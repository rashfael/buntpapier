import { createApp } from 'vue'
import '@fontsource/roboto'
import '@mdi/font/css/materialdesignicons.css'
import Buntpapier from '../../src'
import DatePickers from './DatePickers.vue'

createApp(DatePickers).use(Buntpapier).mount('#app')
