import initDirectives from './directives'

import Button from './button'
import Checkbox from './checkbox'
import Radio from './radio'
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

let Popover
if (typeof window !== 'undefined') {
	Popover = require('./popover').default
}

const lib = {
	install (Vue) {
		initDirectives(Vue)
		Vue.component(`bunt-button`, Button)
		Vue.component(`bunt-checkbox`, Checkbox)
		Vue.component(`bunt-radio`, Radio)
		Vue.component(`bunt-icon`, Icon)
		Vue.component(`bunt-icon-button`, IconButton)
		Vue.component(`bunt-input`, Input)
		Vue.component(`bunt-input-outline-container`, InputOutlineContainer)
		Vue.component(`bunt-link-button`, LinkButton)
		Vue.component(`bunt-select`, Select)
		if (typeof window !== 'undefined') Vue.component(`bunt-popover`, Popover)
		Vue.component(`bunt-progress-circular`, ProgressCircular)
		Vue.component(`bunt-switch`, Switch)
		Vue.component(`bunt-tabs`, Tabs)
		Vue.component(`bunt-tab`, Tab)
		Vue.component(`bunt-dialog`, Dialog)
	}
}

export default lib
