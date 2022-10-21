<script setup>
// TODO link to API docs?
import { onMounted, onUnmounted } from 'vue'
import { registerHandler, unregisterHandler } from '../../../src/requestAnimationFrameMuxxer.js'

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
	.component(:style="style")
		component(:is="componentName", ref="compEl", v-bind="props", v-model="value")
			template(v-for="slot of slots", #[slot.name]) {{ slot.content }}
	.settings
		.template
			.tag #[span.html &lt;]{{ componentName }}
			.prop(v-for="prop of propsDefinition")
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
</template>
<style lang="stylus">
.c-showcase
	border: 2px solid var(--clr-dividers-light)
	border-radius: 6px
	display: flex
	& + .c-showcase
		border-top: none
		border-radius: 0
	> *
		flex: 1
	.component
		display: flex
		justify-content: center
		align-items: center
	.settings
		border-left: 2px solid var(--clr-dividers-light)
		background-color: var(--clr-grey-50)
		display: flex
		> *
			flex: 1
			white-space: pre-wrap
			font-family: 'Roboto Mono'
			&::after
				position: absolute
				top: 4px
				right: 8px
				color: var(--clr-secondary-text-light)
		.template
			padding: 8px
			// display: flex
			// flex-direction: column
			position: relative
			&::after
				content: 'template'
			.tag
				display: inline
				color: #fa8900
			.prop + .tag
				display: block
			.prop
				> *
					display: inline
				.name
					color: #a88c00
				.value
					color: #00b368
				label > *
					display: inline
				input[type="checkbox"]
					margin: 0 4px 0 2px
			.html
				color: #8ca6a6
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
				color: #0095a8
			.punctuation
				color: #004d57
			.value
				margin-left: 4px
				color: #00b368
	
		input:not([type="color"]), select
			color: var(--clr-primary-text-light)
			font-family: 'Roboto Mono'
			font-size: 16px
			background-color: var(--clr-white)
			border: 1px solid var(--clr-dividers-light)
			padding: 0 4px
		select
			margin-left: 8px

		.value-color
			display: flex
			align-items: center
			label
				display: block
				height: 16px
				width: @height
				background-color: var(--value-color)
				border: 1px solid var(--clr-grey-400)
				border-radius: 50%
				margin: 0 8px
			input[type="color"]
				visibility: hidden
				width: 64px
				height: 36px


		&:not(.editable)
			.settings
				flex: 2
			.style
				border-left: 2px solid var(--clr-dividers-light)

		&.editable
			min-height: 360px
			.settings
				flex-direction: column
			.style
				border-top: 2px solid var(--clr-dividers-light)
</style>
