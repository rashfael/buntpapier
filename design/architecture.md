# Architecture direction

The intended architecture uses native platform primitives with a small internal behavior layer. The current alpha still has the JavaScript bridges and positioning dependencies described below. Verify the required browser feature subset when implementing a native replacement.

## Platform and component boundaries

The planned browser floor is Chrome 147+, Firefox 147+ and Safari 26+, with no legacy support. A major-version floor alone does not prove support for every subfeature: invoker commands and popover source handling need their own checks. Native popovers, CSS anchors and `<dialog>` are the intended overlay foundation. In-tree overlays preserve inherited theme context and remove the need for the select's theme forwarding and host teleport target once migration is verified.

The [API guide](api-guide.md) owns the props/CSS boundary and ordinary/primed authoring model. The [bridge inventory](js-bridge-inventory.md) owns what JavaScript still does and the conditions for retiring each bridge. `useComputedStyle` retains its call signature while the observer replacement remains undecided. The current implementation still uses Floating UI for select, Popper for tooltip, root theme notifications and optional per-frame polling.

## Behavior layer

Use internal behavior composables where shared interaction justifies them. Native elements own the positioning, stacking and modal behavior they can supply; JavaScript supplies keyboard navigation, selection, focus reconciliation, announcements and synchronization with application state. This does not promise a public `useX()` for every component. Optional primed workflows follow the [API decision](api-design.md).

The plan considered Reka/Radix, Ark/Zag and Headless UI instead of an in-house behavior layer. It rejected adopting a whole headless core because the surveyed overlay APIs coupled broad component interfaces to positioning and layering stacks that the chosen native architecture replaces. A dependency earns its place through a small interface and substantial implementation. The accepted cost is owning the remaining interaction behavior and its browser and assistive-technology verification.

Those package assessments were research from September 2026, not permanent claims about their releases. Reconsider if Reka offers positioning-independent popover/dialog primitives or Zag's next major supplies a compatible boundary. `focus-trap` remains an option only if an actual non-modal contained-focus workflow needs it; there is no current consumer.

Use other libraries' interaction sources as evidence when designing focus, dismissal, listbox and announcement behavior. Browser and assistive-technology workarounds need verification for our supported combinations before adoption. The date pickers already demonstrate why a blanket native API rule is insufficient: Firefox source-based popover focus ordering requires the explicit entry/return behavior documented in the [interaction record](date-picker-interaction.md).
