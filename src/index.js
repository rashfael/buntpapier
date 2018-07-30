import consts from './_constants'

import './helpers/modality'

import Button from './button'
import Checkbox from './checkbox'
import Icon from './icon'
import IconButton from './icon-button'
import Input from './input'
import LinkButton from './link-button'
import ProgressCircular from './progress-circular'
import Popover from './popover'
import Select from './select'
import Switch from './switch'
import Tabs from './tabs'
import Tab from './tab'
import Dialog from './dialog'

const lib = {
	install (Vue) {
		Vue.component(`${consts.prefix}-button`, Button)
		Vue.component(`${consts.prefix}-checkbox`, Checkbox)
		Vue.component(`${consts.prefix}-icon`, Icon)
		Vue.component(`${consts.prefix}-icon-button`, IconButton)
		Vue.component(`${consts.prefix}-input`, Input)
		Vue.component(`${consts.prefix}-link-button`, LinkButton)
		Vue.component(`${consts.prefix}-select`, Select)
		Vue.component(`${consts.prefix}-popover`, Popover)
		Vue.component(`${consts.prefix}-progress-circular`, ProgressCircular)
		Vue.component(`${consts.prefix}-switch`, Switch)
		Vue.component(`${consts.prefix}-tabs`, Tabs)
		Vue.component(`${consts.prefix}-tab`, Tab)
		Vue.component(`${consts.prefix}-dialog`, Dialog)
	}
}

export default lib
