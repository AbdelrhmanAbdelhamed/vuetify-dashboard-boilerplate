<script>
import { cloneDeep } from 'lodash'

import { mapGetters } from 'vuex'

export default {
  components: {
    TranslationLanguageProvider: () =>
      import('@components/Common/TranslationLanguageProvider/TranslationLanguageProvider.vue'),
  },
  data() {
    return {
      loading: false,
      translation: null,
      itemTranslation: null,
      supportedLanguages: null,
      activeLanguage: null,
      selectedLanguages: null,
    }
  },
  computed: {
    ...mapGetters('core', ['defaultLanguage']),
    title() {
      return this.$options.propsData.title
    },
    eager() {
      return this.$options.propsData.eager ?? true
    },
    fullscreen() {
      return this.$options.propsData.fullscreen
    },
    scrollable() {
      return this.$options.propsData.scrollable
    },
    height() {
      return this.$options.propsData.height
    },
    flat() {
      return this.$options.propsData.flat
    },
    innerScroll() {
      return this.$options.propsData.innerScroll
    },
    titleClass() {
      return this.$options.propsData.titleClass
    },
    retainFocus() {
      return this.$options.propsData.retainFocus ?? false
    },
    hideOverlay() {
      return this.$options.propsData.hideOverlay
    },
    hideClose() {
      return this.$options.propsData.hideClose ?? false
    },
    closeIcon() {
      return this.$options.propsData.closeIcon || 'mdi-close'
    },
    transition() {
      return this.$options.propsData.transition || 'dialog-transition'
    },
    props() {
      return this.$options.propsData.props || {}
    },
    activeLanguageProp() {
      return this.activeLanguage ?? this.defaultLanguage
    },
    listeners() {
      return {
        'supported-languages-change': this.handleSupportedLanguagesChange,
        'item-translation-change': this.handleItemTranslationChange,
        close: this.close,
        'loading-change': (loading) => (this.loading = loading),
        ...(this.$options.propsData.listeners || {}),
      }
    },
    itemHasTranslation() {
      return this.props.item != null && this.props.item.translation != null
    },
    hideTranslationLanguageProvider() {
      return this.$options.propsData.hideTranslationLanguageProvider ?? !this.itemHasTranslation
    },
  },
  watch: {
    'props.item.translation': {
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
    _destroy() {
      // Allow to draw transition, cause vuetify doesn't have onClose method
      setTimeout(() => {
        this.$destroy()
      }, 200)
    },
  },
}
</script>

<template>
  <v-dialog
    v-model="isActive"
    :eager="eager"
    :fullscreen="fullscreen || $vuetify.breakpoint.xsOnly"
    :persistent="persistent || !!loading"
    :scrollable="scrollable"
    :transition="transition"
    :hide-overlay="hideOverlay"
    :max-width="getWidth"
    :retain-focus="retainFocus"
  >
    <v-card
      :loading="loading"
      :height="height"
      :flat="flat"
      :class="{ 'v-inner-scroll': innerScroll }"
    >
      <v-toolbar dark color="primary">
        <v-toolbar-title
          ><span class="text-h3" :class="titleClass">{{ title || '' }}</span></v-toolbar-title
        >

        <v-spacer />

        <TranslationLanguageProvider
          v-if="!hideTranslationLanguageProvider"
          :translation="itemTranslation"
          :selected-languages="selectedLanguages"
          @translation-change="handleTranslationChange"
          @selected-languages-change="handleSelectedLanguagesChange"
          @active-language-change="handleActiveLanguageChange"
        />

        <v-toolbar-items class="ml-5">
          <v-btn v-if="!hideClose && !loading" icon dark @click="listeners.close">
            <v-icon>{{ closeIcon }}</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <div>
        <dialog-child
          ref="dialog"
          :translation="translation"
          :active-language="activeLanguageProp"
          :supported-languages="supportedLanguages"
          v-bind="props"
          v-on="listeners"
        />
      </div>
    </v-card>
  </v-dialog>
</template>
