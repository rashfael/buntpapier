<template lang="pug">
.bunt-tabs(:class="styleClasses", v-resize-observer="_onResizeObserver")
	.bunt-tabs-header
		ul.bunt-tabs-header-items(role="tablist", ref="tabsContainer")
			bunt-tab-header-item(:type="type", :id="tab.id", :icon="tab.icon", :text="tab.header",
				:active="activeTabObj === tab", :disabled="tab.disabled",
				@click.native="select(tab, index)",
				v-for="(tab, index) in tabs", ref="tabElements", :key="tab.id")
		.bunt-tabs-indicator(:class="[indicatorState]", :style="indicatorStyle", @transitionend="onIndicatorTransitionEnd")
	.bunt-tabs-body(ref="body")
		slot
</template>

<script>
import BuntTabHeaderItem from './tab-header'

const calcPercent = function (w, w0) {
	return 100 * w / w0
}

export default {
	name: `bunt-tabs`,
	components: {BuntTabHeaderItem},
	props: {
		type: {
			type: String,
			default: 'text', // 'text', 'icon', or 'icon-and-text'styleObject
		},
		activeTab: {
			type: [Number, String, Object, Function],

		}
	},
	data () {
		return {
			activeTabObj: null,
			tabs: null,
			indicatorState: '', // '', 'expand', 'contract'
			indicatorTransform: { // this is the 'live' css transform
				left: 0,
				width: 0
			},
			indicatorTargetTransform: { // we need to save this for the second stage of the animation
				left: 0,
				width: 0
			}
		}
	},
	computed: {
		styleClasses () {
			let classes = [`bunt-tabs-type-${this.type}`]
			return classes
		},
		indicatorStyle () {
			const it = this.indicatorTransform
			return {
				transform: `translateX(${it.left}%) scaleX(${it.width / 100})`
			}
		}
	},
	watch: {
		activeTab (val) {
			this.activateTab(val)
		},
	},
	mounted () {
		this.updateTabs()
		const observer = new MutationObserver((records) => {
			this.updateTabs()
			this.$nextTick(() => this.activateTab(this.activeTab || 0))
		}).observe(this.$refs.body, {
			childList: true
		})

		// Set the active tab element (to show indicator)
		this.$nextTick(() => {
			if (this.$refs.tabsContainer)
				this.activateTab(this.activeTab || 0)
		})
	},
	methods: {
		_onResizeObserver () {
			if (this.$refs.tabsContainer)
				this.activateTab(this.activeTab || 0)
		},
		updateTabs () {
			// sort this via DOM because $children has no guaranteed order
			const children = Array.from(this.$refs.body.children)
			this.tabs = this.$children.filter((tab) => tab._isTab).sort((a, b) => children.indexOf(a.$el) - children.indexOf(b.$el))
		},
		activateTab (val) {
			let index = null
			if (typeof (val) === 'number') // treat as index
				index = val
			else if (typeof (val) === 'string') { // treat as id
				index = this.tabs.findIndex((tab) => tab.id === val)
			}
			if (this.tabs[index]) {
				this.select(this.tabs[index], index)
			} else {
				this.deselect()
			}
		},
		select (tab, index) {
			let oldIndex = this.tabs.indexOf(this.activeTabObj)
			if (tab.disabled)
				return
			let rect = this.$refs.tabsContainer.getBoundingClientRect()
			let width = rect.width
			const elements = Array.from(this.$refs.tabsContainer.children)
			let tabRect = this.$refs.tabElements.sort((a, b) => elements.indexOf(a.$el) - elements.indexOf(b.$el))[index].$el.getBoundingClientRect()
			let tabOffsetLeft = tabRect.left - rect.left
			this.indicatorTargetTransform = {
				width: calcPercent(tabRect.width, width),
				left: calcPercent(tabOffsetLeft, width)
			}

			if (oldIndex < 0) {
				// Position the bar without animation.
				this.indicatorState = ''
				this.indicatorTransform = {
					width: this.indicatorTargetTransform.width,
					left: this.indicatorTargetTransform.left
				}
				this.activeTabObj = tab
				return
			}

			let oldRect = this.$refs.tabElements[oldIndex].$el.getBoundingClientRect()
			let m = 5 // wtf is m
			// bar animation: expand
			this.indicatorState = 'expand'
			let moveRight = oldIndex < index

			if (moveRight)
				this.indicatorTransform.width = calcPercent(tabRect.left + tabRect.width - oldRect.left, width) - m
			else
				this.indicatorTransform = {
					width: calcPercent(oldRect.left + oldRect.width - tabRect.left, width) - m,
					left: calcPercent(tabOffsetLeft, width) + m
				}
			this.activeTabObj = tab
		},
		deselect () {
			this.activeTabObj = null
			this.indicatorTransform.width = 0
			this.indicatorTransform.left = 0
		},
		onIndicatorTransitionEnd () {
			// bar animation: expand -> contract
			if (this.indicatorState == 'expand') {
				this.indicatorState = 'contract'
				this.indicatorTransform = {
					width: this.indicatorTargetTransform.width,
					left: this.indicatorTargetTransform.left
				}
			// bar animation done
			} else
				this.indicatorState = ''
		}
	}
}
</script>
