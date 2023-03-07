import { IWorld } from '@cucumber/cucumber'
import { ChainablePromiseElement } from 'webdriverio'
import { guestLoginTestIds } from '@go/auth.guest-sign-up-dialog/testIds'
import { testIDs as productPriceIds } from '@go/collection.common/product-price/testIDs'
import { testIDs as productTileIds } from '@go/collection.common/product-tile/testIDs'
import { testIDs as linkCollectionIds } from '@go/collection.link-collection/testIDs'
import { collectionsIds } from '@go/design-system.collections/testIDs'
import { dialogActionsTestIds } from '@go/design-system.dialogs/testIds'
import { addressBar } from '@go/header.components/address-bar/testIDs'
import { myBagButtonIDs } from '@go/header.components/my-bag-button/testIDs'
import { homePageIds } from '@go/home.home-page/testIDs'
import { phoneNumberInputIDs } from '@go/input.phone-number-input/testIDs'
import { collectionPageIds } from '@go/shopping.collection-page/testIDs'
import { productQuantityToolIDs } from '@go/shopping.product-quantity/testIDs'
import { getAdBadgeQuantity } from '../../helpers/adtech'
import {
  isAndroid,
  isChrome,
  isDesktopWeb,
  isIos,
  isMobile,
  isMobileBrowser,
  isSafari,
} from '../../helpers/DriverUtils'
import { SelectedProduct } from '../../helpers/types'
import Gestures from '../../helpers/wdio/Gestures'
import AppScreen from '../AppScreen'
import Prompt from '../components/Prompt'

/**
 * Main landing page displayed after sign-in, contains product lists and account actions
 */
export class HomeScreen extends AppScreen {
  constructor() {
    // HomeScreen needs a better page-level selector, but this is usable for now.
    super(homePageIds.headerId)
  }

  // Selectors
  public get addressBar() {
    return isSafari ? this.getElement('AddressesLink') : this.getElement(homePageIds.addressBar)
  }

  public get addressBarContent() {
    return isIos ? this.getElement('AddressesLink') : this.getElement(addressBar.addressName)
  }

  public get addressText() {
    return this.getElement(isIos ? 'AddressesLink' : addressBar.addressName).getText()
  }

  public get searchBar() {
    return this.getElement(homePageIds.searchBar)
  }
  public get searchBarTextField() {
    return this.getDivDataElements('data-testid', homePageIds.searchBar, '1')
  }
  public get popularSearchSuggestionsList() {
    return this.getElementsArray(homePageIds.searchSuggestion_Text)
  }
  public get searchSuggestions() {
    return this.getElement(homePageIds.searchSuggestion)
  }
  public get productThumbnailTiles() {
    return isSafari || isDesktopWeb
      ? this.getElement(homePageIds.thumbnailTilesImage)
      : this.getElement(homePageIds.thumbnailTiles)
  }

  public get horizontalProductList() {
    return this.getElement(homePageIds.horizontalProductCollection)
  }

  public get verticalProductList() {
    return this.getElement(homePageIds.verticalProductCollection)
  }

  public get horizontalProductTile() {
    if (isSafari) {
      return this.getElement(homePageIds.productTileImage)
    } else if (isIos) {
      return this.getElementByExactText(homePageIds.productTile)
    } else {
      return this.getElement(homePageIds.productTile)
    }
  }

  public get myBagButton() {
    return this.getElement(myBagButtonIDs.myBagButtonPressable)
  }

  public get bagQuantityPill() {
    return $(`[data-testid=${myBagButtonIDs.myBagButton_Quantity}]`)
  }

  public get headerBagButton() {
    return this.getElementInParent(homePageIds.headerId, myBagButtonIDs.myBagButtonPressable, 1)
  }

  public get myBagButtonQuantity() {
    return this.getElement(myBagButtonIDs.myBagButton_Quantity)
  }

  public get productCollectionHeaderLinkSnacksChips() {
    return this.getElement(`${collectionsIds.productCollectionHeaderLink}-Chips`)
  }

  public get snacksTile() {
    if (!isMobile) return this.getElement(homePageIds.snacksCategoryTile)
    else return this.getElementByExactText('Snacks')
  }

  public get snacksCategoryTile() {
    return isIos && !isSafari
      ? this.getElementByExactText('Snacks Snacks')
      : this.getElement(homePageIds.snacksCategoryTile)
  }

  public get alcoholCategoryTile() {
    return this.getElement(homePageIds.alcoholCategoryTile)
  }
  public get productTitle() {
    return this.getElement(homePageIds.productTile)
  }
  public get snacksLink() {
    return this.getElement('ThumbnailTiles_ItemText_Snacks')
  }

  public get horizontalProducts() {
    if (isIos) {
      return $$(
        `//*[@name="${homePageIds.horizontalProductCollection}"]/descendant::*[@name="${homePageIds.productTile}"]`,
      )
    }
    if (isAndroid) {
      return $$(
        `//*[@resource-id="${homePageIds.horizontalProductCollection}"]/descendant::*[@resource-id="${homePageIds.productTile}"]`,
      )
    }

    return $$(
      `[data-testid="${homePageIds.horizontalProductCollection}"] [data-testid="${homePageIds.productTile}"]`,
    )
  }

  public get verticalProducts() {
    return $$(
      `[data-testid="${homePageIds.verticalProductCollection}"] [data-testid="${homePageIds.productTile}"]`,
    )
  }

  public get signInButton() {
    return this.getElement(dialogActionsTestIds.secondary)
  }

  public async isSuggestionsContainBannedWord(bannedWords: string) {
    const arrBannedWords: Array<string> = bannedWords?.split(',')
    if (!arrBannedWords) {
      return false
    }

    const suggestions: Array<WebdriverIO.Element> = await this.popularSearchSuggestionsList
    for await (const suggestion of suggestions) {
      const name = await suggestion.getText()
      if (arrBannedWords.includes(name)) {
        return true
      }
    }

    return false
  }

  public get categoryTiles() {
    return this.getElement(linkCollectionIds.linkCollectionCategoryTiles)
  }

  public get thumbnailTiles() {
    return this.getElement(homePageIds.thumbnailTiles)
  }

  public get horizontalProductCollection() {
    return $$(`[data-testid="${homePageIds.horizontalProductCollection}"]`)
  }

  public get verticalProductCollection() {
    return $$(`[data-testid="${homePageIds.verticalProductCollection}"]`)
  }

  public get alcoholLink() {
    return $(`//*[@data-testid='${homePageIds.alcoholCategoryTile}']/parent::a`)
  }

  public get bannerCaroulsel() {
    return this.getElement(homePageIds.bannerCaroulsel)
  }

  public get buyItAgainCarousel() {
    return this.getElementByExactText('Buy It Again')
  }

  public get guestPopupLoginMessage() {
    return isMobile
      ? this.getElement('GuestEmptyContent')
      : this.getElement(guestLoginTestIds.message)
  }

  public get guestPopupSignUpButton() {
    return isMobile
      ? this.getElementByExactText('Sign Up')
      : this.getElement(dialogActionsTestIds.primary)
  }

  public get pillButton() {
    return this.getElement(phoneNumberInputIDs.pillButtonLeftIcon)
  }

  public get promotedProduct() {
    return this.getElement(homePageIds.promotedProduct)
  }

  public get promotedProducts() {
    return this.getElementsArray(homePageIds.promotedProduct)
  }

  public get saleSearchSuggestion() {
    return this.getElementByExactText('Sale')
  }

  // Actions
  async getBagQuantityItems() {
    await this.bagQuantityPill.waitForDisplayed()
    const amount = await this.bagQuantityPill.getText()
    return parseInt(amount, 10)
  }

  async viewBag() {
    await this.headerBagButton.click()
  }

  public async viewMyBag() {
    await this.myBagButton.click()
  }
  public async verifyAccountAddress(address: string) {
    const addressBarText = await this.addressBarContent.getText()
    await driver.waitUntil(async () => (await addressBarText).includes(address), {
      timeout: 5000,
      timeoutMsg: `expected address name to contain ${address} after 5s`,
    })
  }
  public async clickChipsSeeAll() {
    const seeAll = await this.productCollectionHeaderLinkSnacksChips
    await seeAll.waitForDisplayed()
    await seeAll.click()
  }
  public async clickFirstProductTile() {
    if (isMobileBrowser) {
      if (isChrome) {
        // We need to close 'Download GoPuff Now' Pop-up before we can click product
        await this.clickCloseDownloadPopUp()
      }
      await this.horizontalProductTile.scrollIntoView()
    } else {
      await Gestures.checkIfDisplayedWithSwipeUp(await this.horizontalProductTile, 2)
    }
    await this.horizontalProductTile.click()
    if (!isMobile) await browser.pause(1000)
  }

  public async clickProductThumbnailTile() {
    await this.productThumbnailTiles.click()
  }

  public async clickSnackCategoryTile() {
    await this.clickOnElement(
      this.snacksCategoryTile,
      'Snacks Category Tile is not displayed or clicable',
    )
  }

  public async clickAlcoholCategoryTile() {
    await this.clickOnElement(this.alcoholCategoryTile)
  }

  public async clickCategoryTile(category: string) {
    if (isMobile) {
      await driver.waitUntil(
        async () => {
          await this.verticalSwipeByPercentages(50, 30, 30)
          const isDisplayed = await this.getElement(`ThumbnailTiles_Item_${category}`).isDisplayed()
          return isDisplayed
        },
        {
          timeout: 45 * 1000,
          timeoutMsg: `${category} not found`,
        },
      )
    }
    const element = await this.getElement(`ThumbnailTiles_Item_${category}`)
    await element.click()
  }

  public async clickFirstCategoryTile() {
    const elements = await this.getElementsArray('ThumbnailTile')
    await elements[0].click()
  }

  public async clickProductTile(product: string) {
    const tile = await this.getElementByExactText(product)
    await tile.waitForDisplayed({ timeout: 5000 })
    if (!isMobile) await this.waitForElementClickable(await tile)
    await tile.click()
  }

  public async clickFirstProductTileByCategory(category: string) {
    if (!isMobile) {
      await browser.pause(3000)
    }

    const foundCategory = await this.getElement(
      `${collectionPageIds.horizontalProductCollection}${category.replace(/ /g, '')}`,
    )
    if (!foundCategory) {
      return
    }

    const product = await this.getChildren(foundCategory, homePageIds.productTileImage)
    await this.waitForElementClickable(product)
    await product.click()
  }

  public async clickPromotedProduct() {
    const promotedProduct = await this.promotedProduct
    await promotedProduct.waitForExist()
    const productTileImage = await this.getChildren(promotedProduct, homePageIds.productTileImage)
    await productTileImage.waitForExist()
    await productTileImage.click()
  }

  public async clickAddressBar() {
    await this.addressBar.click()
  }

  public async verifyHomeScreenAddress(validAddress: string) {
    if (!isMobile) {
      await browser.pause(5000)
    }
    const expectedAddress: string = validAddress.trim().split(',')[0]
    const actualAddress: string = await this.addressBarContent.getText()
    expect(actualAddress).toContain(expectedAddress)
  }

  public async verifyHomeAddressIsDisplayed() {
    await this.addressBarContent.waitForDisplayed({
      timeoutMsg: "addressBarContent didn't show up",
    })
    await browser.waitUntil(
      async () => {
        const homeAddress = await this.addressText
        return homeAddress !== 'Add an address to see delivery time'
      },
      { timeout: 10000, timeoutMsg: "verifyHomeAddressIsDisplayed: home address didn't show up" },
    )
  }

  public async clickToSnackLink() {
    if (!isMobile) {
      await this.waitForElementClickable(await this.snacksLink)
    }
    await this.snacksLink.click()
  }

  public async clickMyBagButton() {
    await this.myBagButton.click()
  }

  public async clickOnCategoryTileByName(category: string) {
    const capitlizedCategory = category.charAt(0).toUpperCase() + category.slice(1)
    await this.horizontalProductTile.scrollIntoView()
    const catElement = await this.getElementByExactText(capitlizedCategory)
    await catElement.waitForDisplayed({ timeoutMsg: 'Element is not displayed' })
    await catElement.waitForClickable({ timeoutMsg: 'Element is not clickable' })
    await catElement.click()
  }

  public async clickOnCategoryTileByPillName(category: string) {
    const capitlizedCategory = category.charAt(0).toUpperCase() + category.slice(1)
    const catElement = await this.getElementByExactText(capitlizedCategory, '2')
    await catElement.waitForDisplayed()
    if (!isMobile) await this.waitForElementClickable(await catElement)
    await catElement.click()
  }

  public async clickOnFirstAvailableProduct(
    options: { excludeSection: string[] } = {
      excludeSection: ['Alcohol', 'Gopuff Kitchen', 'Fresh Food Hall'],
    },
  ) {
    await this.horizontalProductList.waitForDisplayed()
    let availableProduct = null
    // product is available when addToCart button is not disabled
    for await (const el of await this.horizontalProductCollection) {
      const incrementButton = await this.getChildren(await el, productQuantityToolIDs.addToCart)
      const sectionTitle = await this.getChildren(
        await el,
        collectionPageIds.productCollectionTitle,
      ).getText()
      const isDisabled = await incrementButton.getAttribute('aria-disabled')
      if (!isDisabled && !options.excludeSection.includes(sectionTitle)) {
        availableProduct = el
        break
      }
    }
    expect(availableProduct).not.toEqual(null)
    await this.clickAvailableProduct(availableProduct)
  }

  public async clickOnAvailableProductBelowMOV(
    world: IWorld,
    options: { excludeSection: string[] } = {
      excludeSection: ['Alcohol', 'Gopuff Kitchen', 'Fresh Food Hall'],
    },
  ) {
    if (!world.selectedProducts) {
      world.selectedProducts = []
    }

    await this.horizontalProductList.waitForDisplayed()
    let availableProduct = null
    // product is available when addToCart button is not disabled
    for await (const el of await this.horizontalProducts) {
      const incrementButton = await this.getChildren(await el, productQuantityToolIDs.addToCart)
      const isDisabled = await incrementButton.getAttribute('aria-disabled')
      const sectionTitle = await this.getProductSectionTitle(el)
      if (!isDisabled && !options.excludeSection.includes(sectionTitle)) {
        const price = await this.getChildren(await el, productPriceIds.productPrice).getText()
        const formattedPrice = parseFloat(price.substring(1))
        // TODO obtain MOV from fake graphql
        if (formattedPrice > 8.95) {
          continue
        }
        const productName = await this.getChildren(
          await el,
          productTileIds.productTileName,
        ).getText()

        world.selectedProducts.push({ price: formattedPrice, productName })

        availableProduct = el
        break
      }
    }
    expect(availableProduct).not.toEqual(null)
    await this.clickAvailableProduct(availableProduct)
  }

  public async addProductsToCart(
    selectedProducts: SelectedProduct[] = [],
    amount = 1,
    options: { excludeSection: string[] } = {
      excludeSection: ['Alcohol', 'Gopuff Kitchen', 'Fresh Food Hall'],
    },
  ): Promise<SelectedProduct[]> {
    let isHorizontalProducts = true
    try {
      await this.horizontalProductList.waitForDisplayed({
        timeout: 10000,
        timeoutMsg: 'horizontalProductList is not displayed',
      })
    } catch {
      isHorizontalProducts = false
      await this.verticalProductList.waitForDisplayed({
        timeout: 10000,
        timeoutMsg: 'verticalProductList is not displayed',
      })
    }

    // product is available when addToCart button is not disabled
    const products = isHorizontalProducts
      ? await this.horizontalProducts
      : await this.verticalProducts
    let counter = 0
    const result = [...selectedProducts]
    for await (const el of products) {
      if (counter >= Math.min(amount, products.length)) {
        break
      }

      const incrementButton = isMobile
        ? await this.getChildren(await el, 'ProductTileImage')
        : await this.getChildren(await el, productQuantityToolIDs.addToCart)
      const isDisabled = isMobile ? false : await incrementButton.getAttribute('aria-disabled')
      const sectionTitle = await this.getProductSectionTitle(el)
      if (!isDisabled && !options.excludeSection.includes(sectionTitle)) {
        let productName = null
        let price = null
        if (isMobile) {
          const productDetails = await this.getChildren(await el, 'ProductLink').getText()
          const priceRegex = /\$[0-9]+\.[0-9]{1,2}/
          price = productDetails.match(priceRegex)?.at(0) || ''
          productName = await this.getChildren(await el, 'ProductTileImage').getText()
        } else {
          productName = await this.getChildren(await el, productTileIds.productTileName).getText()
          price = await this.getChildren(await el, productPriceIds.productPrice).getText()
        }
        const formattedPrice = parseFloat(price.substring(1))
        if (!isMobile) {
          try {
            await incrementButton.waitForClickable({
              timeout: 3000,
              timeoutMsg: 'incrementButton is not clickable',
            })
          } catch (err) {
            continue
          }
          await incrementButton.click()
        } else {
          Gestures.tapElementLocation(await incrementButton, {
            heightPercentage: 0.2,
            widthPercentage: 0.8,
          })
        }
        result.push({ price: formattedPrice, productName })
        counter++
        /**
         * There is a race when you add item into bag
         * and previous response is replaced by the following
         */
        if (isDesktopWeb) {
          await browser.pause(3000)
        }
      }
    }

    return result
  }

  private async clickAvailableProduct(availableProduct: WebdriverIO.Element | null) {
    if (!availableProduct) return
    const clickableProductArea = await this.getChildren(
      await availableProduct,
      homePageIds.productTileImage,
    )
    await clickableProductArea.waitForDisplayed()
    await Gestures.checkIfDisplayedWithSwipeUp(await clickableProductArea, 2)
    await this.waitForElementClickable(await clickableProductArea)
    await clickableProductArea.click()
  }
  public async clickSearchBar() {
    await this.searchBar.click()
  }
  public async clicksearchBarInput() {
    await this.waitForElementClickable(await this.searchBarTextField)
    await this.searchBarTextField.click()
  }

  public async clickOnFirstCarouselAdCard() {
    const sponsoredCard = await this.getElement(homePageIds.sponsoredCard)
    await sponsoredCard.waitForDisplayed()
    await sponsoredCard.click()
  }

  public async scrollToBottom() {
    await this.scrollTo(this.categoryTiles)
  }
  public async scrollToTop() {
    await this.scrollTo(this.thumbnailTiles)
  }
  public async isShopCategoriesVisible() {
    await this.isElementDisplayed(this.categoryTiles, 5000)
  }
  public async isCategoryPillsVisible() {
    await this.isElementDisplayed(this.thumbnailTiles, 5000)
  }
  public async scrollTo(element: ChainablePromiseElement<WebdriverIO.Element>) {
    const productCarouselsIndexes = ['3', '6', '9']

    for (const index of productCarouselsIndexes) {
      await this.getProductCollectionByIndex(index)?.scrollIntoView()
    }

    await element.scrollIntoView()
  }
  public getProductCollectionByIndex(
    index: string,
  ): ChainablePromiseElement<WebdriverIO.Element> | undefined {
    return this.getDivDataElements('data-testid', homePageIds.horizontalProductCollection, index)
  }
  public getCollectionName(collection: WebdriverIO.Element) {
    return this.getChildren(collection, 'HorizontalProductCollectionTitle').getText()
  }

  public async checkPromotedProductsByCategory(min: number, max: number, categories: string) {
    const categoriesArray = categories.split(',')

    for (const category of categoriesArray) {
      const categoryId = `${homePageIds.horizontalProductCollection}${category}`
      const collection = await this.getElement(categoryId)

      await collection.waitForDisplayed()

      const badges = await this.getChildrenArray(collection, 'Badge')
      const adBadgesQuantity = await getAdBadgeQuantity(badges)

      if (adBadgesQuantity < min || adBadgesQuantity > max) {
        await this.refresh()

        throw new Error(
          `Current AdBadges quantity [${adBadgesQuantity}] on category [${category}] does not match the required [min: ${min}, max: ${max}]`,
        )
      }
    }

    for (const collection of await this.horizontalProductCollection) {
      const category = await this.getCollectionName(collection)

      if (!categoriesArray.includes(category)) {
        continue
      }

      const badges = await this.getChildrenArray(collection, 'Badge')
      const adBadgesQuantity = await getAdBadgeQuantity(badges)

      if (adBadgesQuantity < min || adBadgesQuantity > max) {
        await this.refresh()

        throw new Error(
          `Current AdBadges quantity [${adBadgesQuantity}] on category [${category}] does not match the required [min: ${min}, max: ${max}]`,
        )
      }
    }
  }

  public async checkPromotedProducts(minRequiredAds: number) {
    await this.promotedProduct.waitForExist()
    const products = await this.promotedProducts

    if (products.length < minRequiredAds) {
      await this.refresh()

      throw new Error(
        `Promoted Products quantity [${products.length}]  does not match the minimum required required [${minRequiredAds}]`,
      )
    }
  }

  public refresh() {
    return browser.refresh()
  }

  public async checkMyBagIsNotEmpty() {
    await this.myBagButtonQuantity.waitUntil(
      async () => {
        // While page loading, data is 'Validating...'
        const myBagButtonQuantityText = await this.myBagButtonQuantity.getText()
        return myBagButtonQuantityText !== '...'
      },
      { timeout: 15000 },
    )

    return (await this.myBagButtonQuantity.getText()) !== '0'
  }

  public async addFirstAvailableProductToCart() {
    let isHorizontalProducts = true
    try {
      await this.horizontalProductList.waitForDisplayed({
        timeout: 10000,
        timeoutMsg: 'horizontalProductList is not displayed',
      })
    } catch {
      isHorizontalProducts = false
      await this.verticalProductList.waitForDisplayed()
    }

    const availableProduct = await this.getAvailableProduct(undefined, isHorizontalProducts)
    expect(availableProduct).not.toEqual(null)

    const incrementButton = this.getChildren(
      availableProduct as WebdriverIO.Element,
      productQuantityToolIDs.addToCart,
    )

    await this.clickOnElement(incrementButton)
  }

  public async clickToAddressBar() {
    await this.addressBar.click()
  }

  public async clickCloseDownloadPopUp() {
    try {
      await Gestures.tapByPercentageCoordinates(250, 45)
    } catch (err) {
      // // No pop up or already dismissed.
    }
  }

  protected async getProductSectionTitle(product: WebdriverIO.Element) {
    const parent = await this.getAncestorFromElement(
      product,
      collectionPageIds.horizontalProductCollection,
    )
    return this.getChildren(await parent, collectionPageIds.productCollectionTitle).getText()
  }

  private async getAvailableProduct(
    excludeSectionTitle = ['Alcohol', 'Gopuff Kitchen'],
    isHorizontal = true,
  ) {
    let product = null

    for await (const el of isHorizontal
      ? await this.horizontalProductCollection
      : await this.verticalProductCollection) {
      const incrementButton = await this.getChildren(await el, productQuantityToolIDs.addToCart)
      const sectionTitle = await this.getChildren(
        await el,
        collectionPageIds.productCollectionTitle,
      ).getText()
      const isDisabled = await incrementButton.getAttribute('aria-disabled')
      if (!isDisabled && !excludeSectionTitle.includes(sectionTitle)) {
        product = el
        break
      }
    }

    return product
  }

  public async checkBannerCarouselAds(min: number, max: number) {
    await this.bannerCaroulsel.waitForDisplayed()
    const ads = await this.getChildrenArray(await this.bannerCaroulsel, homePageIds.sponsoredCard)

    if (ads.length < min || ads.length > max) {
      throw new Error(
        `Current Ads number <${ads.length}> on Caroulsel Banner does not match with the expected <${min} - ${max}>`,
      )
    }
  }

  public async dismissOrderFeedback() {
    try {
      await Prompt.findPrompt('FeedbackModal', true)
      await Prompt.cancelPrompt()
    } catch (err: unknown) {
      if (err instanceof Error) {
        if (!err.message.startsWith("Couldn't find prompt")) {
          console.error(err)
        }
      }
    }
  }

  public async isBuyItAgainCarouselVisible() {
    await this.isElementDisplayed(this.buyItAgainCarousel, 5000)
  }

  public async navigateToSignUpFromGuestPopup() {
    await this.guestPopupLoginMessage.waitForDisplayed({ timeout: 5000 })
    await this.guestPopupSignUpButton.waitForDisplayed()
    if (isDesktopWeb) {
      await this.guestPopupSignUpButton.waitForClickable()
    }
    await this.guestPopupSignUpButton.click()
  }

  public async closeGuestPopup() {
    const popupIsOpen = await this.guestPopupLoginMessage.isDisplayed()

    if (!popupIsOpen) {
      return
    }

    try {
      await this.guestPopupLoginMessage.waitForDisplayed()
      await this.pillButton.waitForDisplayed()
      await this.pillButton.waitForClickable()
      await this.pillButton.click()
    } catch {
      console.log('Guest popup not displayed')
    }
  }

  public async clickSignInButton() {
    await this.signInButton.waitForDisplayed()
    await this.signInButton.waitForClickable()
    await this.signInButton.click()
  }

  public get backButton() {
    return this.getElement('Back')
  }

  public get spinWheelPopup() {
    return this.getElementByExactText('Spin Wheel')
  }
  public async clickBack() {
    await this.backButton.click()
  }

  public async openSpinWheelPopup() {
    try {
      await this.spinWheelPopup.waitForDisplayed()
      await this.spinWheelPopup.click()
    } catch {
      console.log('SpinWheel popup not displayed')
    }
    const isSpinWheelOpen = await this.spinWheelPopup.isDisplayed()
    return isSpinWheelOpen
  }

  public async closeSpinWheelPopup() {
    const isopen = await this.openSpinWheelPopup()
    if (isopen) {
      await this.clickBack()
    }
  }

  public async verifyProductCurrency(currency: string) {
    const prouductPrice = await this.getElementInParent(
      homePageIds.horizontalProductCollection,
      productPriceIds.productPrice,
    )
    const priceText = await prouductPrice.getText()
    const currencyIsMatched = priceText.includes(currency)

    if (isDesktopWeb) {
      expect(currencyIsMatched).toBeTruthy()
    }

    if (isAndroid && !currencyIsMatched) {
      throw new Error(`Invalid currency, expected ${currency} - got ${priceText}`)
    }
  }
}

export default new HomeScreen()
