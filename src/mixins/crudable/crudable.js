import { getNestedRef } from '@utils'
import { toPascalCase } from '@utils/stringUtils'

export default {
  data() {
    return {
      loading: false,
    }
  },
  props: {
    forceLoading: {
      type: Boolean,
      required: false,
      default: false,
    },
    stateName: {
      type: String,
      required: false,
    },
    module: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    resourcesHierarchy: {
      type: Object,
      required: false,
      default: null,
    },
    fetchActionPrefix: {
      type: String,
      required: false,
      default: 'fetch',
    },
    createActionPrefix: {
      type: String,
      required: false,
      default: 'create',
    },
    updateActionPrefix: {
      type: String,
      required: false,
      default: 'update',
    },
    deleteActionPrefix: {
      type: String,
      required: false,
      default: 'delete',
    },
    deactivateActionPrefix: {
      type: String,
      required: false,
      default: 'deactivate',
    },
    currentItemPrefix: {
      type: String,
      required: false,
      default: 'current',
    },
  },
  computed: {
    state() {
      return this.$store.state[this.stateName || this.module]
    },
    actionNameSpace() {
      return this.module
    },
    normalizedModelName() {
      return toPascalCase(this.model)
    },
    normalizedModuleName() {
      return toPascalCase(this.module)
    },
    fetchListActionName() {
      return `${this.stateName || this.module}/${this.fetchActionPrefix}${
        this.normalizedModuleName
      }`
    },
    fetchItemActionName() {
      return `${this.stateName || this.module}/${this.fetchActionPrefix}${this.normalizedModelName}`
    },
    createActionName() {
      return `${this.stateName || this.module}/${this.createActionPrefix}${
        this.normalizedModelName
      }`
    },
    updateActionName() {
      return `${this.stateName || this.module}/${this.updateActionPrefix}${
        this.normalizedModelName
      }`
    },
    deleteActionName() {
      return `${this.stateName || this.module}/${this.deleteActionPrefix}${
        this.normalizedModelName
      }`
    },
    deactivateActionName() {
      return `${this.stateName || this.module}/${this.deactivateActionPrefix}${
        this.normalizedModelName
      }`
    },
  },
  watch: {
    loading: {
      handler: function(newVal, oldVal) {
        this.$emit('loading-change', newVal)
      },
      immediate: true,
    },
    forceLoading: {
      handler: function(newVal, oldVal) {
        this.loading = newVal
      },
      immediate: true,
    },
  },
  methods: {
    getDataModelMethods({ itemId, listViewRefKey = 'dataListTableView' }) {
      const { fetchItem, updateItem, deleteItem, deactivateItem } = this._getDataModelRef({
        itemId,
        listViewRefKey,
      })
      return { fetchItem, updateItem, deleteItem, deactivateItem }
    },
    _getDataModelRef({ itemId, listViewRefKey = 'dataListTableView' }) {
      if (!itemId) return Promise.reject(new Error(`No id provided to get dataModel ref`))

      return getNestedRef(this, [listViewRefKey, `dataModel-${itemId}`])
    },
    mergeConfig(config, defaultConfig) {
      return config ? { ...defaultConfig, ...config } : defaultConfig
    },
  },
}
