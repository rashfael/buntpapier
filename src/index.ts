import initDirectives from './directives'

import Button from './components/button'
import Checkbox from './components/checkbox.vue'
import DatePicker from './components/date-picker/date-picker.vue'
import DateRangePicker from './components/date-picker/date-range-picker.vue'
import Input from './components/input.vue'
import ProgressCircular from './components/progress-circular.vue'
import Scrollbars from './components/scrollbars.vue'
import Select from './components/select.vue'

import './styles/colors.sass'
import './styles/index.sass'

const lib = {
	install (app) {
		initDirectives(app)
		app.component('BuntButton', Button)
		app.component('BuntCheckbox', Checkbox)
		app.component('BuntDatePicker', DatePicker)
		app.component('BuntDateRangePicker', DateRangePicker)
		app.component('BuntInput', Input)
		app.component('BuntProgressCircular', ProgressCircular)
		app.component('BuntScrollbars', Scrollbars)
		app.component('BuntSelect', Select)
	}
}

export default lib
export { useInputOutline } from './utils/input-outline'
export { refreshComputedStyles } from './themeWatcher'
export { deriveDarkVariant } from './utils/colors'
export {
	Temporal,
	parseDate,
	formatDMY,
	defaultDateRangePresets,
	defaultDatePresets
} from './components/date-picker/temporal'
export type { DateRange, DatePreset, WeekStart } from './components/date-picker/temporal'
