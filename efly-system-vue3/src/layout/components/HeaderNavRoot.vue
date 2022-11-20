<template>
  <el-menu
    mode="horizontal"
    :collapse-transition="false"
    :default-active="activeMenu"
    :background-color="variables.MENU_BG"
    :text-color="variables.MENU_TEXT_COLOR"
    @select="handleSelect"
  >
    <el-menu-item v-for="(item, index) in allMenus" :key="index" :index="item.path">
      <el-icon v-if="item.meta.icon">
        <svg-icon :name="item.meta.icon" />
      </el-icon>
      <span>{{ item.meta.title }}</span>
    </el-menu-item>
  </el-menu>
</template>

<script setup lang="ts" name="HeaderNavRoot">
import variables from '@/assets/style/variables.module.scss'
import useUserStore from '@/store/modules/user'
import useLinkJump from '@/hooks/useLinkJump'
import { treeFindPath } from '@/utils/treeTool'

const route = useRoute()
const userStore = useUserStore()

const activeMenu = ref('')
const oldParentPath = ref('')

const allMenus = computed(() => userStore.allVisibleMenu)

function updateSideMenu(val: any) {
  userStore.updateSidebarMenu(val)
}
function modifySideRoutes(path: string) {
  const res = allMenus.value.find(item => item.path === path)
  if (res && res.children && res.children.length) {
    updateSideMenu(res.children)
  } else {
    useLinkJump(path)
  }
}

function getActiveParentPath(): string {
  const arr = treeFindPath(allMenus.value, 'path', (data: { path: string }) => data.path === route.path)
  return arr.length ? arr[0] : ''
}
function handleSelect(path: string) {
  activeMenu.value = path
  oldParentPath.value = path
  modifySideRoutes(path)
}
function init() {
  const curParentPath = getActiveParentPath()
  let tempRoutes = allMenus.value.length ? allMenus.value[0].children : []
  let tempActive = allMenus.value.length ? allMenus.value[0].path : ''
  if (curParentPath) {
    const res = allMenus.value.find(item => item.path === curParentPath)
    if (res && res.children && res.children.length) {
      tempRoutes = res.children
      tempActive = curParentPath
    }
  }
  updateSideMenu(tempRoutes)
  activeMenu.value = tempActive
}

watch(route, () => {
  const curParentPath = getActiveParentPath()
  activeMenu.value = curParentPath
  if (curParentPath && curParentPath !== oldParentPath.value) {
    oldParentPath.value = curParentPath
    modifySideRoutes(curParentPath)
  }
})

init()
onBeforeUnmount(() => {
  updateSideMenu(allMenus.value)
})
</script>
