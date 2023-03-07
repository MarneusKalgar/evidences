<template>
  <u-table-entity
    :repository="getRepository"
    :columns="tableColumnsDef"
    :onSelectRecord="function() {}"
    :max-height="400"
    :hideActions="['addNew', 'copy', 'addNewByCurrent', 'newVersion', 'showVersions', 'edit', 'delete', 'audit', 'link', 'itemLink', 'summary', 'export', 'viewMode']"
  >

    <template #toolbarDropdown>
      <div/>
    </template>

    <template #checkCol="{row}">
      <el-switch
        :value="getSelected(row)"
        @change="changeSelected(row, $event)" />
    </template>
  
  </u-table-entity>
</template>

<script>
  const _ = require('lodash')

  const {Repository} = require('@unitybase/ub-pub')

  module.exports.default = {
    name: 'ImexSelectEntityInstance',

    model: {
        prop: 'addInstanceList',
        event: 'updated'
    },
  
    props: {
      config: {
        type: Object,
        required: true
      },
      currentInstanceList: {
        required: true
      },
      addInstanceList: {
        required: true
      }
    },

    data() {
      return {
      }
    },

    computed: {
      tableColumnsDef() {
        const checkCol = {id: 'checkCol', label: ''}
        return [checkCol, ...(this.config.tableColumns || this.config.displayAttributes)]
      },

      currentInstanceListDef() {
        return this.currentInstanceList || {}
      },
      
      addInstanceListDef() {
        return this.addInstanceList || {}
      }
    },

    methods: {
      getRepository() {
        const currentLocalKeysRaw = Object.keys(this.currentInstanceListDef)
        const localKeyDataType = $App.domainInfo.get(this.config.entityCode).getAttribute(this.config.localKeyAttribute).dataType
        const localKeyMapFn = (['ID', 'Entity', 'Int', 'BigInt', 'Float', 'Currency']
          .includes(localKeyDataType))
            ? Number
            : (localKeyDataType === 'Boolean')
              ? Boolean
              : undefined
        const currentLocalKeys = (localKeyMapFn) ? currentLocalKeysRaw.map(localKeyMapFn) : currentLocalKeysRaw

        return Repository(this.config.entityCode)
          .whereIf(currentLocalKeys.length > 0, `[${this.config.localKeyAttribute}]`, 'notIn', currentLocalKeys)
          .attrs(_.uniq(['ID', this.config.localKeyAttribute, ...this.config.displayAttributes, ...this.config.keyAttributes]))
      },

      getSelected({[this.config.localKeyAttribute]: localKey}) {
        return !!this.addInstanceListDef[localKey]
      },

      changeSelected({ID, [this.config.localKeyAttribute]: localKey, ...row}, value) {
        const newList = Object.assign({}, this.addInstanceList)
        const keyObj = this.config.keyAttributes.reduce((acc, key) => (acc[key] = row[key], acc), {})
        if (this.config.keyAttributes.includes(this.config.localKeyAttribute)) {
          keyObj[this.config.localKeyAttribute] = localKey
        }
        if (!value) {
          delete newList[localKey]
        } else {
          newList[localKey] = keyObj
        }
        this.$emit('updated', newList)
      }
    }
  }
</script>

