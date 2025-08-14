# Split in lines
<p>This library separates your html text into different lines wrapped by html tags.</p>

## Use case
It is very useful to create text animations.

## Installation
`````bash
pnpm install lines-split
`````

## Usage
`````javascript
import SplitInLines from 'lines-split'

const paragraph = document.querySelector('p')

new SplitInLines(paragraph)
`````
## Instance settings
| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `element` | `HTMLElement` | `undefined` | HTML Text Element to split |
| `containerClass` | `string` | `'container-line'` | CSS Class for line container |
| `wrapperClass` | `string` | `'wrapper-line'` | CSS Class for line wrapper |
| `immediate` | `bolean` | `true` | if `true` `create()` is immediatly execute |

## Instance props
| Property | Type | Description |
| --- | --- | --- |
| `element` | `HTMLElement` | Splited element |
| `text` | `string` | Text content |
| `splited` | `boolean` | splited text state |

## Instance methods
| Option | Description |
| --- | --- |
| `create()` | Split text and wrap each line |
| `destroy()` | Reset to inital render |
