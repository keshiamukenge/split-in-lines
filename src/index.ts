import gsap, { Expo } from 'gsap'

type TargetType = HTMLElement | undefined;

declare global {
  interface HTMLElement {
    splitInLines?: SplitInLines;
  }
}

export default class SplitInLines {
	element: HTMLElement
	isVisible: boolean
	params: {
		width: number
		words: string[]
		lines: NodeListOf<HTMLSpanElement> | []
	}

	constructor(target: TargetType) {
		if(!target) {
			console.warn('Target is null or undefined')
			
			return
		} else {
			this.params = {
				width: 0,
				words: [],
				lines: []
			}
			this.element = target
			this.isVisible = false;
			this.params.words = this.element.innerText.split(' ')
			this.create()
			
			this.element.splitInLines = this
		}
	}

	private create() {
		this.params.width = this.element.getBoundingClientRect().width

		this.clearElementContent()
		this.createLines()
	}

	private clearElementContent() {
		this.element.innerText = ''
	}

	private removeLastWord(text: string): string {
    var lastSpace = text.lastIndexOf(' ')

    if (lastSpace !== -1) {
      return text.substring(0, lastSpace)
    }

    return ''
	}

	private createEmptyLine() {
		let container = document.createElement('span')
		let content = document.createElement('span')

		container.style.display = content.style.display = 'block'
		container.style.overflow = 'hidden'
		content.style.transform = 'translateY(100%)'

		container.appendChild(content)

		return {
			container,
			content
		}
	}

	private createLines() {
		let line = this.createEmptyLine()
		let currentLineHeight = 0
		let previousLineHeight = 0

		this.params.words.forEach((word, id) => {
			line.content.innerText = `${line.content.innerText} ${word}`	
			this.element.appendChild(line.container)
			currentLineHeight = line.container.getBoundingClientRect().height
			
			if(previousLineHeight > 0 && currentLineHeight > previousLineHeight) {
				const text = this.removeLastWord(line.content.innerText)
				line.content.innerText = text + ' '

				// Add new line if latest word doesn't attached on DOM
				if(this.params.words.length === id + 1) {
					const latestLine = this.createEmptyLine()
					latestLine.content.innerText = word
					this.element.appendChild(latestLine.container)

					return
				}

				line = this.createEmptyLine()
				line.content.textContent = word
			}
				
			previousLineHeight = currentLineHeight
		})

		this.params.lines = this.element.querySelectorAll('span span')
	}

	public slideUp() {
		gsap.to(this.params.lines, {
			y: 0,
			duration: 1,
			stagger: 0.05,
			ease: Expo.easeOut,
			onComplete: () => {
				this.isVisible = true
			}
		})
	}

	public resize() {
		this.create()
	}
}