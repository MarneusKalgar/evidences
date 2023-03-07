// Save import library to the module-scope variable to prevent
// name collision with export library
require('xlsx/jszip.js')
const XLSX = require('xlsx/xlsx.js')

const {UBDomain} = require('@unitybase/cs-shared')
const {ubDataTypes} = UBDomain

const {
  parseComplexFieldAndGetMeta,
  customFieldToAttrInfo,
  getComplexFieldPartName
} = require('../../eav-table/complex-fields')

/**
 * Mixin contains code related to the excel import functionality.
 */
module.exports = {
  inject: [
    'getService'
  ],

  mixins: [
    require('./batched-requests-mixin')
  ],

  data() {
    return {
      excelData: [],
      previewData: [],
      previewDialogVisible: false
    }
  },

  computed: {
    /**
     * Info about columns in the same order as they in the table.
     * @return {Array<{column:*, partMeta:FormsComplexFieldPartMeta|null, label: string}>}
     */
    columnsWithMeta() {
      return this.columns.map(column => {
        const parsedColParts = parseComplexFieldAndGetMeta(this.entityName, column.id)
        const isComplexColumn = parsedColParts.length > 1
        const [firstPart] = parsedColParts
        const isReadOnlyColumn = firstPart.type === 'domain' && firstPart.domainAttr.readOnly
        const isID = firstPart.type === 'domain' && firstPart.domainAttr.name === 'ID'
        const partMeta = isComplexColumn || isReadOnlyColumn || isID ? null : parsedColParts[0]
        const label = column.label || (partMeta ? parsedColParts.map(getComplexFieldPartName).join('.') : undefined)
        return {
          column,
          partMeta,
          label
        }
      })
    },

    previewColumns() {
      return this.columnsWithMeta
        .filter(columnInfo => !!columnInfo.partMeta)
        .map(({column: {id}, label}) => ({
          ...this.configuredColumns.find(c => c.id === id),
          id,
          label
        }))
    }
  },

  methods: {
    /**
     * This method takes excel, parses it and fills in:
     * - previewData
     * - excelData
     */
    async upload(e) {
      this.$store.commit('LOADING', {isLoading: true, target: 'parseExcel'})
      try {
        const file = e.raw
        const data = await readFile(file)
        const workbook = XLSX.read(data, {type: 'binary', cellText: true})
        const sheets = this.getCellsWithAttrValues(workbook)

        const excelData = []
        const columnsCount = this.columns.length
        const rowCount = Math.floor(sheets.length / columnsCount - 1)

        let cellIndex = columnsCount // Skip column titles
        for (let i = 0; i < rowCount; i++) {
          const row = {}
          for (const {column, partMeta} of this.columnsWithMeta) {
            if (partMeta) {
              row[column.id] = sheets[cellIndex]
            }
            cellIndex++
          }
          excelData.push(row)
        }

        /** @type {object.<string,FormsComplexFieldPartMeta>} */
        const metaById = {}
        for (const {column, partMeta} of this.columnsWithMeta) {
          if (partMeta) {
            metaById[column.id] = partMeta
          }
        }

        for (const data of excelData) {
          for (const [key, value] of Object.entries(data)) {
            const meta = metaById[key]
            if (meta) {
              data[key] = this.transformAttrValue(value, meta)
            }
          }
        }

        this.excelData = excelData
        this.previewData = excelData.map(item => ({...item}))
        this.previewDialogVisible = true
      } catch (e) {
        this.throwError(e, 'forms_attrs.collection.error.readExcel')
        this.discard()
      } finally {
        this.$store.commit('LOADING', {isLoading: false, target: 'parseExcel'})
      }
    },

    getCellsWithAttrValues(workbook) {
      const REF_FIELD = '!ref'
      const VALUE_FIELD = 'v'

      const [sheetName] = workbook.SheetNames
      const rawSheets = workbook.Sheets[sheetName]

      const [, lastCell] = rawSheets[REF_FIELD].split(':')
      const lastCellNumber = parseInt(
        lastCell
          .split('')
          .filter(k => Number.isInteger(+k))
          .join('')
      )

      const columnLetters = getColumnLetters(rawSheets)
      const sheets = []
      let i = 0

      while (i <= lastCellNumber) {
        const iStr = i.toString()
        for (const row of columnLetters) {
          const key = row + iStr
          const sheet = rawSheets[key]
          if (sheet && sheet[VALUE_FIELD] === sheetName) {
            continue
          }
          sheets.push(sheet && sheet[VALUE_FIELD])
        }
        i++
      }

      return cutNegativeFromEnd(cutNegativeFromBegin(sheets), this.columns.length)
    },

    async apply() {
      this.previewDialogVisible = false
      this.$refs.table.$store.commit('LOADING', true)

      try {
        const eavMixin = this.$UB.connection.domain.get(this.entityName).mixins.eav
        const eavAttr = eavMixin && eavMixin.attribute

        const commands = this.excelData.map(row => {
          const execParams = {
            [this.parentAttr]: this.parentID,
            attrID: this.attrID
          }

          const eavValues = {}

          for (const [key, value] of Object.entries(row)) {
            if (key.indexOf('.') === -1) {
              execParams[key] = value
            } else if (eavAttr && key.startsWith(eavAttr + '.')) {
              const eavAttrCode = key.substring(eavAttr.length + 1)
              eavValues[eavAttrCode] = value
            }
          }

          if (eavAttr) {
            execParams[eavAttr] = eavValues
          }

          return ({
            entity: this.entityName,
            method: 'insert',
            execParams
          })
        })

        await this.callCommandsWithProgress(commands)
        await this.$refs.table.$store.dispatch('refresh')
      } catch (e) {
        this.throwError(e, 'forms_attrs.collection.error.writeToDB')
      } finally {
        this.$refs.table.$store.commit('LOADING', false)
      }

      this.discard()
    },

    discard() {
      // Sometimes, dialog close might be called before dialog opened (when table has no columns and user clicks)
      // maybe ElementUI bug.  So, need to check $refs
      if (this.$refs.upload) {
        this.$refs.upload.clearFiles()
      }
      this.previewDialogVisible = false
    },

    /**
     * @param {*} value
     * @param {FormsComplexFieldPartMeta} meta
     * @returns {*}
     */
    transformAttrValue(value, meta) {
      if (value === undefined) {
        return undefined
      }

      const ubql = meta.customAttr && meta.customAttr.ubql
      const descriptionAttribute = ubql ? this.$UB.connection.domain.get(ubql.entity).descriptionAttribute : undefined
      const getEntryIdByDescriptionAttribute = value => this.$lookups.get(ubql.entity, {[descriptionAttribute]: value}, true).ID
      const domainInfo = meta.domainAttr || customFieldToAttrInfo(meta.customAttr)

      switch (domainInfo.dataType) {
        case ubDataTypes.Int:
        case ubDataTypes.BigInt:
        case ubDataTypes.Float:
        case ubDataTypes.Currency:
          return value

        case ubDataTypes.ID:
          return undefined

        case ubDataTypes.Entity:
          return getEntryIdByDescriptionAttribute(value)

        case ubDataTypes.Many:
          return value.split(', ').map(getEntryIdByDescriptionAttribute)

        case ubDataTypes.DateTime:
        case ubDataTypes.Date:
          return excelDateToJSDate(value).toISOString()

        case ubDataTypes.Boolean:
          return parseBoolean(value)

        default:
          return value
      }
    },

    throwError(errorMsg, errorUIText) {
      console.error(errorMsg)
      this.$dialogError(this.$UB.i18n(errorUIText), 'error')
      throw new Error(errorMsg)
    }
  }
}

function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = e => resolve(e.target.result)
    reader.onerror = reject
    reader.readAsBinaryString(file)
  })
}

function getColumnLetters(sheets) {
  return Array.from(
    new Set(
      Object.keys(sheets)
        .filter(key => key.indexOf('!') === -1)
        .map(key => key
          .split('')
          .filter(k => !Number.isInteger(+k))
          .join('')
        )
    )
  )
}

function cutNegativeFromBegin(sheetsToCut) {
  const sheets = Array.from(sheetsToCut)
  let indexToCut

  for (let i = 0; i <= sheets.length; i++) {
    if (sheets[i] && !sheets[i + 1]) {
      continue
    }
    if (sheets[i]) {
      indexToCut = i
      break
    }
  }

  sheets.splice(0, indexToCut)
  return sheets
}

function cutNegativeFromEnd(sheetsToCut, cellPerRow) {
  const cellCount = sheetsToCut.length
  let indexToCut
  for (let i = 1; i < cellCount / cellPerRow; i++) {
    const startIndex = cellCount - i * cellPerRow
    const endIndex = startIndex + cellPerRow
    const lastPart = sheetsToCut.slice(startIndex, endIndex)
    // cut last row if every cell is empty
    if (lastPart.every(v => v === undefined)) {
      indexToCut = startIndex
    } else {
      break
    }
  }
  if (indexToCut) {
    sheetsToCut.splice(indexToCut)
  }
  return sheetsToCut
}

const BOOLEAN_VALUES_MAP = {
  true: ['yes', 'да', 'так'],
  false: ['no', 'нет', 'ні']
}

function parseBoolean(value) {
  for (const [boolKey, boolValues] of Object.entries(BOOLEAN_VALUES_MAP)) {
    const isValueInBoolValues = boolValues.includes(value.toLowerCase())
    if (isValueInBoolValues) {
      return JSON.parse(boolKey)
    }
  }
  return undefined
}

/**
 * @param {number?} serial excel date
 * @returns {Date?} Js date
 */
function excelDateToJSDate(serial) {
  if (!serial) {
    return undefined
  }

  const utcDays  = Math.floor(serial - 25569)
  const utcValue = utcDays * 86400
  const dateInfo = new Date(utcValue * 1000)

  const fractionalDay = serial - Math.floor(serial) + 0.0000001

  let total_seconds = Math.floor(86400 * fractionalDay)

  const seconds = total_seconds % 60
  total_seconds -= seconds

  return new Date(
    dateInfo.getFullYear(),
    dateInfo.getMonth(),
    dateInfo.getDate(),
    Math.floor(total_seconds / (60 * 60)),
    Math.floor(total_seconds / 60) % 60,
    seconds
  );
}
