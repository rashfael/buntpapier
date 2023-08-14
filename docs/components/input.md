---
title: input
---
# input

<script>
export default {
	data () {
		return {
			inputText: ''
		}
	}
}
</script>

<bunt-input id="input-normal" v-model="inputText" name="an-input" label="ein lustiges Eingabefeld" hint="mit einem lustigen Hinweis"/>
<bunt-input id="input-password" v-model="inputText" type="password" name="password-input" label="Password"/>
<bunt-input id="input-disabled" value="a disabled value" name="disabled-input" label="this input is disabled" hint="with a hint" :disabled="true"/>
<bunt-input id="input-placeholder" v-model="inputText" name="input-placeholder" placeholder="I am a placeholder, not a label" icon="search" />
<bunt-input id="input-compact" v-model="inputText" name="compact-input" label="a compact input"/>
<bunt-input id="input-large" v-model="inputText" name="large-input" label="a large input"/>

<div class="dark-background">
	<bunt-input id="input-dark" v-model="inputText" name="dark-input" label="an input on dark background" hint="with a hint"/>
</div>

### template
```html
<bunt-input id="input-normal" v-model="inputText" name="an-input" label="ein lustiges Eingabefeld" hint="mit einem lustigen Hinweis"/>
<bunt-input id="input-password" v-model="inputText" type="password" name="password-input" label="Password"/>
<bunt-input id="input-disabled" value="a disabled value" name="disabled-input" label="this input is disabled" hint="with a hint" :disabled="true"/>
<bunt-input id="input-placeholder" v-model="inputText" name="input-placeholder" placeholder="I am a placeholder, not a label" icon="search" />
<bunt-input id="input-compact" v-model="inputText" name="compact-input" label="a compact input"/>
<bunt-input id="input-large" v-model="inputText" name="large-input" label="a large input"/>

<div class="dark-background">
	<bunt-input id="input-dark" v-model="inputText" name="dark-input" label="an input on dark background" hint="with a hint"/>
</div>
```

### style
```stylus
#input-normal, #input-password, #input-disabled, #input-placeholder
	width: 420px
	input-style()
#input-compact
	width: 420px
	input-style(size: 'compact')
#input-large
	width: 420px
	input-style(size: 'large')
#input-dark
	width: 420px
	input-style(style: 'dark')
```

## props
| prop | type | required | default | description |
|:-----|:-----|:---------|:--------|:------------|
| type | string | false | 'text' | native input type |
| name | string | true | | native input name |
| label | string | false | | floating label |
| placeholder | string | false | | native placeholder text |
| hint | string | false | | hint text |
| hintIsHtml | boolean | false | false | pass `hint` through `v-html` (potentially unsave) |
| icon | string | false | | mdi icon name to display |
| value | string\|number | false | '' | value (or use v-model) |
| disabled | boolean | false | false | disables input |
| readonly | boolean | false | false | sets native readonly, does not change visuals |
| validation | object | false | | vuelidate object (see validation) |

## slots

| slot | description |
|:-----|:------------|

## events

| event | args | description |
|:------|:-----|:------------|
| input | value | emitted on every keypress or input (or use v-model) |

## style mixin parameters
| parameter | type | default | description |
|:----------|:-----|:--------|:------------|
| style | 'light', 'dark' | 'link' | button style |
| size | 'dense', 'large', 'compact' | 'dense' | input size (compact does not reserve space for a hint) |
