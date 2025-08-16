import dayjs from 'dayjs'

export function formatDate(value: any, fmt = 'YYYY-MM-DD HH:mm:ss') {
  if (!value || value === '0000-00-00 00:00:00') return ''
  let val = value.toString()
  val = /^\d{10}$/.test(val) ? val * 1000 : /^\d{13}$/.test(val) ? val * 1 : val
  return dayjs(val).format(fmt)
}

export function delaySomeTime(ms = 200) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
