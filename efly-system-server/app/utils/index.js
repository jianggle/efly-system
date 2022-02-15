exports.getUserIp = (req) => {
  let { headers, connection = {}, socket = {} } = req
  let ip = headers['x-forwarded-for'] ||
    headers['x-real-ip'] ||
    connection.remoteAddress ||
    socket.remoteAddress ||
    (connection.socket && connection.socket.remoteAddress) ||
    null;
  return ip && ip.match(/\d+\.\d+\.\d+\.\d+/)
}

/**
 * 数组格式转树状结构
 * @description 列表结构转为树结构，就是把所有非根节点放到对应父节点的chilren数组中，然后把根节点提取出来
 * @param   {array}     list
 * @param   {String}    id
 * @param   {String}    pid
 * @param   {String}    children
 * @return  {Array}
 */
exports.listToTree = (list, id = 'id', pid = 'pid', children = 'children') => {
  // 防止污染，先拷贝
  let data = list.map(item => ({ ...item }))
  // 先建立以id为key的map索引数据列，因为对象取值的时间复杂度是O(1)，这样在接下来的找寻父元素就不需要再去遍历一次list了
  let hash = {}
  data.forEach(item => {
    hash[item[id]] = item
  })
  let result = []
  data.forEach((item) => {
    // 以当前遍历项的pid去map对象中找到索引的id，如果未找到就直接作为顶级
    let parent = hash[item[pid]]
    if (parent) {
      (parent.children || (parent.children = [])).push(item)
    } else {
      result.push(item)
    }
  })
  return result
}
