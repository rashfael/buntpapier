<script setup>
// TODO link to API docs?
import { onMounted, onUnmounted } from 'vue'
import Color from 'color'
import { registerHandler, unregisterHandler } from '../../../src/requestAnimationFrameMuxxer.ts'

const {
	componentName,
	props: propsObj,
	slots: slotsObj,
	style: styleObj
} = defineProps({
	editable: {
		type: Boolean,
		default: false
	},
	booleanPropShorthand: {
		type: Boolean,
		default: false
	},
	componentName: String,
	props: {
		type: Object,
		default: () => ({})
	},
	slots: {
		type: Object,
		default: () => ({})
	},
	style: {
		type: Object,
		default: () => ({})
	},
})

const propsDefinition = $ref(Object.entries(propsObj).map(([name, content]) => ({ name, ...content })).filter(prop => prop.name !== 'modelValue'))
const slots = $ref(Object.entries(slotsObj).map(([name, content]) => ({ name, content })))
const styleProperties = $ref(Object.entries(styleObj).map(([name, content]) => ({ name, ...content })))

const style = $ref({})

for (const property of styleProperties) {
	if (property.type === 'enum') {
		style[property.name] = property.default
	}
	if (property.value) {
		style[property.name] = property.value
	}
}

const props = $ref({})

for (const prop of propsDefinition) {
	if (prop.default !== undefined) {
		props[prop.name] = prop.default
	}
	if (prop.value) {
		props[prop.name] = prop.value
	}
}

let compEl = $ref(null)
let value = $ref('')

// per-showcase surface override for the demo pane
// 'auto' follows the page theme; 'custom' sets --clr-surface directly
let surface = $ref('auto')
let customSurface = $ref('#263238')

const surfaceStyle = $computed(() => {
	if (surface === 'light' || surface === 'dark') return { colorScheme: surface }
	if (surface === 'custom') {
		return {
			'--clr-surface': customSurface,
			// accents are light-dark() pairs — pin the scheme to the matching side
			colorScheme: Color(customSurface).isDark() ? 'dark' : 'light'
		}
	}
	return {}
})

const computedStyles = $ref({})

function fetchStyle () {
	if (!compEl?.el) return
	const componentStyle = getComputedStyle(compEl.el)
	for (const property of styleProperties) {
		if (!property.computed) continue
		computedStyles[property.name] = componentStyle.getPropertyValue(property.computed).trim()
	}
}

onMounted(() => {
	registerHandler(fetchStyle)
})
onUnmounted(() => {
	unregisterHandler(fetchStyle)
})
</script>
<template lang="pug">
.c-showcase(:class="{'editable': editable}")
	.component(:style="[style, surfaceStyle]")
		.surface-control
			button(
				v-for="option of ['auto', 'light', 'dark']",
				:key="option",
				:class="{active: surface === option}",
				@click="surface = option"
			) {{ option }}
			label.custom(:class="{active: surface === 'custom'}", :style="{'--value-color': customSurface}")
				input(type="color", v-model="customSurface", @input="surface = 'custom'")
		component(:is="componentName", ref="compEl", v-bind="props", v-model="value")
			template(v-for="slot of slots", #[slot.name])
				slot(:name="slot.name") {{ slot.content }}
	.settings
		.template
			.tag #[span.html &lt;]{{ componentName }}
			.prop(v-for="prop of propsDefinition")
				template(v-if="booleanPropShorthand && prop.type === 'boolean' && props[prop.name]")
					.name {{ prop.name }}
				template(v-else)
					.name {{ prop.type !== 'string' ? ':' : ''}}{{ prop.name }}
					span.html ="
					template(v-if="editable")
						label(v-if="prop.type === 'boolean'")
							input(type="checkbox", v-model="props[prop.name]")
							.value {{ props[prop.name] }}
						input(v-else, type="text", v-model="props[prop.name]")
					.value(v-else) {{ prop.value }}
					span.html "
			.prop(v-if="propsObj.modelValue")
				.name v-model
				span.html ="
				.value yourValue
				span.html "
			.tag #[span.html &gt;]
			.slot(v-for="slot of slots", :key="slot.name")
				template(v-if="slot.name === 'default'")
					input(v-if="editable", v-model="slot.content")
					.content(v-else) {{ slot.content }}
				template(v-else)
					.tag #[span.html &lt;]template \#[slot.name]#[span.html &gt;]
					input(v-if="editable", v-model="slot.content")
					.value(v-else) {{ slot.content }}
					.tag #[span.html &lt;/]template#[span.html &gt;]
			.tag #[span.html &lt;/]{{ componentName }}#[span.html &gt;]
		.style
			.property(v-for="property of styleProperties")
				.name {{ property.name }}
				.punctuation :
				.value.value-color(v-if="property.type === 'color'", :style="{'--value-color': computedStyles[property.name]}")
					template(v-if="editable")
						label
							input(type="color", :value="computedStyles[property.name]", @input="e => style[property.name] = e.target.value")
						input(v-model="style[property.name]", :placeholder="property.default")
					template(v-else) {{ property.value }}
				.value(v-else-if="property.type === 'enum'")
					template(v-if="editable")
						select(v-model="style[property.name]")
							option(v-for="value of property.values") {{ value }}
					template(v-else) {{ property.value }}
			.property(v-if="surface === 'custom'")
				.name --clr-surface
				.punctuation :
				.value {{ customSurface }}
</template>
<style lang="stylus">
.c-showcase
	// syntax highlight tokens, dark variants tuned against --vp-c-bg-alt
	--showcase-tok-tag: #fa8900
	--showcase-tok-name: #a88c00
	--showcase-tok-string: #00b368
	--showcase-tok-html: #8ca6a6
	--showcase-tok-prop: #0095a8
	--showcase-tok-punct: #004d57

	border: 2px solid var(--vp-c-divider)
	border-radius: 6px
	display: flex
	overflow: hidden // clip the demo pane surface to the rounded border
	& + .c-showcase
		border-top: none
		border-radius: 0
	> *
		flex: 1
	.component
		position: relative
		display: flex
		justify-content: center
		align-items: center
		background: var(--clr-surface, transparent)
	.surface-control
		position: absolute
		top: 4px
		left: 8px
		right: 8px
		display: flex
		flex-wrap: wrap // narrow demo panes
		align-items: center
		gap: 4px
		opacity: .4
		font-family: 'Roboto Mono'
		font-size: 11px
		&:hover
			opacity: 1
		button
			cursor: pointer
			border: 1px solid var(--vp-c-divider)
			background: var(--vp-c-bg)
			color: var(--vp-c-text-2)
			padding: 0 6px
			border-radius: 4px
			font: inherit // the revert-layer rule below nukes inherited font
			&.active
				color: var(--vp-c-text-1)
				border-color: var(--vp-c-text-2)
		label.custom
			position: relative
			display: block
			height: 14px
			width: 14px
			border-radius: 50%
			border: 1px solid var(--vp-c-divider)
			background-color: var(--value-color)
			cursor: pointer
			&.active
				border-color: var(--vp-c-text-2)
			input
				// invisibly cover the swatch so the native color dialog
				// anchors here instead of the viewport corner
				position: absolute
				inset: 0
				width: 100%
				height: 100%
				opacity: 0
				cursor: pointer
	.settings
		border-left: 2px solid var(--vp-c-divider)
		background-color: var(--vp-c-bg-alt)
		display: flex
		> *
			flex: 1
			white-space: pre-wrap
			font-family: 'Roboto Mono'
			&::after
				position: absolute
				top: 4px
				right: 8px
				color: var(--vp-c-text-2)
		.template
			padding: 8px
			// display: flex
			// flex-direction: column
			position: relative
			&::after
				content: 'template'
			.tag
				display: inline
				color: var(--showcase-tok-tag)
			.prop + .tag
				display: block
			.prop
				white-space: nowrap
				> *
					display: inline
				.name
					color: var(--showcase-tok-name)
				.value
					color: var(--showcase-tok-string)
				label > *
					display: inline
				input[type="checkbox"]
					margin: 0 4px 0 2px
			.html
				color: var(--showcase-tok-html)
			.slot
				display: flex
				flex-direction: column

			.prop, .slot, .slot input
				margin: 0 16px
		.style
			position: relative
			padding: 8px
			&::after
				content: 'style'
			.property
				display: flex
				color: var(--showcase-tok-prop)
			.name
				white-space: nowrap
			.punctuation
				color: var(--showcase-tok-punct)
			.value
				margin-left: 4px
				color: var(--showcase-tok-string)

		input:not([type="color"]), select
			color: var(--vp-c-text-1)
			font-family: 'Roboto Mono'
			font-size: 16px
			background-color: var(--vp-c-bg)
			border: 1px solid var(--vp-c-divider)
			padding: 0 4px
		select
			margin-left: 8px

		.value-color
			display: flex
			align-items: center
			label
				position: relative
				display: block
				height: 16px
				width: @height
				background-color: var(--value-color)
				border: 1px solid var(--vp-c-divider)
				border-radius: 50%
				margin: 0 8px
				cursor: pointer
				input[type="color"]
					// invisibly cover the swatch so the native color dialog
					// anchors here instead of the viewport corner
					position: absolute
					inset: 0
					width: 100%
					height: 100%
					opacity: 0
					cursor: pointer

	&:not(.editable)
		.settings
			flex: 2
		.style
			border-left: 2px solid var(--vp-c-divider)

	&.editable
		min-height: 360px
		.settings
			flex-direction: column
		.style
			border-top: 2px solid var(--vp-c-divider)
	button, input, select
		all: revert-layer // get rid of vitepress styles

.dark .c-showcase
	--showcase-tok-name: #d8bc2a
	--showcase-tok-html: #9fb8b8
	--showcase-tok-punct: #4fb6c4
</style>
