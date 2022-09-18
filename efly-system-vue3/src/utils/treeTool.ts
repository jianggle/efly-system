// https://www.cnblogs.com/plBlog/p/13905504.html
// https://github.com/Lushenggang/js-tree-tool

/**
 * 数组格式转树状结构
 * @description 列表结构转为树结构，就是把所有非根节点放到对应父节点的chilren数组中，然后把根节点提取出来
 * @param   {array}     list
 * @param   {String}    id
 * @param   {String}    pid
 * @param   {String}    children
 * @return  {Array}
 */
export function listToTree(list: any[], id = 'id', pid = 'pid', children = 'children') {
  // 防止污染，先拷贝
  const data = list.map(item => ({ ...item }))
  // 先建立以id为key的map索引数据列，因为对象取值的时间复杂度是O(1)，这样在接下来的找寻父元素就不需要再去遍历一次list了
  const hash = {}
  data.forEach(item => {
    hash[item[id]] = item
  })
  const result: any[] = []
  data.forEach((item) => {
    // 以当前遍历项的pid去map对象中找到索引的id，如果未找到就直接作为顶级
    const parent = hash[item[pid]]
    if (parent) {
      (parent[children] || (parent[children] = [])).push(item)
    } else {
      result.push(item)
    }
  })
  return result
}

/**
 * 树结构筛选
 * @description 树结构过滤即保留某些符合条件的节点，剪裁掉其它节点。
 * 一个节点是否保留在过滤后的树结构中，取决于它以及后代节点中是否有符合条件的节点。
 * 可以传入一个函数描述符合条件的节点
 */
export function treeFilter(tree: any[], func: Function) {
  // 使用map复制一下节点，避免修改到原树
  return tree.map(node => ({ ...node })).filter(node => {
    node.children = node.children && treeFilter(node.children, func)
    return func(node) || (node.children && node.children.length)
  })
}

/**
 * 查找节点
 * @description 查找节点其实就是一个遍历的过程，遍历到满足条件的节点则返回，遍历完成未找到则返回null。
 * 类似数组的find方法，传入一个函数用于判断节点是否符合条件
 */
export function treeFind(tree: any[], func: Function): any {
  for (const data of tree) {
    if (func(data)) return data
    if (data.children) {
      const res = treeFind(data.children, func)
      if (res) return res
    }
  }
  return null
}

/**
 * 查找节点路径
 * @description 因为不知道符合条件的节点在哪个子树，要用到回溯法的思想。
 * 查找路径要使用先序遍历，维护一个队列存储路径上每个节点的key，假设节点就在当前分支，如果当前分支查不到，则回溯。
 */
export function treeFindPath(tree: any[], key: string, func: Function, path: any[] = []): any[] {
  if (!tree) return []
  for (const data of tree) {
    path.push(data[key])
    if (func(data)) return path
    if (data.children) {
      const findChildren = treeFindPath(data.children, key, func, path)
      if (findChildren.length) return findChildren
    }
    path.pop()
  }
  return []
}
