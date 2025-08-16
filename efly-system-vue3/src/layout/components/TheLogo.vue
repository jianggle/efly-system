<template>
  <div class="logo" @click="$router.push('/dashboard')">
    <dt>efly</dt>
    <dd>efly system</dd>
  </div>
</template>

<script setup lang="ts">
const $router = useRouter()
</script>
