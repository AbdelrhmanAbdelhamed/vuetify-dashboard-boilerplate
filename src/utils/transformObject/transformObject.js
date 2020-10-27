import { transform, isNil } from 'lodash'

import { invokeOrReturn } from '@utils'

export default function transformObject(
  obj,
  fieldsMap,
  { joinArrays = false, joinArrayDelimiter = ',' } = {}
) {
  return transform(obj, (result, oldValue, oldKey) => {
    if (Array.isArray(oldValue) && joinArrays) {
      oldValue = oldValue.length > 1 ? oldValue.join(joinArrayDelimiter) : oldValue[0]
    }

    const newKey = isNil(fieldsMap[oldKey]?.name)
      ? oldKey
      : invokeOrReturn(fieldsMap[oldKey]?.name, oldKey, obj)

    const newValue = isNil(fieldsMap[oldKey]?.value)
      ? oldValue
      : invokeOrReturn(fieldsMap[oldKey]?.value, oldValue, obj)

    // assign value to key only if we don't want to delete both old and new key completely
    if (!isNil(newKey) && invokeOrReturn(fieldsMap[oldKey]?.delete, obj[oldKey], obj) !== true) {
      result[newKey] = newValue
    }

    // If key changed then delete old key unless we want to preserve old key
    if (
      newKey !== oldKey &&
      invokeOrReturn(fieldsMap[oldKey]?.deleteOldKey, obj[oldKey], obj) === false
    ) {
      result[oldKey] = newValue
    }
  })
}
