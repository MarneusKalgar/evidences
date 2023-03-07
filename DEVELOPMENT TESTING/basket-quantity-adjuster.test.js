import { render, fireEvent } from '@testing-library/vue'
import { jest } from '@jest/globals'
import BasketQuantityAdjuster from '../../legacy-widgets/basket-quantity-adjuster.vue'
const mockProductAdded = jest.fn()
const mockProductRemoved = jest.fn()
jest.mock('../../legacy-app/lib/segmentEvents', () => {
  return {
    __esModule: true,
    trackAddToCart: mockProductAdded,
  }
})
jest.spyOn(BasketQuantityAdjuster.methods, 'trackProductAdded').mockImplementation(mockProductAdded)
jest
  .spyOn(BasketQuantityAdjuster.methods, 'trackProductRemoved')
  .mockImplementation(mockProductRemoved)
const rootData = {
  isBasketLoading: false,
  CONSTANTS: {
    CATEGORY_IDS: {
      GIFT_CARDS: 269,
    },
  },
}
const Root = {
  methods: {
    changeProductQuantityFromCart: jest.fn(),
  },
  data: () => rootData,
}
const product = { quantity: 12 }
const excludedProduct = { exclude: true, quantity: 12 }
const excludedProductLessThanInBasket = { exclude: true, quantity: 12, amount: 8 }
const excludedProductSameAsInBasket = { exclude: true, quantity: 12, amount: 12 }
const testGiftCard = {
  uuid: 'd8f8a251-b9ce-4501-982d-31ff35fd4a16',
  receiver_name: 'test example',
  receiver_email: 'test@example.com',
  sender_message: 'some gift card message',
  sender_name: 'Test Sender',
}
const giftCardProduct = { quantity: 1, giftcards: testGiftCard, category_id: 269 }
const routerGoToProduct = jest.fn()
const mountComponent = (product) => {
  return render(BasketQuantityAdjuster, {
    props: { product },
    parentComponent: Root,
    mocks: {
      $t: (val) => val,
      Router: {
        GoToProduct: routerGoToProduct,
      },
    },
  })
}
beforeEach(() => {
  jest.clearAllMocks()
  rootData.isBasketLoading = false
})

describe('rendering the BasketQuantityAdjuster', () => {
  it('renders the quantity', async () => {
    const { findByTestId } = mountComponent(product)
    expect((await findByTestId('quantity-adjuster-quantity')).innerHTML).toContain('12')
  })
})

describe('incrementing and decrementing product counts from the BasketQuantityAdjuster', () => {
  it('increments the quantity for a non-rx product', async () => {
    const { findByTestId } = mountComponent(product)

    await fireEvent.click(await findByTestId('add-item'))
    expect(Root.methods.changeProductQuantityFromCart).toHaveBeenCalledWith(product, 1)
  })

  it('does not increment the quantity when the basket is loading', async () => {
    rootData.isBasketLoading = true

    const { findByTestId } = mountComponent(product)

    await fireEvent.click(await findByTestId('add-item'))
    expect(Root.methods.changeProductQuantityFromCart).not.toHaveBeenCalled()
  })

  it('does not increment the quantity of an excluded product', async () => {
    const { findByTestId } = mountComponent(excludedProduct)

    await fireEvent.click(await findByTestId('add-item'))
    expect(Root.methods.changeProductQuantityFromCart).not.toHaveBeenCalled()
  })

  it('redirects to the PDP when the add button is clicked on a gift card', async () => {
    const { findByTestId } = mountComponent(giftCardProduct)

    await fireEvent.click(await findByTestId('add-item'))
    expect(Root.methods.changeProductQuantityFromCart).not.toHaveBeenCalled()
    expect(routerGoToProduct).toHaveBeenCalledWith(giftCardProduct)
  })

  it('decrements the quantity for a non-rx product', async () => {
    const { findByTestId } = mountComponent(product)

    await fireEvent.click(await findByTestId('remove-item'))
    expect(Root.methods.changeProductQuantityFromCart).toHaveBeenCalledWith(product, -1)
  })

  it('removes gift cards', async () => {
    const { findByTestId } = mountComponent(giftCardProduct)

    await fireEvent.click(await findByTestId('remove-item'))
    expect(Root.methods.changeProductQuantityFromCart).toHaveBeenCalledWith(giftCardProduct, -1)
  })

  it('removes an excluded product if no amount has been set', async () => {
    const { findByTestId } = mountComponent(excludedProduct)

    await fireEvent.click(await findByTestId('remove-item'))
    expect(Root.methods.changeProductQuantityFromCart).toHaveBeenCalledWith(excludedProduct, -12)
  })

  it('adjusts an excluded product to the available quantity if amount is set and its less than quantity', async () => {
    const { findByTestId } = mountComponent(excludedProductLessThanInBasket)

    await fireEvent.click(await findByTestId('remove-item'))
    expect(Root.methods.changeProductQuantityFromCart).toHaveBeenCalledWith(
      excludedProductLessThanInBasket,
      -4
    )
  })

  it('decrements an excluded product if amount is set and its greater or equal to quantity', async () => {
    const { findByTestId } = mountComponent(excludedProductSameAsInBasket)

    await fireEvent.click(await findByTestId('remove-item'))
    expect(Root.methods.changeProductQuantityFromCart).toHaveBeenCalledWith(
      excludedProductSameAsInBasket,
      -1
    )
  })

  it('does not decrement the quantity when the basket is loading', async () => {
    rootData.isBasketLoading = true

    const { findByTestId } = mountComponent(product)

    await fireEvent.click(await findByTestId('remove-item'))
    expect(Root.methods.changeProductQuantityFromCart).not.toHaveBeenCalled()
  })
})
