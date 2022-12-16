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
  background-color: var(--el-fill-color-blank);
  border: 1px solid var(--el-border-color-light);
  border-radius: 4px;
  transition: var(--el-transition-duration);
}

.table-card--search {
  padding: 18px 18px 0;
  margin-bottom: 10px;
}

.table-card--table-header {
  margin-bottom: 12px;
}
</style>
