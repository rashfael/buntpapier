const alias = {
	add: 'plus',
	done: 'check',
	remove: 'minus',
	search: 'magnify',
	'help_outline': 'help-circle-outline'
}

export default {
	getClass (name) {
		if (!name) return ''
		return 'mdi-' + (alias[name] || name).replace('_', '-')
	}
}
