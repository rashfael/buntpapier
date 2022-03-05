---
title: progress-circular
---
# progress-circular

<bunt-progress-circular style="--progress-size: tiny" />
<bunt-progress-circular style="--progress-size: small" />
<bunt-progress-circular />
<bunt-progress-circular style="--progress-size: big" />
<bunt-progress-circular style="--progress-size: huge" />
<bunt-progress-circular style="--progress-size: huge; --progress-layout: center" />
<bunt-progress-circular style="--progress-size: huge; --progress-layout: page" />

### template
```html
<bunt-progress-circular size="tiny" />
<bunt-progress-circular size="small" />
<bunt-progress-circular />
<bunt-progress-circular size="big" />
<bunt-progress-circular size="huge" />
<bunt-progress-circular :center="true" size="huge" />
<bunt-progress-circular :page="true" size="huge"/>
```

### style
```
```

## props
| prop | type | required | default | description |
|:-----|:-----|:---------|:--------|:------------|
| size | 'normal','tiny','small','big','huge' | false | 'normal' | size |
| center | boolean | false | false | render as block and center |
| page | boolean | false | false | render as block and center with margin |

## slots

| slot | description |
|:-----|:------------|

## events

| event | args | description |
|:------|:-----|:------------|

## style mixin parameters
has no mixin
