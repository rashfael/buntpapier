<script lang="ts">
export default {
	name: 'BuntProgressCircular'
}
</script>
<script setup lang="ts">
import { ref } from 'vue'
import { useComputedStyle } from '../computedStyle.js'

const el = ref()

useComputedStyle(el, {
	'--progress-size': 'size',
	'--progress-layout': 'layout',
}, ({ size, layout }) => {
	const style = {}
	const classes = []
	if (size) {
		classes.push(`bunt-progess-circular--size-${size}`)
	}
	if (layout) {
		classes.push(`bunt-progess-circular--layout-${layout}`)
	}

	return { style, classes }
})

</script>

<template lang="pug">
.bunt-progress-circular(ref="el")
	svg(viewBox="25 25 50 50")
		circle(cx="50", cy="50", r="20")
</template>
