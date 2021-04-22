import { cloneDeep, merge, pick } from 'lodash'
import {
  isValidObjectId,
  valuesToObject,
  ObjectToValues,
  escapeRegExp,
  isValidPhoneNumber,
} from '@utils'

import createFormDataProxy from '@utils/createFormDataProxy/createFormDataProxy'
import transformObjectInPlace from '@utils/transformObjectInPlace/transformObjectInPlace'
import transformObject from '@utils/transformObject/transformObject'

import store from '@state/store'

/* eslint-disable camelcase */
export default class BaseModel {
  constructor(
    fields = {},
    { translationFields = BaseModel.translationFields, Model = BaseModel } = {}
  ) {
    const { id, createdAt, updatedAt, translation } = fields

    this.id = id
    this.createdAt = createdAt
    this.updatedAt = updatedAt

    if (translation) {
      this.translation = BaseModel.setDefaultTranslationLanguageValues({
        translation,
        translationFields: [...translationFields, ...Model.translationFields],
      })
    }
  }

  static modelFieldsMap = {
    _id: { name: 'id' },
    created_at: { name: 'createdAt' },
    updated_at: { name: 'updatedAt' },
    translation: {
      value: (translation, item) =>
        this.fromRawTranslation({
          translation,
          item,
        }),
    },
  }

  static rawFieldsMap = {
    id: { name: '_id', delete: (id) => !isValidObjectId(id) },
    createdAt: { name: 'created_at' },
    updatedAt: { name: 'updated_at' },
    translation: {
      value: (translation) => this.toRawTranslation({ translation }),
    },
  }

  static rawParamsMap = {
    page: {
      value: (page) => Math.max(page - 1, 0),
    },
    sortBy: {
      name: 'sort',
    },
    itemsPerPage: {
      name: 'limit',
      value: (itemsPerPage) => Math.max(itemsPerPage, 0),
    },
    query: {
      name: 'q',
      value: (query) => (isValidPhoneNumber(query) ? this.toRawPhoneNumber(query) : query?.trim()),
    },
    isTimeAchieved: {
      name: 'is_time_achieved',
    },
  }

  static translationFields = ['name', 'description', 'title', 'currency', 'type']

  static paramsToOmit = ['sortDesc']

  static getRawFieldName(field) {
    const rawFieldsMap = merge(cloneDeep(BaseModel.rawFieldsMap), this.rawFieldsMap)

    return rawFieldsMap[field]?.name || field
  }

  static getRawParamsName(field) {
    const rawParamsMap = merge(cloneDeep(BaseModel.rawParamsMap), this.rawParamsMap)

    return rawParamsMap[field]?.name || this.getRawFieldName(field)
  }

  static toRawParams(fields) {
    const rawParamsMap = merge(cloneDeep(BaseModel.rawParamsMap), this.rawParamsMap)

    return transformObject(this.toRawData(fields), rawParamsMap, {
      joinArrays: true,
    })
  }

  static fromRawData(
    fields,
    { translationFields = [...BaseModel.translationFields, ...this.translationFields] } = {}
  ) {
    if (!fields) return fields

    const modelFieldsMap = merge(cloneDeep(BaseModel.modelFieldsMap), this.modelFieldsMap)

    const modelFields = transformObject(fields, modelFieldsMap)

    return new this(modelFields, translationFields)
  }

  static toRawData(fields, { returnProxy = false, translationOverrides = {} } = {}) {
    if (!fields) return fields

    if (Array.isArray(fields)) {
      return this.arrayToRawData(fields, { returnProxy, translationOverrides })
    }

    const fieldsClone = BaseModel.cloneFields(fields)

    const rawDataProxyOrFields =
      fieldsClone instanceof FormData ? createFormDataProxy(fieldsClone) : fieldsClone

    const rawFieldsMap = merge(cloneDeep(BaseModel.rawFieldsMap), this.rawFieldsMap)

    this.setFieldsFromDefaultTranslationInPlace({
      item: rawDataProxyOrFields,
      overrides: translationOverrides,
    })

    transformObjectInPlace(rawDataProxyOrFields, rawFieldsMap)

    return returnProxy ? { fields: fieldsClone, proxy: rawDataProxyOrFields } : fieldsClone
  }

  static arrayToRawData(array, { returnProxy = false, translationOverrides = {} } = {}) {
    const fields = array.map((item) =>
      this.toRawData(item, { returnProxy: false, translationOverrides })
    )
    return returnProxy ? { fields, proxy: fields } : fields
  }

  static cloneFields(fields) {
    return fields instanceof FormData ? fields : cloneDeep(fields)
  }

  static fromRawPhoneNumber(phoneNumber, countryCode = '+2') {
    if (!phoneNumber) return phoneNumber

    const countryCodePattern = new RegExp(escapeRegExp(`${countryCode}`))

    return phoneNumber.trim().replace(countryCodePattern, '')
  }

  static toRawPhoneNumber(phoneNumber, countryCode = '+2') {
    if (!phoneNumber) return phoneNumber

    const countryCodePattern = new RegExp(escapeRegExp(`${countryCode}`))

    return !countryCodePattern.test(phoneNumber.trim())
      ? `${countryCode}${phoneNumber.trim()}`
      : phoneNumber.trim()
  }

  static fromRawTranslation({
    translation,
    langKey = '_lang',
    translationFields = [...BaseModel.translationFields, ...this.translationFields],
    item,
    shouldSetDefaultTranslationLanguageValues = true,
  } = {}) {
    const modelTranslation = Array.isArray(translation)
      ? valuesToObject({ values: translation, key: langKey })
      : translation

    return shouldSetDefaultTranslationLanguageValues
      ? this.setDefaultTranslationLanguageValues({
          translation: modelTranslation,
          translationFields,
          item,
        })
      : modelTranslation
  }

  static toRawTranslation({ translation }) {
    return ObjectToValues(translation)
  }

  static setDefaultTranslationLanguageValues({
    item,
    translationFields = [...BaseModel.translationFields, ...this.translationFields],
    translation = {},
    defaultTranslationCode = store.state.core.defaultLanguageCode,
  }) {
    return {
      [defaultTranslationCode]: {
        _lang: defaultTranslationCode,
        ...pick(item, translationFields),
      },
      ...translation,
    }
  }

  static setFieldsFromDefaultTranslationInPlace({
    item,
    overrides = {},
    defaultTranslationCode = store.state.core.defaultLanguageCode,
  } = {}) {
    const defaultTranslation = item.translation?.[defaultTranslationCode]

    if (defaultTranslation) {
      for (const translationKey in defaultTranslation) {
        if (Object.prototype.hasOwnProperty.call(item, translationKey)) {
          const translationValue = defaultTranslation[translationKey]
          const overridesValue = overrides[translationKey]

          item[translationKey] = overridesValue ?? translationValue
        }
      }
    }
  }
}
