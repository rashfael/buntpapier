import initDirectives from './directives'

import Button from './components/button.vue'
import ProgressCircular from './components/progress-circular.vue'

import './styles/colors.css'
import './styles/index.styl'

const lib = {
	install (Vue) {
		initDirectives(Vue)
		Vue.component(`bunt-button`, Button)
		Vue.component(`bunt-progress-circular`, ProgressCircular)
	}
}

export default lib
