// v-tooltip accepts text or { text, show, placement, fixed, boundariesElement }.
import { effectScope, shallowRef } from 'vue'
import type { DirectiveBinding, ObjectDirective } from 'vue'
import type { Placement } from '@popperjs/core'
import { useTooltip } from '../tooltip'
import type { TooltipContent } from '../tooltip'

function options (binding: DirectiveBinding<TooltipContent>) {
	const value = typeof binding.value === 'string' ? { text: binding.value } : binding.value || {}
	return {
		...value,
		placement: value.placement || Object.keys(binding.modifiers).find(mod => /^(auto|top|right|bottom|left)/.test(mod)) as Placement,
		fixed: value.fixed || binding.modifiers.fixed
	}
}

function attach (el: HTMLElement, binding: DirectiveBinding<TooltipContent>) {
	const content = shallowRef(options(binding))
	const scope = effectScope()
	scope.run(() => useTooltip(el, content))
	return { content, scope }
}

const instances = new WeakMap<HTMLElement, ReturnType<typeof attach>>()
const directive: ObjectDirective<HTMLElement, TooltipContent> = {
	mounted (el, binding) {
		instances.set(el, attach(el, binding))
	},
	updated (el, binding) {
		const instance = instances.get(el)
		if (instance) instance.content.value = options(binding)
	},
	unmounted (el) {
		instances.get(el)?.scope.stop()
		instances.delete(el)
	}
}

export default directive

export function install (app) {
	app.directive('tooltip', directive)
}
