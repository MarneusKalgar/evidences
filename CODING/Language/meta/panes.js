/**
 * Create proxy for easy and convenient interaction with store in panes
 * @param {Vuex.Store} store
 * @param {string} storeModuleName
 * @returns {Vuex.Store}
 */
function createStoreProxy(store, storeModuleName) {
  return {
    getters: new Proxy({}, {
      get: (_, getterName) => typeof getterName === 'string'
        ? store.getters[storeModuleName + '/' + getterName]
        : null
    }),
    dispatch: (actionName, payload) => store.dispatch(storeModuleName + '/' + actionName, payload),
    commit: (commitType, payload) => store.commit(storeModuleName + '/' + commitType, payload)
  }
}

const PANES_DICT = {
  FieldListPane,
  TotalsPane,
  WhereListPane,
  OrderListPane,
  ColorsPane
}

/**
 * Create panes that are required for EntityTableConfigurator as panes prop
 *
 * @param {Vuex.Store} store
 * @param {object} config
 * @param {string[]} [config.panes = Object.keys(PANES_DICT)]
 * @param {string} [config.storeModuleName = 'tableConfigurator']
 * @returns {Pane[]}
 */
function createPanes(
  store,
  {
    panes = Object.keys(PANES_DICT),
    storeModuleName = 'tableConfigurator'
  } = {}
) {
  const storeProxy = createStoreProxy(store, storeModuleName)
  return panes.map(paneName => {
    const ClassConstructor = PANES_DICT[paneName]
    return new ClassConstructor(storeProxy)
  })
}