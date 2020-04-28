import { createApp } from 'vue'
// import Router from 'vue-router'
import Buntpapier from '../src/'
// import Vuelidate from '@vuelidate/core'
import App from './App'

const app = createApp(App)
app.use(Buntpapier)
// app.use(Vuelidate)
// Vue.use(Router)
// App.router = new Router({
// 	mode: 'history',
// 	routes: []
// })
app.mount('#app')
