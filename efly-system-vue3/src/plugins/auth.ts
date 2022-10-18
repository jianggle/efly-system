import useUserStore from '@/store/modules/user'

function hasPermit(value: string[]) {
  const userPermits = useUserStore().permissions
  if (value && value instanceof Array && value.length > 0) {
    return userPermits.some((item) => value.includes(item))
  } else {
    return false
  }
}

export default {
  hasPermit,
}
