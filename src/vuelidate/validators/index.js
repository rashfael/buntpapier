import { withParams, req } from 'vuelidate/lib/validators/common'
import { email as _email, minLength as _minLength } from 'vuelidate/lib/validators'

const required = message => withParams({message: message}, req)
const email = message => withParams({message: message}, _email)
const minLength = message => withParams({message: message}, _minLength)

export {
	required,
	email,
	minLength
}
