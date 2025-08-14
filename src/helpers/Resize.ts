import { debounce } from 'throttle-debounce'

export interface Size {
	width: number
	height: number
}

export interface SizeCallbackParameters {
	rect: ResizeObserverEntry['contentRect']
	size: Size
}

export type SizeCallback = (parameters: SizeCallbackParameters) => void
export type SizeWatchCallback = (size: Size) => void

export default class Resize {
	static instance: Resize
	private observer: ResizeObserver
	private onCallbacks: Map<ResizeObserverEntry['target'], Set<SizeCallback>>
	private watchCallbacks: Set<SizeWatchCallback>
	public size: Size

	constructor() {
		if(Resize.instance) {
			return Resize.instance
		}

		this.size = { width: 0, height: 0 }

		this.create()
		
		Resize.instance = this
	}

	private create() {
		this.onCallbacks = new Map()
		this.watchCallbacks = new Set()

		this.observer = new ResizeObserver(entries => {
			for(const entry of entries) {
				const callbacks = this.onCallbacks.get(entry.target)

				if(callbacks) {
					callbacks.forEach(callback => {
						callback({
							rect: entry.contentRect,
							size: this.size,
						})
					})
				}
			}
		})
	}

	public on(
		element: Element,
		callback: SizeCallback,
		options: {
			debounce?: number
			once?: boolean
		} = {}
	) {
		if (!this.onCallbacks.has(element)) {
			this.onCallbacks.set(element, new Set())
			this.observer.observe(element)
		}

		let wrappedCallback: SizeCallback

		if(options.debounce) {
			wrappedCallback = debounce(options.debounce, callback)
		} else {
			wrappedCallback = callback
		}

		if (options.once) {
			const original = wrappedCallback
			
			wrappedCallback = (parameters) => {
				original(parameters)
				this.off(element, wrappedCallback)
			}
		}

  	this.onCallbacks.get(element)?.add(wrappedCallback)
	}


	public off(element: Element, callback?: SizeCallback) {
		const callbacks = this.onCallbacks.get(element)

		if (!callbacks) return

		if (callback) {
			callbacks.delete(callback)

			if (callbacks.size === 0) {
				this.onCallbacks.delete(element)
				this.observer.unobserve(element)
			}
		} else {
			this.onCallbacks.delete(element)
			this.observer.unobserve(element)
		}
	}

	public watch(callback: SizeWatchCallback) {
		this.watchCallbacks.add(callback)
	}
	
	public unwatch(callback: SizeWatchCallback) {
		this.watchCallbacks.delete(callback)
	}

	public destroy() {
		this.onCallbacks.clear()
		this.watchCallbacks.clear()
		this.observer.disconnect()
	}
}