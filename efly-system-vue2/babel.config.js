const { isProd, removConsole, removExcludeConsole } = require('./src/config')

const prodPlugins = []
if (isProd && removConsole) {
  prodPlugins.push(['transform-remove-console', { exclude: removExcludeConsole }])
}

module.exports = {
  presets: ['@vue/cli-plugin-babel/preset'],
  plugins: [...prodPlugins],
}
