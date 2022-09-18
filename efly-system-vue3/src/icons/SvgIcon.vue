<template>
  <svg :class="svgClass" aria-hidden="true">
    <use :xlink:href="iconName" />
  </svg>
</template>

<script setup lang="ts" name="SvgIcon">
import { computed } from 'vue'
const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  className: {
    type: String,
    default: '',
  },
})
const iconName = computed(() => {
  return `#icon-${props.name}`
})
const svgClass = computed(() => {
  return `svg-icon ${props.className || ''}`
})
</script>

<style lang="scss">
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
