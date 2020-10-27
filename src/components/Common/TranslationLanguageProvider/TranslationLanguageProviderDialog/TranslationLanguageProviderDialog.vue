<script>
import dialogable from '@mixins/dialogable/dialogable'

export default {
  name: 'TranslationLanguageProviderDialog',
  mixins: [dialogable],
  inheritAttrs: false,
  props: {
    items: {
      type: Array,
      required: true,
    },
    availableLanguages: {
      type: Array,
      required: false,
      default: function() {
        return [
          {
            ...this.$store.getters['core/defaultLanguage'],
            disabled: true,
          },
        ]
      },
    },
  },
  data() {
    return {
      selectedLanguages: [...this.availableLanguages],
    }
  },
  computed: {
    attrs() {
      return {
        items: this.items,
        value: this.selectedLanguages,
        outlined: true,
        label: this.$t('supported_languages'),
        'persistent-hint': true,
        'item-text': 'name',
        'item-value': 'code',
        chips: true,
        multiple: true,
        'deletable-chips': true,
        'small-chips': true,
        'return-object': true,
        ...this.$attrs,
      }
    },
    listeners() {
      return {
        ...this.$listeners,
        input: (value) => {
          this.selectedLanguages = value
          this.$emit('input', value)
        },
      }
    },
  },
  methods: {
    async handleSave() {
      return this.submitAndClose(this.selectedLanguages)
    },
    handleCancel() {
      this.close()
    },
  },
}
</script>

<template>
  <div>
    <v-card-text>
      <v-autocomplete :value="selectedLanguages" v-bind="attrs" v-on="listeners"></v-autocomplete>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn color="secondary" text @click="handleCancel">{{ $t('cancel') }}</v-btn>
      <v-btn color="primary" text @click="handleSave">{{ $t('save') }}</v-btn>
    </v-card-actions>
  </div>
</template>
