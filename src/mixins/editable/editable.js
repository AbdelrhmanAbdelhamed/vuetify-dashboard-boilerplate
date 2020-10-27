import { cloneDeep } from 'lodash'
import { isEmpty } from '@utils'

export default {
  props: {
    mode: {
      type: String,
      required: false,
      default: '',
      validator: (value) => ['create', 'add', 'update', 'edit', '', null].includes(value),
    },
    item: {
      type: [Object, String, Array],
      required: true,
    },
    resourcesHierarchy: {
      type: Object,
      required: false,
      default: null,
    },
    createOrUpdateAction: {
      type: Function,
      required: false,
      default: null,
    },
    fetchList: {
      type: Function,
      required: false,
      default: () => {},
    },
    goToPage: {
      type: Function,
      required: false,
      default: () => {},
    },
  },
  data() {
    return {
      editedItem: null,
      isItemNew: null,
    }
  },
  created() {
    this.isItemNew =
      !['update', 'edit'].includes(this.mode) &&
      Object.prototype.hasOwnProperty.call(this.editedItem, 'id')
        ? !this.editedItem.id
        : ['create', 'add'].includes(this.mode) || isEmpty(this.editedItem)
  },
  computed: {
    defaultTranslationCode() {
      return this.$store.state.core.defaultLanguageCode || 'en-us'
    },
    createOrUpdateActionText() {
      return this.isItemNew ? 'add' : 'update'
    },
  },
  watch: {
    item: {
      handler: function(newVal, oldVal) {
        this.editedItem = cloneDeep(newVal)

        this.$emit('item-change', this.editedItem)
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    saveAndClose(editedItem) {
      this.$emit('submit', cloneDeep(editedItem))
    },
    close() {
      this.$emit('close')
    },
  },
}
