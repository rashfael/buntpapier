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

<bunt-checkbox id="chbox-slot" name="check-slot" v-model="check"> <b title="hello there">with any content!</b></bunt-checkbox>

<bunt-checkbox id="chbox-disabled" name="check-disabled" label="I'm disabled" v-model="check" :disabled="true"/>

### template
```html
<bunt-checkbox id="chbox-none" name="check-none" label="turn me ooooon" v-model="check" />
<bunt-checkbox id="chbox-small" name="check-small" label="I'm small!" v-model="check" />
<bunt-checkbox id="chbox-slot" name="check-slot" v-model="check"> <b title="hello there">with any content!</b></bunt-checkbox>
<bunt-checkbox id="chbox-disabled" name="check-disabled" label="I'm disabled" v-model="check" :disabled="true"/>
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
| value | boolean | false | false | value (or use v-model) |
| disabled | boolean | false | false | disables input |
| readonly | boolean | false | false | sets native readonly, does not change visuals |

## slots

| slot | description |
|:-----|:------------|
| default | label, if label prop is not set |

## events

| event | args | description |
|:------|:-----|:------------|
| input | value | emitted on every keypress or input (or use v-model) |

## style mixin parameters
| parameter | type | default | description |
|:----------|:-----|:--------|:------------|
| size | normal, small | normal | checkbox size |
