<template lang="jade">
.bunt-tabs(:class="styleClasses")
	.bunt-tabs-header
		ul.bunt-tabs-header-items(role="tablist", ref="tabsContainer")
			bunt-tab-header-item(:type="type", :id="tab.id", :icon="tab.icon", :text="tab.header",
				:active="activeTabObj === tab", :disabled="tab.disabled",
				@click.native="select(tab, index)",
				v-for="(tab, index) in tabs", ref="tabElements")
		.bunt-tabs-indicator(:class="[indicatorState]", :style="indicatorStyle", @transitionend="onIndicatorTransitionEnd")
	.bunt-tabs-body(ref="body")
		slot
</template>

<script>
import consts from './_constants'
import BuntTabHeaderItem from './tab-header'

const calcPercent = function(w, w0) {
	return 100 * w / w0;
}

export default {
	name: `${consts.prefix}-tabs`,
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
	data() {
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
		styleClasses() {
			let classes = [`${consts.prefix}-tabs-type-${this.type}`]
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
		// activeTabObj (val, oldVal) {
		// 	if(this.activeTab === null) // nobody listens
		// 		return
		// 	if(typeof(this.activeTab) === 'number') { // treat as index
		// 		const index = this.tabs.indexOf(val)
		// 		this.activeTab = index
		// 	} else if (typeof(this.activeTab) === 'string') { // treat as id
		// 		const id = val.id
		// 		this.activeTab = id
		// 	}
		// }
	},
	mounted () {
		this.tabs = this.$children.slice(0)
		// for(let child of this.$children)
		// 	child.id = child.id || UUID.short(`${consts.prefix}-tab-`)

		// Set the active tab
		
		// Set the active tab element (to show indicator)
		this.$nextTick(() => {
			if (this.$refs.tabsContainer) 
				this.activateTab(this.activeTab || 0)
		})
	},
	methods: {
		activateTab(val) {
			let index = null
			if(typeof(val) === 'number') // treat as index
				index = val
			else if (typeof(val) === 'string') {// treat as id
				index = this.tabs.findIndex((tab) => tab.id === val)
			}
			this.select(this.tabs[index], index)
		},
		select(tab, index) {
			if (tab.disabled || this.activeTabObj === tab)
				return
			let rect = this.$refs.tabsContainer.getBoundingClientRect()
			let width = rect.width
			let tabRect = this.$refs.tabElements[index].$el.getBoundingClientRect()
			let tabOffsetLeft = tabRect.left - rect.left
			this.indicatorTargetTransform = {
				width: calcPercent(tabRect.width, width),
				left: calcPercent(tabOffsetLeft, width)
			}
			if(this.activeTabObj == null) {
				// Position the bar without animation.
				this.indicatorState = ''
				this.indicatorTransform = {
					width: this.indicatorTargetTransform.width,
					left: this.indicatorTargetTransform.left
				}
				this.activeTabObj = tab
				return
			}
			
			let oldIndex = this.tabs.indexOf(this.activeTabObj)
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
