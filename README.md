# buntpapier
collection of vue components
https://rashfael.github.io/buntpapier/

## Goals
Buntpapier aims to provide material design components for vue, with a focus on exposing variables and mixins via stylus.

It tries to minimize the use of components, opting for simple styling on DOM elements instead. Examples:

- Doesn't use the icon component internally, because it is literally one line of jade.
- Doesn't have components for cards/tables, provides stylus mixins instead.

Buntpapier tries to make the prefix configurable (working for vue and stylus, missing for jade classes)

## Inspiration
Buntpapier is heavily inspired by KeenUI and Material-UI.
