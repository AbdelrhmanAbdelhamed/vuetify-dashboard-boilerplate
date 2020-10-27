import {
  camelCase,
  kebabCase,
  lowerCase,
  snakeCase,
  startCase,
  upperCase,
  upperFirst,
} from 'lodash'

export function toCamelCase(str) {
  return camelCase(str)
}

export function toTitleCase(str) {
  return startCase(camelCase(str))
}

export function toPascalCase(str) {
  return startCase(camelCase(str)).replace(/ /g, '')
}

export function toConstantCase(str) {
  return upperCase(str).replace(/ /g, '_')
}

export function toDotCase(str) {
  return lowerCase(str).replace(/ /g, '.')
}

export function toKebabCase(str) {
  return kebabCase(str)
}

export function toLowerCase(str) {
  return lowerCase(str).replace(/ /g, '')
}

export function toPathCase(str) {
  return lowerCase(str).replace(/ /g, '/')
}

export function toSnakeCase(str) {
  return snakeCase(str)
}

export function toSentenceCase(str) {
  return upperFirst(lowerCase(str))
}

export function toNumber(str) {
  const potentialNumber = parseFloat(str)
  return isNaN(potentialNumber) ? str : potentialNumber
}

export function isCamelCase(str) {
  return /^[a-z][A-Za-z]*$/.test(str)
}

export function isPascalCase(str) {
  return /^[A-Z][A-Za-z]*$/.test(str)
}

export function isSnakeCase(str) {
  return /^([a-z]{1,})(_[a-z0-9]{1,})*$/.test(str)
}

export function isKebabCase(str) {
  return /^([a-z]{1,})(_[a-z0-9]{1,})*$/.test(str)
}
