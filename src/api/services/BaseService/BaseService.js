import { cloneDeep, omit } from 'lodash'

import { isEmpty } from '@utils'

import { toCamelCase } from '@utils/stringUtils'

import httpClient from '../../clients/http'

export default class BaseService {
  get resourcesHierarchy() {
    return { [this.resource]: '' }
  }

  get resource() {
    throw new Error('"resource" getter is not defined, please make sure to override it')
  }

  get resourcesEndPointMap() {
    return {}
  }

  get endPointSearchPostfix() {
    return ''
  }

  get Model() {
    throw new Error('"Model" getter is not defined, please make sure to override it')
  }

  constructor(client) {
    this.client = client || httpClient
  }

  generateEndPoint = (resourcesHierarchy = this.resourcesHierarchy) => {
    return Object.entries(
      Object.hasOwnProperty.call(resourcesHierarchy, this.resource)
        ? resourcesHierarchy
        : { ...resourcesHierarchy, ...this.resourcesHierarchy }
    )
      .map(
        ([resourceName, resourceKey]) =>
          `${this.resourcesEndPointMap[resourceName] ?? resourceName}${
            resourceKey ? `/${resourceKey}` : ''
          }`
      )
      .join('/')
  }

  resolveItem = ({ item, Model = this.Model } = {}) => {
    return Model.fromRawData(item)
  }

  resolveItemList = ({ list, Model = this.Model } = {}) => {
    const resourceData = list.map((item, index) =>
      this.resolveItem({ item: { index, ...item }, Model })
    )
    return resourceData
  }

  resolveResponse = ({ data }, { resource = this.resource, Model = this.Model } = {}) => {
    const list = data[toCamelCase(resource)] || data[resource.toLowerCase()]

    // paginated results
    if (Array.isArray(list)) {
      // eslint-disable-next-line camelcase
      const { page, total_pages, total } = data
      return {
        [resource]: this.resolveItemList({ list, Model }),
        page,
        pages: total_pages,
        total,
      }
    }

    return Array.isArray(data)
      ? { [resource]: this.resolveItemList({ list: data, Model }) }
      : this.resolveItem({ item: data, Model })
  }

  normalizeConfig = ({ config, resource = this.resource, Model = this.Model } = {}) => {
    config = config || { params: {} }

    const normalizedConfig = cloneDeep(config)

    normalizedConfig.resolveResponse =
      normalizedConfig.resolveResponse ??
      (({ data }) => this.resolveResponse({ data }, { resource, Model }))

    if (normalizedConfig.params) {
      normalizedConfig.params = this.normalizeParams({
        config: normalizedConfig,
        resource,
        Model,
      })
    }

    return normalizedConfig
  }

  normalizeGetAllEndPoint({ resourcesHierarchy = this.resourcesHierarchy, config } = {}) {
    const endPoint = config.endPoint ?? `${this.generateEndPoint(resourcesHierarchy)}`

    const endPointSearchPostfix = config.endPointSearchPostfix ?? this.endPointSearchPostfix

    return !isEmpty(config.filters) && endPointSearchPostfix
      ? `${endPoint}/${endPointSearchPostfix}`
      : endPoint
  }

  normalizeParams = ({ config, resource = this.resource, Model = this.Model } = {}) => {
    let normalizedParams = cloneDeep(config.params)

    if (config.filters) {
      normalizedParams = { ...normalizedParams, ...config.filters }
    }

    normalizedParams = Model.toRawParams(normalizedParams)

    if (normalizedParams.sort) {
      normalizedParams.sort = this.normalizeSortParams({
        sortField: normalizedParams.sort,
        sortDesc: normalizedParams.sortDesc,
        resource,
        Model,
      })
    }

    normalizedParams = omit(normalizedParams, Model.paramsToOmit)

    return normalizedParams
  }

  normalizeSortParams = ({ sortField, sortDesc, Model = this.Model } = {}) => {
    let rawSortField = Model.getRawParamsName(sortField)

    if (sortDesc && rawSortField) {
      rawSortField = `-${rawSortField}`
    }
    return rawSortField
  }

  create({
    item,
    resourcesHierarchy = this.resourcesHierarchy,
    config,
    resource = this.resource,
    Model = this.Model,
  } = {}) {
    const normalizedConfig = this.normalizeConfig({ config, resource, Model })

    const itemRawData = Model.toRawData(item)

    const endPoint = normalizedConfig.endPoint ?? `${this.generateEndPoint(resourcesHierarchy)}`

    return this.client.post(endPoint, itemRawData, normalizedConfig)
  }

  getAll({
    resourcesHierarchy = this.resourcesHierarchy,
    config,
    resource = this.resource,
    Model = this.Model,
  } = {}) {
    const normalizedConfig = this.normalizeConfig({ config, resource, Model })

    const normalizedEndPoint = this.normalizeGetAllEndPoint({
      resourcesHierarchy,
      config: normalizedConfig,
    })

    return this.client.get(normalizedEndPoint, normalizedConfig)
  }

  getList({
    resourcesHierarchy = this.resourcesHierarchy,
    config,
    resource = this.resource,
    Model = this.Model,
  } = {}) {
    const normalizedConfig = this.normalizeConfig({ config, resource, Model })

    const normalizedEndPoint =
      normalizedConfig.endPoint ?? `${this.generateEndPoint(resourcesHierarchy)}/list`

    return this.client.get(normalizedEndPoint, normalizedConfig)
  }

  getById({
    id,
    resourcesHierarchy = this.resourcesHierarchy,
    config,
    resource = this.resource,
    Model = this.Model,
  } = {}) {
    const normalizedConfig = this.normalizeConfig({ config, resource, Model })

    const endPoint =
      normalizedConfig.endPoint ?? `${this.generateEndPoint(resourcesHierarchy)}/${id}`

    return this.client.get(endPoint, normalizedConfig)
  }

  update({
    item,
    resourcesHierarchy = this.resourcesHierarchy,
    config,
    resource = this.resource,
    Model = this.Model,
    usePatchMethod = false,
  } = {}) {
    const normalizedConfig = this.normalizeConfig({ config, resource, Model })

    const { fields: itemRawData, proxy: itemRawDataProxy } = Model.toRawData(item, {
      returnProxy: true,
    })

    const shouldAppendId = !Array.isArray(itemRawDataProxy)
    const shouldHaveId = shouldAppendId && !itemRawDataProxy._id

    if (shouldHaveId) return Promise.reject(new Error(`No id provided to update ${resource}`))

    const endPoint =
      normalizedConfig.endPoint ??
      `${this.generateEndPoint(resourcesHierarchy)}${
        shouldAppendId ? `/${itemRawDataProxy._id}` : ''
      }`

    return this.client[usePatchMethod ? 'patch' : 'put'](endPoint, itemRawData, normalizedConfig)
  }

  delete({
    id,
    resourcesHierarchy = this.resourcesHierarchy,
    config,
    resource = this.resource,
  } = {}) {
    if (!id) return Promise.reject(new Error(`No id provided to delete ${resource}`))

    const normalizedConfig = this.normalizeConfig({ config, resource })

    const endPoint =
      normalizedConfig.endPoint ?? `${this.generateEndPoint(resourcesHierarchy)}/${id}`

    return this.client.delete(endPoint, normalizedConfig)
  }
}
