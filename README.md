# Split in lines
<p>This library separates your html text into different lines wrapped by html tags.</p>

## Use cases
It is very useful to create text animations.

## Installation
`````
npm install lines-split
`````

## Usage
`````
import SplitInLines from 'lines-split'

const paragraph = document.querySelector('p')

new SplitInLines(paragraph)
`````
## Instance settings
| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `target` | `HTMLElement` | `undefined` | Text element to split |

## Instance props
| Property | Type | Description |
| --- | --- | --- |
| `element` | `HTMLElement` | Splited element |
| `isVisible` | `boolean` | Whether or not `slideUp()` animation is completed. Set to `true` when animation is completed. |
| `params` | `object` | Instance parameters : <ul><li>`width: number`</li><li>`words: string[]`</li><li>`lines: NodeListOf<HTMLSpanElement>`</li></ul>` |

## Instance methods
| Option | Description |
| --- | --- |
| `slideUp()` | Basic text animation using gsap |
| `resize()` | Recreate each line in relation to element's width |
