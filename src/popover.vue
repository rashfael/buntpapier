<template lang="jade">
.bunt-popover-inner(role="dialog", tabindex="-1", @keydown.esc="closeDropdown", ref="dropdown")
	slot
</template>
<script>
import Drop from './drop'
import consts from './_constants'

export default {
	name: `${consts.prefix}-popover`,
	props: {
		target: {
			type: String
		},
		dropdownPosition: {
			type: String,
			default: 'bottom middle'
		},
		openOn: {
			type: String,
			default: 'click' // 'click', 'hover', 'focus', 'always'
		}
	},
	// data() {
	// 	return {
	// 		drop: null,
	// 		lastFocussedElement: null
	// 	}
	// },
	mounted() {
		if (this.target) {
			const _target = this.$parent.$refs[this.target]
			if (_target.$el)
				this._target = _target.$el
			else
				this._target = _target
			this.drop = new Drop({
				target: this._target,
				content: this.$refs.dropdown,
				position: this.dropdownPosition,
				constrainToWindow: true,
				openOn: this.openOn,
			})

			// TO FIX: Hacky workaround for Tether not positioning
			// correctly for positions other than 'bottom left'
			if (this.dropdownPosition !== 'bottom left') {
				this.drop.open()
				this.drop.close()
				this.drop.open()
				this.drop.close()
			}

			// this.drop.on('open', this.positionDrop)
			// this.drop.on('open', this.dropdownOpened)
			// this.drop.on('close', this.dropdownClosed)
		}
	},
	beforeDestroy () {
		if (this.drop) {
			this.drop.remove()
			this.drop.destroy()
		}
	},
	methods: {
		openDropdown() {
			if (this.drop) {
				this.drop.open()
			}
		},
		closeDropdown() {
			if (this.drop) {
				this.drop.close();
			}
		},
		toggleDropdown(e) {
			if (this.drop) {
				this.drop.toggle(e);
			}
		},
		/**
		 * Ensures drop is horizontally within viewport (vertical is already solved by drop.js).
		 * https://github.com/HubSpot/drop/issues/16
		 */
		positionDrop() {
			const drop = this.drop;
			const windowWidth = window.innerWidth ||
				document.documentElement.clientWidth ||
				document.body.clientWidth;

			let dropWidth = drop.drop.getBoundingClientRect().width;
			let left = drop.target.getBoundingClientRect().left;
			let availableSpace = windowWidth - left;

			if (dropWidth > availableSpace) {
				let direction = dropWidth > availableSpace ? 'right' : 'left';

				drop.tether.attachment.left = direction;
				drop.tether.targetAttachment.left = direction;

				drop.position();
			}
		},
		dropdownOpened() {
			this.lastFocussedElement = document.activeElement
			this.$refs.dropdown.focus()
			
			this.$emit('opened')
		},
		dropdownClosed() {
			if (this.lastFocussedElement)
				this.lastFocussedElement.focus()

			this.$emit('closed')
		}
	}
}
</script>
