import { getTextMetrics } from '../helpers/text-metrics'

export default {
	data: function () {
		return {
			outlineStroke: ''
		}
	},
	computed: {
		floatingLabelWidth () {
			return this.label ? getTextMetrics(this.label, `12px 'Roboto', "Helvetica Neue", HelveticaNeue, Helvetica, Arial, sans-serif`).width + 8 : 0
		}
	},
	mounted () {
		// TODO redraw on changes
		this.$nextTick(() => {
			this.generateOutline()
		})
	},
	methods: {
		generateOutline () {
			const {width, height} = this.$refs.outline.getBoundingClientRect()
			const radius = 4
			const cornerWidth = radius + 1
			this.outlineStroke = `M ${cornerWidth} 1
			h ${width - 2 * cornerWidth}
			a ${radius} ${radius} 0 0 1 ${radius} ${radius}
			v ${height - 2 * cornerWidth}
			a ${radius} ${radius} 0 0 1 ${-radius} ${radius}
			h ${-width + 2 * cornerWidth}
			a ${radius} ${radius} 0 0 1 ${-radius} ${-radius}
			v ${-height + 2 * cornerWidth}
			a ${radius} ${radius} 0 0 1 ${radius} ${-radius}`
		}
	}
}
