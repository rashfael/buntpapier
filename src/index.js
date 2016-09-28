import consts from './_constants'

import './helpers/modality'

import Button from './button'
import Input from './input'
import Select from './select'

const lib = {
	install(Vue) {
		Vue.component(`${consts.prefix}-button`, Button)
		Vue.component(`${consts.prefix}-input`, Input)
		Vue.component(`${consts.prefix}-select`, Select)
	}
}

module.exports = lib
