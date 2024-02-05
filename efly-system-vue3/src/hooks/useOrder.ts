const useOrder = <T>(api: (params: any) => Promise<any>, idField: string, valField: string, callback?: () => void) => {
  const tempOrderNumber = ref(0)

  async function handleOrder(row: T, e: FocusEvent) {
    const target = e.target as HTMLInputElement
    const newVal = target.value.replace(/\s/g, '')
    const oldVal = String(tempOrderNumber.value)
    if (!newVal || !/^\d{1,4}$/.test(newVal) || newVal === oldVal) {
      target.value = oldVal
    } else {
      await api({
        [idField]: row[idField],
        [valField]: parseInt(newVal),
      })
      typeof callback === 'function' && callback()
    }
  }

  return {
    tempOrderNumber,
    handleOrder,
  }
}

export default useOrder
