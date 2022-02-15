<template>
  <div v-if="item.meta && item.meta.isMenu">
    <el-submenu v-if="item.children" :index="item.path">
      <template #title>
        <svg-icon v-if="item.meta.icon" :name="item.meta.icon"/>
        <span>{{item.meta.title}}</span>
      </template>
      <MenuItem
        v-for="child in item.children"
        :key="child.path"
        :item="child"
      />
    </el-submenu>
    <MenuLink v-else :to="item.path">
      <el-menu-item :index="item.path">
        <svg-icon v-if="item.meta.icon" :name="item.meta.icon"/>
        <template #title>{{item.meta.title}}</template>
      </el-menu-item>
    </MenuLink>
  </div>
</template>

<script>
import MenuLink from './MenuLink.vue'
export default {
  name: 'MenuItem',
  components: {
    MenuLink
  },
  props: {
    item: {
      type: Object,
      required: true
    }
  }
}
</script>
