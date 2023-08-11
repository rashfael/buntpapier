import { reactive, onMounted, onUnmounted } from 'vue'
import { registerHandler, unregisterHandler } from './requestAnimationFrameMuxxer.js'

export function useComputedStyle (el, customPropNames: {[key: string]: string}, computeStyle) {
	const customProps: any = reactive({})
	// TODO duplicate data structure?
	let prevComputedStyle = {}
	let prevComputedClasses = []

	const style = {}
	const classes = []

	const generateStyle = () => {
		if (!el.value) return
		let dirty = false
		const baseStyle = getComputedStyle(el.value)

		for (const [propName, key] of Object.entries(customPropNames)) {
			const value = baseStyle.getPropertyValue(propName).trim().replace(/'|"/g, '')
			if (customProps[key] !== value) {
				dirty = true
				customProps[key] = value
			}
		}
		if (!dirty) return
		const { style: computedStyle, classes: computedClasses } = computeStyle(customProps)

		// set computed styles
		for (const [propName, value] of Object.entries(computedStyle)) {
			el.value.style.setProperty(propName, value)
			style[propName] = value
		}

		// remove undefined styles
		for (const propName of Object.keys(prevComputedStyle)) {
			if (computedStyle[propName] == null) {
				el.value.style.removeProperty(propName)
				delete style[propName]
			}
		}

		// add new classes
		for (const className of computedClasses) {
			if (!prevComputedClasses.includes(className)) {
				el.value.classList.add(className)
			}
		}

		// remove old classes
		for (const className of prevComputedClasses) {
			if (!computedClasses.includes(className)) {
				el.value.classList.remove(className)
			}
		}

		prevComputedStyle = computedStyle
		prevComputedClasses = computedClasses
		classes.splice(0, classes.length, ...computedClasses)
	}
	onMounted(() => {
		generateStyle()
		const willChange = getComputedStyle(el.value).getPropertyValue('--bunt-will-change').trim() === 'all'
		if (willChange) registerHandler(generateStyle)
	})
	onUnmounted(() => {
		unregisterHandler(generateStyle)
	})

	// this is non-reactive on purpose
	// use this to preserve classes and style so they don't get nuked by vue
	return {
		classes,
		style,
		customProps
	}
}
