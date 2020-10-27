<script>
import { cloneDeep } from 'lodash'

import { mapGetters } from 'vuex'

export default {
  components: {
    TranslationLanguageProvider: () =>
      import('@components/Common/TranslationLanguageProvider/TranslationLanguageProvider.vue'),
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
    flat: {
      type: Boolean,
      required: false,
      default: false,
    },
    title: {
      type: String,
      required: false,
      default: '',
    },
    hideManage: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      translation: null,
      itemTranslation: null,
      supportedLanguages: null,
      activeLanguage: null,
      selectedLanguages: null,
    }
  },
  computed: {
    ...mapGetters('core', ['defaultLanguage']),
    activeLanguageProp() {
      return this.activeLanguage ?? this.defaultLanguage
    },
    listeners() {
      return {
        'supported-languages-change': this.handleSupportedLanguagesChange,
        'item-translation-change': this.handleItemTranslationChange,
      }
    },
    itemHasTranslation() {
      return this.item != null && this.item.translation != null
    },
  },
  watch: {
    'item.translation': {
      handler(newVal, oldVal) {
        this.itemTranslation = newVal
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    handleItemTranslationChange(itemTranslation) {
      this.itemTranslation = itemTranslation
    },
    handleTranslationChange(translation) {
      this.translation = cloneDeep(translation)
    },
    handleSelectedLanguagesChange(selectedLanguages) {
      this.supportedLanguages = selectedLanguages
    },
    handleSupportedLanguagesChange(supportedLanguages) {
      this.selectedLanguages = supportedLanguages
    },
    handleActiveLanguageChange(activeLanguage) {
      this.activeLanguage = activeLanguage
    },
  },
}
</script>

<template>
  <v-card :flat="flat">
    <v-toolbar v-if="title" dark color="primary">
      <v-toolbar-title
        ><span class="text-h5">{{ title }}</span></v-toolbar-title
      >

      <v-spacer />

      <TranslationLanguageProvider
        :hide-manage="hideManage"
        :translation="itemTranslation"
        :selected-languages="selectedLanguages"
        @translation-change="handleTranslationChange"
        @selected-languages-change="handleSelectedLanguagesChange"
        @active-language-change="handleActiveLanguageChange"
      />
    </v-toolbar>
    <div>
      <slot
        :item="item"
        :translation="translation"
        :active-language="activeLanguageProp"
        :supported-languages="supportedLanguages"
      />
    </div>
  </v-card>
</template>
