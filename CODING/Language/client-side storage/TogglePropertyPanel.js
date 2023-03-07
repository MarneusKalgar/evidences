export default class TogglePropertyPanel {
  static get $inject() {
    return ['eventBus', 'canvas']
  }

  constructor(eventBus, canvas) {
    this._eventBus = eventBus
    this._isPropertiesPanelCollapsed = this._getPropertyPanelStatus()
    this._canvas = canvas
    this._eventBus.once('attach', () => {
      if (this._isPropertiesPanelCollapsed) {
        this.hide()
      } else {
        this.show()
      }
    })
  }

  toggle() {
    this._setPropertyPanelStatus(!this._isPropertiesPanelCollapsed)
    if (this._isPropertiesPanelCollapsed) {
      this.hide()
      this._eventBus.fire('propertyPanel.collapsed')
    } else {
      this.show()
      this._eventBus.fire('propertyPanel.expanded')
    }
  }

  hide() {
    const parent = this._getParentContainer(this._canvas.getContainer())
    parent.querySelector('.js-canvas').classList.remove('js-canvas-with-properties')
    parent.querySelector('.js-properties-panel').classList.remove('js-properties-panel-expanded')
    const switcherControl = parent.querySelector('.toggle-pp-сtrl')
    switcherControl.classList.remove('fa-angle-double-right')
    switcherControl.classList.add('fa-angle-double-left')
  }

  show() {
    const parent = this._getParentContainer(this._canvas.getContainer())
    parent.querySelector('.js-canvas').classList.add('js-canvas-with-properties')
    parent.querySelector('.js-properties-panel').classList.add('js-properties-panel-expanded')
    const switcherControl = parent.querySelector('.toggle-pp-сtrl')
    switcherControl.classList.remove('fa-angle-double-left')
    switcherControl.classList.add('fa-angle-double-right')
  }

  _getParentContainer(container) {
    while (container && !container.matches('.js-canvas') && !container.matches('.fullscreen__container')) {
      container = container.parentNode
    }
    return container && container.parentNode
  }

  _getPropertyPanelStatus() {
    return localStorage.getItem('isPropertyPanelCollapsed') === 'true'
  }

  _setPropertyPanelStatus(isCollapsed) {
    this._isPropertiesPanelCollapsed = isCollapsed
    localStorage.setItem('isPropertyPanelCollapsed', isCollapsed)
  }
}
