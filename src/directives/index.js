import ResizeObserver from 'resize-observer-polyfill'
import Scrollbar from './scrollbar'

export default function (Vue) {
	Vue.directive('resizeObserver', {
		inserted (el, binding) {
			const observer = new ResizeObserver(binding.value)
			observer.observe(el)
			el.__buntpapier__resize_observer = observer
		},
		componentUpdated (el, binding) {
			if (el.__buntpapier__resize_observer)
				el.__buntpapier__resize_observer.disconnect()
			const observer = new ResizeObserver(binding.value)
			observer.observe(el)
			el.__buntpapier__resize_observer = observer
		},
		unbind (el, binding, vnode, oldVnode) {
			if (!el.__buntpapier__resize_observer) return
			el.__buntpapier__resize_observer.disconnect()
		}
	})

	Scrollbar(Vue)
}
