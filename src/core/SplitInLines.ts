import Resize, { type SizeCallbackParameters, type SizeCallback } from '~/helpers/Resize'
import { measureText } from '~/utils/measure'

export interface SplitInLinesParameters {
	containerClass?: string
	wrapperClass?: string
	immediate?: boolean
}

export default class SplitInLines {
	public element: HTMLElement
	public text: string
	private words: {
		text: string
		width: number
	}[]
	private elementWidth: number
	private spaceMeasure: Awaited<ReturnType<typeof measureText>>
	private spaceWidth: number
	private resize: Resize | undefined
	public lines: string[]
	private containerClass: string
	private wrapperClass: string
	private immediate: boolean
	public splited: boolean
	private onResizeEvent: SizeCallback

	constructor(
		element: HTMLElement,
		parameters: SplitInLinesParameters = {}
	) {
		if(!element) {
			throw new Error('Element missing')
		}

		this.element = element
		this.text = element.innerText
		this.containerClass = parameters.containerClass || 'container-line'
		this.wrapperClass = parameters.wrapperClass || 'wrapper-line'

		this.immediate = parameters.immediate ?? true

		this.onResizeEvent = this.onResize.bind(this)

		if(this.immediate) {
			this.create()
		}
	}

	public async create() {
		if(this.splited) return

		this.words = await Promise.all(
			this.text.split(' ').map(async word => {
				const measure = await measureText(this.element, word)

				return {
					text: word,
					width: measure?.width || 0
				}
			})
		)
		this.spaceMeasure = await measureText(this.element, ' ')
		this.spaceWidth = this.spaceMeasure?.width || 0

		if(!this.resize) {
			this.resize = new Resize()
			this.resize.on(this.element, this.onResizeEvent)
		}
	}

	private async splitText() {
		let width = 0
		let line = ''
		const lines: string[] = []

		this.words.forEach(word => {
			const isFirstWord = width === 0
			const space = isFirstWord ? 0 : this.spaceWidth
			const nextWordWidth = word.width + space

			if (width + nextWordWidth <= this.elementWidth) {
				line += (isFirstWord ? '' : ' ') + word.text
				width += nextWordWidth
			} else {
				lines.push(line)
				line = word.text
				width = word.width
			}
		})

		if (line.trim() !== '') {
			lines.push(line)
		}

		this.lines = lines

		this.element.textContent = ''
		const fragment = document.createDocumentFragment()

		this.lines.forEach((line, index) => {
			const containerElement = document.createElement('div')
			containerElement.classList.add(this.containerClass)
			containerElement.style.setProperty('--i', index.toString())

			const wrapperElement = document.createElement('div')
			wrapperElement.classList.add(this.wrapperClass)

			wrapperElement.textContent = line
			containerElement.appendChild(wrapperElement)
			fragment.appendChild(containerElement)
		})

		this.element.appendChild(fragment)
		this.splited = true
	}

	private onResize({ rect }: SizeCallbackParameters) {
		this.elementWidth = rect.width
		this.splitText()
	}

	public destroy() {
		if(!this.splited) return

		this.resize?.off(this.element, this.onResizeEvent)
		this.resize = undefined

		this.element.textContent = this.text
		this.lines = []
		this.splited = false
	}
}