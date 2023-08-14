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

### template
```html
<bunt-radio id="radio-one" name="radio" label="Pick me!" value="one" v-model="check" />
```

### style
```
```

## props
| prop | type | required | default | description |
|:-----|:-----|:---------|:--------|:------------|
| name | string | true | | native input name |
| label | string | false | | floating label |
| checked | any | false | false | checked value (or use v-model) |
| value | any | false | false | value to emit |
| disabled | boolean | false | false | disables input |
| readonly | boolean | false | false | sets native readonly, does not change visuals |

## slots

| slot | description |
|:-----|:------------|

## events

| event | args | description |
|:------|:-----|:------------|
| change | value | emitted on every input (or use v-model) |

## style mixin parameters
has no mixin
