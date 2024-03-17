<template lang="pug">
router-link(:to="to", custom, v-slot="{ href, navigate, isActive, isExactActive }")
	a.bunt-link-button(v-bind="$attrs", :class="{'router-link-active': isActive, 'router-link-exact-active': isExactActive}", :href="href", @click="navigate($event); $emit('click', $event)")
		slot
		ripple-ink
</template>
<script>
import RippleInk from './mixins/ripple-ink'

export default {
	name: `bunt-link-button`,
	components: {},
	mixins: [
		RippleInk
	],
	props: {
		to: Object
	},
	emits: ['click']
}
</script>
