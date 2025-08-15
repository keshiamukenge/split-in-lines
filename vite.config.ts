import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  root: 'demo',

  base: 'split-in-lines',

	plugins: [vue()],

  resolve: {
    alias: [
      { find: '~', replacement: path.resolve(__dirname, './src'), }
    ]
  },
	
  server: {
    port: 3000,
    open: true
  }
})