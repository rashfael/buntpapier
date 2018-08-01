import Scrollbar from './scrollbar'

export default function (Vue) {
	Vue.directive('resizeObserver', {
		bind (el, binding) {
			if (!window.ResizeObserver) return
			const observer = new window.ResizeObserver(binding.value)
			observer.observe(el)
		}
	})

	Scrollbar(Vue)
}
