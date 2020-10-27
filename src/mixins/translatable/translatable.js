export default {
  props: {
    translation: {
      type: Object,
      required: false,
      default: null,
    },
    activeLanguage: {
      type: Object,
      required: true,
      default: null,
    },
  },
  computed: {
    defaultTranslationCode() {
      return this.$store.state.core.defaultLanguageCode || 'en-us'
    },
  },
  watch: {
    translation: {
      handler(newVal, oldVal) {
        if (newVal) {
          this.editedItem.translation = newVal
        }
      },
    },
    'editedItem.translation': {
      handler: function(newVal, oldVal) {
        this.$emit('item-translation-change', newVal)
      },
      deep: true,
    },
  },
}
