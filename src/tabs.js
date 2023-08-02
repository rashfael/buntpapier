import { h as createElement, ref, reactive, toRef, computed, onMounted, onBeforeUpdate, onBeforeUnmount, nextTick, watch, provide, Fragment } from 'vue'
import ResizeObserver from 'resize-observer-polyfill'
import BuntTabHeaderItem from './tab-header.vue'

const filterTabs = function (vnodes) {
	if (vnodes.length === 1 && vnodes[0].type === Fragment) return filterTabs(vnodes[0].children)
	return vnodes.filter(tab => tab.type.name === 'bunt-tab')
}

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
	emits: ['update:modelValue'],
	setup(props, { slots, emit }) {
		const state = reactive({
			tabs: filterTabs(slots.default()),
			activeTab: null,
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

		const $el = ref(null)
		const tabsContainer = ref(null)
		const tabElements = ref([])
		onBeforeUpdate(() => {
			tabElements.value = []
		})

		const getTabValue = (tab) => tab ? tab.props.id || state.tabs.indexOf(tab) : null
		watch(
			() => slots.default(),
			(els) => {
				state.tabs = filterTabs(els)
				// also renders the initial selection
				let index = tabElements.value.findIndex(tab => tab.id === state.activeTab)
				if (index < 0 && props.modelValue === undefined) index = 0
				select(index)
			},
			{
				flush: 'post'
			}
		)
		watch(
			() => props.modelValue,
			() => {
				if (getTabValue(state.activeTab) === props.modelValue) return
				select(tabElements.value.findIndex(tab => tab.id === props.modelValue))
			}
		)

		const animateIndicator = (index, oldIndex) => {
			if (index == null || index < 0) {
				state.indicatorTransform = {
					width: 0,
					left: 0
				}
				return
			}
			let rect = tabsContainer.value.getBoundingClientRect()
			let width = rect.width
			const elements = Array.from(tabsContainer.value.children)
			let tabRect = tabElements.value[index].$el.getBoundingClientRect()
			let tabOffsetLeft = tabRect.left - rect.left
			state.indicatorTargetTransform = {
				width: tabRect.width / width,
				left: tabOffsetLeft / width * 100
			}

			if (oldIndex === undefined || oldIndex < 0) {
				// position the bar without animation.
				state.indicatorState = ''
				state.indicatorTransform = {
					width: state.indicatorTargetTransform.width,
					left: state.indicatorTargetTransform.left
				}
			} else {
				const oldRect = tabElements.value[oldIndex].$el.getBoundingClientRect()
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
		}

		const select = (idOrIndex) => {
			const activeTab = state.tabs.find((tab) => tab.props.id === idOrIndex) || state.tabs[idOrIndex]
			const index = state.tabs.indexOf(activeTab)
			const oldIndex = state.tabs.indexOf(state.activeTab)
			const oldValue = getTabValue(state.activeTab)
			if (oldValue) {
				state.activeTab.props.onDeselected?.(oldValue)
			}
			state.activeTab = activeTab
			const newValue = getTabValue(state.activeTab)
			if (newValue !== props.modelValue) {
				emit('update:modelValue', newValue)
			}
			state.activeTab?.props.onSelected?.(newValue)
			animateIndicator(index, oldIndex)
		}

		let observer
		onMounted(() => {
			select(props.modelValue || 0)
			observer = new ResizeObserver(entries => {
				if (tabsContainer.value && state.activeTab)
					animateIndicator(state.tabs.indexOf(state.activeTab))
			})
			observer.observe($el.value)
		})

		onBeforeUnmount(() => {
			observer.disconnect()
		})

		return () => {
			return createElement('div', {
				class: 'bunt-tabs',
				ref: $el
			}, [
				createElement('div', {
					class: 'bunt-tabs-header'
				}, [
					createElement('ul', {
						class: 'bunt-tabs-header-items',
						role: 'tablist',
						ref: tabsContainer
					}, state.tabs.map((tab, index) => {
						return createElement(BuntTabHeaderItem, {
							id: tab.props.id,
							text: typeof tab.props.header === 'string' ? tab.props.header : null,
							active: tab === state.activeTab,
							disabled: tab.props.disabled,
							key: tab.props.id,
							ref (el) {
								if (!el) return
								tabElements.value[index] = el
							},
							onClick () {
								if (tab.props.disabled) return
								select(index, state.tabs)
							}
						}, slots.headerItem ? () => slots.headerItem({id: tab.props.id, ...tab.props.header}) : null)
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
					tabindex: 0,
					key: state.activeTab?.props.id // forces proper lifecycle of tab contents
				}, state.activeTab?.children?.default()) // just activeTab does not seem to work
			])
		}
	}
}
