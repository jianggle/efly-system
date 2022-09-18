const icons: string[] = []
const modules = import.meta.glob('./svg/*.svg')
for (const path in modules) {
  const _name = path.split('/svg/')[1].split('.svg')[0]
  icons.push(_name)
}

export default icons
