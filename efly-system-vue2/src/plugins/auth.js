import store from '@/store'

function hasPermit(value) {
  const userPermits = store.getters.permissions || []
  if (value && value instanceof Array && value.length > 0) {
    return userPermits.some((item) => value.includes(item))
  } else {
    return false
  }
}

export default {
  hasPermit,
}
