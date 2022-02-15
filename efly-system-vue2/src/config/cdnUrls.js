// 通过读取package.json中的相关版本号来进行替换
const pjson = require('../../package.json')

const cdnResource = {
  css: [],
  js: [],
  externals: {
    'vue': 'Vue',
    'vue-router': 'VueRouter',
    'vuex': 'Vuex',
    'axios': 'axios',
    'element-ui': 'ELEMENT'
  }
}

const urls = [
  'https://cdn.jsdelivr.net/npm/vue@version/dist/vue.runtime.min.js',
  'https://cdn.jsdelivr.net/npm/vue-router@version/dist/vue-router.min.js',
  'https://cdn.jsdelivr.net/npm/vuex@version/dist/vuex.min.js',
  'https://cdn.jsdelivr.net/npm/axios@version/dist/axios.min.js',
  'https://cdn.jsdelivr.net/npm/element-ui@version/lib/index.js',
  'https://cdn.jsdelivr.net/npm/element-ui@version/lib/theme-chalk/index.css',
]

for (let item of urls) {
  let pkg_name = item.match(/(?<=npm\/).*?(?=@version)/g)[0]
  let url = item.replace('version', pjson.dependencies[pkg_name].replace('^', ''))
  if (url.split('.').pop() === 'css') {
    cdnResource.css.push(url)
  } else {
    cdnResource.js.push(url)
  }
}

module.exports = {
  cdnResource
}
