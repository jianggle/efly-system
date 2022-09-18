import { isExternal } from '@/utils/validator'
import router from '@/router'

export default function (path: string) {
  if (isExternal(path)) {
    const aLink = document.createElement('a')
    aLink.href = path
    aLink.target = '_blank'
    aLink.rel = 'noopener'
    aLink.click()
  } else {
    router.push(path)
  }
}
