import Vue from 'vue'
import vuetify from 'vuetify'
import Loading from './_Loading.vue'

describe('@views/Loading/_Loading', () => {
  beforeEach(() => {
    Vue.use(vuetify)
  })

  it('is a valid view', () => {
    expect(Loading).toBeAViewComponent()
  })
})
