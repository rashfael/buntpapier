import { withParams, req, len } from 'vuelidate/lib/validators/common'
import { email as _email } from 'vuelidate/lib/validators'

const required = message => withParams({message: message}, req)
const email = message => withParams({message: message}, _email)
const minLength = (length, message) => withParams({message: message, min: length}, value => !req(value) || len(value) >= length)
const maxLength = (length, message) => withParams({message: message, max: length}, value => !req(value) || len(value) <= length)

export {
	required,
	email,
	minLength,
	maxLength
}
