---
title: radio
---
# radio

<script>
export default {
	data () {
		return {
			check: false
		}
	}
}
</script>

<bunt-radio id="radio-one" name="radio" label="Pick me!" value="one" v-model="check" />
<bunt-radio id="radio-two" name="radio" label="No, pick me!" value="two" v-model="check" />
<bunt-radio id="radio-three" name="radio" label="Don't listen to them, pick me!" value="three" v-model="check" />

<style lang="styl">
</style>

### template
```html
<bunt-checkbox id="chbox-none" name="check-none" label="turn me ooooon" v-model="check" />
```

### style
```
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
has no mixin
