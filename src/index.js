import consts from './_constants'

import './helpers/modality'

import Input from './input'
import Button from './button'

const lib = {
	install(Vue) {
		Vue.component(`${consts.prefix}-input`, Input)
		Vue.component(`${consts.prefix}-button`, Button)
	}
}

module.exports = lib
