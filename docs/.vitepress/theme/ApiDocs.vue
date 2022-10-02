<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
const {
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

const props = $ref(Object.entries(propsObj).map(([name, content]) => ({ name, ...content })))
const slots = $ref(Object.entries(slotsObj).map(([name, content]) => ({ name, ...content })))
const style = $ref(Object.entries(styleObj).map(([name, content]) => ({ name, ...content })))

</script>
<template lang="pug">
.c-api-docs
	.slots
		h3 Slots
		table
			tr
				th Slot
				th Description
			tr(v-for="slot of slots")
				td {{ slot.name }}
				td.description {{ slot.description }}
	.props
		h3 Props
		table
			tr
				th Property
				th Type
				th Default
				th Description
			tr(v-for="prop of props")
				td {{ prop.name }}
				td.type-enum(v-if="prop.type === 'enum'") {{ prop.values.join(', ') }}
				td.type(v-else) {{ prop.type }}
				td {{ prop.default }}
				td.description {{ prop.description }}
	.style
		h3 Style
		table
			tr
				th Property
				th Type
				th Default
				th Description
			tr(v-for="property of style")
				td {{ property.name }}
				td.type-enum(v-if="property.type === 'enum'") {{ property.values.join(', ') }}
				td.type(v-else) {{ property.type }}
				td(:class="{computed: property.default === 'computed'}") {{ property.default }}
				td.description {{ property.description }}
</template>
<style lang="stylus">
.c-api-docs
	th
		white-space: nowrap
	td:not(.description)
		font-family: 'Roboto Mono'
		white-space: nowrap
	td.description
		width: 100%
	td.type
		font-style: italic
	td.computed
		font-style: italic
		color: var(--clr-secondary-text-light)
</style>
