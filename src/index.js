import initDirectives from './directives'

import Button from './button.vue'
import Checkbox from './checkbox.vue'
import Radio from './radio.vue'
import Icon from './icon.vue'
import IconButton from './icon-button.vue'
import Input from './input.vue'
import InputOutlineContainer from './input-outline-container.vue'
import LinkButton from './link-button.vue'
import ProgressCircular from './progress-circular.vue'
import Select from './select.vue'
import Switch from './switch.vue'
import Tabs from './tabs'
import Tab from './tab.vue'
import Dialog from './dialog.vue'

import { Scrollbars } from './directives/scrollbar'

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
		Vue.component(`bunt-progress-circular`, ProgressCircular)
		Vue.component(`bunt-switch`, Switch)
		Vue.component(`bunt-tabs`, Tabs)
		Vue.component(`bunt-tab`, Tab)
		Vue.component(`bunt-dialog`, Dialog)
	}
}

export default lib
export { Scrollbars }
