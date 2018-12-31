<template lang="pug">
.bunt-input-outline-container(:class="{focused}", :style="{'--label-gap': floatingLabelWidth}", v-resize-observer="generateOutline")
	label {{label}}
	slot(:focus="focus", :blur="blur")
	svg.outline(ref="outline")
		path(:d="outlineStroke")
</template>
<script>
import inputOutline from './mixins/input-outline'

export default {
	name: `bunt-input-outline-container`,
	mixins: [inputOutline],
	props: {
		label: String
	},
	data () {
		return {
			focused: false
		}
	},
	computed: {},
	created () {},
	mounted () {
		this.$nextTick(() => {
		})
	},
	methods: {
		focus () {
			this.focused = true
		},
		blur () {
			this.focused = false
		}
	}
}
</script>
