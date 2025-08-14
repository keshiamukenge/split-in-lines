const measureCache = new Map<string, number>()

export async function measureText(element: HTMLElement, text: string) {
	const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')

	if(!context) {
		return
	}

	const measureParameters = await getMeasureParameters(element)

	if(!measureParameters) {
		return
	}

	const cacheKey = `${measureParameters.font}-${measureParameters.fontKerning}-${measureParameters.fontVariantCaps}-${measureParameters.letterSpacing}-${text}`

	if (measureCache.has(cacheKey)) {
		return { width: measureCache.get(cacheKey)! }
	}

  context.font = measureParameters.font

  const rawWidth = context.measureText(text).width
	const letterSpacingWidth = parseFloat(measureParameters.letterSpacing)
	const spacing = isNaN(letterSpacingWidth) ? 0 : letterSpacingWidth * text.length
	const width = rawWidth + spacing

	measureCache.set(cacheKey, width)
	
	return { width }
}

async function getMeasureParameters(element: HTMLElement) {
	const style = getComputedStyle(element)

	const font = [
		style.fontStyle,
    style.fontVariant,
    style.fontWeight,
    style.fontSize,
    style.lineHeight !== 'normal' ? `/${style.lineHeight}` : '',
    style.fontFamily,
  ].join(' ')

	const loaded = await fontLoaded(font)

	if(!loaded) {
		return
	}

	return {
		font,
		fontKerning: style.fontKerning,
		fontVariantCaps: style.fontVariantCaps,
		letterSpacing: style.letterSpacing,
	}
}

async function fontLoaded(font: string): Promise<boolean | void> {
	try {
		await document.fonts.load(font)

		return document.fonts.check(font)
	} catch(error) {
		console.error(error)
	}
}