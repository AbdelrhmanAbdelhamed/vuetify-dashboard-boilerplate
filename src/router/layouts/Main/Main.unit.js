import Vue from 'vue'
import vuetify from 'vuetify'
import MainLayout from './Main.vue'

describe('@layouts/Main/Main.vue', () => {
  beforeEach(() => {
    Vue.use(vuetify)
  })

  it('renders its content', () => {
    const slotContent = '<p>Hello!</p>'
    const { element } = shallowMount(MainLayout, {
      ...createComponentMocks({
        store: {
          auth: {
            getters: {
              loggedIn: () => true,
            },
          },
        },
      }),
      slots: {
        default: slotContent,
      },
    })
    expect(element.innerHTML).toContain(slotContent)
  })
})
