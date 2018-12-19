import consts from './_constants'

import './helpers/modality'

import initDirectives from './directives'

import Button from './button'
import Checkbox from './checkbox'
import Icon from './icon'
import IconButton from './icon-button'
import Input from './input'
import InputOutlineContainer from './input-outline-container'
import LinkButton from './link-button'
import ProgressCircular from './progress-circular'
import Select from './select'
import Switch from './switch'
import Tabs from './tabs'
import Tab from './tab'
import Dialog from './dialog'

if (!process.server) {
	const Popover = require('./popover')
}

const lib = {
	install (Vue) {
		initDirectives(Vue)
		Vue.component(`${consts.prefix}-button`, Button)
		Vue.component(`${consts.prefix}-checkbox`, Checkbox)
		Vue.component(`${consts.prefix}-icon`, Icon)
		Vue.component(`${consts.prefix}-icon-button`, IconButton)
		Vue.component(`${consts.prefix}-input`, Input)
		Vue.component(`${consts.prefix}-input-outline-container`, InputOutlineContainer)
		Vue.component(`${consts.prefix}-link-button`, LinkButton)
		Vue.component(`${consts.prefix}-select`, Select)
		if (!process.server) Vue.component(`${consts.prefix}-popover`, Popover)
		Vue.component(`${consts.prefix}-progress-circular`, ProgressCircular)
		Vue.component(`${consts.prefix}-switch`, Switch)
		Vue.component(`${consts.prefix}-tabs`, Tabs)
		Vue.component(`${consts.prefix}-tab`, Tab)
		Vue.component(`${consts.prefix}-dialog`, Dialog)
	}
}

export default lib
