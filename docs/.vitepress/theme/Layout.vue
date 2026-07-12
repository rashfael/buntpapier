<script setup>
import { provide } from 'vue'
import { useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import ThemePicker from './ThemePicker.vue'

const { Layout: DefaultLayout } = DefaultTheme

const { frontmatter } = $(useData())
const { isDark } = useData()
let layout = $computed(() => frontmatter?.layoutClass)

// cross-fade the appearance flip (vitepress's VPSwitchAppearance injects this)
provide('toggle-appearance', () => {
	const flip = () => {
		isDark.value = !isDark.value
	}
	if (!document.startViewTransition) return flip()
	document.startViewTransition(flip)
})
</script>
<template lang="pug">
DefaultLayout(:class="[layout ? `layout-${layout}` : '']")
	template(#nav-bar-content-after)
		ThemePicker
</template>
<style lang="stylus">
</style>
