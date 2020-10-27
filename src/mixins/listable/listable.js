import vuetify from '@plugins/vuetify'

export default {
  props: {
    stateName: {
      type: String,
      required: false,
    },
    module: {
      type: String,
      required: false,
      default: '',
    },
    model: {
      type: String,
      required: false,
      default: '',
    },
    headers: {
      type: Array,
      required: true,
    },
    items: {
      type: Array,
      required: true,
    },
    total: {
      type: Number,
      required: false,
      default: -1,
    },
    forceLoading: {
      type: Boolean,
      required: false,
      default: false,
    },
    loading: {
      type: Boolean,
      required: false,
      default: false,
    },
    fetchList: {
      type: Function,
      required: false,
      default: () => {},
    },
    createItem: {
      type: Function,
      required: false,
      default: () => {},
    },
    goToPage: {
      type: Function,
      required: false,
      default: () => {},
    },
    actions: {
      type: Array,
      required: false,
      default: () => [],
    },
    hideActionsHeader: {
      type: Boolean,
      required: false,
      default: undefined,
    },
    hideCreate: {
      type: Boolean,
      required: false,
      default: undefined,
    },
    hideRefresh: {
      type: Boolean,
      required: false,
      default: undefined,
    },
    hideUpdate: {
      type: Boolean,
      required: false,
      default: undefined,
    },
    hideDelete: {
      type: Boolean,
      required: false,
      default: undefined,
    },
    disableCreate: {
      type: Boolean,
      required: false,
      default: false,
    },
    disableRefresh: {
      type: Boolean,
      required: false,
      default: false,
    },
    createBtnAttrs: {
      type: Object,
      required: false,
      default: () => ({
        depressed: true,
        color: 'primary',
      }),
    },
    refreshBtnAttrs: {
      type: Object,
      required: false,
      default: () => ({
        depressed: true,
        color: 'secondary',
      }),
    },
    updateBtnAttrs: {
      type: Object,
      required: false,
      default: () => ({
        color: 'primary',
      }),
    },
    deleteBtnAttrs: {
      type: Object,
      required: false,
      default: () => ({
        color: 'error',
      }),
    },
    draggingBtnAttrs: {
      type: Object,
      required: false,
      default: () => ({
        style: { cursor: 'move' },
      }),
    },
    draggingTooltipActivatorClass: {
      type: Object,
      required: false,
      default: () => ({
        [`float-${vuetify.framework.rtl ? 'left' : 'right'}`]: true,
        'drag-handle': true,
      }),
    },
    afterCreate: {
      type: Function,
      required: false,
      default: null,
    },
    afterUpdate: {
      type: Function,
      required: false,
      default: null,
    },
    afterDelete: {
      type: Function,
      required: false,
      default: null,
    },
    afterDeactivate: {
      type: Function,
      required: false,
      default: null,
    },
  },
  computed: {
    createdListener() {
      return this.afterCreate || this.fetchList
    },
    updatedListener() {
      return this.afterUpdate || this.fetchList
    },
    deletedListener() {
      return this.afterDelete || this.fetchList
    },
    deactivatedListener() {
      return this.afterDeactivate || this.fetchList
    },
    listLoading() {
      return this.forceLoading || this.loading
    },
  },
  methods: {
    getDataModelMethods({ itemId }) {
      const { fetchItem, updateItem, deleteItem, deactivateItem } = this._getDataModelRef({
        itemId,
      })
      return { fetchItem, updateItem, deleteItem, deactivateItem }
    },
    _getDataModelRef({ itemId }) {
      if (!itemId) return Promise.reject(new Error(`No id provided to get dataModel ref`))

      return this.$refs[`dataModel-${itemId}`]
    },
  },
}
