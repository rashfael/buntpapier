import { createApp } from 'vue'
import Buntpapier from '../src/'
import App from './App.vue'

const app = createApp(App)
app.use(Buntpapier)
app.mount('#app')
