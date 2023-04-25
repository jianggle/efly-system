<template>
  <div class="header-search" :class="{ show: showSearch }">
    <svg-icon name="search" class-name="search-icon" @click.stop="onToggle()" />
    <el-select
      class="header-search-select"
      ref="selectRef"
      v-model="keywords"
      :default-first-option="true"
      :filterable="true"
      :remote="true"
      :remote-method="onSearch"
      placeholder="Search"
      @change="onChange"
    >
      <el-option
        v-for="(item, index) in resultList"
        :key="index"
        :value="item.path"
        :label="item.title.join(' > ')"
      />
    </el-select>
  </div>
</template>

<script setup lang="ts" name="HeaderSearch">
import { ElSelect } from 'element-plus'
import Fuse from 'fuse.js'
import useLinkJump from '@/hooks/useLinkJump'
import useUserStore from '@/store/modules/user'

interface OptionItem {
  path: string
  title: string[]
}

const selectRef = ref<InstanceType<typeof ElSelect>>()
const showSearch = ref(false)
const keywords = ref('')
const fuse = ref<InstanceType<typeof Fuse<OptionItem>>>()
const searchPool = ref<OptionItem[]>([])
const resultList = ref<OptionItem[]>([])

const originData = computed(() => {
  return useUserStore().routes
})

function onToggle() {
  showSearch.value = !showSearch.value
  if (showSearch.value) {
    selectRef.value!.focus()
  }
}
function onClose() {
  selectRef.value!.blur()
  resultList.value = []
  showSearch.value = false
}

function onChange(path: string) {
  useLinkJump(path)
  keywords.value = ''
  resultList.value = []
  nextTick(() => {
    showSearch.value = false
  })
}

function initFuse(list: OptionItem[]) {
  fuse.value = new Fuse(list, {
    shouldSort: true,
    threshold: 0.4,
    location: 0,
    distance: 100,
    minMatchCharLength: 1,
    keys: [
      // { name: 'title', weight: 0.7 },
      // { name: 'path', weight: 0.3 },
      { name: 'title', weight: 1 },
    ],
  })
}

function generatePoolData(pool: any[], prefixTitle: string[] = []) {
  let res: OptionItem[] = []
  for (const route of pool) {
    if (!route.meta || !route.meta.title || !route.meta.isMenu) continue
    const data = {
      path: route.path,
      title: [...prefixTitle, route.meta.title],
    }
    if (route.redirect !== 'no') {
      res.push(data)
    }
    if (route.children) {
      const tempRoutes = generatePoolData(route.children, data.title)
      if (tempRoutes.length >= 1) {
        res = [...res, ...tempRoutes]
      }
    }
  }
  return res
}

function onSearch(keywords: string) {
  if (keywords !== '') {
    const res = fuse.value!.search(keywords)
    resultList.value = res.map((item) => item.item)
  } else {
    resultList.value = []
  }
}

onMounted(() => {
  searchPool.value = generatePoolData(originData.value)
})

watch(originData, () => {
  searchPool.value = generatePoolData(originData.value)
})
watch(showSearch, (val) => {
  if (val) {
    document.body.addEventListener('click', onClose)
  } else {
    document.body.removeEventListener('click', onClose)
  }
})
watch(searchPool, (list) => {
  initFuse(list)
})
</script>

<style lang="scss" scoped>
.header-search {
  font-size: 0 !important;

  .search-icon {
    cursor: pointer;
    font-size: 18px;
    vertical-align: middle;
  }

  .header-search-select {
    font-size: 18px;
    transition: width 0.2s;
    width: 0;
    overflow: hidden;
    display: inline-block;
    vertical-align: middle;

    :deep(.el-input__wrapper) {
      border-radius: 0;
      padding: 0;
      box-shadow: none !important;
      border-bottom: 1px solid #d9d9d9;
      background: transparent;
      vertical-align: middle;
    }
    :deep(.el-input.is-focus .el-input__wrapper) {
      box-shadow: none !important;
    }
  }

  &.show {
    .header-search-select {
      width: 210px;
      margin-left: 10px;
    }
  }
}
</style>
