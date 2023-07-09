import initDirectives from './directives'

import Button from './components/button'
import Checkbox from './components/checkbox.vue'
import Input from './components/input.vue'
import ProgressCircular from './components/progress-circular.vue'

import './styles/colors.css'
import './styles/index.styl'

const lib = {
	install (app) {
		initDirectives(app)
		app.component('bunt-button', Button)
		app.component('bunt-checkbox', Checkbox)
		app.component('bunt-input', Input)
		app.component('bunt-progress-circular', ProgressCircular)
	}
}

export default lib
