<template>
  <TableCard>
    <p>{{ welcome }}</p>
  </TableCard>
</template>

<script setup lang="ts">
defineOptions({
  name: 'PageDashboard',
})

const welcome = ref('welcome to here 2333...')
</script>
