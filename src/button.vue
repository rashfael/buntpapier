<template lang="jade">
button.bunt-button(:type="type", :disabled="disabled || loading || showSuccess", ref="button", :class="{error: errorMessage || error, success: showSuccess}", @mouseenter="userShowTooltip = true", @mouseleave="userShowTooltip = false", @click="$emit('click', $event)")
	.bunt-button-content(:class="{invisible: loading || errorMessage || error || showSuccess }")
		i.bunt-icon.mdi(v-if="icon", :class="[iconClass]")
		.bunt-button-text
			slot
				span(v-text="text")
	progress-circular(v-show="loading", size="small")
	i.bunt-icon.mdi.mdi-replay.error(v-if="errorMessage || error")
	i.bunt-icon.mdi.mdi-check.success(v-if="showSuccess")
	ripple-ink(v-if!="!noInk && !disabled")
	tooltip(:show="showTooltip") {{ _tooltip }}
</template>
<script>
import RippleInk from './mixins/ripple-ink'
import consts from './_constants'
import ProgressCircular from './progress-circular'
import Tooltip from './tooltip'
import iconHelper from './helpers/icon'

export default {
	name: `${consts.prefix}-button`,
	components: { ProgressCircular, Tooltip },
	props: {
		text: String,
		icon: String,
		tooltip: String,
		iconRight: {
			type: Boolean,
			default: false
		},
		loading: {
			type: Boolean,
			default: false
		},
		showDropdownIcon: {
			type: Boolean,
			default: true
		},
		disabled: {
			type: Boolean,
			default: false
		},
		type: {
			type: String,
			default: 'button'
		},
		error: Boolean,
		errorMessage: String,
		successAfterLoading: {
			type: Boolean,
			default: true
		}
	},
	data () {
		return {
			userShowTooltip: false,
			_loading: false,
			showSuccess: false
		}
	},
	computed: {
		showTooltip () {
			return (this.tooltip && this.userShowTooltip) || !!this.errorMessage
		},
		_tooltip () {
			return this.errorMessage ? this.errorMessage : this.tooltip
		},
		iconClass () {
			return iconHelper.getClass(this.icon)
		}
	},
	watch: {
		loading: 'loadingChanged',
		errorMessage: 'errorChanged',
		error: 'errorChanged'
	},
	mixins: [
		// HasDropdown,
		RippleInk
	],

	methods: {
		loadingChanged (value) {
			if (value) {
				this._loading = value
				this.userShowTooltip = false // button gets disabled and mouseleave is not registered
				this.showSuccess = false
				if (this.$successTimeout)
					clearTimeout(this.$successTimeout)
			}
			else {
				this._loading = value
				if (this.errorMessage || this.error) return
				this.showSuccess = true
				this.$successTimeout = setTimeout(() => {
					this.showSuccess = false
				}, 3000)
			}
		},
		errorChanged (value) {
			if (value !== null)
				this.showSuccess = false
		}
	}
}
</script>
