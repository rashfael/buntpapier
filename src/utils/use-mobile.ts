import { ref, onMounted, onUnmounted } from 'vue'
import type { Ref } from 'vue'

// Reactive `pointer: coarse` detection. SSR-safe: returns false before mount.
export function useMobile (): Ref<boolean> {
	const isMobile = ref(false)
	let mql: MediaQueryList | null = null
	const listener = () => {
		if (mql) isMobile.value = mql.matches
	}

	onMounted(() => {
		if (typeof window === 'undefined') return
		mql = window.matchMedia('(pointer: coarse)')
		isMobile.value = mql.matches
		mql.addEventListener('change', listener)
	})

	onUnmounted(() => {
		mql?.removeEventListener('change', listener)
	})

	return isMobile
}
