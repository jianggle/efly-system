<template>
  <component :is="type" v-bind="linkProps()">
    <slot />
  </component>
</template>

<script setup lang="ts" name="MenuLink">
import { isExternal } from '@/utils/validator'

const props = defineProps({
  to: {
    type: String,
    required: true,
  },
})

const isExt = computed(() => {
  return isExternal(props.to)
})

const type = computed(() => {
  if (isExt.value) return 'a'
  return 'router-link'
})

const linkProps = () => {
  if (isExt.value) {
    return {
      href: props.to,
      target: '_blank',
      rel: 'noopener',
    }
  }
  return {
    to: props.to,
  }
}
</script>
