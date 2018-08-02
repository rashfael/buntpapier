import ResizeObserver from 'resize-observer-polyfill'
import Scrollbar from './scrollbar'

export default function (Vue) {
	Vue.directive('resizeObserver', {
		bind (el, binding) {
			const observer = new ResizeObserver(binding.value)
			observer.observe(el)
		}
	})

	Scrollbar(Vue)
}
