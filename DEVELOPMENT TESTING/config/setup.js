import Vue from "vue"

global.Vue = Vue
global.navigateTo = jest.fn()
global.postExternalMessage = jest.fn()

// Allows us to call through to the inner function with no delay
global.puffDebounce = jest.fn((func) => func)

global.DeliveryZoneMixin = {}
global.RouterMixin = {}
global.CartMixin = {}
global.ProductsMixin = {}
global.CategoriesMixin = {}
global.PageMixin = {}
global.ExperimentsMixin = {}
global.ControlMixin = {}
global.FAMMixin = {}
