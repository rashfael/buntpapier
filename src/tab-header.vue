<template lang="jade">
li.bunt-tab-header-item(role="tab", :class="['type-' + type, { 'active': active, 'disabled': disabled }]",
	:tabindex="active ? 0 : -1", :aria-controls="id", :aria-selected="active ? 'true' : null",
	:disabled="disabled", ref="item")
	.bunt-tab-header-item-icon(v-if="type === 'icon' || type === 'icon-and-text'")
		i.bunt-icon.material-icons(v-html="icon")
	.bunt-tab-header-item-text(v-text="text", v-if="type === 'text' || type === 'icon-and-text'")
	ripple-ink(v-if!="!noInk && !disabled")
</template>
<script>
import RippleInk from './mixins/ripple-ink'
import consts from './_constants'

export default {
	name: `${consts.prefix}-tab-header-item`,
	props: {
		id: String,
		type: {
			type: String,
			default: 'text', // 'text', 'icon', or 'icon-and-text'
		},
		text: String,
		icon: String,
		active: {
			type: Boolean,
			default: false
		},
		disabled: {
			type: Boolean,
			default: false
		}
	},
	mixins: [
		RippleInk
	]
}
</script>
