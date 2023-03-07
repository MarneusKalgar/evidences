<template>
  <el-dialog
    v-hold-focus
    :title="$ut('dfx_DocType_form.states.addAction')"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="500px"
    top="0"
    class="dfx-dialog"
  >
    <u-form-container
      label-position="top"
      :label-width="150"
      class="dfx-dialog__form"
    >
      <u-form-row
        attribute-name="code"
        label="dfx_DocTypeAction.code"
      >
        <u-base-input
          v-model="code"
          type="text"
          required
          @blur="$v.code.$touch()"
        >
        </u-base-input>
      </u-form-row>

      <u-form-row
        attribute-name="name"
        label="dfx_DocTypeAction.name"
      >
        <u-base-input
          v-model="name"
          type="text"
          required
          @blur="$v.name.$touch()"
        />
      </u-form-row>

      <u-form-row
        attribute-name="type"
        label="dfx_DocTypeAction.type"
      >
        <u-select-enum
          v-model="type"
          e-group="DFX_ACTION_TYPE"
          @blur="$v.type.$touch()"
        />
      </u-form-row>

      <u-form-row
        label="dfx_DocTypeAction.dialogType"
        v-if="type !== 'api'"
      >
        <u-select-enum
          v-model="dialogType"
          e-group="DFX_ACTION_DIALOG"
        />
      </u-form-row>

      <u-form-row
        v-if="type === 'transition'"
        attribute-name="destDocTypeStateID"
        label="dfx_DocTypeAction.destDocTypeStateID"
      >
        <el-select
          style="width: 100%;"
          v-model="destDocTypeStateID"
          @blur="$v.destDocTypeStateID.$touch()"
        >
          <el-option
            v-for="item in destinationStates"
            :key="item.docTypeStateID"
            :label="item.name"
            :value="item.docTypeStateID">
          </el-option>
        </el-select>
      </u-form-row>

      <u-form-row
        label="dfx_DocTypeAction.roles"
      >
        <el-select
          style="width: 100%;"
          v-model="roles"
          multiple
        >
          <el-option
            v-for="item in docTypeRoles"
            :key="item.code"
            :label="item.name"
            :value="item.code">
          </el-option>
        </el-select>
      </u-form-row>
    </u-form-container>

    <span
      slot="footer"
      class="dfx-dialog__footer"
    >
      <u-button
        appearance="plain"
        @click="dialogVisible = false"
      >
        {{ $ut('cancel') }}
      </u-button>
      <u-button
        color="primary"
        @click="apply"
      >
        {{ $ut(`dfx_DocType_form.states.${dialogMode}Action`) }}
      </u-button>
    </span>
  </el-dialog>
</template>

<script>
  const {mapGetters} = require('vuex')
  const {required} = require('vuelidate/lib/validators/index')
  const {formHelpers, validationMixin} = require('@unitybase/adminui-vue')

  const ACTION_ATTRIBUTES = [
    'ID',
    'docTypeStateID',
    'code',
    'name',
    'roles',
    'type',
    'dialogType',
    'destDocTypeStateID'
  ]

  export default {
    name: 'StatesActionsDialog',

    mixins: [
      validationMixin
    ],

    props: {
      stateActions: {
        type: Array,
        required: false,
        default: []
      }
    },

    data() {
      const data = {
        dialogVisible: false,
        dialogMode: 'add'
      }
      for (const attr of ACTION_ATTRIBUTES) {
        data[attr] = null
      }
      return data
    },

    computed: {
      ...mapGetters('states', [
        'states'
      ]),

      ...mapGetters('roles', {
        roleItems: 'roles'
      }),

      destinationStates() {
        return this.states.filter(state => state.isUsed)
      },

      docTypeRoles() {
        return this.roleItems.filter(role => role.isUsed)
      },

      actionObj() {
        const obj = {}
        for (const attr of ACTION_ATTRIBUTES) {
          obj[attr] = this[attr]
        }
        if (this.type !== 'transition') {
          obj.destDocTypeStateID = null
        }
        if (obj.type === 'api') {
          delete obj.dialogType
        }
        return obj
      }
    },

    validations() {
      return {
        code: {
          required,

          unique: formHelpers.validateWithErrorText(
            'dfx_DocType_form.states.actionCodeNonUnique',
            v => !this.stateActions.find(sa => sa.code === v && sa.ID !== this.ID)
          ),

          regexp: formHelpers.validateWithErrorText(
            'dom_validation.codeRegexpNoUnderscore',
            /**
             * Validate code against regexp, start with letter, and contain only letters digits and underscores.
             * Ignore empty value, let "required" to show its message
             * @param {string} v
             * @return {boolean}
             */
            v => !v || typeof v === 'string' && v.match(/^[a-zA-ZА-Яа-я][a-zA-ZА-Яа-я0-9]*$/) !== null
          )
        },

        name: {
          required
        },

        type: {
          required
        },

        destDocTypeStateID: {
          required(value) {
            return this.type !== 'transition' || required(value)
          }
        }
      }
    },

    methods: {
      openForAdd(docTypeStateID) {
        this.validator.reset()
        this.dialogMode = 'add'
        this.dialogVisible = true

        this.ID = null
        this.docTypeStateID = docTypeStateID
        this.code = ''
        this.name = ''
        this.type = 'transition'
        this.dialogType = 'confirm'
        this.roles = []
        this.destDocTypeStateID = null
      },

      openForEdit(action) {
        this.validator.reset()
        this.dialogMode = 'edit'
        this.dialogVisible = true

        for (const attr of ACTION_ATTRIBUTES) {
          this[attr] = action[attr]
        }
      },

      apply() {
        if (!this.dialogVisible) {
          return
        }
        this.validator.validateForm({showErrorModal: false})
        this.$emit(this.dialogMode + '-action', this.actionObj)
        this.dialogVisible = false
      }
    }
  }
</script>
