---
title: radio
layoutClass: 'component'
---

# Scrollbars

## Playground

<div class="scrollbar">
	<Showcase
		componentName="bunt-scrollbars"
		:booleanPropShorthand="true"
		:props="{x: {type: 'boolean', value: true}, y: {type: 'boolean', value: true}}"
		:slots="{default: ''}"
	>
		<div class="scrolling-content"></div>
	</Showcase>
</div>

<style lang="sass">
.scrollbar .bunt-scrollbars
	height: 400px
	width: 400px
	flex: none
	.scrolling-content
		flex: none
		height: 1000px
		width: 1000px
</style>

