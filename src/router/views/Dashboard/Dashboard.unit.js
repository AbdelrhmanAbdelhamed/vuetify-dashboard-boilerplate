import Vue from 'vue'
import vuetify from 'vuetify'
import Dashboard from './Dashboard.vue'

describe('@views/Dashboard/Dashboard', () => {
  beforeEach(() => {
    Vue.use(vuetify)
  })

  it('is a valid view', () => {
    expect(Dashboard).toBeAViewComponent()
  })

  it('renders an element', () => {
    const { element } = shallowMountView(Dashboard)
    expect(element.textContent).toContain('Dashboard Page')
  })
})
