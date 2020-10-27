import vuetifyDialog from 'vuetify-dialog'
import 'vuetify-dialog/dist/vuetify-dialog.css'

import DynamicDialogLayout from '@layouts/DynamicDialog/DynamicDialog.vue'
import DynamicDialogOverlay from '@layouts/DynamicDialogOverlay/DynamicDialogOverlay.vue'

let _dialogs = []

export default function initVuetifyDialog({ Vue, store, i18n, vuetify }) {
  if (!Vue.prototype.$dialog) {
    Vue.use(vuetifyDialog, {
      property: '$dialog',
      context: {
        vuetify,
        store,
        i18n,
      },
      toast: {
        position: 'bottom',
      },
      notification: {
        position: 'top-right',
      },
      confirm: {
        actions: {
          false: 'No',
          true: {
            text: 'Yes',
            color: 'primary',
          },
        },
        color: 'primary',
        icon: 'mdi-help-circle',
        persistent: true,
        width: 500,
      },
      warning: {
        actions: {
          false: 'No',
          true: {
            text: 'Yes',
            color: 'primary',
          },
        },
        color: 'primary',
        icon: 'mdi-alert',
        persistent: true,
        width: 500,
      },
      info: {
        color: 'primary',
      },
    })

    Vue.prototype.$dialog.on('shown', ({ dialog }) => _dialogs.push(dialog))

    Vue.prototype.$dialog.on(
      'destroyed',
      ({ dialog }) => (_dialogs = _dialogs.filter((_dialog) => _dialog.id !== dialog.id))
    )

    Vue.prototype.$dialog.clearDialogs = () => {
      _dialogs.forEach((_dialog) => _dialog.remove())
      _dialogs = []
    }

    Vue.prototype.$dialog.layout('dynamic-dialog', DynamicDialogLayout)
    Vue.prototype.$dialog.overlay('default', DynamicDialogOverlay)
  }
}
