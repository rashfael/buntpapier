---
title: Validation
---

# Validation via vuelidate

`vuelidate` is required for validation.

Buntpapier provides validators with added parameters to define error messages in the validations definitions.

Currently available:

- required
- email
- minLength

<validation-example/>

```html
<template>
<form>
	<bunt-input v-model="name" name="name" label="enter a name"  :validation="$v.name" />
	<bunt-input v-model="email" name="email" label="enter a email"  :validation="$v.email" />
	<bunt-select v-model="validSelection" name="a-select" label="Select something" :options="['Okay']" :validation="$v.validSelection" />
</form>
</template>
<script>
import { required, email, minLength } from 'buntpapier/src/vuelidate/validators'

export default {
	name: 'validation-example',
	data () {
		return {
			name: '',
			validSelection: null
		}
	},
	validations: {
		name: {
			required: required('a man needs a name'),
			minLength: minLength(4, 'must be at least 4 chars long'),
		},
		email: {
			required: required('I wanna mail at you!'),
			email: email('not a valid mail')
		},
		validSelection: {
			required: required('I SAID SELECT SOMETHING')
		}
	},
}
</script>
```
