import consts from './_constants'

import './helpers/modality'

import Button from './button'
import Icon from './icon'
import IconButton from './icon-button'
import Input from './input'
import ProgressCircular from './progress-circular'
import Popover from './popover'
import Select from './select'
import Tabs from './tabs'
import Tab from './tab'

const lib = {
	install(Vue) {
		Vue.component(`${consts.prefix}-button`, Button)
		Vue.component(`${consts.prefix}-icon`, Icon)
		Vue.component(`${consts.prefix}-icon-button`, IconButton)
		Vue.component(`${consts.prefix}-input`, Input)
		Vue.component(`${consts.prefix}-select`, Select)
		Vue.component(`${consts.prefix}-popover`, Popover)
		Vue.component(`${consts.prefix}-progress-circular`, ProgressCircular)
		Vue.component(`${consts.prefix}-tabs`, Tabs)
		Vue.component(`${consts.prefix}-tab`, Tab)
	}
}

module.exports = lib
