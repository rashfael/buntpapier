<template lang="pug">
li.bunt-tab-header-item(role="tab", :class="['type-' + type, { 'active': active, 'disabled': disabled }]",
	:tabindex="active ? 0 : -1", :aria-controls="id", :aria-selected="active ? 'true' : null",
	:disabled="disabled", ref="item")
	slot
		.bunt-tab-header-item-icon(v-if="type === 'icon' || type === 'icon-and-text'")
			i.bunt-icon.mdi(:class="[iconClass]")
		.bunt-tab-header-item-text(v-text="text", v-if="type === 'text' || type === 'icon-and-text'")
	ripple-ink(v-if="!disabled")
</template>
<script>
import RippleInk from './mixins/ripple-ink'
import iconHelper from './helpers/icon'

export default {
	name: `bunt-tab-header-item`,
	mixins: [
		RippleInk
	],
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
	computed: {
		iconClass () {
			return iconHelper.getClass(this.icon)
		}
	}
}
</script>
