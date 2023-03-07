<template>
  <div
    class="table-configurator-pane"
    :style="{
      flexBasis: pane.width,
      minHeight: pane.minHeight
    }"
  >
    <div class="table-configurator-pane__label">{{ pane.label }}</div>

    <div
      class="table-configurator-pane__content"
      :class="{hover: isHovered}"
      @drop="drop"
      @dragover.prevent.stop="dragAndDropService.dragOver($event, pane, $refs)"
    >
      <transition-group name="table-configurator-pane__transition-group" tag="div">
        <div
          v-for="(item, index) in pane._buildData(dragAndDropService.dragData)"
          class="table-configurator-pane__attribute"
          :ref="pane.generateItemKey(item)"
          :key="pane.generateItemKey(item)"
          draggable="true"
          @dragstart="dragAndDropService.startDrag(item, pane)"
          @dragend="dragAndDropService.endDrag()"
        >
          <component
            :is="pane.itemRender"
            :item="pane.transformItem(item)"
          >
            <u-button
              class="attribute-render__delete-button"
              slot="delete-button"
              appearance="inverse"
              icon="u-icon-delete"
              color="primary"
              :disabled="item.disabled"
              @click="pane.removeItem(index)"
            />
          </component>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script>
  const {DragAndDropService, Pane} = require('../panes')

  export default {
    name: 'Pane',

    props: {
      dragAndDropService: DragAndDropService,
      pane: Pane
    },

    computed: {
      isHovered() {
        return this.dragAndDropService.dragData?.hoverPane === this.pane
      }
    },

    methods: {
      drop() {
        if (!this.dragAndDropService.dragData) {
          return
        }
        this.dragAndDropService.dropping = true
        try {
          this.pane.drop(this.dragAndDropService.dragData)
        } finally {
          this.dragAndDropService.dropping = false
          this.dragAndDropService.endDrag()
        }
      }
    }
  }
</script>

<style>
  .table-configurator-pane {
    display: flex;
    flex-direction: column;
    flex: 1 0;
    padding: 10px;
  }

  .table-configurator-pane__content {
    background: hsl(var(--hs-background), var(--l-background-inverse));
    flex-grow: 1;
    padding: 5px;
  }

  .table-configurator-pane__content.hover {
    box-shadow: inset 0 0 4px 2px hsl(var(--hs-background), var(--l-background-active));
  }

  .table-configurator-pane__label {
    padding-bottom: 4px;
    color: hsl(var(--hs-text), var(--l-text-label))
  }

  .table-configurator-pane__attribute {
    font-size: 14px;
    color: hsl(var(--hs-text), var(--l-text-default));
    border: 1px solid hsl(var(--hs-border), var(--l-layout-border-default));
    border-left: 4px solid hsl(var(--hs-primary), var(--l-state-default));
    border-radius: var(--border-radius);
    padding: 4px;
    margin: 4px;
  }

  .table-configurator-pane__transition-group-move {
    transition: transform 0.2s;
  }

  .table-configurator-pane__transition-group-enter-active,
  .table-configurator-pane__transition-group-leave-active {
    transition: all 0.2s;
  }

  .table-configurator-pane__transition-group-enter, .table-configurator-pane__transition-group-leave-to {
    opacity: 0;
    transform: translateX(-30px);
  }

  .attribute-render {
    display: flex;
    align-items: center;
    flex-grow: 1;
    flex-wrap: wrap;
  }

  .attribute-render__label {
    margin-right: 12px;
  }
</style>
