import { createApp } from 'vue'
// import Router from 'vue-router'
import Buntpapier from '../src/'
import { VuelidatePlugin } from '../src/validators/vuelidate'
import App from './App'

const app = createApp(App)
app.use(Buntpapier)
app.use(VuelidatePlugin)
// Vue.use(Router)
// App.router = new Router({
// 	mode: 'history',
// 	routes: []
// })
app.mount('#app')
