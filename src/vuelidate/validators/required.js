import {withParams, req} from 'vuelidate/lib/validators/common'
export default message => withParams({message: message}, req)
