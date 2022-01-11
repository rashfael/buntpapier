import ResizeObserver from './resize-observer'
import RippleInk from './ripple-ink'
import Scrollbar from './scrollbar'
import Tooltip from './tooltip'

export default function (Vue) {
	ResizeObserver(Vue)
	RippleInk(Vue)
	Scrollbar(Vue)
	Tooltip(Vue)
}
