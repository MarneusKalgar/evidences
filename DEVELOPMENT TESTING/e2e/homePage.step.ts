import AllureReporter from '@wdio/allure-reporter'
import { Then, When } from '@wdio/cucumber-framework'
import { BagScreen, HomeScreen, OrderProgressScreen } from '../screenobjects/common'
import AlcoholScreen from '../screenobjects/products/AlcoholScreen'

When(/^I scroll down the Home Page$/, async function () {
  AllureReporter.addStep('Scroll down to the Shop Categories')
  await HomeScreen.scrollToBottom()
})

Then(/^I should see the Shop Categories section$/, async function () {
  AllureReporter.addStep('View Shop Categories')
  await HomeScreen.isShopCategoriesVisible()
})

When(/^I scroll up the Home Page$/, async function () {
  AllureReporter.addStep('Scroll up to the Category Pills')
  await HomeScreen.scrollToTop()
})

Then(/^I should see the category pills$/, async function () {
  AllureReporter.addStep('View Category Pills')
  await HomeScreen.isCategoryPillsVisible()
})

When(/^I click on alcohol category tile$/, async function () {
  await HomeScreen.alcoholLink.waitForClickable()
  await HomeScreen.alcoholLink.click()
})

Then(/^the alcohol page should load$/, async function () {
  await AlcoholScreen.waitForIsShown()
})

When(/^I add first available product to My Bag$/, async function () {
  AllureReporter.addStep('Add available product')
  await HomeScreen.addFirstAvailableProductToCart()
})

Then(/^I should see the X button on the top left on the Bag Page$/, async function () {
  AllureReporter.addStep('Back button should be visible')
  await BagScreen.verifyBackButton()
})

Then(/^I click My Bag Button$/, async function () {
  AllureReporter.addStep('Tap: Back button')
  await HomeScreen.myBagButton.click()
})

Then(/^I should see the X button on the top left on Order Page$/, async function () {
  AllureReporter.addStep('OrderProgress Screen should be visible')
  await OrderProgressScreen.waitForIsShown()
  AllureReporter.addStep('Back button should be visible')
  await OrderProgressScreen.verifyBackButton()
})

When(/^I tap the X button on Order Page$/, async function () {
  AllureReporter.addStep('Tap: Back button')
  await OrderProgressScreen.verifyElementIsDisplayed(OrderProgressScreen.backButton)
  await OrderProgressScreen.clickOnElement(OrderProgressScreen.backButton)
})

Then(
  /^I should see a Banner Caroulsel at the top of the page, with at least (.+) - (.+) ads$/,
  async function (min: number, max: number) {
    await HomeScreen.checkBannerCarouselAds(Number(min), Number(max))
  },
)

Then(/^I click on the first Ad inside Banner Caroulsel$/, async function () {
  await HomeScreen.clickOnFirstCarouselAdCard()
})

Then(/^the Buy It Again carousel should be displayed$/, async function () {
  await HomeScreen.isBuyItAgainCarouselVisible()
})

When(/^I click on the first product in the Buy It Again carousel$/, async function () {
  await HomeScreen.clickFirstProductTileByCategory('Buy It Again')
})

Then(/^I close guest popup if it is open$/, async function () {
  await HomeScreen.closeGuestPopup()
})

Then(/^products should have (.+) currency$/, async function (currency) {
  await HomeScreen.verifyProductCurrency(currency)
})
