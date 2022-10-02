---
title: button
layout: 'component'
---

<script setup>
const slots = {
	default: {description: 'Button text. Leave empty to render icon button.'}
}
const props = {
	disabled: {type: 'boolean', default: false},
	icon: {type: 'string', description: 'To render just an icon button, leave slot empty.'},
	tooltip: {type: 'string'},
	loading: {type: 'boolean', default: false},
	error: {type: 'boolean', default: false},
	errorMessage: {type: 'string'},
	to: {type: ['string', 'object'], description: 'vue-router\'s router-link location. If set, renders a router-link component instead of a button element.'}
}
const style = {
	'--button-shape': {type: 'enum', values: ['pill', 'rounded', 'squared'], default: 'pill'},
	'--button-weight': {type: 'enum', values: [/* 'elevated', */ 'filled', 'outlined', 'text'], default: 'filled'},
	'--button-color': {type: 'color', default: 'var(--clr-primary)', computed: '--_button-color'},
	'--button-color-error': {type: 'color', default: 'var(--clr-danger)', computed: '--_button-color-error'},
	'--button-color-success': {type: 'color', default: 'var(--clr-success)', computed: '--_button-color-success'},
	'--button-text-color': {type: 'color', default: 'computed', computed: '--_button-text-color', description: 'Either --clr-primary-text-light or --clr-primary-text-dark, whichever has better contrast with --button-color'},
	'--button-size': {type: 'enum', values: ['normal', 'large', 'huge'], default: 'normal'},
	'--tooltip-placement': {type: 'enum', values: ['auto', 'top', 'right', 'bottom', 'left'], default: 'auto', description: 'Supports `-start` and `-end` suffix.'}
}
</script>

# Button

## Playground

<Showcase
	:editable="true"
	componentName="bunt-button"
	:slots="{default: 'Customize Me'}"
	:props="props"
	:style="style"
></Showcase>

## API

<ApiDocs :props="props" :style="style" :slots="slots"/>

## Examples

### Shape

<Showcase
	componentName="bunt-button"
	:slots="{default: 'default'}"
	:props="{}"
	:style="{
		'--button-shape': {type: 'enum', value: 'pill'}
	}"
></Showcase>

<Showcase
	componentName="bunt-button"
	:slots="{default: 'rounded'}"
	:props="{}"
	:style="{
		'--button-shape': {type: 'enum', value: 'rounded'}
	}"
></Showcase>

<Showcase
	componentName="bunt-button"
	:slots="{default: 'squared'}"
	:props="{}"
	:style="{
		'--button-shape': {type: 'enum', value: 'squared'}
	}"
></Showcase>

### Weight

<Showcase
	componentName="bunt-button"
	:slots="{default: 'filled'}"
	:props="{}"
	:style="{
		'--button-weight': {type: 'enum', value: 'filled'}
	}"
></Showcase>

<Showcase
	componentName="bunt-button"
	:slots="{default: 'outlined'}"
	:props="{}"
	:style="{
		'--button-weight': {type: 'enum', value: 'outlined'}
	}"
></Showcase>

<Showcase
	componentName="bunt-button"
	:slots="{default: 'text'}"
	:props="{}"
	:style="{
		'--button-weight': {type: 'enum', value: 'text'}
	}"
></Showcase>

### Size

<Showcase
	componentName="bunt-button"
	:slots="{default: 'normal'}"
	:props="{}"
	:style="{'--button-size': {type: 'enum', value: 'normal'}}"
></Showcase>

<Showcase
	componentName="bunt-button"
	:slots="{default: 'large'}"
	:props="{}"
	:style="{'--button-size': {type: 'enum', value: 'large'}}"
></Showcase>

<Showcase
	componentName="bunt-button"
	:slots="{default: 'huge'}"
	:props="{}"
	:style="{'--button-size': {type: 'enum', value: 'huge'}}"
></Showcase>

### Custom Color

<Showcase
	componentName="bunt-button"
	:slots="{default: 'color'}"
	:style="{
		'--button-color': {type: 'color', value: 'var(--clr-orange)'}
	}"
></Showcase>

<Showcase
	componentName="bunt-button"
	:slots="{default: 'color'}"
	:style="{
		'--button-color': {type: 'color', value: 'var(--clr-yellow)'},
		'--button-text-color': {type: 'color', value: 'var(--clr-red)'}
	}"
></Showcase>

### Icon

<Showcase
	componentName="bunt-button"
	:slots="{default: 'with icon'}"
	:props="{icon: {type: 'string', value: 'plus'}}"
></Showcase>

<Showcase
	componentName="bunt-button"
	:slots="{default: ''}"
	:props="{icon: {type: 'string', value: 'space-invaders'}}"
	:style="{}"
></Showcase>

<Showcase
	componentName="bunt-button"
	:slots="{default: ''}"
	:props="{icon: {type: 'string', value: 'space-invaders'}}"
	:style="{
		'--button-shape': {type: 'enum', value: 'rounded'}
	}"
></Showcase>

<Showcase
	componentName="bunt-button"
	:slots="{default: ''}"
	:props="{icon: {type: 'string', value: 'space-invaders'}}"
	:style="{
		'--button-shape': {type: 'enum', value: 'squared'}
	}"
></Showcase>

<Showcase
	componentName="bunt-button"
	:slots="{default: ''}"
	:props="{icon: {type: 'string', value: 'space-invaders'}}"
	:style="{
		'--button-weight': {type: 'enum', value: 'outlined'}
	}"
></Showcase>

<Showcase
	componentName="bunt-button"
	:slots="{default: ''}"
	:props="{icon: {type: 'string', value: 'space-invaders'}}"
	:style="{
		'--button-weight': {type: 'enum', value: 'text'}
	}"
></Showcase>

### Tooltip

<Showcase
	componentName="bunt-button"
	:slots="{default: 'hover me!'}"
	:props="{tooltip: {type: 'string', value: 'a tooltip!'}}"
	:style="{
		'--tooltip-placement': {type: 'enum', value: 'left'}
	}"
></Showcase>

### States

<Showcase
	componentName="bunt-button"
	:slots="{default: 'disabled'}"
	:props="{disabled: {type: 'boolean', value: true}}"
></Showcase>

<Showcase
	componentName="bunt-button"
	:slots="{default: 'loading loading'}"
	:props="{loading: {type: 'boolean', value: true}}"
></Showcase>

<Showcase
	componentName="bunt-button"
	:slots="{default: 'error'}"
	:props="{error: {type: 'boolean', value: true}}"
></Showcase>

<Showcase
	componentName="bunt-button"
	:slots="{default: 'error message'}"
	:props="{errorMessage: {type: 'string', value: 'something went wrong!'}}"
></Showcase>

<Showcase
	componentName="bunt-button"
	:slots="{default: 'router-link'}"
	:props="{to: {type: 'string', value: '/some-path'}}"
></Showcase>
