import { h as createElement, ref, reactive, toRef, computed, onMounted, onBeforeUpdate, nextTick, watch, provide} from 'vue'
import BuntTabHeaderItem from './tab-header.vue'

const filterTabs = function (vnodes) {
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

		const tabsContainer = ref(null)
		const tabElements = ref([])
		onBeforeUpdate(() => {
			tabElements.value = []
		})

		watch(
			() => slots.default(),
			(els) => {
				state.tabs = filterTabs(els)
				// also renders the initial selection
				let index = tabElements.value.findIndex(tab => tab.id === state.activeTab)
				if (index < 0 && props.modelValue === undefined) index = 0
				select(index)
			}
		)
		watch(
			() => props.modelValue,
			() => {
				if (state.activeTab?.id === props.modelValue) return
				select(tabElements.value.findIndex(tab => tab.id === props.modelValue))
			}
		)

		const select = (idOrIndex) => {
			const activeTab = state.tabs.find((tab) => tab.props.id === idOrIndex) || state.tabs[idOrIndex]
			if (!activeTab) return

			const index = state.tabs.indexOf(activeTab)
			const oldIndex = state.tabs.indexOf(state.activeTab)
			if (index === oldIndex) return
			let rect = tabsContainer.value.getBoundingClientRect()
			let width = rect.width
			const elements = Array.from(tabsContainer.value.children)
			let tabRect = tabElements.value[index].$el.getBoundingClientRect()
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
			const getValue = (tab) => tab.props.id || state.tabs.indexOf(tab)
			const oldValue = state.activeTab ? getValue(state.activeTab) : null
			state.activeTab = activeTab
			const newValue = getValue(state.activeTab)
			if (newValue === props.modelValue) return
			emit('update:modelValue', newValue)
			if (!oldValue) return
			state.activeTab?.props.onDeselected?.(oldValue)
			state.activeTab?.props.onSelected?.(newValue)
		}

		onMounted(() => select(props.modelValue || 0))

		return () => {
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
					}, state.tabs.map((tab, index) => {
						return createElement(BuntTabHeaderItem, {
							id: tab.props.id,
							text: tab.props.header,
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
				}, state.activeTab?.children?.default()) // just activeTab does not seem to work
			])
		}
	}
}
