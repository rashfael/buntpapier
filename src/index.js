import consts from './_constants'

import './helpers/modality'

import Button from './button'
import Input from './input'
import ProgressCircular from './progress-circular'
import Select from './select'

const lib = {
	install(Vue) {
		Vue.component(`${consts.prefix}-button`, Button)
		Vue.component(`${consts.prefix}-input`, Input)
		Vue.component(`${consts.prefix}-select`, Select)
		Vue.component(`${consts.prefix}-progress-circular`, ProgressCircular)
	}
}

module.exports = lib
