export const hooks = {
	beforeMount (el, binding) {
		const observer = new ResizeObserver(entries => {
			if (!el.__buntpapier__resize_observer) return
			for (const handler of el.__buntpapier__resize_observer.handlers) {
				handler(entries)
			}
		})
		if (!el.__buntpapier__resize_observer) {
			el.__buntpapier__resize_observer = {
				observer,
				handlers: [binding.value]
			}
		} else {
			el.__buntpapier__resize_observer.handlers.push(binding.value)
		}
		observer.observe(el)
	},
	beforeUnmount (el) {
		if (!el.__buntpapier__resize_observer) return
		el.__buntpapier__resize_observer.observer.disconnect()
		el.__buntpapier__resize_observer = null
	}
}

export default function (Vue) {
	Vue.directive('resizeObserver', hooks)
}
