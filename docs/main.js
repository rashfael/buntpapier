import Vue from 'vue'
import Router from 'vue-router'
import Buntpapier from '../src/'
import Vuelidate from 'vuelidate'
import App from './App'

Vue.use(Buntpapier)
Vue.use(Vuelidate)
Vue.use(Router)
App.router = new Router({
	mode: 'history',
	routes: []
})
new Vue(App).$mount('#app')
