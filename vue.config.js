const path = require('path')

module.exports = {
	// baseUrl: process.env.NODE_ENV === 'production'
	// 	? '/buntpapier/'
	// 	: '/',
	devServer: {
		host: 'localhost',
		port: 8080
	},
	configureWebpack: {
		entry: {
			app: './docs/main.js'
		},
		resolve: {
			modules: [path.resolve('src'), 'node_modules'],
		}
	},
	css: {
		loaderOptions: {
			stylus: {
				use: [require('./stylus')()]
			}
		}
	},

	lintOnSave: false
}
