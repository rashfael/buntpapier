<script setup>
import { useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import ThemePicker from './ThemePicker.vue'

const { Layout: DefaultLayout } = DefaultTheme

const { frontmatter } = $(useData())
let layout = $computed(() => frontmatter?.layout)
</script>
<template lang="pug">
DefaultLayout(:class="[layout ? `layout-${layout}` : '']")
	template(#nav-bar-content-after)
		ThemePicker
</template>
<style lang="stylus">
</style>
