<script lang="ts" setup>
  import { useTemplateRef, ref, computed, onMounted, onUnmounted } from 'vue'

  import SplitInLines from '../src/core/SplitInLines'

  const element = useTemplateRef('elementRef')
  const splitInLines = ref<SplitInLines>()
  const visible = ref(false)
  const restart = ref(false)
  const lines = ref(true)
  const buttonLinesLabel = computed(
    () => `${lines.value ? 'Hide' : 'Show'} lines`
  )
  const timeoutId = ref<NodeJS.Timeout>()

  async function onCreateButtonClick() {
    if (!splitInLines.value) return

    await splitInLines.value.create()
    visible.value = true
  }

  function onDestroyButtonClick() {
    if (!splitInLines.value) return

    splitInLines.value.destroy()
    visible.value = false
  }

  function onRestartButtonClick() {
    timeoutId.value && clearTimeout(timeoutId.value)

    visible.value = false
    restart.value = true

    timeoutId.value = setTimeout(() => {
      visible.value = true
      restart.value = false
    }, 350)
  }

  onMounted(() => {
    if (!element.value) return

    splitInLines.value = new SplitInLines(element.value)
		console.log(splitInLines.value)
    timeoutId.value = setTimeout(() => {
      visible.value = true
    }, 200)
  })

  onUnmounted(() => {
    timeoutId.value && clearTimeout(timeoutId.value)
  })
</script>

<template>
  <div class="root">
    <div class="container">
      <div class="buttons">
        <button
          class="button"
          @click="onCreateButtonClick"
        >
          Create
        </button>
        <button
          class="button"
          @click="onRestartButtonClick"
        >
          Restart
        </button>
        <button
          class="button"
          @click="onDestroyButtonClick"
        >
          Destroy
        </button>
        <button
          class="button"
          @click="lines = !lines"
        >
          {{ buttonLinesLabel }}
        </button>
      </div>
      <p
        ref="elementRef"
        class="element"
        :class="{ visible, restart, lines }"
      >
        Cras ultricies ligula sed magna dictum porta. Proin eget tortor risus.
        Donec rutrum congue leo eget malesuada. Donec rutrum congue leo eget
        malesuada. Nulla quis lorem ut libero malesuada feugiat. Nulla porttitor
        accumsan tincidunt. Quisque velit nisi, pretium ut lacinia in, elementum
        id enim. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        Pellentesque in ipsum id orci porta dapibus. Curabitur aliquet quam id
        dui posuere blandit.
      </p>
    </div>
  </div>
</template>

<style>
  .root {
    width: 100%;
    height: 100%;
    max-width: 1440px;
    margin: auto;
    padding: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .container {
    width: 100%;
    height: fit-content;
  }

  .buttons {
    display: flex;
    gap: 6px;
  }

  .button {
    border: none;
    margin: 0;
    padding: 0;
    width: auto;
    overflow: visible;
    background: #ecdfcc;
    color: #1e201e;
    font: inherit;
    font-size: 0.8rem;
    line-height: normal;
    -webkit-font-smoothing: inherit;
    -moz-osx-font-smoothing: inherit;
    -webkit-appearance: none;
    cursor: pointer;
    padding: 6px 8px;
    border-radius: 2px;
    transition: 0.4s opacity ease;
  }

  .button:hover {
    opacity: 0.8;
  }

  .button.disable {
    pointer-events: none;
  }

  .element {
    margin: 40px 0;
    font-size: 1rem;
    font-weight: 200;
    line-height: 1.5rem;
  }

  .container-line {
    overflow: hidden;
  }

  .wrapper-line {
    transform: translateY(100%);
    transition: 1s transform calc(var(--i) * 0.1s) ease;
    position: relative;
  }

  .element.visible .wrapper-line {
    transform: translateY(0);
  }

  .element.restart .wrapper-line {
    opacity: 0;
    transition: 0s transform 0.3s, 0.3s opacity ease;
  }

  .element.lines .wrapper-line {
    &::before {
      content: '';
      display: block;
      position: absolute;
      height: 1rem;
      width: 100%;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      border: 1px dashed #697565;
      box-sizing: border-box;
      z-index: -1;
    }
  }
</style>
