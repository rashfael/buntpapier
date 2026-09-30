// Shared field wiring for the single-date and range pickers. Both present the same field two
// ways: a display textbox with a popover calendar, or the calendar on its own under `inline`.
// Whichever is showing is where the caller's id, name, ARIA and focus belong, so both components
// need the same routing, focus ownership, description merging and tab-stop rules. What genuinely
// differs — parsing, range selection, what counts as an empty model — stays in the components.

import { computed, watch } from 'vue'
import type { Ref } from 'vue'
import { useFieldRouting, useFieldFocus, mergeDescriptionIds } from '../../utils/field'

interface CalendarHandle {
	el?: HTMLElement
	focusDay: (options?: FocusOptions) => boolean
}

interface PickerFieldOptions {
	/** Component root. */
	root: Ref<HTMLElement>
	/** Display textbox, absent under `inline`. */
	input: Ref<HTMLInputElement>
	/** The CalendarPanel instance, whose root doubles as the named group under `inline`. */
	calendar: Ref<CalendarHandle>
	/** The popover element, so a disable can tell inside focus from outside focus. */
	popover: Ref<HTMLElement>
	inline: () => boolean
	disabled: () => boolean
	open: () => boolean
	label: () => string | undefined
	hint: () => string | undefined
	hintSlot: () => boolean
	/** True while the component renders its own keyboard-help text. */
	keyboardHelp?: () => boolean
	/** Closes the popover, optionally returning focus to the textbox. */
	close: (returnFocus: boolean) => void
	emit: (event: 'focus' | 'blur') => void
}

export function usePickerField (options: PickerFieldOptions) {
	const { root, input, calendar, popover, inline, disabled, open, label, hint, hintSlot, keyboardHelp, close, emit } = options
	const { id, attr, rootAttrs, inputAttrs } = useFieldRouting()

	// Whichever element is showing carries the caller's bindings and takes focus.
	const controlEl = computed(() => inline() ? calendar.value?.el : input.value)

	const hasHint = () => Boolean(hintSlot() || hint())
	const describedBy = () => mergeDescriptionIds(
		keyboardHelp?.() ? `${id()}-help` : undefined,
		hasHint() ? `${id()}-hint` : undefined
	)

	// A caller tabindex belongs to the showing element, so under `inline` it lands on the calendar's
	// named group. A negative one also takes the days out of the Tab sequence rather than giving
	// every day a tab stop. A popover calendar keeps its own roving stop either way: that one is the
	// component's, not the caller's.
	const callerTabindex = computed(() => attr('tabindex'))
	const tabbableDays = computed(() => !inline() || callerTabindex.value === undefined || Number(callerTabindex.value) >= 0)
	const groupTabindex = computed(() => callerTabindex.value ?? (disabled() ? 0 : -1))

	const { focused, focus: focusInput, available } = useFieldFocus(root, controlEl, emit, { repair: () => repairFocus() })

	function focusCalendar (focusOptions?: FocusOptions) {
		if (!disabled() && calendar.value?.focusDay(focusOptions)) return
		// A disabled calendar, or one whose focused day is not rendered, leaves the named
		// group as the only focus target.
		calendar.value?.el?.focus(focusOptions)
	}
	function repairFocus () {
		if (inline()) focusCalendar()
		else focusInput()
	}

	/** Focuses the textbox, or an inline calendar's focused day, without opening the popover. */
	function focus (focusOptions?: FocusOptions) {
		if (!available()) return
		if (inline()) focusCalendar(focusOptions)
		else focusInput(focusOptions)
	}

	// Disabling an open picker closes it without committing. Focus inside it comes back to the
	// showing element; focus elsewhere is the user's and stays put.
	watch(disabled, (value) => {
		if (!value || !open()) return
		close(Boolean(popover.value?.contains(document.activeElement)))
	})

	// Destructure this with $(): the reactivity transform unwraps focused, tabbableDays and
	// groupTabindex into plain values. Reading a bare ref in a script-side computed would always
	// be truthy. The attribute getters stay functions, because useAttrs is not reactive and they
	// have to be called during rendering.
	return {
		id,
		rootAttrs,
		/** Caller bindings for whichever element is showing. */
		controlAttrs: () => inputAttrs(describedBy(), label()),
		hasHint,
		tabbableDays,
		groupTabindex,
		focused,
		focus,
		focusCalendar
	}
}
