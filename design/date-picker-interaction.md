# Date Picker — Interaction Design

## 1. Problem

`bunt-date-picker` opens its calendar dialog when the input receives focus. Because the dialog is a native `<dialog>` opened with `showModal()`, this moves focus into the dialog and the backdrop intercepts clicks. Typing is effectively blocked.

Typing is a legitimate input mode for date fields. USWDS, one of the few design systems that states this explicitly:

> "Always allow a user to type in the date manually."
> "Whenever possible, keep the keyboard active so people can enter in the date information without having to use the picker."
> — [USWDS Date picker](https://designsystem.digital.gov/components/date-picker/)

Most other design systems do not state an explicit principle about this in their docs.

## 2. Scope

- **date-picker** (single date) — primary target.
- **date-range-picker** — parallel treatment; ranges are harder.
- **bunt-select** — out of scope for behavior change; included only to note it implements a different W3C variant.

## 3. W3C APG — combobox-datepicker pattern

### What the spec prescribes (verbatim)

Keyboard interaction for the combobox input — the entire keyboard table, one row:

| Key | Function |
|---|---|
| `Down Arrow, ALT + Down Arrow` | "Open the date picker dialog. If the combobox contains a valid date, moves focus to that date in the calendar grid. Otherwise, moves focus to current date, i.e., today's date." |

ARIA attributes on the `input`:

- `role="combobox"` — "Identifies the `input` element as a combobox."
- `aria-haspopup="dialog"` — "Indicates that the combobox opens a dialog."
- `aria-expanded="false"` / `aria-expanded="true"`
- `aria-autocomplete="none"` — "Indicates the combobox does not support autocomplete."
- `aria-controls="IDREF"`
- `aria-describedby="IDREF"`

Source: [APG combobox-datepicker example](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-datepicker/).

### What the spec example doesn't cover

The keyboard table has no entry for character keys. Text input into the example is possible, but typed values do not live-update the calendar grid — the picker only reflects them after the input loses and regains focus. So while the APG pattern technically supports typing, it does not provide a pattern for *integrated* typing-plus-picker. For that, we design beyond what the spec illustrates.

## 4. Library survey

### Shopify `<DateField>` web component

Official docs: [shopify.dev/.../forms/date-field](https://shopify.dev/docs/api/app-home/web-components/forms/date-field).

The docs list props/events but **do not document the interaction model** — how the calendar opens, how typing works, what keys do what.

Observed live behavior:

- Click on the input opens the calendar (not Tab-focus).
- Focus stays in the input; the displayed string is normalized to `YYYY-MM-DD`.
- `ArrowUp` / `ArrowDown` increments / decrements the currently-edited date segment.
- `ArrowLeft` / `ArrowRight` moves between year, month, and day segments.
- Implementation is a **single real `<input>`** with segment selection driven by JS — not multiple separate inputs or contenteditable spans. This preserves native copy / paste / select-all while giving segmented-UX on top.
- Segment-spinner behavior does not map cleanly to mobile software keyboards / touch — unusable on small screens.

### MUI X DatePicker

Official docs: [MUI X DatePicker](https://mui.com/x/react-date-pickers/date-picker/), [Base concepts](https://mui.com/x/react-date-pickers/base-concepts/).

Architecture, verbatim:
> "Each Picker is a combination of one Field and one or several Calendar / Clock components. For example, the `DatePicker` is the combination of the `DateField` and the `DateCalendar`."
> "For input editing with a popover or modal for mouse interaction, use the Picker components."
> "For input-only editing, use the Field components."

Responsive variants:
> "The desktop component (for example `DesktopDatePicker`) … renders the views inside a popover and a field for keyboard editing."
> "The mobile component (for example `MobileDatePicker`) … renders the view inside a modal and a field for keyboard editing."

Interaction specifics (when does the popover open? what key opens it? what happens when input is focused?) are not documented.

Observed behavior: Tab-focus lands on the input without opening the popover; click opens; typing works via segmented arrow-nav. Two tab stops: the whole input and the icon.

### USWDS Date picker

[USWDS Date picker](https://designsystem.digital.gov/components/date-picker/).

Explicit guidance, verbatim:
> "Always allow a user to type in the date manually."
> "Whenever possible, keep the keyboard active so people can enter in the date information without having to use the picker."

Known issue: *"Users had trouble correctly typing dates in the input field."*

Calendar grid keyboard, once opened:
> "Days use left and right arrows / Weeks use up and down arrows / Months by using page up and page down / Years by using shift + page up and shift + page down / Home and End keys navigate to the beginning and end of a week"

When the calendar opens is not documented.

### Adobe React Aria / React Spectrum

Segmented input, implemented as multiple `<span contenteditable>` elements with extensive per-segment ARIA. Four tab stops (year / month / day / icon).

Rationale, verbatim from [their blog](https://react-aria.adobe.com/blog/date-and-time-pickers-for-all):

> "Rather than a free-form text field, we render individually focusable segments for each date and time unit."
> "In practice, it is nearly impossible to reliably parse free form text that a user might enter into a date field when you consider all of these possible variations."
> "Each segment is also individually labeled for accessibility, so users always know which field they are on (e.g. 'year', 'month', 'day', etc.)."
> "This is much easier to use for screen reader users than a plain text field where the expected format is unknown."
> "For internationalization, individual segments avoid the problem of parsing dates in various formats entirely."
> "The date format is automatically determined based on the locale, and the user only needs to fill in the values and not worry about messing up the separators or getting the order wrong."
> "Finally, on mobile, we can take advantage of the numeric software keyboard, which is nicer to use than a full QWERTY keyboard."

Observed behavior: neither Tab-focus nor click opens the calendar; opening requires activating the trailing icon button.

### Ant Design DatePicker

[DatePicker docs](https://ant.design/components/date-picker/) do not document when the panel opens, typing behavior, or keyboard interaction.

Observed behavior:

- Tab-focus does not open the panel; click opens; focus stays on the input and accepts free-text typing.
- The range-input variant shows two focusable halves ("from" / "to") inside one shared visual outline, with a single dropdown that stays open as focus moves between them.

### Material 3 Date pickers

From the [M3 Accessibility page](https://m3.material.io/components/date-pickers/accessibility):

> "The calendar icon is the exclusive entry point for the date picker."

M3 is the only design system found that *explicitly* prescribes an icon-only trigger.

### Google Calendar

Google's own date input: clicking opens the picker, Tab-focus does not, focus stays in the input, typing works. Diverges from Material 3's icon-exclusive rule — here the whole input acts as a click target while preserving keyboard focus for typing.

### At-a-glance comparison

| System | Tab-focus opens? | Click on input opens? | Typing in input works? | Notes |
|---|---|---|---|---|
| Google Calendar | No | Yes | Yes (free text) | "Click-opens, Tab-focus preserves typing" pattern. |
| Ant Design DatePicker | No | Yes | Yes (parsing doesn't fire live) | Same pattern shape; notable range variant (see §6.2). |
| Fluent UI DatePicker | No | Yes | No — typing blocked | Click-triggered Model A; no typing path. |
| MUI X DatePicker | No (Tab lands on input) | Yes | Yes — segmented arrow-nav (yyyy/mm/dd) | Two tab stops: whole input, then icon. |
| Carbon DatePicker | Yes | Yes | Yes (free text) | Focus auto-opens. Tab *inside* the focused input moves focus into the picker — unusual, don't copy. |
| Adobe React Aria | No | No | Per-segment | Four tab stops (year / month / day / icon). Opens via icon button only. |
| PrimeVue DatePicker | Yes | Yes | Not noted | Auto-opens on focus. No icon by default. Full keyboard-behavior reference table in docs — a good model for our own docs (§6.4). |
| Shopify `<DateField>` | No | Yes | Yes — segmented arrow-nav | Single real `<input>` with JS-controlled selection. Breaks on mobile. |
| Vue3 Datepicker | No | Yes | No | Model A with click trigger. |
| Vuetify | — | — | — | No dropdown-under-input variant exists. |
| GitHub Primer | — | — | — | Storybook not publicly accessible; couldn't test. |

### Why docs rarely describe the open-trigger distinction

Most design-system docs talk about "when the calendar opens" without distinguishing how focus arrived. The implicit assumption seems to be that "focus" means "user clicked" — but tabbing through a form is also focus. The absence of written distinction is probably why behavior varies so much between systems: it falls out of the default browser behavior of form controls when the component doesn't explicitly override it.

### Summary

- **Principled, sourced in docs**: Adobe (segmented, with reasons), USWDS (typing-must-work), M3 (icon-exclusive).
- **Behavior-only, no written principle**: MUI, Shopify, Ant Design, Fluent UI, Carbon, PrimeVue.
- **Diverges from own guidance**: Google Calendar vs. M3.

There is no industry consensus. The design choice is open; this doc states our own reasoning.

## 5. Interaction models

Four live models, derived from §4.

### Model A — Display-only input, explicit trigger

- Input not typeable.
- Calendar opens on `Alt+Down`, `Down Arrow`, icon click, or (variant) anywhere on the input.
- Strict APG: icon / keyboard only. APG + click-anywhere variant: Fluent UI, Vue3 Datepicker.
- Doesn't support typing.

### Model B — Segmented input + calendar

Per-segment arrow behavior: `ArrowLeft` / `ArrowRight` move between segments, `ArrowUp` / `ArrowDown` increment / decrement.

Two implementation approaches, independent of UX:

- **Contenteditable-spans (Adobe React Aria)** — each segment is its own `<span contenteditable>` with extensive per-segment ARIA. Four tab stops. Native text semantics like select-all and copy-full-value require custom implementation.
- **Single-input with JS-controlled selection (Shopify `<DateField>`)** — one real `<input type="text">`. `ArrowLeft` / `ArrowRight` drive `selectionStart` / `selectionEnd` to highlight YYYY / MM / DD character ranges; `ArrowUp` / `ArrowDown` mutate the value. Native copy / paste / select-all / caret / undo all work because the primitive is a real `<input>`. Single tab stop.

### Model C — Free-text input + calendar popover

Input is a normal text field; typed freely; calendar is an assistive popup. Two variants by open trigger:

- **C1 — Focus auto-opens (Tab or click).** Carbon, PrimeVue. Breaks typing for Tab-in-and-type users.
- **C2 — Click-only opens; Tab-focus preserves typing.** Google Calendar, Ant Design.

## 6. Per-component decisions

### 6.1 date-picker

**Decision: Model B, single-input-with-JS-controlled-selection** (Shopify-inspired; "B-faux-segmented"). A single real `<input type="text">` whose selection is programmatically controlled on arrow-nav, giving segmented-UX affordances layered over a native text input primitive.

Why this over the alternatives:

- **vs. contenteditable-spans (React Aria)** — keeps native text-editing semantics: copy, paste, select-all, caret, undo all work because we're sitting on top of a real `<input>`. The contenteditable-spans approach re-implements all of that and spreads a single logical input across multiple tab stops.
- **vs. C2 (click-opens; Google Calendar / Ant Design)** — gets segmented arrow-nav UX (precise YYYY/MM/DD increment/decrement) *in addition to* free-text typing. C2 gives only the typing.
- **vs. A + click trigger** — supports typing at all.

#### Design points

1. **Input shape.** Single `<input type="text">`, displayed value is canonical YYYY-MM-DD while focused. Segment highlighting via `input.setSelectionRange(start, end)` on `ArrowLeft` / `ArrowRight`.
2. **Arrow semantics.**
   - `ArrowLeft` / `ArrowRight`: move to adjacent segment, re-select that segment's character range. At the left / right edge, let the caret behave natively (or cycle — TBD).
   - `ArrowUp` / `ArrowDown`: increment / decrement the currently-selected segment's value by 1 (day / month / year). Respects `minDate` / `maxDate` / `disabledDates`.
   - Left/right arrow when a non-segment range is selected (e.g. after select-all): deselect and return to caret mode.
3. **Native keys that must keep working.** Ctrl/Cmd+A (select-all), Ctrl/Cmd+C (copy), Ctrl/Cmd+V (paste), Ctrl/Cmd+X (cut), Ctrl/Cmd+Z (undo), Backspace, Delete, Home, End, typing digits and separators. Intercept only the four arrows when segment state is active.
4. **Paste handling.** On paste, run `parseInput(pastedText)`; if it yields a valid date, normalize to canonical form and replace. If not, accept the paste as raw text (free-text parse) and attempt parse on blur / Enter.
5. **Locale.** Segment order respects the locale's date format (YMD / DMY / MDY). Segment display format is canonical while focused; pretty-print when blurred is an enhancement (see below).
6. **Calendar-open trigger.**
   - **Tab / keyboard focus → does not open.** Typing path is preserved.
   - **Click anywhere on the input (text area OR icon) → opens the picker.** In the pointer tree, the icon is not a special-purpose button — it's part of the input's clickable area, styled to hint at the picker affordance.
   - **`Alt+Down` → opens the picker** (keyboard equivalent of clicking).
   - Click placing the caret *and* opening the picker are the same action; they coexist because the picker stays non-modal (see architectural implication).
   - **Icon is an explicit button in the a11y tree.** For screen-reader users, the icon is exposed as a `<button aria-label="Open calendar">` with `tabindex="-1"` — it doesn't clutter the Tab order but is reachable via the SR virtual cursor. Its click handler is identical to the input's; it exists to give SR users a labeled, activatable affordance they would not otherwise know about.

   **Architectural implication:** because click-opens-picker AND the user must continue typing in the input after clicking, the picker cannot trap focus. This rules out `<dialog>.showModal()` and pushes the picker to be a non-modal floating popover (matching bunt-select's use of `@floating-ui/vue`). Calendar-cell focus moves only on explicit user action (click a day), never automatically on open.

#### Enhancements (not v1)

- **Pretty-print when unfocused.** While blurred, render the value in a locale-pretty form ("Apr 23, 2026"); on focus, swap to canonical YYYY-MM-DD for editing. Display-only; underlying value is canonical. Shopify-inspired.
- **Wrap-around on segment edges.** `ArrowRight` on the day segment cycles to year. Low priority.
- **Type-over-segment.** Typing a digit when a segment is selected replaces that segment's value and auto-advances to the next segment when the segment is full.

#### Fallback

If B-faux-segmented proves too gnarly during implementation (particularly paste handling or cross-browser `setSelectionRange` quirks), **Model C2 is the fallback** — still delivers the "typing works" core requirement, without the segmented-UX benefits.

### 6.2 date-range-picker

Ant Design's range pattern: two logical inputs ("from" / "to") inside one visual input outline, sharing one picker dropdown that stays open as focus moves between them. Avoids two-separate-input awkwardness while keeping each half typeable.

**Decision:** adopt the same shape. Two typeable halves, one shared picker that stays open while focus moves between them. Each half is a B-faux-segmented date-picker per §6.1.

### 6.3 bunt-select

`bunt-select` implements a different W3C variant: [editable combobox with list autocomplete](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-autocomplete-list/). That example's keyboard table includes character keys and specifies the popup appears on typing. Typing filters options, and options must be visible during typing — so open-on-click (or open-on-focus) is correct for this variant.

No change proposed for bunt-select.

### 6.4 Documentation convention

PrimeVue's DatePicker docs include a dedicated **Accessibility** section with a full keyboard-behavior reference table (every key, what it does in each context). Adopt the same convention for `bunt-date-picker`, `bunt-select`, and every `bunt-*` component going forward, in the Buntpapier Showcase / component docs.

## 7. Mobile

### Overlay modal

On touch / small-viewport devices, tapping the input opens a full-screen overlay modal containing **both** the calendar and the editable date string at the top. Follows the Material 3 guideline: [M3 Date pickers — Modal input](https://m3.material.io/components/date-pickers/guidelines#c5c0471f-aa8a-4205-ab4b-1ab8cb893c5c).

Rationale:

- Consistent theming with desktop (vs. handing off to the native picker, which can't be themed).
- Works for both single and range pickers (no native `<input type="daterange">` exists).
- The editable string stays present in the modal, so the typing path (§6.1) remains available on mobile — not replaced by a calendar-only UI.
- Segment-spinner behavior that fails on compact mobile inputs is sidestepped: the segmented behavior operates inside the modal's roomier input.

### Mobile detection

- **CSS**: `@media (pointer: coarse)` for style / layout differences.
- **JS**: `window.matchMedia('(pointer: coarse)')` + a reactive wrapper for component logic (whether tapping the input opens the overlay modal or a desktop popover).
- **Viewport size** as a secondary cue if `pointer` alone doesn't match the need (e.g. tablet-with-keyboard edge cases).

## 8. Open questions

1. **Default parse formats.** ISO `YYYY-MM-DD` clearly in. Also accept locale-formatted (e.g. "23.04.2026", "Apr 23, 2026")? Paste will surface this — see §6.1 point 4.
2. **Segment-edge arrow behavior.** `ArrowRight` past the day segment — cycle to year, clamp, or let caret move past the input? (§6.1 point 2.)
3. **Type-over-segment** (§6.1 enhancement): ship in v1 or defer?
4. **Pretty-print-when-unfocused** (§6.1 enhancement): v1 or v2?
5. **Keyboard open shortcut.** `Alt+Down` only, or also bare `Down Arrow`? APG says both. `Down Arrow` conflicts with segment-spin semantics — so probably `Alt+Down` only.
6. **Keyboard navigation into the calendar.** With the picker non-modal and focus staying in the input, how do keyboard-only users reach the calendar grid?

   Working argument: they don't strictly need to. All interactions the calendar offers — selecting a specific date, advancing by day / week / month / year — are already expressible via segment-spin in the input (`ArrowUp` / `ArrowDown` on the appropriate segment). The calendar is a visual aid; keyboard users get an equivalent-power primitive in the input itself.

   What this leaves unresolved:
   - Month/year navigation buttons inside the calendar are useful for pointer users but redundant for keyboard users.
   - Preset buttons (if `presets` prop supplied) would need Tab-reach somehow, or be accepted as pointer-only.

   **Decision for v1:** leave the calendar grid non-tab-reachable. Keyboard users operate entirely through the input. Revisit if user feedback reveals a concrete need.

## 9. Implementation-time knowledge gaps

- Cross-browser behavior of programmatic `setSelectionRange` on `<input type="text">` during rapid interaction (arrow + click + paste interleaving). Well-specified in theory; edge cases worth testing.
- Non-modal popover behavior on mobile viewports, including interaction with the iOS on-screen keyboard.
- Safe-area / scrolling behavior of the mobile overlay modal (notches, home indicators, keyboard-over-input).

## 10. Sources

- [Date Picker Combobox Example — W3C APG](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-datepicker/)
- [Combobox Pattern — W3C APG](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)
- [Editable Combobox With List Autocomplete — W3C APG](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-autocomplete-list/)
- [USWDS Date picker](https://designsystem.digital.gov/components/date-picker/)
- [MUI X DatePicker](https://mui.com/x/react-date-pickers/date-picker/)
- [MUI X Base concepts](https://mui.com/x/react-date-pickers/base-concepts/)
- [Shopify `<DateField>` web component](https://shopify.dev/docs/api/app-home/web-components/forms/date-field)
- [Date and Time Pickers for All — Adobe React Aria blog](https://react-aria.adobe.com/blog/date-and-time-pickers-for-all)
- [Ant Design DatePicker](https://ant.design/components/date-picker/)
- [Material 3 Date pickers — Accessibility](https://m3.material.io/components/date-pickers/accessibility)
- [Material 3 Date pickers — Guidelines](https://m3.material.io/components/date-pickers/guidelines)
- [MDN `<input type="date">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date)
