---
title: v-tooltip
---
# v-tooltip

`v-tooltip="'text'"` shows on hover

`v-tooltip.bottom=""` control placement https://popper.js.org/popper-documentation.html#Popper.placements

`v-tooltip="{text: 'text', show: alwaysShow, placement: 'right', fixed: true}"` trigger show manually, set options programatically

`v-tooltip.fixed=""` use position: fixed to break free of stacking context (lags slightly when scrolling)

<div class="tooltips">
	<div class="tooltipable" v-tooltip.fixed="'HORRAY'">HOVER ME</div>
	<div class="tooltipable" v-tooltip.top="'HORRAY'">UP TOP</div>
	<div class="tooltipable" v-tooltip.left="'HORRAY'">LEFT</div>
	<div class="tooltipable" v-tooltip.right-end="'HORRAY'">RIGHT ON THE END</div>
</div>

<style lang="styl">
.tooltips
	display: flex
.tooltipable
	width: 100px
	border: 2px solid black
	padding: 8px
	margin: 8px 16px
</style>

```html
<div v-tooltip.fixed="'HORRAY'">HOVER ME</div>
<div v-tooltip.top="'HORRAY'">UP TOP</div>
<div v-tooltip.left="'HORRAY'">LEFT</div>
<div v-tooltip.right-end="'HORRAY'">RIGHT ON THE END</div>
```

## modifiers
| modifier | description |
|:---------|:------------|
| top,right,bottom,left (-end / -start) | tooltip placement |
| fixed | use `position: fixed` |
