import { h as createElement, ref, reactive, computed, onMounted, nextTick, watch } from 'vue'
import BuntTabHeaderItem from './tab-header'

export default {
	name: `bunt-tabs`,
	props: {
		type: {
			type: String,
			default: 'text', // 'text', 'icon', or 'icon-and-text'styleObject
		},
		modelValue: {
			type: [Number, String, Object, Function],
		}
	},
	setup(props, { slots, emit }) {
		const tabs = slots.default().filter(tab => tab.type.name === 'bunt-tab')
		const state = reactive({
			activeTab: props.modelValue,
			indicatorTargetTransform: null,
			indicatorState: null,
			indicatorTransform: null,
			indicatorStyle: computed(() => {
				if (!state.indicatorTransform) return
				return {
					transform: `translateX(${state.indicatorTransform.left}%) scaleX(${state.indicatorTransform.width})`
				}
			})
		})

		const tabsContainer = ref(null)
		const tabElements = reactive([])

		watch(
			() => tabElements.length,
			() => {
				// also renders the initial selection
				let index = tabElements.findIndex(tab => tab.id === state.activeTab)
				if (index < 0 && props.modelValue === undefined) index = 0
				select(index)
			}
		)
		watch(
			() => props.modelValue,
			() => {
				if (state.activeTab?.id === props.modelValue) return
				state.activeTab = props.modelValue
				select(tabElements.findIndex(tab => tab.id === state.activeTab))
			}
		)

		const select = (index, tabs) => {
			if (index < 0) return
			const oldIndex = state.activeTab?.id ? (tabs?.findIndex(tab => tab.props.id === state.activeTab.id) ?? -1) : (state.activeTab?.index ?? -1)
			if (index === oldIndex) return
			let rect = tabsContainer.value.getBoundingClientRect()
			let width = rect.width
			const elements = Array.from(tabsContainer.value.children)
			let tabRect = tabElements[index].$el.getBoundingClientRect()
			let tabOffsetLeft = tabRect.left - rect.left
			state.indicatorTargetTransform = {
				width: tabRect.width / width,
				left: tabOffsetLeft / width * 100
			}

			if (oldIndex < 0) {
				// position the bar without animation.
				state.indicatorState = ''
				state.indicatorTransform = {
					width: state.indicatorTargetTransform.width,
					left: state.indicatorTargetTransform.left
				}
			} else {
				const oldRect = tabElements[oldIndex].$el.getBoundingClientRect()
				state.indicatorState = 'expand'

				if (oldIndex < index) {
					// move right
					state.indicatorTransform.width = (tabRect.left + tabRect.width - oldRect.left) / width
				} else {
					// move left
					state.indicatorTransform = {
						width: (oldRect.left + oldRect.width - tabRect.left) / width,
						left: tabOffsetLeft / width * 100
					}
				}
			}
			const tabId = tabElements[index].id
			if (tabId) {
				state.activeTab = {id: tabId}
				emit('update:modelValue', tabId)
			} else {
				state.activeTab = {index}
				emit('update:modelValue', index)
			}

		}

		return () => {
			const tabs = slots.default().filter(tab => tab.type.name === 'bunt-tab')
			const activeTab = tabs.find((tab, index) => state.activeTab?.id ? tab.props.id === state.activeTab.id : index === state.activeTab?.index)
			tabElements.length = 0 // reset refs
			return createElement('div', {
				class: 'bunt-tabs'
			}, [
				createElement('div', {
					class: 'bunt-tabs-header'
				}, [
					createElement('ul', {
						class: 'bunt-tabs-header-items',
						role: 'tablist',
						ref: tabsContainer
					}, tabs.map((tab, index) => {
						return createElement(BuntTabHeaderItem, {
							id: tab.props.id,
							text: tab.props.header,
							active: tab === activeTab,
							disabled: tab.props.disabled,
							key: tab.props.id,
							ref (el, ol, il) {
								if (!el) return // no idea how this works, can't find docs for that
								tabElements[index] = el
							},
							onClick () {
								if (tab.props.disabled) return
								select(index, tabs)
							}
						})
					})),
					createElement('div', {
						class: ['bunt-tabs-indicator', state.indicatorState],
						style: state.indicatorStyle,
						onTransitionend () {
							if (state.indicatorState === 'expand') {
								state.indicatorState = 'contract'
								state.indicatorTransform = {
									width: state.indicatorTargetTransform.width,
									left: state.indicatorTargetTransform.left
								}
							} else {
								state.indicatorState = ''
							}
						}
					})
				]),
				createElement('div', {
					class: 'bunt-tabs-body',
					role: 'tabpanel',
					tabindex: 0
				}, [activeTab?.children?.default()]) // just activeTab does not seem to work
			])
		}
	}
}
