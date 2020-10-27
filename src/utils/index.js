import { merge, cloneDeep, isEqual, isPlainObject, get } from 'lodash'
import { toSnakeCase } from './stringUtils'

import { version } from '~/package.json'

export function arrayToLocale({
  array,
  i18n,
  converter = toSnakeCase,
  key = 'text',
  value = 'value',
} = {}) {
  return array.map((item) => ({
    [key]: i18n.t(converter(item[key] ?? item)),
    [value]: item,
  }))
}

export function localeToArray({ locale, key = 'value' } = {}) {
  return locale.map((item) => item[key] ?? item)
}

export function valuesToObject({ values, key }) {
  return Object.assign(
    {},
    ...values
      .filter((item) => item != null && item[key] != null)
      .map((item) => ({ [item[key]]: item }))
  )
}

export function ObjectToValues(obj = {}) {
  return Object.values(obj)
}

export function objectMapToArray({
  obj,
  textKey = 'text',
  valueKey = 'value',
  disabledPredicate = () => false,
} = {}) {
  return Object.entries(obj).map(([key, value]) => {
    const disabled = disabledPredicate({ key, value })
    return {
      [textKey]: key,
      [valueKey]: value,
      disabled,
    }
  })
}

export function primitivesArrayToObjectsArray({ array, key = 'value' }) {
  return array.map((item, index) => ({ [key]: item, id: index + 1 }))
}

export function objectsArrayToPrimitivesArray({ array, key = 'value' }) {
  return array.map((item) => item[key])
}

export function assignNonEmptyValues(item, valuesMap = {}) {
  for (const key in valuesMap) {
    const value = valuesMap[key]
    if (value != null && value !== '') item[key] = value
  }
}

export function removeEmptyAttrs(obj) {
  return Object.fromEntries(
    Object.entries(obj)
      .filter(([key, value]) => value != null && value !== '')
      .map(([key, value]) => (isPlainObject(value) ? [key, removeEmptyAttrs(value)] : [key, value]))
  )
}

export function generateAttrs(attrs, ...args) {
  const generatedAttrs = {}
  if (typeof attrs === 'object') {
    Object.entries(attrs).forEach(([key, value]) => {
      generatedAttrs[key] = invokeOrReturn(value, ...args)
    })
  }
  return generatedAttrs
}

export function getObjectFields(srcObj = {}) {
  return Object.keys(srcObj).reduce((obj, item) => {
    obj[item] = ''
    return obj
  }, {})
}

export function setFormDataArray(formData, array, key = 'images') {
  formData.delete(key)
  array.forEach((item) => formData.append(key, item.file, item.file.name))
}

export function isContainsJsonContentType(headers) {
  const jsonContentTypes = [headers['content-type'] ?? '', headers.common?.Accept ?? '']
  return jsonContentTypes.some((contentType) => contentType.includes('application/json'))
}

export function downloadFile(filePath) {
  const link = document.createElement('a')
  link.href = filePath
  link.download = filePath.substr(filePath.lastIndexOf('/') + 1)
  link.click()
}

export function escapeRegExp(string) {
  return string.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}

export function getSavedState(key) {
  return JSON.parse(localStorage.getItem(`v${version}:${key}`))
}

export function saveState(key, state) {
  localStorage.setItem(`v${version}:${key}`, JSON.stringify(state))
}

export function invokeOrReturn(invocableCandidate, ...args) {
  return typeof invocableCandidate === 'function' ? invocableCandidate(...args) : invocableCandidate
}

export function isEmpty(item = {}) {
  if (item == null) item = {}

  const values = ObjectToValues(item)

  return (
    values.length === 0 ||
    !values.some(
      (value) =>
        (Array.isArray(value) && value.length > 0) ||
        (!Array.isArray(value) && value !== '' && value != null)
    )
  )
}

export function isSecureURL(str) {
  const secureUrlRegex = /^(https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/g
  return secureUrlRegex.test(str)
}

export function testRegex(regex, value) {
  return value != null && value !== '' && regex.test(String(value))
}

export function isValidObjectId(id) {
  return testRegex(/^[0-9a-fA-F]+$/, id)
}

export function isValidPhoneNumber(phoneNumber) {
  return testRegex(/^(010|011|012|015)[0-9]{8}$/, phoneNumber)
}

export function mergeTwoArraysByKey(arrayA, arrayB, key = 'id') {
  return arrayA.map((itemA) =>
    merge(
      cloneDeep(itemA),
      arrayB.find((itemB) => isEqual(itemA[key], itemB[key]))
    )
  )
}

export function replaceAll(string, search, replace, options = 'g') {
  const searchRegExp = new RegExp(escapeRegExp(search), options)
  return string.replace(searchRegExp, replace)
}

export function safeJsonParse(string) {
  try {
    return [null, JSON.parse(string)]
  } catch (error) {
    return [error]
  }
}

export function reOrderArrayItem(arr, { newIndex, oldIndex } = {}) {
  const reOrderedArray = cloneDeep(arr)
  const selectedItemToReorder = reOrderedArray.splice(oldIndex, 1)[0]
  reOrderedArray.splice(newIndex, 0, selectedItemToReorder)
  return reOrderedArray
}

export function triggerRipple($el) {
  const ev = new Event('mousedown')
  const offset = $el.getBoundingClientRect()
  ev.clientX = offset.left + offset.width / 2
  ev.clientY = offset.top + offset.height / 2
  $el.dispatchEvent(ev)

  setTimeout(function() {
    $el.dispatchEvent(new Event('mouseup'))
  }, 300)
}

export function roundToFixedNumber(num, scale = 2) {
  const digits = 10 ** scale
  return Math.round((num + Number.EPSILON) * digits) / digits
}

export function getNestedRef(component, refKeys = []) {
  const nestedPath = `$refs.${refKeys.join('.$refs.')}`
  return get(component, nestedPath)
}
