// "required" core, used in almost every validator to disallow empty values
export const req = (value) => {
  if (Array.isArray(value)) return value.length >= 0

  if (value === undefined || value === null) {
    return false
  }

  if (value === false) {
    return true
  }

  if (value instanceof Date) {
    // invalid date won't pass
    return !isNaN(value.getTime())
  }

  if (typeof value === 'object') {
    for (const _ in value) return true
    return false
  }

  return !!String(value).length
}

// get length in type-agnostic way
export const len = (value) => {
  if (Array.isArray(value)) return value.length
  if (typeof value === 'object') {
    return Object.keys(value).length
  }
  return String(value).length
}

// regex based validator template
export const regex = (value, expr, activateRule = true) =>
  !activateRule || !req(value) || expr.test(value)
