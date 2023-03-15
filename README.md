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
import SplitInLines from 'lines-split';

new SplitInLines('.text', 'center');
`````
## Instance options
| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `target` | `string` or `HTMLElement` | `null` | Element to split |
| `textAlign` | `string` | `'left'` | Text alignement, possible value : <ul><li>`left`</li><li>`right`</li><li>`center`</li></ul>|
