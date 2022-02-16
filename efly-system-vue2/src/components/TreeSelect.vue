<template>
  <div v-clickoutside="onClose" class="tree-select-wrapper">
    <el-input
      v-if="inputVisible"
      ref="input"
      v-model="inputText"
      :placeholder="inputPlaceholder"
      :clearable="true"
    />
    <el-input
      v-else
      v-model="realSelectName"
      :placeholder="placeholder"
      :readonly="true"
      :disabled="disabled"
      @focus="onFocus"
    />
    <div v-show="treeVisible" class="tree-select-tree">
      <el-tree
        ref="tree"
        :data="options"
        :highlight-current="true"
        :check-on-click-node="true"
        :expand-on-click-node="false"
        :props="{children: normalizer.children, label: normalizer.label}"
        :node-key="normalizer.id"
        :filter-node-method="filterNode"
        @node-click="onNodeClick"
      >
        <template #default="{ node, data }">
          <span>
            {{ node.label }}
            <em v-if="showCount && data[normalizer.children] && data[normalizer.children].length">
              ({{ data[normalizer.children].length }})
            </em>
          </span>
        </template>
      </el-tree>
    </div>
  </div>
</template>

<script>
import { treeFind } from '@/utils/treeTool'
import ClickOutside from 'element-ui/lib/utils/clickoutside'
export default {
  name: 'TreeSelect',
  directives: {
    clickoutside: ClickOutside
  },
  props: {
    value: {
      type: Number,
      default: null
    },
    options: {
      type: Array,
      default: () => []
    },
    showCount: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    normalizer: {
      type: Object,
      default: () => {
        return {
          id: 'id',
          label: 'label',
          children: 'children'
        }
      }
    },
    placeholder: {
      type: String,
      default: '请选择...'
    }
  },
  data() {
    return {
      inputVisible: false,
      inputText: '',
      inputPlaceholder: '',
      realSelectName: '',
      treeVisible: false,
    }
  },
  watch: {
    value: {
      handler() {
        this.handleReshow()
      },
      immediate: true
    },
    options() {
      this.handleReshow()
    },
    inputText(val) {
      this.$refs.tree.filter(val)
    }
  },
  methods: {
    handleReshow() {
      const obj = treeFind(this.options, (data) => data[this.normalizer.id] === this.value)
      this.realSelectName = obj ? obj[this.normalizer.label] : ''
      this.$nextTick(() => {
        obj && this.$refs.tree.setCurrentNode(obj)
      })
    },
    onFocus() {
      this.treeVisible = true
      this.inputVisible = true
      this.inputPlaceholder = this.realSelectName || this.placeholder
      this.$nextTick(() => {
        this.$refs.input.focus()
      })
    },
    onClose() {
      this.treeVisible = false
      this.inputVisible = false
      this.inputText = ''
    },
    filterNode(value, data) {
      if (!value) return true
      return data[this.normalizer.label].indexOf(value) !== -1
    },
    onNodeClick(data) {
      this.realSelectName = data[this.normalizer.label]
      this.$emit('update:value', data[this.normalizer.id])
      this.onClose()
    }
  }
}
</script>

<style lang="scss" scoped>
.tree-select-wrapper {
  position: relative;
}
.tree-select-tree {
  position: absolute;
  z-index: 2;
  background-color: #fff;
  width: 100%;
  max-height: 320px;
  overflow-y: auto;
  padding: 6px 0;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}
</style>
