import { safeJsonParse } from '@utils'

export default function createFormDataProxy(fields) {
  return new Proxy(fields, {
    get(obj, prop) {
      if (typeof prop === 'symbol') return Reflect.get(obj, prop)
      return formDataGetTrap(obj, prop)
    },
    set(obj, prop, val) {
      if (typeof prop === 'symbol') return Reflect.set(obj, prop, val)
      return formDataSetTrap(obj, prop, val)
    },
    deleteProperty(obj, prop) {
      return formDataDeleteTrap(obj, prop)
    },
    ownKeys(obj) {
      return formDataOwnKeysTrap(obj)
    },
    has(obj, prop) {
      return formDataHasTrap(obj, prop)
    },
    getOwnPropertyDescriptor(obj, prop) {
      return {
        value: this.get(obj, prop),
        enumerable: true,
        configurable: true,
      }
    },
  })
  function formDataGetTrap(obj, prop) {
    let property
    if (obj.has('data')) {
      const [error, data] = safeJsonParse(obj.get('data'))
      if (!error && prop in data) property = data[prop]
    }
    return typeof property === 'function' ? property.bind(obj) : property
  }
  function formDataSetTrap(obj, prop, val) {
    if (obj.has('data')) {
      const [error, data] = safeJsonParse(obj.get('data'))
      if (!error) {
        data[prop] = val
        obj.set('data', JSON.stringify(data))
      }
      return true
    }
    return false
  }
  function formDataDeleteTrap(obj, prop) {
    if (obj.has('data')) {
      const [error, data] = safeJsonParse(obj.get('data'))
      if (!error) {
        delete data[prop]
        obj.set('data', JSON.stringify(data))
      }
      return true
    }
    return false
  }
  function formDataOwnKeysTrap(obj) {
    const keys = Array.from(obj.keys())
    let ownKeys = []
    keys.forEach((key) => {
      if (key === 'data') {
        const [error, data] = safeJsonParse(obj.get(key))
        if (!error) {
          const dataKeys = Object.keys(data)
          ownKeys = [...ownKeys, ...dataKeys]
        }
      }
    })
    return ownKeys
  }
  function formDataHasTrap(obj, prop) {
    if (obj.has('data')) {
      const [error, data] = safeJsonParse(obj.get('data'))
      return !error && prop in data
    }
  }
}
