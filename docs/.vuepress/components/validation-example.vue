<template lang="pug">
form
	bunt-input(name="name", label="enter a name", v-model="name", :validation="$v.name")
	bunt-input(name="email", label="enter your email", v-model="email", :validation="$v.email")
	bunt-select(name="a-select", label="Select something", v-model="validSelection", :options="['Okay']", :validation="$v.validSelection")
</template>
<script>
import { required, email, minLength } from '../../../src/vuelidate/validators'

export default {
	name: 'validation-example',
	data () {
		return {
			name: '',
			email: '',
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
<style lang="stylus">
</style>
