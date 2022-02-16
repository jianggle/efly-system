// element-ui version from node_modules
const version = require('element-ui/package.json').version
// default color
const ORIGINAL_THEME = '#409EFF'

function updateStyle(style, oldCluster, newCluster) {
  let newStyle = style
  oldCluster.forEach((color, index) => {
    newStyle = newStyle.replace(new RegExp(color, 'ig'), newCluster[index])
  })
  return newStyle
}

function getCSSString(url) {
  return new Promise(resolve => {
    const xhr = new XMLHttpRequest()
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        resolve(xhr.responseText.replace(/@font-face{[^}]+}/, ''))
      }
    }
    xhr.open('GET', url)
    xhr.send()
  })
}

function getThemeCluster(theme) {
  const tintColor = (color, tint) => {
    let red = parseInt(color.slice(0, 2), 16)
    let green = parseInt(color.slice(2, 4), 16)
    let blue = parseInt(color.slice(4, 6), 16)

    if (tint === 0) { // when primary color is in its rgb space
      return [red, green, blue].join(',')
    } else {
      red += Math.round(tint * (255 - red))
      green += Math.round(tint * (255 - green))
      blue += Math.round(tint * (255 - blue))

      red = red.toString(16)
      green = green.toString(16)
      blue = blue.toString(16)

      return `#${red}${green}${blue}`
    }
  }

  const shadeColor = (color, shade) => {
    let red = parseInt(color.slice(0, 2), 16)
    let green = parseInt(color.slice(2, 4), 16)
    let blue = parseInt(color.slice(4, 6), 16)

    red = Math.round((1 - shade) * red)
    green = Math.round((1 - shade) * green)
    blue = Math.round((1 - shade) * blue)

    red = red.toString(16)
    green = green.toString(16)
    blue = blue.toString(16)

    return `#${red}${green}${blue}`
  }

  const clusters = [theme]
  for (let i = 0; i <= 9; i++) {
    clusters.push(tintColor(theme, Number((i / 10).toFixed(2))))
  }
  clusters.push(shadeColor(theme, 0.1))
  return clusters
}

// content of theme-chalk css
let tempChalk = ''

export async function setThemeColor(val) {
  if (typeof val !== 'string') return
  const oldVal = tempChalk ? val : ORIGINAL_THEME
  const themeCluster = getThemeCluster(val.replace('#', ''))
  const originalCluster = getThemeCluster(oldVal.replace('#', ''))

  const getHandler = (cssString, id) => {
    return () => {
      const originalCluster = getThemeCluster(ORIGINAL_THEME.replace('#', ''))
      const newStyle = updateStyle(cssString, originalCluster, themeCluster)

      let styleTag = document.getElementById(id)
      if (!styleTag) {
        styleTag = document.createElement('style')
        styleTag.setAttribute('id', id)
        document.head.appendChild(styleTag)
      }
      styleTag.innerText = newStyle
    }
  }

  if (!tempChalk) {
    const url = `https://cdn.jsdelivr.net/npm/element-ui@${version}/lib/theme-chalk/index.css`
    // eslint-disable-next-line
    tempChalk = await getCSSString(url)
  }

  const chalkHandler = getHandler(tempChalk, 'chalk-style')

  chalkHandler()

  const styles = [].slice.call(document.querySelectorAll('style')).filter(style => {
    const text = style.innerText
    return new RegExp(oldVal, 'i').test(text) && !/Chalk Variables/.test(text)
  })
  styles.forEach(style => {
    const { innerText } = style
    if (typeof innerText !== 'string') return
    style.innerText = updateStyle(innerText, originalCluster, themeCluster)
  })
}
