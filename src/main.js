import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// import IdleVue from 'idle-vue'
// import { useVuelidate } from '@vuelidate/core'
// import Vuelidate from 'vuelidate'
// import Vuelidate from 'vuelidate'
// import VuelidatePlugin from '@vuelidate/core'
import Primevue from 'primevue/config'
import ToastService from 'primevue/toastservice'

import 'primevue/resources/themes/saga-blue/theme.css' // theme
import 'primevue/resources/primevue.min.css' // core css
import 'primeicons/primeicons.css' // icons
import 'primeflex/primeflex.css' // CSS Utility Library

import Menubar from 'primevue/menubar'
import Menu from 'primevue/menu'
import Card from 'primevue/card'
import Button from 'primevue/button'

import Password from 'primevue/password'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import ColumnGroup from 'primevue/columngroup' // optional for column grouping
import Paginator from 'primevue/paginator'
import Toolbar from 'primevue/toolbar'
import Dialog from 'primevue/dialog'
import Textarea from 'primevue/textarea'
import Toast from 'primevue/toast'
import SelectButton from 'primevue/selectbutton'
import Divider from 'primevue/divider'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import ToggleButton from 'primevue/togglebutton'
import DataView from 'primevue/dataview'
import FileUpload from 'primevue/fileupload'
import InputNumber from 'primevue/inputnumber'
import InputText from 'primevue/inputtext'
import RadioButton from 'primevue/radiobutton'
import Checkbox from 'primevue/checkbox'
import Sidebar from 'primevue/sidebar'

// const eventsHub = createApp

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresLogin)) {
      if (!store.getters['authentication/loggedIn']) {
        console.log('sss')
        next({ name: 'login' })
      } else {
        next()
      }
    } else {
      next()
    }
  })

// const eventsHub = createApp()
// const options = {
//   eventEmitter: eventsHub,
//   idleTime: 2000,
//   startAtIdle: false,
//   store
// }
const app = createApp(App).use(store).use(router).use(Primevue).use(ToastService) // .use(IdleVue, options) // .use(Vuelidate) // .use(Vuelidate) // after 10sec idle .use(IdleVue, { idleTime: 5000, store })
// app.use(IdleVue, {
//   eventEmitter: eventsHub,
//   idleTime: 3000,
//   store,
//   startAtIdle: false
// })

app.component('Menubar', Menubar)
app.component('Menu', Menu)
app.component('Card', Card)
app.component('Button', Button)
app.component('Password', Password)
app.component('DataTable', DataTable)
app.component('Column', Column)
app.component('ColumnGroup', ColumnGroup)
app.component('Paginator', Paginator)
app.component('Toolbar', Toolbar)
app.component('Dialog', Dialog)
app.component('Textarea', Textarea)
app.component('Toast', Toast)
app.component('SelectButton', SelectButton)
app.component('Divider', Divider)
app.component('TabView', TabView)
app.component('TabPanel', TabPanel)
app.component('ToggleButton', ToggleButton)
app.component('DataView', DataView)
app.component('FileUpload', FileUpload)
app.component('InputNumber', InputNumber)
app.component('InputText', InputText)
app.component('RadioButton', RadioButton)
app.component('Checkbox', Checkbox)
app.component('Sidebar', Sidebar)

app.mount('#app')
