<template lang="pug">
button.bunt-button(:type="type", ref="button", :class="{disabled: disabled || loading || showSuccess, error: errorMessage || error, success: showSuccess}", @click="onClick", v-tooltip="{text: _tooltip, show: !!this.errorMessage, placement: tooltipPlacement, fixed: tooltipFixed}", :aria-disabled="disabled")
	.bunt-button-content(:class="{invisible: loading || errorMessage || error || showSuccess }")
		i.bunt-icon.mdi(v-if="icon", :class="[iconClass]")
		.bunt-button-text
			slot
				span(v-text="text")
	progress-circular(v-show="loading", size="small")
	i.bunt-icon.mdi.mdi-replay.error(v-if="errorMessage || error")
	i.bunt-icon.mdi.mdi-check.success(v-if="showSuccess")
	ripple-ink(v-if!="!noInk && !disabled")
</template>
<script>
import RippleInk from './mixins/ripple-ink'
import ProgressCircular from './progress-circular'
import iconHelper from './helpers/icon'

export default {
	name: `bunt-button`,
	components: { ProgressCircular },
	mixins: [
		// HasDropdown,
		RippleInk
	],
	props: {
		text: String,
		icon: String,
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
		},
		tooltip: String,
		tooltipPlacement: {
			type: String,
			default: 'bottom'
		},
		tooltipFixed: {
			type: Boolean,
			default: false
		}
	},
	data () {
		return {
			_loading: false,
			showSuccess: false
		}
	},
	computed: {
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

	methods: {
		loadingChanged (value) {
			if (value) {
				this._loading = value
				this.userShowTooltip = false // button gets disabled and mouseleave is not registered
				this.showSuccess = false
				if (this.$successTimeout)
					clearTimeout(this.$successTimeout)
			} else {
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
		},
		onClick (event) {
			if (this.disabled || this.loading || this.showSuccess) return
			this.$emit('click', event)
		}
	}
}
</script>
