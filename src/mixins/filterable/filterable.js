import { isEqual } from 'lodash'

export default {
  props: {
    filterAttrs: {
      type: Object,
      required: false,
      default: () => ({}),
    },
  },
  data() {
    return {
      filters: this.getInitialFilters(),
    }
  },
  methods: {
    getInitialFilters() {
      return {
        query: null,
      }
    },
    handleSelectedFiltersChange(selectedFilters) {
      this.filters = selectedFilters
    },
    handleClearFilters() {
      const initialFilters = this.getInitialFilters()
      if (!isEqual(initialFilters, this.filters)) {
        this.filters = initialFilters
      }
    },
  },
}
