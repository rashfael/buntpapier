---
title: icon-button
---
# icon-button

#### button styles
<bunt-icon-button id="ibtn-none">add</bunt-icon-button>
<bunt-icon-button id="ibtn-primary">remove</bunt-icon-button>
<bunt-icon-button id="ibtn-clear">add</bunt-icon-button>
<bunt-icon-button id="ibtn-disabled" :disabled="true">add</bunt-icon-button>
#### tooltip
<bunt-icon-button id="ibtn-tooltip" tooltip="hoorrraaaa">tooltip-outline</bunt-icon-button>
<bunt-icon-button id="ibtn-tooltip" tooltip="hoorrraaaa" tooltip-placement="right">tooltip right</bunt-icon-button>

### template
```html
<bunt-icon-button id="ibtn-none">add</bunt-icon-button>
<bunt-icon-button id="ibtn-primary">remove</bunt-icon-button>
<bunt-icon-button id="ibtn-clear">add</bunt-icon-button>
<bunt-icon-button id="ibtn-disabled" :disabled="true">add</bunt-icon-button>

<bunt-icon-button id="ibtn-tooltip" tooltip="hoorrraaaa">tooltip-outline</bunt-icon-button>
<bunt-icon-button id="ibtn-tooltip" tooltip="hoorrraaaa" tooltip-placement="right">tooltip right</bunt-icon-button>
```

### style
```stylus
#ibtn-none, #ibtn-tooltip
	icon-button-style()
#ibtn-primary, #ibtn-disabled
	icon-button-style(color: $clr-primary)
#ibtn-clear
	icon-button-style(color: $clr-primary, style: 'clear')
```

## props
| prop | type | required | default | description |
|:-----|:-----|:---------|:--------|:------------|
| type | string | false | 'button' | native button type |
| disabled | boolean | false | false | disables button (renders as disabled and does not emit click, other events and native events are unaffected) |
| tooltip | string | false | | tooltip text |
| tooltip-placement | string | false | 'bottom' | tooltip placement, see v-tooltip directive documentation |
| tooltip-fixed | boolean | false | false | position tooltip fixed, see v-tooltip directive documentation |
| loading | boolean | false | false | show loading indicator and disable button |

## slots

| slot | description |
|:-----|:------------|
| default | mdi icon name |

## events

| event | args | description |
|:------|:-----|:------------|
| click | null | |

## style mixin parameters
| parameter | type | default | description |
|:----------|:-----|:--------|:------------|
| style | 'flat', 'clear' | 'flat' | button style |
| color | color | | background-color if flat style, text color if clear style|
