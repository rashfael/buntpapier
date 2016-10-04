var webpack = require('webpack')
var path = require('path')
var utils = require('./utils')
var projectRoot = path.resolve(__dirname, '../')

module.exports = {
	entry: {
		app: './docs/main.js'
	},
	output: {
		path: path.resolve(__dirname, '../dist'),
		publicPath: '',
		filename: '[name].js'
	},
	resolve: {
		extensions: ['', '.js', '.json', '.vue'],
		modules: [path.resolve(__dirname, "../src"), path.join(__dirname, '../node_modules')]
	},
	module: {
		loaders: [
			{ test: /\.vue$/, loader: 'vue' },
			{ test: /\.js$/, loader: 'babel', exclude: /node_modules\/(?!buntpapier)/,query: {presets: ['es2015']} },
			{ test: /\.json$/, loader: 'json' },
			{ test: /\.html$/, loader: 'vue-html' },
			{ test: /\.(png|jpe?g|gif|svg)(\?.*)?$/, loader: 'url',
				query: {
					limit: 10000,
					name: utils.assetsPath('img/[name].[hash:7].[ext]')
			}},
			{ test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/, loader: 'url',
				query: {
					limit: 10000,
					name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
			}}
		]
	},
	stylus: {
		use: [require('nib')(),require('rupture')(),require('autoprefixer-stylus')(), require('../stylus')()]
	},
	vue: {
		loaders: utils.cssLoaders()
	},
	// plugins: [
	// 	new webpack.LoaderOptionsPlugin({
	// 		vue: {
	// 			loaders: utils.cssLoaders()
	// 		},
	// 		stylus: {
	// 			use: [require('nib')(),require('rupture')(),require('autoprefixer-stylus')(), require('../stylus')()]
	// 		},
	// 	})
	// ]
}
