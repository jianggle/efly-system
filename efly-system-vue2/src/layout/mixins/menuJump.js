import { isExternal } from '@/utils/validator'

export default {
  methods: {
    onMenuJump(path) {
      if (isExternal(path)) {
        let aLink = document.createElement('a')
        aLink.href = path
        aLink.target = '_blank'
        aLink.rel = 'noopener'
        aLink.click()
      } else {
        this.$router.push(path)
      }
    }
  }
}
