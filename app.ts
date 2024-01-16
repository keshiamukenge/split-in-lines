import SplitInLines from './src'

const elements = document.querySelectorAll<HTMLParagraphElement>('[data-text-animation="on-scroll"]')

// INTERSECTION OBSERVER
const intersectionObserver = new IntersectionObserver((entries) => {
	entries.forEach((entry, id) => {
		if(entry.isIntersecting) {
			const targetElement = entry.target as HTMLElement

			if(!targetElement.splitInLines?.isVisible) {
				targetElement.splitInLines?.slideUp()
			}
		}
	})
}, {
	threshold: 0.5
})

// RESIZE OBSERVER
let entriesSeen = new Set()

const resizeObserver = new ResizeObserver((entries) => {
	for (const entry of entries) {
		if (!entriesSeen.has(entry.target)) {
			// do nothing during initial call
			// just mark element as seen
			entriesSeen.add(entry.target);
		} else {
			const targetElement = entry.target as HTMLElement

			targetElement.splitInLines?.resize()
			
			if(targetElement.splitInLines?.isVisible) {
				targetElement.splitInLines?.slideUp()
			}
		}
	}
})

elements.forEach(element => {
	new SplitInLines(element)
	intersectionObserver.observe(element)
	resizeObserver.observe(element)
})



		
			