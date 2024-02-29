const { isProd } = require('./src/config')

const prodPlugins = []
if (isProd) {
  prodPlugins.push(['transform-remove-console', { exclude: ['error', 'warn'] }])
}

module.exports = {
  presets: ['@vue/cli-plugin-babel/preset'],
  plugins: [...prodPlugins],
}
