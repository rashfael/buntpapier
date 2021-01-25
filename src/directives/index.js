import ResizeObserver from 'resize-observer-polyfill'
import Scrollbar from './scrollbar'
import Tooltip from './tooltip'

export default function (Vue) {
	Vue.directive('resizeObserver', {
		beforeMount (el, binding) {
			const observer = new ResizeObserver(binding.value)
			observer.observe(el)
			el.__buntpapier__resize_observer = observer
		},
		beforeUnmount (el, binding, vnode, oldVnode) {
			if (!el.__buntpapier__resize_observer) return
			el.__buntpapier__resize_observer.disconnect()
		}
	})

	Scrollbar(Vue)
	Tooltip(Vue)
}
