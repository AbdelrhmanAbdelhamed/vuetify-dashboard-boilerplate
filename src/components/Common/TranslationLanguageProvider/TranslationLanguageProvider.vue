<script>
import { difference, omit, cloneDeep } from 'lodash'

import { mapGetters } from 'vuex'

import { getObjectFields } from '@utils'

import TranslationLanguageProviderDialog from './TranslationLanguageProviderDialog/TranslationLanguageProviderDialog.vue'

export default {
  name: 'TranslationLanguageProvider',
  components: {},
  props: {
    backgroundColor: {
      type: String,
      required: false,
      default: 'secondary',
    },
    translation: {
      type: Object,
      required: true,
    },
    selectedLanguages: {
      type: Array,
      required: false,
      default: null,
    },
    hideManage: {
      type: Boolean,
      required: false,
      default: false,
    },
    showLangSelector: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      editedTranslation: null,
      editedSelectedLanguages: [],
      activeLanguage: '',
      languageMenu: false,
    }
  },
  computed: {
    ...mapGetters('core', { languages: 'normalizedLanguages' }),

    defaultTranslationCode() {
      return this.$store.state.core.defaultLanguageCode || 'en-us'
    },

    availableLanguages() {
      const languages = this.$store.state.core.constants?.LANGUAGES.LANGUAGES || {}

      const itemTranslationCodes = Object.keys(this.editedTranslation || {})

      const availableLanguageCodes = !itemTranslationCodes.includes(this.defaultTranslationCode)
        ? [this.defaultTranslationCode, ...itemTranslationCodes]
        : [...itemTranslationCodes]

      return availableLanguageCodes.map((languageCode) => {
        const disabled = languageCode === this.defaultTranslationCode
        return {
          code: languageCode,
          name: languages[languageCode],
          disabled,
        }
      })
    },
  },
  watch: {
    translation: {
      handler(newVal, oldVal) {
        if (newVal) {
          this.editedTranslation = cloneDeep(newVal)
        }
      },
      immediate: true,
      deep: true,
    },
    activeLanguage: {
      handler(newVal, oldVal) {
        if (newVal) {
          this.$emit('active-language-change', newVal)
        }
      },
      immediate: true,
      deep: true,
    },
    selectedLanguages: {
      handler(newVal, oldVal) {
        if (newVal) {
          this.handleSelectedLanguagesChange(newVal)
        }
      },
      deep: true,
    },
  },
  created() {
    this.editedSelectedLanguages = [...this.availableLanguages]
    this.activeLanguage = this.editedSelectedLanguages[0]

    if (!this.editedTranslation[this.defaultTranslationCode]) {
      this.editedTranslation[this.defaultTranslationCode] = {
        _lang: this.defaultTranslationCode,
        name: '',
        description: '',
      }
      this.$emit('translation-change', this.editedTranslation)
    }
  },
  methods: {
    handleActiveLanguageChange(activeLanguage) {
      this.activeLanguage = activeLanguage
    },
    async handleAddOrRemoveLanguage() {
      const selectedLanguages = await this.$dialog.showAndWait(
        { ...TranslationLanguageProviderDialog, layout: 'dynamic-dialog' },
        {
          title: this.$t('select_item', { item: this.$t('supported_languages') }),
          width: '600px',
          persistent: true,
          props: {
            items: this.languages,
            availableLanguages: this.editedSelectedLanguages,
          },
        }
      )
      this.handleSelectedLanguagesChange(selectedLanguages)
    },
    handleSelectedLanguagesChange(selectedLanguages) {
      if (selectedLanguages) {
        const selectedLanguageCodes = selectedLanguages.map((language) => language.code)

        const translationLanguageCodes = Object.keys(this.editedTranslation)

        const translationsToRemove = difference(translationLanguageCodes, selectedLanguageCodes)

        const translationsToAdd = difference(selectedLanguageCodes, translationLanguageCodes)

        // Remove Unselected Translation
        this.editedTranslation = omit(this.editedTranslation, translationsToRemove)

        // Add Selected Translation
        const defaultTranslationFields = getObjectFields(
          this.editedTranslation[this.defaultTranslationCode]
        )
        translationsToAdd.forEach((translationCode) => {
          this.editedTranslation[translationCode] = {
            ...defaultTranslationFields,
            _lang: translationCode,
          }
        })

        this.$emit('translation-change', this.editedTranslation)

        this.editedSelectedLanguages = cloneDeep(selectedLanguages)

        const lastAddedLanguage = this.editedSelectedLanguages.find(
          (selectedLanguage) =>
            selectedLanguage.code ===
            this.editedSelectedLanguages[this.editedSelectedLanguages.length - 1].code
        )

        this.activeLanguage = lastAddedLanguage

        this.$emit('selected-languages-change', selectedLanguages)
      }
    },
  },
}
</script>

<template>
  <v-menu v-model="languageMenu" offset-y>
    <template v-slot:activator="{ on, attrs }">
      <v-btn class="text-capitalize" text v-bind="attrs" v-on="on">
        <v-icon left>mdi-translate</v-icon>
        {{ activeLanguage.name }}
        <v-icon small right>mdi-menu-down</v-icon>
      </v-btn>
    </template>

    <v-list dense>
      <v-list-item
        v-for="(language, index) in editedSelectedLanguages"
        :key="index"
        @click="handleActiveLanguageChange(language)"
      >
        <v-list-item-title>{{ language.name }}</v-list-item-title>
      </v-list-item>

      <v-divider v-if="!hideManage"></v-divider>

      <v-list-item v-if="!hideManage" @click="handleAddOrRemoveLanguage">
        <v-list-item-title>
          {{ $t('item_manage', { item: $tc('language', 2) }) }}
          <v-icon small>mdi-plus-circle</v-icon>
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>
