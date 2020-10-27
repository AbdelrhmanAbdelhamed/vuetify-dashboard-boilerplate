<script>
export default {
  inheritAttrs: false,
  data() {
    return {
      value: null,
    }
  },
  computed: {
    attrs() {
      return {
        class: 'mx-5',
        clearable: true,
        'persistent-hint': true,
        'append-icon': 'mdi-table-search',
        outlined: true,
        type: 'search',
        ...this.$attrs,
      }
    },
    listeners() {
      return {
        'click:append': (value) => {
          this.$emit('input', this.value)
          this.$emit('change', this.value)
        },
        'click:prepend': (value) => {
          this.$emit('input', this.value)
          this.$emit('change', this.value)
        },
        'click:clear': () => {
          this.$emit('input', null)
          this.$emit('change', null)
        },
        ...this.$listeners,
        input: (value) => {
          this.value = value
          this.$emit('input', value)
        },
      }
    },
  },
}
</script>

<template>
  <v-text-field v-bind="attrs" v-on="listeners">
    <template v-for="(_, slotName) of $scopedSlots" v-slot:[slotName]="scope">
      <slot :name="slotName" v-bind="scope" />
    </template>
  </v-text-field>
</template>
