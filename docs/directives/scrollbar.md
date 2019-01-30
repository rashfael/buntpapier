---
title: v-scrollbar
---
# v-scrollbar

Uses native scrolling (`overflow: scroll`) but hides the native scrollbars and displays our own.

Works even with padding!

`v-scrollbar.x.y` : scrolling both axis

`v-scrollbar.x` | `v-scrollbar.y` : scrolling one axis

CAUTION: in pug, you need to use `v-scrollbar.x=""` (empty value)

<div class="scrollbar" v-scrollbar.x.y="">
	<div class="scrolling-content"></div>
	<div class="scrolling-content"></div>
	<div class="scrolling-content"></div>
</div>

<div class="scrollbar scrollbar-padding" v-scrollbar.x.y="">
	<div class="scrolling-content"></div>
	<div class="scrolling-content"></div>
	<div class="scrolling-content"></div>
</div>

<style lang="styl">
.scrollbar
	height: 400px
	width: 600px
	.scrolling-content
		height: 1000px
		width: 1000px
		background: radial-gradient(rgba(219,255,0,1) 0%, rgba(255,177,0,1) 12%, rgba(255,0,0,1) 21%, rgba(0,0,255,1) 33%, rgba(181,255,0,1) 56%, rgba(0,255,65,1) 66%, rgba(255,0,0,1) 85%, rgba(0,212,255,1) 100%)
	&.scrollbar-padding
		margin-top: 8px
		border: 2px solid black
		padding: 32px
</style>

```html
<div v-scrollbar.x.y="">
	<div></div>
	<div></div>
	<div></div>
</div>
```

## modifiers
| modifier | description |
|:---------|:------------|
| x | scroll x axis |
| y | scroll y axis |
