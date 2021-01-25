---
title: link-button
---
# link-button

<bunt-link-button id="lbtn-none" :to="{name: 'derp'}">it's a link</bunt-link-button>
<bunt-link-button id="lbtn-primary" :to="{path: '/'}">with color!</bunt-link-button>

### template
```html
<bunt-link-button id="lbtn-none" :to="{name: 'derp'}">it's a link</bunt-link-button>
<bunt-link-button id="lbtn-primary" :to="{path: '/'}">with color!</bunt-link-button>
```

### style
```stylus
#lbtn-none
	link-button-style()
#lbtn-primary
	link-button-style(color: $clr-primary)
```

## props
| prop | type | required | default | description |
|:-----|:-----|:---------|:--------|:------------|
| to | object | true | null | router-link `to` prop |

## slots

| slot | description |
|:-----|:------------|
| default | button text |

## events

| event | args | description |
|:------|:-----|:------------|

## style mixin parameters
| parameter | type | default | description |
|:----------|:-----|:--------|:------------|
| style | 'flat', 'clear' | 'flat' | button style |
| color | color | | background-color if flat style, text color if clear style|
| text-color | color | automagic | text-color is automatically chosen depending on lightness of color |
| size | 'normal', 'large', 'huge' | 'normal' | button size |
