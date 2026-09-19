# Why buntpapier?

buntpapier takes a different approach to letting devs style its components — "styling" referring to changing any aspect of a components appearance or presentation.

The majority of vue component libraries offer styling based on props, for example looking like this:

```html
<v-btn color="indigo" outlined large>Click Me!</v-btn>
```

This might not seem like a big problem, but it sacrifices a lot of power "classic" styling in CSS offers.

- Applying styles to multiple components at once with selectors is not possible, you need to set props on each component separately
- No cascade
- You can't build macros without wrapping the library component in your own

buntpapier was always built around a strong separation of concerns between template and style. In past versions, this was achieved by using the css preprocessor stylus. buntpapier v3 forgoes the use of stylus and bases styling completely on vanilla css custom properties.

buntpapier aims to provide an API that might become possible with vanilla CSS in a few years, now.

## CSS custom properties

Custom properties let appearance follow the cascade. One property can also control several derived values. This:

```css
.my-button {
	--button-color: purple
}
```

not only sets the button background color, but also:

- derives hover and pressed state colors
- picks a light or dark text label color for best contrast

More complex properties like

```css
.my-button {
	--button-size: huge
}
```

set multiple css properties like height, padding and font size.

Colour derivation now runs in CSS: relative colours derive hover and pressed states, and [contrast-color()](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/color_value/contrast-color) chooses black or white text on filled controls. JavaScript still adjusts accents used as text or outlined ink against the surrounding surface, where preserving the accent needs more than a black-or-white choice.

Keyword properties such as `--button-size: huge` still use a JavaScript bridge that reads computed styles and applies modifier classes. CSS [`if()`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/if) can express those choices directly, but does not yet work across our supported browsers. As native features cover each use case, we can remove the corresponding bridge while keeping the custom-property API.


## Bring Your Own Class System

buntpapier does not dictate how you use its custom properties. While I personally recommend using semantic classes for your components and styling them in SFCs, buntpapier does not stop you from creating a global `.btn-primary-huge` class and using it on multiple components.

