import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'

Vue.use(Vuex)

const modules = {}
const modulesFiles = require.context('./modules', true, /\.js$/)
modulesFiles.keys().forEach((item) => {
  const moduleName = item.replace(/^\.\/(.*)\.\w+$/, '$1')
  modules[moduleName] = modulesFiles(item).default
})

export default new Vuex.Store({
  modules,
  state: {},
  mutations: {},
  getters,
})
