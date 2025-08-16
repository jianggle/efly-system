export {}

declare module 'vue' {
  export interface GlobalComponents {
    SvgIcon: typeof import('@/icons/SvgIcon.vue').default
    TableCard: typeof import('@/components/TableCard.vue').default
    Pagination: typeof import('@/components/Pagination.vue').default
  }
}
