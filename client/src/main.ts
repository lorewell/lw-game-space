import { createApp } from 'vue'
import './style.css'
import 'virtual:uno.css'
import App from './App.vue'
import router from './router'
import { vScrollbar } from './directives/scrollbar'
import { createPinia } from 'pinia'

const pinia = createPinia()

const app = createApp(App)
app.use(router)
app.use(pinia)
app.directive('scrollbar', vScrollbar)
app.mount('#app')
