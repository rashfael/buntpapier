# Installation

```
npm install buntpapier
```

## Add to build chain
Buntpapier needs to be compiled with babel, pug, stylus and used with stylus.

Example vue-cli config
```js
module.exports = {
	transpileDependencies: ['buntpapier'],
	configureWebpack: {
		module: {
			rules: [
				{
					test: /\.pug$/,
					loader: 'pug-plain-loader'
				}
			]
		},
	},
	css: {
		loaderOptions: {
			stylus: {
				use: [require('buntpapier/stylus')()]
			}
		}
	}
}
```

Also buntpapier needs at least `@babel/plugin-proposal-optional-chaining`.

For example via a babel.config.js:
```js
module.exports = {
	presets: [
		'@vue/app'
	],
	plugins: [
		["@babel/plugin-proposal-optional-chaining", { "loose": false }],
		["@babel/plugin-proposal-nullish-coalescing-operator", { "loose": false }]
	]
}
```

## Load buntpapier into your projects stylus style
Example main.styl (only needed once)

```stylus
$clr-primary = $clr-green

variables()
normalize-css()
base()
typography()
components()
scrollbars()
```
