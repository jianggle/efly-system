<template>
  <div class="app-container">
    <el-card>
      <template v-if="$slots.header" #header>
        <slot name="header" />
      </template>
      <slot />
    </el-card>
  </div>
</template>
