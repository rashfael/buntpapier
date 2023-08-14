---
title: switch
---
# switch

<script>
export default {
	data () {
		return {
			switchValue: false
		}
	}
}
</script>

<bunt-switch id="switch-none" name="switch-none" label="turn me ooooon" v-model="switchValue" />

### template
```html
<bunt-switch id="switch-none" name="switch-none" label="turn me ooooon" v-model="switch" />
```

### style
```
```

## props
| prop | type | required | default | description |
|:-----|:-----|:---------|:--------|:------------|
| name | string | true | | native input name |
| label | string | false | | floating label |
| value | boolean | false | false | value (or use v-model) |
| disabled | boolean | false | false | disables input |
| readonly | boolean | false | false | sets native readonly, does not change visuals |

## slots

| slot | description |
|:-----|:------------|

## events

| event | args | description |
|:------|:-----|:------------|
| input | value | emitted on every keypress or input (or use v-model) |

## style mixin parameters
has no mixin
