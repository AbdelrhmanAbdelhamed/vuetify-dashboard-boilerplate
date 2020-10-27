import { cloneDeep } from 'lodash'

export default {
  methods: {
    submitAndClose(data) {
      this.$emit('submit', cloneDeep(data))
    },
    close() {
      this.$emit('close')
    },
  },
}
