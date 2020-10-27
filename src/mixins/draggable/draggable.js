import Sortable from 'sortablejs'

export default {
  props: {
    draggable: {
      type: Boolean,
      required: false,
      default: false,
    },
    draggingDefaultOptions: {
      type: Object,
      required: false,
      default: () => ({
        animation: 150,
        dataIdAttr: 'id',
      }),
    },
    refElementKey: {
      type: String,
      required: false,
      default: 'dataTable',
    },
    refElementSelector: {
      type: String,
      required: false,
      default: 'tbody',
    },
    draggableHandleSelector: {
      type: String,
      required: false,
      default: '.drag-handle',
    },
    rowKey: {
      type: String,
      required: false,
      default: 'id',
    },
    RowModel: {
      type: Function,
      required: false,
      default: null,
    },
    itemGetterSelector: {
      type: String,
      required: false,
      default: '#item-getter',
    },
    parseElementRows: {
      type: Function,
      required: false,
      default: function(element) {
        return [...element.rows].map((row, index) => {
          const dragHandleCellIndex = row.cells.length - 1
          const itemAttributeValue = row.cells[dragHandleCellIndex]
            .querySelector(this.itemGetterSelector)
            .getAttribute(`data-${this.rowKey}`)

          const fields = {
            ...this.items.find((item) => item[this.rowKey] === itemAttributeValue),
            index,
          }

          return this.RowModel ? new this.RowModel(fields) : fields
        })
      },
    },
  },
  computed: {
    element() {
      return this.$refs[this.refElementKey].$el.querySelector(this.refElementSelector)
    },
  },
  methods: {
    dragStart({ newIndex, oldIndex }) {
      const item = this.items[oldIndex]
      const { fetchItem, updateItem, deleteItem, deactivateItem } = this.$refs[
        `dataModel-${item.id}`
      ]

      this.$emit('drag-start', {
        newIndex,
        oldIndex,
        items: this.items,
        item,
        element: this.element,
        sortedItems: this.parseElementRows(this.element),
        fetchItem,
        updateItem,
        deleteItem,
        deactivateItem,
      })
    },
    dragEnd({ newIndex, oldIndex }) {
      const item = this.items[oldIndex]

      const { fetchItem, updateItem, deleteItem, deactivateItem } = this.getDataModelMethods({
        itemId: item.id,
      })

      if (oldIndex !== newIndex)
        this.$emit('drag-end', {
          newIndex,
          oldIndex,
          items: this.items,
          item,
          element: this.element,
          sortedItems: this.parseElementRows(this.element),
          fetchItem,
          updateItem,
          deleteItem,
          deactivateItem,
        })
    },
    activateDragging() {
      if (!this.element)
        throw new Error(
          'Cannot find a element to attach, please make sure to provide a valid ref key and a valid query selector'
        )

      Sortable.create(this.element, {
        ...this.draggingDefaultOptions,
        handle: this.draggableHandleSelector,
        onStart: (event) => this.dragStart(event),
        onEnd: (event) => this.dragEnd(event),
      })
    },
  },
  mounted() {
    if (this.draggable) {
      this.activateDragging()
    }
  },
}
