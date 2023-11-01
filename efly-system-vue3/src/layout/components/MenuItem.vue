<template>
  <el-sub-menu v-if="item.children" :index="item.path">
    <template #title>
      <el-icon v-if="item.meta.icon">
        <svg-icon :name="item.meta.icon" />
      </el-icon>
      <span>{{ item.meta.title }}</span>
    </template>
    <MenuItem v-for="child in item.children" :key="child.path" :item="child" />
  </el-sub-menu>
  <el-menu-item v-else :index="item.path" @click="useLinkJump(item.path)">
    <el-icon v-if="item.meta.icon">
      <svg-icon :name="item.meta.icon" />
    </el-icon>
    <span>{{ item.meta.title }}</span>
  </el-menu-item>
</template>

<script setup lang="ts">
import useLinkJump from '@/hooks/useLinkJump'

defineOptions({
  name: 'MenuItem'
})

defineProps({
  item: {
    type: Object,
    required: true,
  },
})
</script>
