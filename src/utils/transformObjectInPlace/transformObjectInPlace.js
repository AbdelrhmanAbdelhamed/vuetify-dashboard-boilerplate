import { isNil, cloneDeep } from 'lodash'

import { invokeOrReturn } from '@utils'

export default function transformObjectInPlace(obj, fieldsMap) {
  const originalObj = obj instanceof FormData ? obj : cloneDeep(obj)

  for (const oldKey in fieldsMap) {
    if (Object.prototype.hasOwnProperty.call(obj, oldKey)) {
      const oldValue = obj[oldKey]

      const newKey =
        isNil(oldKey) || isNil(fieldsMap[oldKey].name)
          ? oldKey
          : invokeOrReturn(fieldsMap[oldKey].name, oldKey, originalObj)

      const newValue =
        isNil(oldValue) || isNil(fieldsMap[oldKey].value)
          ? oldValue
          : invokeOrReturn(fieldsMap[oldKey].value, originalObj[oldKey], originalObj)

      obj[oldKey] = newValue

      if (!isNil(newKey)) {
        obj[newKey] = newValue

        // Delete both old and new key completely
        if (invokeOrReturn(fieldsMap[oldKey].delete, originalObj[oldKey], originalObj) === true) {
          delete obj[oldKey]
          delete obj[newKey]
        }

        // If key changed then delete old key unless we want to preserve old key
        else if (
          newKey !== oldKey &&
          invokeOrReturn(fieldsMap[oldKey].deleteOldKey, originalObj[oldKey], originalObj) !== false
        ) {
          delete obj[oldKey]
        }
      }
    }
  }
}
