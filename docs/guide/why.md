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

Using custom properties to influence presentation of components gives us all features of CSS for free. While they seem powerful at first, custom properties are (currently) quite limited. Even simple things like setting a color on a button are more complex than you might expect. This:

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

Sadly, offering an API like this is currently not possible with CSS, but the csswg is working hard to add new features like [color-contrast()](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/color-contrast).

Until CSS add features to implement the buntpapier API natively, buntpapier relies on a few bits of javascript to make the magic happen.


## Bring Your Own Class System

buntpapier does not dictate how you use its custom properties. While I personally recommend using semantic classes for your components and styling them in SFCs, buntpapier does not stop you from creating a global `.btn-primary-huge` class and using it on multiple components.


