import ResizeObserver from './resize-observer'
import RippleInk from './ripple-ink'
import Scrollbar from './scrollbar'
import { install as installTooltop } from './tooltip'

export default function (app) {
	ResizeObserver(app)
	RippleInk(app)
	Scrollbar(app)
	installTooltop(app)
}
