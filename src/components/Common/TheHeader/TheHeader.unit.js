import Vue from 'vue'
import vuetify from 'vuetify'
import TheHeader from './TheHeader.vue'

describe('@components/TheHeader/TheHeader.vue', () => {
  beforeEach(() => {
    Vue.use(vuetify)
  })

  it('exports a valid component', () => {
    expect(TheHeader).toBeAComponent()
  })
})
