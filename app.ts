import SplitInLines from './src'

new SplitInLines('.p-1', 'left');
new SplitInLines(document.querySelector<HTMLElement>('.p-2'), 'center');
new SplitInLines('.p-3', 'right');