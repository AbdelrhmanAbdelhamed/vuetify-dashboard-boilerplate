import Vue from 'vue'
import vuetify from 'vuetify'
import View404 from './_404.vue'

describe('@views/_404/_404', () => {
  beforeEach(() => {
    Vue.use(vuetify)
  })

  it('is a valid view', () => {
    expect(View404).toBeAViewComponent()
  })
})
