const alias = {
	add: 'plus',
	done: 'check',
	remove: 'minus'
}

export default {
	getClass (name) {
		if (!name) return ''
		return 'mdi-' + (alias[name] || name).replace('_', '-')
	}
}
