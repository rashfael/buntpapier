<template lang="pug">
.bunt-ripple-ink(@mousedown="mousedown($event)", @touchstart.passive="touchstart($event)")
	transition(name="ripple-ink")
		.ripple(v-if="show", :style="style")
</template>

<script>
export default {
	name: `bunt-ripple-ink`,
	data () {
		return {
			show: false,
			style: null,
		}
	},
	methods: {
		mousedown (e) {
			if (e.button === 0) {
				this.ripple(e.type, e)
			}
		},
		touchstart (e) {
			if (e.changedTouches) {
				for (let i = 0; i < e.changedTouches.length; ++i) {
					this.ripple(e.type, e.changedTouches[i])
				}
			}
		},
		ripple (eventType, e) {
			const holder = this.$el
			const prev = holder.getAttribute('data-ui-event')
			if (prev && prev !== eventType) {
				return
			}
			holder.setAttribute('data-ui-event', eventType)
			let rect = holder.getBoundingClientRect()
			let x = e.offsetX
			let y
			if (x !== undefined) {
				y = e.offsetY
			} else {
				x = e.clientX - rect.left
				y = e.clientY - rect.top
			}
			let max = rect.width === rect.height
				? rect.width * 1.412 : Math.sqrt(
					(rect.width * rect.width) + (rect.height * rect.height)
				)
			let dim = (max * 2) + 'px'
			this.style = {
				width: dim,
				height: dim,
				marginLeft: -max + x + 'px',
				marginTop: -max + y + 'px'
			}
			this.show = true
			const releaseEvents = ['mouseleave', 'mouseup', 'touchend']
			const release = () => {
				releaseEvents.forEach((eventName) => {
					holder.removeEventListener(eventName, release)
				})
				setTimeout(() => {
					this.show = false
					this.style = null
					holder.removeAttribute('data-ui-event')
				}, 200)
			}
			releaseEvents.forEach((eventName) => {
				holder.addEventListener(eventName, release)
			})
		}
	}
}
</script>
