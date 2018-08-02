const alias = {
	add: 'plus',
	done: 'check',
	remove: 'minus',
	search: 'magnify'
}

export default {
	getClass (name) {
		if (!name) return ''
		return 'mdi-' + (alias[name] || name).replace('_', '-')
	}
}
