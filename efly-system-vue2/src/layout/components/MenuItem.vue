<template>
  <div>
    <el-submenu v-if="item.children" :index="item.path">
      <template #title>
        <SvgIcon v-if="item.meta.icon" :name="item.meta.icon" />
        <span>{{ item.meta.title }}</span>
      </template>
      <MenuItem v-for="child in item.children" :key="child.path" :item="child" />
    </el-submenu>
    <el-menu-item v-else :index="item.path" @click="onLinkJump(item.path)">
      <SvgIcon v-if="item.meta.icon" :name="item.meta.icon" />
      <template #title>{{ item.meta.title }}</template>
    </el-menu-item>
  </div>
</template>

<script>
import useLinkJump from '../mixins/useLinkJump'
export default {
  name: 'MenuItem',
  mixins: [useLinkJump],
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
}
</script>
