import { defineStore } from 'pinia'
import { RouteLocationNormalizedLoaded } from 'vue-router'

export interface TabItem {
  path: string
  title: string
  name?: string
  affix: boolean
}

/**获取当前页面组件的name */
const getCptName = (route: RouteLocationNormalizedLoaded) => {
  const res = route.matched.find((item) => item.path === route.path)
  return res && res.components?.default.name
}

const useTabStore = defineStore('tab', {
  state: () => ({
    visitedTabs: [] as TabItem[],
    cachedTabs: [] as string[],
  }),
  actions: {
    addTab(route: RouteLocationNormalizedLoaded) {
      this.addVisitedTab(route)
      this.addCachedTab(route)
    },
    addVisitedTab(route: RouteLocationNormalizedLoaded) {
      if (!route.meta || !route.meta.title) return
      if (this.visitedTabs.some((v) => v.path === route.fullPath)) return
      const cptName = getCptName(route)
      this.visitedTabs.push({
        path: route.fullPath,
        title: String(route.meta.title),
        name: String(cptName),
        affix: route.meta.affix === true
      })
    },
    addCachedTab(route: RouteLocationNormalizedLoaded) {
      const cptName = getCptName(route)
      if (!route.meta || route.meta.isCached !== true || !cptName) return
      if (this.cachedTabs.includes(cptName)) return
      this.cachedTabs.push(cptName)
    },
    removeTab(data: any) {
      const isRouteData = Array.isArray(data.matched)
      const realPath = isRouteData ? data.fullPath : data.path
      for (const [i, v] of this.visitedTabs.entries()) {
        if (v.path === realPath) {
          this.visitedTabs.splice(i, 1)
          break
        }
      }
      const cptName = isRouteData ? getCptName(data) : data.name
      const index = this.cachedTabs.indexOf(cptName)
      if (index < 0) return
      this.cachedTabs.splice(index, 1)
    },
    removeAllTab() {
      return new Promise((resolve: (value?: any) => void) => {
        const affixTabs = this.visitedTabs.filter(tab => tab.affix)
        this.visitedTabs = affixTabs
        this.cachedTabs = []
        resolve()
      })
    },
    removeOtherTab(route: RouteLocationNormalizedLoaded) {
      return new Promise((resolve: (value: boolean) => void) => {
        if (this.visitedTabs.length < 2) return resolve(false)
        const cptName = getCptName(route)
        this.visitedTabs = this.visitedTabs.filter((item) => {
          return item.affix || item.path === route.fullPath
        })
        this.cachedTabs = cptName && route.meta.isCached === true ? [cptName] : []
        resolve(true)
      })
    },
  },
})

export default useTabStore
