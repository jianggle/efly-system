<template>
  <div class="app-container">
    <div v-if="$slots.search" class="table-card--section table-card--search">
      <slot name="search" />
    </div>
    <div class="table-card--section table-card--table">
      <div v-if="$slots['table-header']" class="table-card--table-header">
        <slot name="table-header" />
      </div>
      <slot />
    </div>
  </div>
</template>

<style lang="scss">
.table-card--section {
  box-sizing: border-box;
  padding: 20px;
  background-color: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  transition: 0.3s;
}
.table-card--search {
  padding: 18px 18px 0;
  margin-bottom: 10px;
  .el-form-item {
    margin-bottom: 18px;
  }
}
.table-card--table-header {
  margin-bottom: 12px;
}
</style>
