<template>
  <div class="menu-icon-select">
    <el-input
      v-model.trim="activeName"
      :prefix-icon="Search"
      clearable
      placeholder="输入图标名称进行搜索..."
      @clear="filterIcons"
      @input="filterIcons"
    />
    <div class="icon-list">
      <div v-for="(item, index) in iconList" :key="index" @click="selectedIcon(item)">
        <svg-icon :name="item" style="width: 16px; height: 30px" />
        <span>{{ item }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Search } from '@element-plus/icons-vue'
import icons from '@/icons/requireIcons'

const emit = defineEmits(['selected'])

const activeName = ref('')
const iconList = ref<string[]>(icons)

function filterIcons() {
  iconList.value = icons
  if (activeName.value) {
    iconList.value = iconList.value.filter((item) => item.includes(activeName.value))
  }
}
function selectedIcon(name: string) {
  emit('selected', name)
  document.body.click()
}
function reset() {
  activeName.value = ''
  iconList.value = icons
}

defineExpose({
  reset,
})
</script>

<style lang="scss">
.menu-icon-select {
  width: 100%;
  padding: 10px;
  .icon-list {
    height: 200px;
    overflow-y: scroll;
    div {
      float: left;
      width: 33%;
      height: 30px;
      margin-bottom: -5px;
      line-height: 30px;
      cursor: pointer;
      &:hover {
        background-color: #f5f5f5;
      }
    }
    span {
      display: inline-block;
      margin-left: 4px;
      overflow: hidden;
      vertical-align: -0.15em;
      fill: currentColor;
    }
  }
}
</style>
