const path = require('path')

module.exports = {
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
		},
		module: {
			rules: [
				{
					test: /\.jade$/,
					loader: 'pug-plain-loader'
				}
			]
		},
	},
	css: {
		loaderOptions: {
			stylus: {
				use: [require('nib')(), require('rupture')(), require('autoprefixer-stylus')()]
			}
		}
	},

	lintOnSave: true
}
