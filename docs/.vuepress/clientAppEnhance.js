import Buntpapier from '../../src/'
// import Vuelidate from 'vuelidate'
import 'roboto-fontface'
import 'typeface-roboto-mono'
import '@mdi/font/css/materialdesignicons.css'

export default ({
	Vue, // the version of Vue being used in the VuePress app
	options, // the options for the root Vue instance
	router, // the router instance for the app
	siteData // site metadata
}) => {
	Vue.use(Buntpapier)
	// Vue.use(Vuelidate)
}
