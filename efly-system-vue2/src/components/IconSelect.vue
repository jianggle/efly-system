<template>
  <div class="menu-icon-select">
    <el-input
      v-model.trim="name"
      placeholder="输入图标名称进行搜索..."
      prefix-icon="el-icon-search"
      clearable
      @clear="filterIcons"
      @input.native="filterIcons"
    />
    <div class="icon-list">
      <div v-for="(item, index) in iconList" :key="index" @click="selectedIcon(item)">
        <SvgIcon :name="item" style="width: 16px; height: 30px" />
        <span>{{ item }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import icons from '@/icons/requireIcons'
export default {
  name: 'IconSelect',
  data() {
    return {
      name: '',
      iconList: icons,
    }
  },
  methods: {
    filterIcons() {
      this.iconList = icons
      if (this.name) {
        this.iconList = this.iconList.filter((item) => item.includes(this.name))
      }
    },
    selectedIcon(name) {
      this.$emit('selected', name)
      document.body.click()
    },
    reset() {
      this.name = ''
      this.iconList = icons
    },
  },
}
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
