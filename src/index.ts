import initDirectives from './directives'

import Button from './components/button'
import Checkbox from './components/checkbox.vue'
import Input from './components/input.vue'
import ProgressCircular from './components/progress-circular.vue'
import Scrollbars from './components/scrollbars.vue'

import './styles/colors.sass'
import './styles/index.sass'

const lib = {
	install (app) {
		initDirectives(app)
		app.component('BuntButton', Button)
		app.component('BuntCheckbox', Checkbox)
		app.component('BuntInput', Input)
		app.component('BuntProgressCircular', ProgressCircular)
		app.component('BuntScrollbars', Scrollbars)
	}
}

export default lib
