---
title: button
---
# button

#### button styles
<bunt-button id="btn-none">default</bunt-button>
<bunt-button id="btn-primary">color</bunt-button>
<bunt-button id="btn-clear">clear</bunt-button>
<bunt-button id="btn-text-color">text color</bunt-button>
<bunt-button id="btn-disabled" :disabled="true">disabled</bunt-button>
### button sizes
<bunt-button id="btn-none">normal</bunt-button>
<bunt-button id="btn-large">large</bunt-button>
<bunt-button id="btn-huge">huge</bunt-button>
#### tooltip
<bunt-button id="btn-tooltip" tooltip="hoorrraaaa">tooltip</bunt-button>
<bunt-button id="btn-tooltip" tooltip="hoorrraaaa" tooltip-placement="right">tooltip right</bunt-button>
#### icon
<bunt-button id="btn-icon" icon="add">icon</bunt-button>
#### loading
<bunt-button id="btn-loading" :loading="true">a longish text</bunt-button>
#### error
<bunt-button id="btn-error" :error="true">a longish text</bunt-button>
<bunt-button id="btn-error" error-message="something went wrong">a longish text</bunt-button>
<style lang="styl">
#btn-none, #btn-tooltip, #btn-icon
	button-style()
#btn-primary, #btn-disabled, #btn-loading, #btn-error
	button-style(color: $clr-primary)
#btn-clear
	button-style(color: $clr-primary, style: 'clear')
#btn-text-color
	button-style(color: $clr-danger, text-color: $clr-warning)
#btn-large
	button-style(size: 'large')
#btn-huge
	button-style(size: 'huge')
</style>

### template
```html
<bunt-button id="btn-none">default</bunt-button>
<bunt-button id="btn-primary">color</bunt-button>
<bunt-button id="btn-clear">clear</bunt-button>
<bunt-button id="btn-text-color">text color</bunt-button>
<bunt-button id="btn-disabled" :disabled="true">disabled</bunt-button>

<bunt-button id="btn-none">normal</bunt-button>
<bunt-button id="btn-large">large</bunt-button>
<bunt-button id="btn-huge">huge</bunt-button>

<bunt-button id="btn-tooltip" tooltip="hoorrraaaa">tooltip</bunt-button>
<bunt-button id="btn-tooltip" tooltip="hoorrraaaa" tooltip-placement="right">tooltip right</bunt-button>

<bunt-button id="btn-icon" icon="add">icon</bunt-button>

<bunt-button id="btn-loading" :loading="true">a longish text</bunt-button>

<bunt-button id="btn-error" :error="true">a longish text</bunt-button>
<bunt-button id="btn-error" error-message="something went wrong">a longish text</bunt-button>
```

### style
```stylus
#btn-none, #btn-tooltip, #btn-icon
	button-style()
#btn-primary, #btn-disabled, #btn-loading, #btn-error
	button-style(color: $clr-primary)
#btn-clear
	button-style(color: $clr-primary, style: 'clear')
#btn-text-color
	button-style(color: $clr-danger, text-color: $clr-warning)
#btn-large
	button-style(size: 'large')
#btn-huge
	button-style(size: 'huge')
```

## props
| prop | type | required | default | description |
|:-----|:-----|:---------|:--------|:------------|
| type | string | false | 'button' | native button type |
| disabled | boolean | false | false | disables button (renders as disabled and does not emit click, other events and native events are unaffected) |
| icon | string | false | | mdi icon name to display |
| tooltip | string | false | | tooltip text |
| tooltip-placement | string | false | 'bottom' | tooltip placement, see v-tooltip directive documentation |
| tooltip-fixed | boolean | false | false | position tooltip fixed, see v-tooltip directive documentation |
| loading | boolean | false | false | show loading indicator and disable button |
| error | boolean | false | false | render the button error state |
| errorMessage | string | false | | render the button error state and show a message as open tooltip |
| text | string | false | | button text (recommended: use slot instead) |

## slots

| slot | description |
|:-----|:------------|
| default | button text |

## events

| event | args | description |
|:------|:-----|:------------|
| click | null | |

## style mixin parameters
| parameter | type | default | description |
|:----------|:-----|:--------|:------------|
| style | 'flat', 'clear' | 'flat' | button style |
| color | color | | background-color if flat style, text color if clear style|
| text-color | color | automagic | text-color is automatically chosen depending on lightness of color |
| size | 'normal', 'large', 'huge' | 'normal' | button size |
