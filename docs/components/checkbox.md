---
title: checkbox
---
# checkbox

<script>
export default {
	data () {
		return {
			check: false
		}
	}
}
</script>

<bunt-checkbox id="chbox-none" name="check-none" label="turn me ooooon" v-model="check" />
<bunt-checkbox id="chbox-small" name="check-small" label="I'm small!" v-model="check" />

### template
```html
<bunt-checkbox id="chbox-none" name="check-none" label="turn me ooooon" v-model="check" />
<bunt-checkbox id="chbox-small" name="check-small" label="I'm small!" v-model="check" />
```

### style
```
#chbox-small
	checkbox-style(size: small)
```

## props
| prop | type | required | default | description |
|:-----|:-----|:---------|:--------|:------------|
| name | string | true | | native input name |
| label | string | false | | floating label |
| placeholder | string | false | | native placeholder text |
| value | boolean | false | false | value (or use v-model) |
| disabled | boolean | false | false | disables input |

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
| size | normal, small | normal | checkbox size |
