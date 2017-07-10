var webpack = require('webpack')
var path = require('path')
var utils = require('./utils')
var stylusLoader = require('stylus-loader')
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
		extensions: ['.js', '.json', '.vue'],
		modules: [path.resolve(__dirname, "../src"), path.join(__dirname, '../node_modules')]
	},
	module: {
		rules: [
			
			{ test: /\.js$/, include: projectRoot, exclude: /node_modules\//, use: [{
				loader: 'babel-loader',
				options: {
					babelrc: false,
					presets: [
						['env', {
							modules: false,
							loose: true,
							targets: {
								chrome: 59
							}}],
						'stage-1',
					]
				}}]
			},
			{ test: /\.html$/, use: ['vue-html-loader'] },
			{ test: /\.(png|jpe?g|gif)(\?.*)?$/, use: [{
				loader: 'url-loader',
				options: {
					limit: 10000,
					name: utils.assetsPath('img/[name].[hash:7].[ext]')
				}
			}]},
			{ test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/, use: [{
				loader: 'url-loader',
				options: {
					limit: 10000,
					name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
				}
			}]}
		]
	},
	plugins: [
		new stylusLoader.OptionsPlugin({
			default: {
				use: [require('nib')(), require('rupture')(), require('autoprefixer-stylus')(), require('../stylus')()]
			},
		}),
		// needed for style tags in vue
		new webpack.LoaderOptionsPlugin({
			test: /\.vue$/,
			stylus: {
				default: {
					use: [require('nib')(), require('rupture')(), require('autoprefixer-stylus')(), require('../stylus')()]
				}
			},
		}),
	]
}
