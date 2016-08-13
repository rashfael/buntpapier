import Vue from 'vue'
import moment from 'moment'

const format = new Intl.NumberFormat('de-DE', {minimumFractionDigits: 2, maximumFractionDigits:2})
const dateFormat = 'DD. MM. YYYY'
const dateTimeFormat = 'DD. MM. YYYY hh:mm'

Vue.filter('pure-currency', {
	read: function(val) {
		if(val == null)
			return ''
		return format.format(val)
	},
	write: function(val, oldVal) {
		var number = parseFloat(val.replace(/\./g,'').replace(',','.'))
		return isNaN(number) ? 0 : number
	}
})

Vue.filter('currency', function(val) {
	if(val == null)
		return ''
	return format.format(val) + ' €'
})

Vue.filter('percentage', function(val) {
	if(val == null)
		return ''
	return (val*100).toFixed(2) + ' %'
})

Vue.filter('date', function(val) {
	if(val == null)
		return ''
	return moment(val).format(dateFormat)
})

Vue.filter('datetime', function(val) {
	if(val == null)
		return ''
	return moment(val).format(dateTimeFormat)
})
