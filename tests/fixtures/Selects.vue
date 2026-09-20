<script setup lang="ts">
// Grouped-select consumers: the same nested option shape the component
// documents, once with the default rendering and once through the #group slot.
const groupedOptions = [
	{ label: 'Fruits', items: ['Apple', 'Banana', 'Cherry'] },
	{ label: 'Vegetables', items: ['Carrot', 'Potato', 'Pumpkin'] },
	{
		label: 'Drinks',
		items: [
			{ label: 'Coffee', value: 'coffee' },
			{ label: 'Tea', value: 'tea' }
		]
	}
]

const groupedValue = $ref(null)
const slottedValue = $ref(null)
</script>
<template lang="pug">
main.c-select-fixture
	section
		h2 Default group rendering
		//- the style attribute is passed straight to the component on purpose:
		//- it must reach the root element even though the component renders a
		//- fragment (root plus teleported dropdown)
		bunt-select(
			v-model="groupedValue",
			label="Grouped options",
			:options="groupedOptions",
			style="--input-shape: rounded; width: 280px"
		)
		output(data-testid="grouped-value") {{ groupedValue ?? 'empty' }}
	section
		h2 Group slot rendering
		bunt-select(
			v-model="slottedValue",
			label="Grouped slot",
			:options="groupedOptions",
			style="--input-shape: rounded; width: 280px"
		)
			template(#group="{ group, Options }")
				.c-custom-group-header — {{ group.label }} —
				component(:is="Options")
		output(data-testid="slotted-value") {{ slottedValue ?? 'empty' }}
	//- the dropdown teleports here
	#bunt-teleport-target
</template>
<style lang="sass">
.c-select-fixture
	.c-custom-group-header
		padding: 4px 8px
		font-weight: 700
		color: var(--clr-primary)
</style>
