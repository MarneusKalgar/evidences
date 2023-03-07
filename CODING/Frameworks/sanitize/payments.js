const express = require('express')
const router = express.Router()
const { requestPromise, pipeAsync, authOK_API } = require('../utils')
const { hydrateUser } = require('../mixcart.js')
const { handle_error, getPointOfSaleFromReq } = require('../utils/mixutil')
const { prop, path, map, includes, filter, omit, find, propEq } = require('ramda')
const addresser = require('addresser')
const { M2MAuthToken } = require('../auth0')
const appInsights = require('applicationinsights')
const axios = require('axios')
const sanitizeHtml = require('sanitize-html')
const serverEnv = require('../lib/serverEnv').init(appInsights)

const paymentsURI = serverEnv.getVar(serverEnv.PAYMENTS_API_URL)

const updateBillingAddress = async (body) =>
  requestPromise({
    uri: `${paymentsURI}/updateCreditCardBillingAddress`,
    method: 'POST',
    json: true,
    headers: {
      authorization: await M2MAuthToken('payments'),
    },
    body,
  })

const fetchPaymentMethods = ([endpoint, token]) =>
  requestPromise({
    uri: `${endpoint}/v3/payment_methods`,
    method: 'GET',
    json: true,
    headers: {
      authorization: `Token token=${token}`,
    },
  })

const backofficeSignatureFromReq = (req) => [
  path(['user', 'mixclaim', 'endpoint'], req),
  path(['user', 'token'], req),
]

const verifyUserOwnsPaymentMethod = async (req, res, next) => {
  const userOwnsPaymentId = await pipeAsync(
    [
      backofficeSignatureFromReq,
      fetchPaymentMethods,
      map(prop('id')),
      includes(path(['body', 'legacyCardId'], req)),
    ],
    (e) => handle_error(req, res, e)
  )(req)

  if (!userOwnsPaymentId) {
    return res.status(401).send()
  }
  next()
}

const formatAddressForUpdate = (body) => {
  if (body.billingAddress) {
    return body
  } else {
    const keyMap = {
      zipCode: 'postalCode',
      stateAbbreviation: 'adminArea2',
      placeName: 'adminArea1',
      addressLine1: 'addressLine1',
      streetNumber: 'addressLine2',
    }
    const addressData = addresser.parseAddress(body.addressString.address)
    const billingAddress = filter(Boolean)({
      // Rename keys from parseAddress
      // to the API's expected schema
      ...Object.keys(keyMap).reduce(
        (res, k) => Object.assign(res, { [keyMap[k]]: addressData[k] }),
        {}
      ),
      addressLine2: body.addressString.apt,
      countryCode: body.countryCode,
    })
    return { billingAddress, cardId: body.cardId }
  }
}

const paymentServiceIDOrLegacyID = async (req, res) => {
  const { cardId, legacyCardId } = req.body
  // Already have the payment service ID
  if (cardId !== legacyCardId) {
    return cardId
  }
  // Check if we have a payment service ID
  // associated with this CC
  const paymentServiceID = await pipeAsync(
    [
      backofficeSignatureFromReq,
      fetchPaymentMethods,
      find(propEq('id', legacyCardId)),
      prop('payment_service_id'),
    ],
    (e) => handle_error(req, res, e)
  )(req)

  // If we have it, return it, otherwise
  // use the legacy card ID.  Payments API
  // is configured to accept the legacy ID
  // ONLY when the payment service ID does
  // not exist
  return paymentServiceID || legacyCardId
}

router.post('/updateBillingAddress', hydrateUser, verifyUserOwnsPaymentMethod, async (req, res) => {
  try {
    const payload = formatAddressForUpdate(req.body)
    const cardId = await paymentServiceIDOrLegacyID(req, res)
    const result = await updateBillingAddress(omit(['legacyCardId'], { ...payload, cardId }))

    return res.json(result)
  } catch (e) {
    handle_error(req, res, e)
  }
})

router.get('/cardNonce', async (req, res) => {
  try {
    if (!authOK_API(res)) {
      return
    }
    const claim = res.locals.authContext.mixclaim
    const cardId = sanitizeHtml(req.query.cardId)
    const userId = sanitizeHtml(claim.user.id)
    const response = await axios({
      url: `/users/${userId}/cards/${cardId}/nonce`,
      baseURL: paymentsURI,
      method: 'get',
      responseType: 'json',
      headers: {
        authorization: await M2MAuthToken('payments'),
        'x-gp-point-of-sale': getPointOfSaleFromReq(req),
      },
    })
    res.json(response.data)
  } catch (err) {
    handle_error(req, res, err)
  }
})

module.exports = router
