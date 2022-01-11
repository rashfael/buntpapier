import initDirectives from './directives'

import Button from './components/button.vue'

import './styles/colors.css'
import './styles/index.styl'

const lib = {
	install (Vue) {
		initDirectives(Vue)
		Vue.component(`bunt-button`, Button)
	}
}

export default lib
