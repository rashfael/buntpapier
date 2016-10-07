<template lang="jade">
.bunt-tab(:id="id", role="tabpanel", :tabindex="active ? '0' : null", :aria-hidden="!active ? 'true' : null", v-show="active")
	slot
</template>
<script>
import consts from './_constants'

export default {
	name: `${consts.prefix}-tab`,
	data() {
		return {
			id: ''
		}
	},
	props: {
		header: String,
		icon: String,
		disabled: {
			type: Boolean,
			default: false
		},
		_id: String,
	},

	computed: {
		active() {
			return this.$parent.activeTab === this.id
		}
	},

	watch: {
		active() {
			if (this.active) {
				this.$emit('selected', this.id)
			} else {
				this.$emit('deselected', this.id)
			}
		},
		id() {
			if (this._id) {
				this.id = this._id
			}
		}
	}
}
</script>
