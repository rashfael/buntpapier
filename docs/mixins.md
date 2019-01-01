---
title: Stylus Mixins
---

# Stylus Mixins

## colors

buntpapier exposes material design color variables with the `$clr-` prefix:

```stylus
$clr-blue
$clr-red-700

$clr-success
$clr-warning
$clr-danger

# for light backgrounds
$clr-primary-text-light
$clr-secondary-text-light
$clr-disabled-text-light
$clr-dividers-light

# for dark backgrounds
$clr-primary-text-dark
$clr-secondary-text-dark
$clr-disabled-text-dark
$clr-dividers-dark
```

all color names here: https://www.materialui.co/colors

## card
<div class="mixin-card"> a card </div>

```stylus
.card-to-be
	card()
```

<style lang="styl">
.mixin-card
	card()
	margin: 8px
	height: 100px
	width: @height
</style>

### raised

<div class="mixin-card-raised"> a card </div>

```stylus
.card-to-be-raised
	card-raised()
```

<style lang="styl">
.mixin-card-raised
	card-raised()
	margin: 8px
	height: 100px
	width: @height
</style>

## shadows

<div class="mixin-shadow-bottom"> shadowing! </div>

```stylus
.shadow-on-top
	parting-shadow-bottom()
.shadow-on-bottom
	parting-shadow-top()
```

<style lang="styl">
.mixin-shadow-bottom
	margin: 16px 0
	parting-shadow-bottom()
</style>

## separators

<div class="mixin-separator"></div>

```stylus
.separator-on-top
	border-top: border-separator()
.separator-on-top-in-the-dark
	border-top: border-separator-dark()
```

<style lang="styl">
.mixin-separator
	margin: 16px 0
	height: 10px
	width: 100%
	border-top: border-separator()
</style>

## table
```stylus
table()
```
