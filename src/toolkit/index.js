import consts from './_constants'

import Input from './input'

const lib = {
	install(Vue) {
		Vue.component(`${consts.prefix}-input`, Input)
	}
}

module.exports = lib
