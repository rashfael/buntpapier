---
title: select
---
# select

select component with option search

<script>
export default {
	data () {
		return {
			selection: '',
			complexOptions: [
				{id: 1, name: 'One', color: 'red'},
				{id: 2, name: 'Two', color: 'blue'},
				{id: 3, name: 'Three', color: 'green'},
				{id: 5, name: 'Five', color: 'orange'},
			],
			activeComplexOption: 2,
		}
	}
}
</script>

<bunt-select id="select-none" name="a-select" label="Select something" v-model="selection" :options="['Delicious Pizza', 'All The Kebab', 'Burrrrrrito!', 'Noodles, Peking Duck', 'McKingC', 'Linsa mit Spätzle und Saita', 'Ice, Ice, Baby', 'Egg and bacon', 'Egg, sausage and bacon', 'Egg and Spam', 'Egg, bacon and Spam', 'Egg, bacon, sausage and Spam', 'Spam, bacon, sausage and Spam', 'Spam, egg, Spam, Spam, bacon and Spam', 'Spam, Spam, Spam, egg and Spam', 'Spam, Spam, Spam, Spam, Spam, Spam, baked beans, Spam, Spam, Spam and Spam', 'Lobster Thermidor aux crevettes with a Mornay sauce, garnished with truffle pâté, brandy and a fried egg on top, and Spam.']" />
<p>{{ selection }}</p>
<bunt-select id="select-complex" name="complex-select" label="complex select" icon="palette" v-model="activeComplexOption" :options="complexOptions" option-label="name">
	<template v-slot="{ option }">
		<div class="select-complex-item">
			<div class="name">{{ option.name }}</div>
			<div class="id" :style="{'background-color': option.color}">{{ option.id }}</div>
		</div>
	</template>
</bunt-select>

<div id="bunt-teleport-target"></div>

### template
```html
<script>
export default {
	data () {
		return {
			selection: '',
			complexOptions: [
				{id: 1, name: 'One', color: 'red'},
				{id: 2, name: 'Two', color: 'blue'},
				{id: 3, name: 'Three', color: 'green'},
				{id: 5, name: 'Five', color: 'orange'},
			],
			activeComplexOption: 2,
		}
	}
}
</script>

<bunt-select name="a-select" label="Select something" v-model="selection" :options="['Delicious Pizza', 'All The Kebab', 'Burrrrrrito!', 'Noodles, Peking Duck', 'McKingC', 'Linsa mit Spätzle und Saita', 'Ice, Ice, Baby', 'Egg and bacon', 'Egg, sausage and bacon', 'Egg and Spam', 'Egg, bacon and Spam', 'Egg, bacon, sausage and Spam', 'Spam, bacon, sausage and Spam', 'Spam, egg, Spam, Spam, bacon and Spam', 'Spam, Spam, Spam, egg and Spam', 'Spam, Spam, Spam, Spam, Spam, Spam, baked beans, Spam, Spam, Spam and Spam', 'Lobster Thermidor aux crevettes with a Mornay sauce, garnished with truffle pâté, brandy and a fried egg on top, and Spam.']" />
<p>{{ selection }}</p>
<bunt-select id="select-complex" name="complex-select" label="complex select" icon="palette" v-model="activeComplexOption" :options="complexOptions" option-label="name">
	<template slot-scope="{ option }">
		<div class="select-complex-item">
			<div class="name">{{ option.name }}</div>
			<div class="id" :style="{'background-color': option.color}">{{ option.id }}</div>
		</div>
	</template>
</bunt-select>

<!-- add a div for all dropdowns to teleport to somewhere at the end of your html, preferably directly in <body> -->
<div id="bunt-teleport-target"></div>
```

### style
```stylus
#select-none, #select-complex
	select-style()
#select-complex
	ul li
		display: flex
		justify-content: space-between
		.id
			width: 120px
			text-align: right
			padding: 0 8px
			color: $clr-secondary-text-dark
```

## props
| prop | type | required | default | description |
|:-----|:-----|:---------|:--------|:------------|
| name | string | true | | native input name |
| label | string | false | | floating label |
| placeholder | string | false | | native placeholder text |
| hint | string | false | | hint text |
| hintIsHtml | boolean | false | false | pass `hint` through `v-html` (potentially unsave) |
| icon | string | false | | mdi icon name to display |
| value | string\|number\|object | false | nell | value (or use v-model) |
| options | array | false | [] | array of strings or objects of all choices |
| option-label | string | false | 'label' | label attribute of option object |
| get-option-label | function | false | using `option-label` | function to generate label from option objects|
| option-value | string | false | 'id' | value attribute of option object |
| get-option-value | function | false | using `option-value` | function to get value from option object |
| disabled | boolean | false | false | disables input |
| validation | object | false | | vuelidate object (see validation) |

## slots

| slot | scope | description |
|:-----|:------|:------------|
| default | { option } | render a single option in the dropdown |
| result-header | | optional area before the options list inside dropdown |
| no-options | | renders when search does not match |

## events

| event | args | description |
|:------|:-----|:------------|
| input | value | emitted on every keypress or input (or use v-model) |
| focus | | after dropdown opens |
| blur | | after dropdown closes |

## methods
| method | args | description |
|:------|:-----|:------------|
| focus | | focus input, open dropdown |
| blur | | blur input, close dropdown |

## style mixin parameters
| parameter | type | default | description |
|:----------|:-----|:--------|:------------|
| style | 'light', 'dark' | 'link' | button style |
| size | 'dense', 'large', 'compact' | 'dense' | input size (compact does not reserve space for a hint) |
