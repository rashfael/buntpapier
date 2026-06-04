# Date Picker — Interaction Design Document

## 1. Problem

`bunt-date-picker` opens its calendar dialog when the input receives focus. Because the dialog is a native `<dialog>` opened with `showModal()`, this moves focus into the dialog and the backdrop intercepts clicks. Typing is effectively blocked.

Typing is a legitimate input mode for date fields. USWDS, one of the few design systems that states this explicitly:

> "Always allow a user to type in the date manually."
> "Whenever possible, keep the keyboard active so people can enter in the date information without having to use the picker."
> — [USWDS Date picker](https://designsystem.digital.gov/components/date-picker/)

Most other design systems (MUI, Ant Design, Shopify, Polaris, React Aria) do not state an explicit principle about this in their docs.

## 2. Scope

- **date-picker** (single date) — primary target.
- **date-range-picker** — parallel treatment; ranges are harder.
- **bunt-select** — out of scope for behavior change; included only to note it implements a different W3C variant.

## 3. Sourcing discipline for this doc

Every interaction claim below is either:
- **Quoted verbatim** from a primary source (spec, official docs, official blog), or
- **Observed**, attributed to who observed it (@rash's live testing), or
- **Not stated** — explicitly flagged when docs don't say.

Earlier drafts of this doc included interpretive claims about library behavior that turned out to be wrong. That's dropped.

## 4. W3C APG — combobox-datepicker pattern

### What the spec actually prescribes (verbatim)

Keyboard interaction for the combobox element (this is the entire keyboard table for the combobox — only one row):

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

### What the spec *doesn't* say

The combobox keyboard table has no entry for character keys. The example's combobox input is **not intended to be typed into** — the input is a display + dialog-trigger, not an editable text field. Earlier drafts of this doc called APG "the canonical answer" for our typing problem. That was wrong: the APG pattern, taken literally, does not solve typing — it just moves the open trigger off focus.

If we want typing, APG does not hand us a pre-made pattern. We're doing something beyond what the spec illustrates.

## 5. Library survey — primary sources only

### Shopify `<DateField>` web component

Official docs: [shopify.dev/.../forms/date-field](https://shopify.dev/docs/api/app-home/web-components/forms/date-field).

The docs list props/events but **do not document the interaction model** — how the calendar opens, how typing works, what keys do what. None of that is stated.

Live behavior, observed by @rash in the docs examples:
- Click on the input opens the calendar (not tab-focus).
- Focus stays in the input; the displayed string is normalized to `YYYY-MM-DD`.
- `ArrowUp` / `ArrowDown` increments / decrements the currently-edited date segment.
- `ArrowLeft` / `ArrowRight` moves between year, month, and day segments.
- Implementation is a **single real `<input>`** with segment *selection* driven by JS — not multiple separate inputs or contenteditable spans. This preserves native copy/paste/select-all while giving segmented-UX on top.
- **On mobile: doesn't work well.** (Segmented spinner behavior doesn't map cleanly to the mobile software keyboard / touch.)

### MUI X DatePicker

Official docs: [MUI X DatePicker](https://mui.com/x/react-date-pickers/date-picker/), [Base concepts](https://mui.com/x/react-date-pickers/base-concepts/).

Architecture is stated:
> "Each Picker is a combination of one Field and one or several Calendar / Clock components. For example, the `DatePicker` is the combination of the `DateField` and the `DateCalendar`."
> "For input editing with a popover or modal for mouse interaction, use the Picker components."
> "For input-only editing, use the Field components."

Responsive variants:
> "The desktop component (for example `DesktopDatePicker`) … renders the views inside a popover and a field for keyboard editing."
> "The mobile component (for example `MobileDatePicker`) … renders the view inside a modal and a field for keyboard editing."

Interaction specifics (when does the popover open? what key opens it? what happens when input is focused?) — **not stated** in the docs I fetched.

### USWDS Date picker

[USWDS Date picker](https://designsystem.digital.gov/components/date-picker/).

Verbatim guidance:
> "Always allow a user to type in the date manually."
> "Whenever possible, keep the keyboard active so people can enter in the date information without having to use the picker."

Known issue (verbatim): *"Users had trouble correctly typing dates in the input field."*

Calendar grid keyboard (once opened):
> "Days use left and right arrows / Weeks use up and down arrows / Months by using page up and page down / Years by using shift + page up and shift + page down / Home and End keys navigate to the beginning and end of a week"

When the calendar opens — **not stated** in the docs I fetched.

### Adobe React Aria / React Spectrum

Segmented input — implemented as multiple `<span contenteditable>` elements with extensive ARIA attributes per segment (@rash, DOM inspection). This is the opposite implementation choice from Shopify's single-input approach.

With explicit rationale quoted from [their blog](https://react-aria.adobe.com/blog/date-and-time-pickers-for-all):

> "Rather than a free-form text field, we render individually focusable segments for each date and time unit."
> "In practice, it is nearly impossible to reliably parse free form text that a user might enter into a date field when you consider all of these possible variations."
> "Each segment is also individually labeled for accessibility, so users always know which field they are on (e.g. 'year', 'month', 'day', etc.)."
> "This is much easier to use for screen reader users than a plain text field where the expected format is unknown."
> "For internationalization, individual segments avoid the problem of parsing dates in various formats entirely."
> "The date format is automatically determined based on the locale, and the user only needs to fill in the values and not worry about messing up the separators or getting the order wrong."
> "Finally, on mobile, we can take advantage of the numeric software keyboard, which is nicer to use than a full QWERTY keyboard."

Adobe's mobile claim (numeric keyboard → segmented is good on mobile) is worth testing against @rash's Shopify observation (segmented "doesn't work well on mobile"). These may not contradict — Adobe may have tuned focus/keyboard triggers more carefully. Without live testing, I can't tell.

### Ant Design DatePicker

[DatePicker docs](https://ant.design/components/date-picker/) — does not document when the panel opens, typing behavior, or keyboard interaction. **Not stated.**

### Material 3 Date pickers

[M3 Accessibility page](https://m3.material.io/components/date-pickers/accessibility), as reported by @rash:

> "The calendar icon is the exclusive entry point for the date picker."

(WebFetch couldn't read the live page — the site is JS-rendered — so this quote is relayed from @rash's reading, not independently verified by me.)

If accurate, M3 is the first design system we've found that *explicitly prescribes* the icon-only trigger, i.e., click on the input itself does **not** open the calendar.

### Data point: Google Calendar's own date input

@rash's observation: Google Calendar's date input opens the picker on *click*, not on tab-focus. Focus remains in the input, and typing works. Click opens the picker. (An earlier note in this doc said "autoexpand on focus" — corrected: it's click-only.)

Google's own product thus diverges from Material 3's "icon is exclusive" rule, but in a specific way — it makes the *whole input* act as the trigger for click, while preserving keyboard focus for typing.

### The pattern: "click opens, keyboard focus does not"

@rash flagged this as possibly recurring. It's worth isolating as a third pattern alongside "focus auto-opens" and "icon-only opens":

- **Mouse click on the input** → opens the calendar popup.
- **Tab / keyboard focus** → does *not* open; user can type immediately.
- **Typing** → never blocked.

Attempts to find written primary sources:

- **Fluent UI (Microsoft)** — a search-engine preview surfaced this sentence: *"String input is intended to be accomplished through keyboard navigation as mouse-clicking will open the picker."* Fetching the [actual spec file](https://github.com/microsoft/fluentui/blob/master/specs/Datepicker.md) did **not** reproduce that wording — the spec I could read only documents `Space/Enter` to open. So: plausibly matches, but I couldn't verify the quote against the primary source.
- **Carbon Design System** — [usage page](https://carbondesignsystem.com/components/date-picker/usage/) truncated in WebFetch; can't pull verbatim.
- **Native `<select>`** is a close analog that *does* behave this way and is specified this way: tab-focus does not open the dropdown; mouse click does; `Alt+Down` opens via keyboard. This is the HTML baseline for "click-opens, tab-focus-doesn't" on interactive form controls. Source: [HTML spec — select element](https://html.spec.whatwg.org/multipage/form-elements.html#the-select-element) and [MDN `<select>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select).
- **Native `<input type="date">`** has a partial form of this: tab-focus lands in the typeable segments without opening the calendar popup; clicking the calendar icon opens it. Click on the text segments themselves places the caret rather than opening.

### Why docs rarely describe the distinction

Most design-system docs talk about "when the calendar opens" without distinguishing how focus arrived. The implicit assumption seems to be that "focus" means "user clicked" — but of course tabbing through a form is also focus. The absence of written distinction is probably why this pattern feels under-documented despite being common: it falls out of the default browser behavior of form controls when the component doesn't explicitly override it.

### Hands-on test results (@rash, in-browser)

| System | Tab-focus opens? | Click on input opens? | Typing in input works? | Notes |
|---|---|---|---|---|
| Google Calendar | No | Yes | Yes (free text) | The target "click-opens, Tab-focus preserves typing" pattern. |
| Ant Design DatePicker | No | Yes | Yes (parsing didn't fire) | Matches the target pattern shape. Its range input is a strong reference — see §7.2. |
| Fluent UI DatePicker | No | Yes | No — typing blocked | Click-triggered Model A; no typing path. |
| MUI X DatePicker | No (Tab lands on input) | Yes | Yes — segmented arrow-nav (yyyy/mm/dd) | Two total tab stops: the whole input, then the icon. @rash: "better than React Aria." |
| Carbon DatePicker | Yes | Yes | Yes (free text) | Focus auto-opens. Tab *inside* the focused input moves focus into the picker — unusual. |
| Adobe React Aria DatePicker | No | No | Per-segment | Four tab stops (year / month / day / icon). @rash: "seems excessive." |
| PrimeVue DatePicker | Yes | Yes | Not noted | Auto-opens on focus. No icon by default. Has a detailed accessibility section with a full keyboard-behavior reference — see §7.4 takeaway. |
| Vue3 Datepicker (vue3datepicker.com) | No | Yes | No | Model A with click trigger; input can't be typed into. |
| Vuetify | — | — | — | No dropdown-under-input variant exists. |
| GitHub Primer | — | — | — | Storybook not publicly accessible; couldn't test. |

What the tests actually prove:

- **The "click opens, Tab-focus doesn't, typing works" pattern is live in at least two production systems** — Google Calendar and Ant Design. Previously unverified rumor; now confirmed.
- **Segmented input has two camps**: one tab-stop with internal arrow nav between segments (MUI) vs. one tab-stop per segment (Adobe, 4 total). MUI's shape is leaner.
- **"Model A + click trigger" is common** (Fluent UI, Vue3 Datepicker) — click opens anywhere on input, but typing is still blocked. Compromise between strict APG and typeable.
- **Carbon's "Tab inside input moves into picker"** is weird and shouldn't be copied.
- **Ant Design's range input** packs two focusable halves inside one input-outline with a single shared dropdown. Reference design for our range picker (§7.2).

### Summary of the field (revised)

- **Principled, sourced**: Adobe (segmented, with reasons), USWDS (typing-must-work), M3 (icon-exclusive, per @rash).
- **Behavior-only, no written principle**: MUI, Shopify, Ant Design, Fluent UI, Carbon, PrimeVue — verified by @rash in-browser.
- **Diverges from own guidance**: Google Calendar vs. M3.

The field is genuinely split; there is no industry consensus. We can pick based on what fits our users and state our own reasoning.

## 6. Viable interaction models

Based on §5 testing, four live models:

### Model A — Display-only input, explicit trigger

- Input not typeable.
- Calendar opens on `Alt+Down`, `Down Arrow`, icon click, or (variant) anywhere on the input.
- Strict APG: icon/keyboard only (no live examples tested). APG-plus-click variant: **Fluent UI, Vue3 Datepicker**.
- Doesn't solve typing.

### Model B — Segmented input + calendar

Per-segment arrow-key behavior: `ArrowLeft` / `ArrowRight` move between segments, `ArrowUp` / `ArrowDown` increment / decrement. Rationale quoted in §5 (Adobe blog).

Two distinct *implementation* approaches exist, independent of UX:

- **Contenteditable-spans (Adobe React Aria)** — each segment is its own `<span contenteditable>` with extensive per-segment ARIA. Four tab stops (year / month / day / icon). Native text semantics like select-all and copy-full-value either require custom implementation or don't work.
- **Single-input with JS-controlled selection (Shopify `<DateField>`)** — one real `<input type="text">`. `ArrowLeft` / `ArrowRight` drive `selectionStart` / `selectionEnd` to highlight the YYYY / MM / DD character ranges; `ArrowUp` / `ArrowDown` mutate the value. Native copy / paste / select-all / caret / undo all Just Work because we're sitting on a real `<input>`. Single tab stop.

MUI's DOM implementation isn't fully verified from the tests; behaviorally it resembles the single-input approach (two tab stops: whole input + icon, with internal segment nav) but confirming would need DOM inspection.

### What we're adopting: B-faux-segmented (Shopify-inspired)

Single-input with JS-controlled selection. Shopify's `<DateField>` is the live reference. The "faux" prefix is descriptive — segments are visual / interaction-level, not structural in the DOM.

Trade-off we inherit from Shopify: the segment-spin UX doesn't work well on compact mobile inputs. We address that separately via the overlay modal on mobile (§8), where the input has enough room and the segment UX is inside a roomier, focused context.

### Model C — Free-text input + calendar popover

Input is a normal text field; typed freely; calendar is an assistive popup. Parses free text (Adobe's parsing warning applies). Two live variants:

- **C1 — Focus auto-opens (Tab or click).** Carbon, PrimeVue. Breaks typing for Tab-in-and-type users.
- **C2 — Click-only opens; Tab-focus preserves typing.** Google Calendar, Ant Design. The "target pattern" we converged on.

### What our current code is

Our current code is trying to be Model C but layered on a `<dialog>` that opens on focus (C1-shaped, but the dialog-modal mechanics make it worse than C1 because it traps focus). Fixing the bug means picking a model deliberately.

## 7. Per-component decisions

### 7.1 date-picker

**Decision: Model B-faux-segmented, Shopify-inspired.** A single real `<input type="text">` whose selection is programmatically controlled on arrow-nav, giving segmented-UX affordances layered over a native text input primitive. Shopify's `<DateField>` is the live reference.

Why this over the alternatives considered earlier:

- **vs. contenteditable-spans (React Aria)** — keeps native text-editing semantics: copy, paste, select-all, caret, undo all Just Work because we're still sitting on top of a real `<input>`. The contenteditable-spans approach re-implements all of that (and, per @rash: "an insane amount of contenteditable spans with absurd aria attributes"). Also just one tab stop instead of four.
- **vs. C2 (click-opens; Google Calendar / Ant Design)** — gets the segmented arrow-nav UX (precise YYYY/MM/DD increment/decrement) *in addition to* free-text typing. C2 gives you only the typing.
- **vs. A + click trigger** — supports typing at all.

### Design points for B-faux-segmented

1. **Input shape.** Single `<input type="text">`, displayed value is canonical YYYY-MM-DD while focused. Segment highlighting via `input.setSelectionRange(start, end)` on `ArrowLeft` / `ArrowRight`.
2. **Arrow semantics.**
   - `ArrowLeft` / `ArrowRight`: move to adjacent segment, re-select that segment's character range. At the left / right edge, let the caret behave natively (or cycle — TBD).
   - `ArrowUp` / `ArrowDown`: increment / decrement the currently-selected segment's value by 1 (day / month / year). Respects `minDate` / `maxDate` / `disabledDates`.
   - Left/right arrow when a non-segment range is selected (e.g. after select-all): deselect and return to caret mode.
3. **Native keys that must keep working.** Ctrl/Cmd+A (select-all), Ctrl/Cmd+C (copy), Ctrl/Cmd+V (paste), Ctrl/Cmd+X (cut), Ctrl/Cmd+Z (undo), Backspace, Delete, Home, End, typing digits and separators. We intercept *only* the four arrows when segment state is active.
4. **Paste handling.** On paste, run `parseInput(pastedText)`; if it yields a valid date, normalize to canonical form and replace. If not, accept the paste as raw text (fall back to C-style free-text parse) and attempt parse on blur / Enter.
5. **Locale.** Segment order must respect the locale's date format (YMD / DMY / MDY). Segment *display* format is canonical while focused; pretty-print when blurred is an **enhancement** (see below).
6. **Calendar-open trigger.**
   - **Tab / keyboard focus → does not open.** Typing path is preserved.
   - **Click anywhere on the input (text area OR icon) → opens the picker.** In the pointer tree, the icon is not a special-purpose button — it's part of the input's clickable area, styled to hint at the picker affordance. This matches the C2 pattern (Google Calendar, Ant Design).
   - **`Alt+Down` → opens the picker** (keyboard equivalent of clicking).
   - Click placing the caret *and* opening the picker are the same action — they coexist because the picker stays non-modal (see architectural note below).
   - **Icon is an explicit button in the a11y tree.** For screen-reader users, the icon is exposed as a `<button aria-label="Open calendar">` with `tabindex="-1"` (so it doesn't clutter the Tab order) but reachable via the SR virtual cursor. Its click handler is identical to the input's click handler — it just provides a labeled, activatable affordance for SR users who wouldn't otherwise know that clicking the input opens a picker.

   **Architectural implication:** because click-opens-picker AND the user must continue typing in the input after clicking, the picker **cannot trap focus**. Our current `<dialog>` + `showModal()` approach traps focus by definition. This decision pushes us away from a modal dialog toward a **non-modal floating popover** (as bunt-select already uses via `@floating-ui/vue`). Calendar-cell focus moves *only* on explicit user action (click a day, or a new keyboard shortcut), never automatically on open.

### Enhancement ideas (not v1)

- **Shopify-style pretty-print when unfocused.** While blurred, render the value in a locale-pretty form ("Apr 23, 2026"); on focus, swap to canonical YYYY-MM-DD for editing. Display-only; underlying value is canonical. Kept as a v2 enhancement.
- **Wrap-around on segment edges.** `ArrowRight` on the day segment could cycle to year. Low priority.
- **Type-over-segment.** Typing a digit when a segment is selected replaces that segment's value and auto-advances to the next segment when the segment is full. Worth prototyping.

### Fallback

If B-faux-segmented proves too gnarly during implementation (particularly paste handling or cross-browser `setSelectionRange` quirks), **C2 is the fallback** — still delivers on the "typing works" core requirement, without the segmented-UX benefits. Revisit if we hit a wall.

### 7.2 date-range-picker

Ant Design's range pattern (@rash, in-browser): two logical inputs ("from" / "to") inside one visual input outline, sharing one picker dropdown that stays open as focus moves between them. Avoids two-separate-input awkwardness while keeping each half typeable.

**Decision:** adopt the same shape. Two typeable halves, one shared dialog that stays open while focus moves between them. Each half is a B-faux-segmented date-picker per §7.1.

### 7.3 bunt-select

`bunt-select` maps to a different W3C variant: **editable combobox with list autocomplete** — [APG example](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-autocomplete-list/). That example's keyboard table includes character keys and specifies the popup appears on typing. Typing filters options, and options must be visible during typing — so open-on-click (or open-on-focus) is correct for this variant.

No change proposed for bunt-select.

### 7.4 Documentation convention takeaway

PrimeVue's DatePicker docs include a dedicated **Accessibility** section with a full keyboard-behavior reference table (every key, what it does in each context). @rash's call-out: we should do the same for `bunt-date-picker`, `bunt-select`, and every `bunt-*` component going forward. This is a convention to adopt in the Buntpapier Showcase / component docs, not specific to this change, but worth recording here so it isn't lost.

## 8. Mobile and native controls

### Decision: mobile overlay modal

On touch / small-viewport devices, tapping the input opens a full-screen overlay modal containing **both** the calendar and the editable date string at the top. This follows the Material 3 guideline: [M3 Date pickers — Modal input](https://m3.material.io/components/date-pickers/guidelines#c5c0471f-aa8a-4205-ab4b-1ab8cb893c5c).

Rationale:

- Consistent theming with desktop (vs. handing off to the native picker, which can't be themed).
- Works for both single and range pickers (no native `<input type="daterange">` exists).
- The editable string stays present in the modal, so the typing path (B-faux-segmented) remains available on mobile — not replaced by a calendar-only UI.
- Segment-spinner behavior that failed on mobile in Shopify's `<DateField>` is avoided because the segmented behavior operates inside the modal's input, with enough space and a clear focused context.

### Mobile detection

This introduces a new requirement: detecting "mobile" / touch-primary at runtime.

- **CSS**: `@media (pointer: coarse)` for style / layout differences.
- **JS**: `window.matchMedia('(pointer: coarse)')` + a reactive wrapper for component logic (whether tapping the input opens the overlay modal vs. a desktop popover).
- **Viewport size** as a secondary cue if `pointer` alone doesn't match the need (e.g. tablet-with-keyboard edge cases).

Exact wiring is an implementation detail — the design commitment is "mobile detection is a dependency of this change."

### Knowledge gaps remaining

- Our current `<dialog>`-based modal on mobile — does `showModal()` behave OK on small viewports, especially with the iOS on-screen keyboard opening over it? To verify during implementation.
- Safe-area insets (notches / home indicators) and scrolling behavior of a full-screen modal containing calendar + input need thought.

## 9. Open questions

Resolved:
- ~~Which interaction model?~~ → **B-faux-segmented** (§7.1). C2 is fallback.
- ~~Date-range-picker shape?~~ → **Ant-Design-style two halves + shared dialog** (§7.2).
- ~~Mobile strategy?~~ → **Overlay modal with calendar + editable string, per M3** (§8).

Still open:

1. **Default parse formats.** ISO `YYYY-MM-DD` clearly in. Also accept locale-formatted (e.g. "23.04.2026", "Apr 23, 2026")? Paste will surface this — see §7.1 point 4.
2. **Segment-edge arrow behavior.** `ArrowRight` past the day segment — cycle to year, clamp, or let caret move past the input? (§7.1 point 2.)
3. **Type-over-segment** (§7.1 enhancement): ship in v1 or defer?
4. **Pretty-print-when-unfocused** (§7.1 enhancement, Shopify-inspired): v1 or v2?
5. **Keyboard open shortcut.** `Alt+Down` only, or also bare `Down Arrow`? APG says both. `Down Arrow` conflicts with our segment-spin semantics — so probably `Alt+Down` only.
6. **Keyboard navigation into the calendar.** With the picker now non-modal and focus staying in the input, how do keyboard-only users reach the calendar grid?

   Working argument: **they don't strictly need to.** All interactions the calendar offers — selecting a specific date, advancing by day / week / month / year — are already expressible via segment-spin in the input (`ArrowUp` / `ArrowDown` on the appropriate segment). The calendar is a visual aid; keyboard users get an equivalent-power primitive in the input itself.

   What this leaves unresolved:
   - Month/year *navigation* buttons inside the calendar (prev/next) are still useful for pointer users browsing dates. Keyboard users can achieve the same via segment-spin, so they don't need to reach those buttons — but if they try to, what happens? Tab-trap-free means focus just leaves the input and moves to the next form field, skipping the calendar entirely. Probably fine.
   - Preset buttons in the calendar (if `presets` prop supplied) — same question. Keyboard users would need to Tab into them somehow, or we accept that presets are pointer-only.
   - Date-cell selection via mouse stays trivially possible; via keyboard, it's redundant with segment-spin.

   **Decision for v1:** leave the calendar grid non-tab-reachable. Keyboard users operate entirely through the input. Revisit if user feedback reveals a concrete need.

## 10. Knowledge gaps — status

Resolved by @rash's testing:
- MUI DatePicker click / typing behavior — click opens popover, typing works via segmented arrow-nav.
- Fluent UI / Carbon / Ant Design / PrimeVue / React Aria / Vue3 Datepicker click-vs-Tab-focus behavior — see §5 table.
- Whether Google Calendar auto-opens on focus — no, click-only.

Still open, to resolve during implementation:
- Cross-browser behavior of programmatic `setSelectionRange` on `<input type="text">` during rapid interaction (arrow + click + paste interleaving). Well-specified in theory; edge cases worth testing.
- `<dialog>` + `showModal()` behavior on mobile viewports, including interaction with the iOS on-screen keyboard.
- Safe-area / scrolling behavior of the mobile overlay modal.

## 11. Sources

- [Date Picker Combobox Example — W3C APG](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-datepicker/)
- [Combobox Pattern — W3C APG](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)
- [Editable Combobox With List Autocomplete — W3C APG](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-autocomplete-list/)
- [USWDS Date picker](https://designsystem.digital.gov/components/date-picker/)
- [MUI X DatePicker](https://mui.com/x/react-date-pickers/date-picker/)
- [MUI X Base concepts](https://mui.com/x/react-date-pickers/base-concepts/)
- [Shopify `<DateField>` web component](https://shopify.dev/docs/api/app-home/web-components/forms/date-field)
- [Date and Time Pickers for All — Adobe React Aria blog](https://react-aria.adobe.com/blog/date-and-time-pickers-for-all)
- [Ant Design DatePicker](https://ant.design/components/date-picker/)
- [Material 3 Date pickers — Accessibility](https://m3.material.io/components/date-pickers/accessibility) (page is JS-rendered; quote relayed by @rash)
- [MDN `<input type="date">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date)
