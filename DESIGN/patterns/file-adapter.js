const {connection} = require('@unitybase/ub-pub')

/**
 * @typedef {object} FileInformation
 * @property {string} size
 * @property {string} fileName
 * @property {string} origFileName
 * @property {string} contentType
 */

/**
 * Class responsible for accessing file infos in a script module.
 */
class FileAccessor {
  /**
   * @param {object} fileInfo
   * @param {FileAdapter} fileAdapter
   */
  constructor(fileInfo, fileAdapter) {
    this._fileInfo = fileInfo
    this._fileAdapter = fileAdapter
  }

  /**
   * Returns information about file by entity attribute name with the "Document" dataType
   *
   * @param {string} blobAttrName
   * @returns {FileInformation | null}
   */
  _getFileInfoByAttributeName(blobAttrName) {
    const blobAttribute = this._fileInfo[blobAttrName]
    if (!blobAttribute) {
      return null
    }

    const parsedFile = typeof blobAttribute === 'string' ? JSON.parse(blobAttribute) : blobAttribute
    const {fName, origName, ct, size} = parsedFile

    return {
      size,
      fileName: fName,
      origFileName: origName,
      contentType: ct
    }
  }

  /**
   * Returns true if the file's content has been uploaded
   *
   * @returns {boolean}
   * @readonly
   * @memberof FileAccessor
   */
  get isUploaded() {
    return !!this.fileInfo
  }

  /**
   * Returns information about content of the file
   *
   * @returns {FileInformation | null}
   * @readonly
   * @memberof FileAccessor
   */
  get fileInfo() {
    return this._getFileInfoByAttributeName(this._fileAdapter.fileAttribute)
  }

  /**
   * Returns information about original content of the file
   *
   * @returns {FileInformation | null}
   * @readonly
   * @memberof FileAccessor
   */
  get originalFileInfo() {
    return this._getFileInfoByAttributeName(this._fileAdapter.storedOriginalFileAttribute)
  }
}

/**
 * Adapter for dataProvider for managing files, their signatures and versions
 */
class FileAdapter {
  /**
   * @param {object} params
   * @param {DataProvider} params.dataProvider
   * @param {string} [params.entityName]
   * @param {string} [params.fileCollectionDataObj]
   * @param {string} [params.signaturesDataObj]
   * @param {string} [params.versionsDataObj]
   * @param {string} [params.documentIDAttributeName]
   * @param {string} [params.documentItemIDAttributeName]
   * @param {string} [params.fileAttribute]
   * @param {string} [params.storedOriginalFileAttribute]
   * @param {FormScriptModule} [params.scriptModule]
   * @param {string} [params.attributeCode]
   */
  constructor({
    dataProvider,
    entityName = 'dfx_DocumentAttachment',
    fileCollectionDataObj = 'instance:attachments',
    signaturesDataObj = 'instance:signatures',
    versionsDataObj = 'instance:imageVersions',
    documentIDAttributeName = 'ID',
    documentItemIDAttributeName,
    fileAttribute = 'attachment',
    storedOriginalFileAttribute = 'original',
    scriptModule,
    attributeCode
  }) {
    this.dataProvider = dataProvider
    this.entityName = entityName
    this.fileCollectionDataObj = fileCollectionDataObj
    this.signaturesDataObj = signaturesDataObj
    this.versionsDataObj = versionsDataObj
    this.documentIDAttributeName = documentIDAttributeName
    this.documentItemIDAttributeName = documentItemIDAttributeName
    this.fileAttribute = fileAttribute
    this.storedOriginalFileAttribute = storedOriginalFileAttribute

    this._scriptModule = scriptModule
    this._attributeCode = attributeCode
  }

  /**
   * @readonly
   * @returns {number}
   */
  get documentID() {
    return this.dataProvider.getValue(this.documentIDAttributeName, 'instance')
  }

  /**
   * @readonly
   * @returns {number}
   */
  get documentItemID() {
    return this.documentItemIDAttributeName
      ? this.dataProvider.getValue(this.documentItemIDAttributeName, 'instance')
      : null
  }

  /**
   * @readonly
   * @returns {string[]}
   */
  get fileItemAttrs() {
    return [
      this.fileAttribute,
      this.storedOriginalFileAttribute,
      'name',
      'description'
    ]
  }

  /**
   * DataProvider shall return ALL files attached to the master entity.
   * @readonly
   * @returns {Array}
   */
  get files() {
    return this.dataProvider.getItems(this.fileCollectionDataObj)
  }

  /**
   * DataProvider shall return ALL versions available for the master entity.
   * @readonly
   * @return {Array}
   */
  get versions() {
    return this.dataProvider.getItems(this.versionsDataObj)
  }

  /**
   * DataProvider shall return ALL signatures available for the master entity.
   * @readonly
   * @return {Array}
   */
  get signatures() {
    return this.dataProvider.getItems(this.signaturesDataObj)
  }

  /**
   * Index in the files of the file displayed by this control.
   * @param {number|null} attrID
   * @return {number}
   */
  getFileItemIndex(attrID) {
    return this.files.findIndex(item => item.attrID === attrID)
  }

  /**
   * Collection item for the currently displayed file.
   * @param {number|null} attrID
   * @returns {object}
   */
  getFileItem(attrID) {
    return this.files[this.getFileItemIndex(attrID)] || {}
  }

  /**
   * Collection items for the file collection.
   * @param {number|null} attrID
   * @returns {object[]}
   */
  getFileItems(attrID) {
    return this.files.filter(item => item.attrID === attrID)
  }

  /**
   * Upload single custom or native file attribute
   * @param {object} itemToAdd
   */
  async addFile(itemToAdd) {
    itemToAdd.documentID = this.documentID
    itemToAdd.documentItemID = this.documentItemID
    this.dataProvider.addItem(itemToAdd, this.fileCollectionDataObj)

    if (this._scriptModule) {
      await this._scriptModule.onAttributeChange({
        attributeCode: this._attributeCode,
        value: new FileAccessor(itemToAdd, this),
        oldValue: null,
        dataObj: this.fileCollectionDataObj
      })
    }
  }

  /**
   * Update single custom or native file or some item of "Document Attachments"
   * @param {object} newItem
   * @param {object} [oldItem]
   */
  async updateFile(newItem, oldItem) {
    const fileIndex = this.files.findIndex(i => i.ID === newItem.ID)
    if (fileIndex === -1) {
      console.error('file-adapter cannot updateFile, because item for attribute %d is not found', newItem.attrID)
      return
    }

    for (const attr of this.fileItemAttrs) {
      const value = newItem[attr] === undefined ? null : newItem[attr]
      this.dataProvider.changeItem(fileIndex, attr, value, this.fileCollectionDataObj)
    }

    if (this._scriptModule) {
      await this._scriptModule.onAttributeChange({
        attributeCode: this._attributeCode,
        value: new FileAccessor(newItem, this),
        oldValue: new FileAccessor(oldItem, this),
        dataObj: this.fileCollectionDataObj
      })
    }
  }

  /**
   * Clear some native or custom file
   * @param {number|null} attrID
   * @param {object} oldValue
   */
  async clearFile(attrID, oldValue) {
    const fileIndex = this.getFileItemIndex(attrID)
    if (fileIndex === -1) {
      console.error(`file-adapter cannot clearFile, because item for attribute ${attrID} is not found`)
      return
    }

    for (const attr of this.fileItemAttrs) {
      this.dataProvider.changeItem(fileIndex, attr, null, this.fileCollectionDataObj)
    }
    this.dataProvider.changeItem(fileIndex, 'name', '-', this.fileCollectionDataObj)

    if (this._scriptModule) {
      await this._scriptModule.onAttributeChange({
        attributeCode: this._attributeCode,
        value: null,
        oldValue: new FileAccessor(oldValue, this),
        dataObj: this.fileCollectionDataObj
      })
    }
  }

  /**
   * Remove some file from collection of files
   * @param {object} item
   */
  deleteFile(item) {
    const fileIndex = this.files.findIndex(i => i.ID === item.ID)
    if (fileIndex === -1) {
      console.error('file-adapter cannot deleteFile, because item for attribute %d is not found', item.attrID)
      return
    }

    this.dataProvider.removeItem(fileIndex, this.fileCollectionDataObj)
  }

  /**
   * Get signatures for some specific file
   * @param {string} originalFileAttribute
   * @param {number} originalRevision
   * @param {number} recordID
   * @returns {object[]}
   */
  getSignatures(originalFileAttribute, originalRevision, recordID) {
    return this.signatures.filter(item => {
      const {instanceID, imageEntity, imageAttribute, revision} = item
      return imageEntity === this.entityName
        && imageAttribute === originalFileAttribute
        && revision === originalRevision
        && instanceID === recordID
    })
  }

  /**
   * @param {string} signature  base-64 content
   * @param {SignatureValidationResult} verificationResult
   * @param {number} [attrID]
   * @param {number} [instanceID]  Is used when working with a collection of files, not a single file
   * @param {number} [revision]  For "dirty" (not in permanent store) document, there is no revision yet
   * @param {string} md5
   * @param {string} imageAttributeName
   * @return {Promise<void>}
   */
  async signDocument({
    instanceID,
    signature,
    verificationResult,
    attrID,
    revision,
    md5,
    imageAttributeName
  }) {
    const docSignature = await connection.addNewAsObject({
      entity: 'dfx_DocumentSignature',
      fieldList: ['ID']
    })

    const signatureAttrValue = await connection.setDocument(signature, {
      entity: 'dfx_DocumentSignature',
      attribute: 'signature',
      ID: docSignature.ID,
      origName: verificationResult.subject.fullName + '.p7s'
    })

    const fileItemID = instanceID || this.getFileItem(attrID).ID

    const signatureItem = {
      ID: docSignature.ID,

      documentID: this.documentID,
      documentItemID: this.documentItemID,

      instanceID: fileItemID,
      imageEntity: this.entityName,
      imageAttribute: imageAttributeName,
      revision,
      imageMD5: md5,

      signature: JSON.stringify(signatureAttrValue),
      timeStamp: verificationResult.signingTime,
      signer: verificationResult.subject.fullName
    }

    this.dataProvider.addItem(signatureItem, this.signaturesDataObj)

    if (this._scriptModule) {
      await this._scriptModule.onDocumentSigned({
        dataObj: this.fileCollectionDataObj,
        attributeCode: this._attributeCode,
        signature: formatSignatureItemForScriptModule(signatureItem)
      })
    }
  }

  /**
   * @param {object} signature
   * @returns {Promise<void>}
   */
  async removeSignature(signature) {
    const indexInDataObj = this.signatures.findIndex(item => item.ID === signature.ID)
    this.dataProvider.removeItem(indexInDataObj, this.signaturesDataObj)

    if (this._scriptModule) {
      await this._scriptModule.onDocumentSignatureRemoved({
        dataObj: this.fileCollectionDataObj,
        attributeCode: this._attributeCode,
        signature: formatSignatureItemForScriptModule(signature)
      })
    }
  }

  /**
   * Get versions specific for some file
   * @param {number} recordID
   * @returns {object[]}
   */
  getVersions(recordID) {
    const filteredVersions = this.versions
      .filter(item => item.instanceID === recordID && !!item.imageFile)
    return _.orderBy(filteredVersions, 'version', 'desc')
  }

  /**
   * @param {string} signature  base-64 content
   * @param {number} [attrID]
   * @param {number} [instanceID]  Is used when working with a collection of files, not a single file
   * @return {Promise<void>}
   */
  async createVersion({
    instanceID,
    attrID
  }) {
    const imgVersion = await connection.addNewAsObject({
      entity: 'dfx_DocumentImgVersion',
      fieldList: ['ID']
    })

    const fileItem = this.getFileItem(attrID)

    if (!instanceID) {
      instanceID = fileItem.ID
    }
    const maxVersionItem = _.maxBy(
      this.getVersions(instanceID),
      ver => ver.version
    )
    const version = maxVersionItem ? maxVersionItem.version + 1 : 1

    const versionItem = {
      ID: imgVersion.ID,

      documentID: this.documentID,
      documentItemID: this.documentItemID,
      instanceID,

      imageAttribute: fileItem[this.fileAttribute]
        ? this.fileAttribute
        : null,
      imageFile: fileItem[this.fileAttribute]
        ? JSON.parse(fileItem[this.fileAttribute])
        : null,

      originalAttribute: fileItem[this.storedOriginalFileAttribute]
        ? this.storedOriginalFileAttribute
        : null,
      originalFile: fileItem[this.storedOriginalFileAttribute]
        ? JSON.parse(fileItem[this.storedOriginalFileAttribute])
        : null,

      version
    }

    this.dataProvider.addItem(versionItem, this.versionsDataObj)

    if (this._scriptModule) {
      await this._scriptModule.onDocumentVersionCreated({
        dataObj: this.fileCollectionDataObj,
        attributeCode: this._attributeCode,
        version: formatVersionItemForScriptModule(versionItem)
      })
    }
  }

  /**
   * @param {number} versionID
   * @returns {Promise<void>}
   */
  async removeVersion(versionID) {
    const versionItem = this.versions.find(item => item.ID === versionID)
    const index = this.versions.findIndex(item => item.ID === versionID)
    this.dataProvider.removeItem(index, this.versionsDataObj)

    if (this._scriptModule) {
      await this._scriptModule.onDocumentVersionRemoved({
        dataObj: this.fileCollectionDataObj,
        attributeCode: this._attributeCode,
        version: formatVersionItemForScriptModule(versionItem)
      })
    }
  }
}

module.exports = {
  FileAdapter,
  FileAccessor
}

/**
 * @typedef {object} FileSignature
 * @property {string} timeStamp
 * @property {string} signer
 */

/**
 * @typedef {FileSignature} FileSignatureWithFile
 * @property {object} file
 * @property {number} [revision]
 */

/**
 * @typedef {object} FileVersion
 * @property {number} version
 * @property {FileAccessor} file
 */

/**
 * Format signature entry for convenient interaction in th script module.
 * @param {{signer: string, timeStamp: number, signature: string, revision?: number}} signatureItem
 * @returns {FileSignatureWithFile}
 */
function formatSignatureItemForScriptModule(signatureItem) {
  return {
    signer: signatureItem.signer,
    timeStamp: signatureItem.timeStamp,
    file: JSON.parse(signatureItem.signature),
    revision: signatureItem.revision
  }
}

/**
 * Format version entry for convenient interaction in th script module.
 * @param {{version: number, imageFile: object}} versionItem
 * @returns {FileVersion}
 */
function formatVersionItemForScriptModule(versionItem) {
  return {
    version: versionItem.version,
    file: versionItem.imageFile
  }
}
