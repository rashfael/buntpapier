// directive rendering ripple ink effect on element
// handles events implicitly

// TODO:
// - update/unmount hooks?

export default function (Vue) {
	Vue.directive('rippleInk', {
		created (el, binding, vnode, prevVnode) {
			const rippleContainer = document.createElement('div')
			rippleContainer.className = 'bunt-ripple-container'
			el.appendChild(rippleContainer)

			const ripple = document.createElement('div')
			ripple.className = 'bunt-ripple'
			rippleContainer.appendChild(ripple)

			async function rippleStartHandler (event) {
				ripple.classList.remove('bunt-ripple--leave')
				const { clientX, clientY } = event
				const {
					x: containerX,
					y: containerY,
					width: containerWidth,
					height: containerHeight
				} = el.getBoundingClientRect()
				const x = clientX - containerX
				const y = clientY - containerY
				const radius = Math.sqrt(Math.max(x, containerWidth - x) ** 2 + Math.max(y, containerHeight -y)**2)
				ripple.style.setProperty('--bunt-ripple-radius', `${radius}`)
				ripple.style.setProperty('--bunt-ripple-x', `${x}px`)
				ripple.style.setProperty('--bunt-ripple-y', `${y}px`)
				ripple.classList.add('bunt-ripple--active')
			}

			function rippleEndHandler () {
				ripple.classList.remove('bunt-ripple--active')
				ripple.classList.add('bunt-ripple--leave')
			}

			el.addEventListener('pointerdown', rippleStartHandler)
			el.addEventListener('pointerup', rippleEndHandler)
			el.addEventListener('pointerleave', rippleEndHandler)
		}
	})
}
