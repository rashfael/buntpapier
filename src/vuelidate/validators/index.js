import { withParams, req } from 'vuelidate/lib/validators/common'
import { email as _email } from 'vuelidate/lib/validators'

const required = message => withParams({message: message}, req)
const email = message => withParams({message: message}, _email)

export {
	required,
	email
}
