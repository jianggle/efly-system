/**
 * 检查是否为叶子节点
 * @param {PersonInGraphVO} node - 当前节点
 * @param {Map<string, number>} relationHigher - 关系层级映射
 * @param {Map<number, Array<number>>} neighborMap - 邻居节点映射
 * @returns {boolean} 是否是叶子节点
 */
function isLeafNode(node, relationHigher, neighborMap) {
  const neighbors = neighborMap.get(node.id)
  if (!neighbors) {
    return true
  }
  for (const n of neighbors) {
    if (relationHigher.get(`${node.id}-${n}`) === 1) {
      return false
    }
  }
  return true
}

/**
 * 获取直接后代节点
 * @param {PersonInGraphVO} node - 当前节点
 * @param {Map<string, number>} relationHigher - 关系层级映射
 * @param {Map<number, Array<number>>} neighborMap - 邻居节点映射
 * @param {Map<number, PersonInGraphVO>} nodesIdMap - 节点ID映射
 * @returns {Array<PersonInGraphVO>} 直接后代节点列表
 */
function getDirectDecendants(node, relationHigher, neighborMap, nodesIdMap) {
  const result = []
  const neighbors = neighborMap.get(node.id)
  if (!neighbors) return result

  for (const n of neighbors) {
    if (relationHigher.get(`${node.id}-${n}`) === 1) {
      const p = nodesIdMap.get(n)
      if (p) result.push(p)
    }
  }
  return result
}

/**
 * 计算叶子后代数量
 * @param {PersonInGraphVO} node - 当前节点
 * @param {Map<string, number>} relationHigher - 关系层级映射
 * @param {Map<number, Array<number>>} neighborMap - 邻居节点映射
 * @param {Map<number, PersonInGraphVO>} nodesIdMap - 节点ID映射
 * @param {Set<number>} accessSet - 已访问节点ID集合
 * @returns {number} 叶子后代数量
 */
function countLeafDescendants(node, relationHigher, neighborMap, nodesIdMap, accessSet) {
  if (accessSet.has(node.id)) {
    return node.leafDescendantCount || 0
  }

  if (isLeafNode(node, relationHigher, neighborMap)) {
    node.leafDescendantCount = 1
    accessSet.add(node.id)
    return 1
  } else {
    // 获取所有直接后代
    const directDecendants = getDirectDecendants(node, relationHigher, neighborMap, nodesIdMap)
    node.directDescendantCount = directDecendants.length

    // 累加所有后代的叶子节点数量
    let c = 0
    for (const personInGraphVO of directDecendants) {
      c += countLeafDescendants(personInGraphVO, relationHigher, neighborMap, nodesIdMap, accessSet)
    }

    accessSet.add(node.id)
    node.leafDescendantCount = c
    return c
  }
}

/**
 * 递归标记节点层级
 * @param {PersonInGraphVO} startNode - 起始节点
 * @param {Map<number, Array<number>>} neighborMap - 邻居节点映射
 * @param {Set<number>} accessSet - 已访问节点ID集合
 * @param {Array<PersonInGraphVO>} nodes - 所有节点列表
 * @param {Map<string, number>} relationHigher - 关系层级映射
 * @param {Map<number, PersonInGraphVO>} nodesIdMap - 节点ID映射
 * @param {Set<number>} startSet - 起始节点集合
 */
function recursiveMark(
  startNode,
  neighborMap,
  accessSet,
  nodes,
  relationHigher,
  nodesIdMap,
  startSet
) {
  if (!startNode) return

  startSet.add(startNode.id)
  const neighbors = neighborMap.get(startNode.id)
  if (!neighbors) return

  for (const n of neighbors) {
    if (accessSet.has(n)) continue

    const key = `${startNode.id}-${n}`
    const relation = relationHigher.get(key)
    const targetNode = nodesIdMap.get(n)

    if (!targetNode) continue

    // level数字越大，代表越后代
    if (relation === 1) {
      targetNode.level = startNode.level + 1
    } else if (relation === 0) {
      targetNode.level = startNode.level
    } else {
      targetNode.level = startNode.level - 1
    }

    accessSet.add(n)
  }

  for (const n of neighbors) {
    if (!startSet.has(n)) {
      recursiveMark(
        nodesIdMap.get(n),
        neighborMap,
        accessSet,
        nodes,
        relationHigher,
        nodesIdMap,
        startSet
      )
    }
  }
}

/**
 * 设置叶子子节点数量
 * @param {Array<PersonInGraphVO>} nodes - 所有节点列表
 * @param {Map<number, Array<number>>} neighborMap - 邻居节点映射
 * @param {Map<string, number>} relationHigher - 关系层级映射
 * @param {Map<number, PersonInGraphVO>} nodesIdMap - 节点ID映射
 */
function setLeafChildrenCount(nodes, neighborMap, relationHigher, nodesIdMap) {
  const accessSet = new Set()

  for (const node of nodes) {
    countLeafDescendants(node, relationHigher, neighborMap, nodesIdMap, accessSet)
  }
}

/**
 * 选择起始节点
 * @param {Set<number>} accessSet - 已访问节点ID集合
 * @param {Array<PersonInGraphVO>} nodes - 所有节点列表
 * @returns {PersonInGraphVO|null} 返回选中的起始节点或null
 */
function selectStartNode(accessSet, nodes) {
  for (const p of nodes) {
    if (!accessSet.has(p.id)) {
      p.level = 10
      accessSet.add(p.id)
      return p
    }
  }
  return null
}

/**
 * 设置节点层级
 * @param {Array<PersonInGraphVO>} nodes - 所有节点列表
 * @param {Array<RelationVO>} links - 关系列表
 * @param {Map<number, number>} rowDistanceMap - 行距离映射
 */
export function setNodeLevel(nodes, links, rowDistanceMap) {
  if (!nodes || nodes.length === 0) return

  const nodesIdMap = new Map()
  const neighborMap = new Map()
  const relationHigher = new Map()

  // 初始化节点ID映射
  for (const p of nodes) {
    nodesIdMap.set(p.id, p)
  }

  // 设置relationHigher和neighborMap
  for (const relationVO of links) {
    relationHigher.set(`${relationVO.source}-${relationVO.target}`, relationVO.higher)

    const key = relationVO.source
    if (neighborMap.has(key)) {
      neighborMap.get(key).push(relationVO.target)
    } else {
      neighborMap.set(key, [relationVO.target])
    }
  }

  // 记录已访问节点集合
  const accessSet = new Set()
  const startSet = new Set()

  // 循环直到所有节点都被访问
  do {
    const startNode = selectStartNode(accessSet, nodes)
    recursiveMark(startNode, neighborMap, accessSet, nodes, relationHigher, nodesIdMap, startSet)
  } while (accessSet.size !== nodes.length)

  // 归一化垂直层级，从1开始
  let minLevel = nodes[0].level
  let maxLevel = minLevel

  for (const p of nodes) {
    if (p.level < minLevel) minLevel = p.level
    if (p.level > maxLevel) maxLevel = p.level
  }

  setLeafChildrenCount(nodes, neighborMap, relationHigher, nodesIdMap)

  // 归一化层级并计算行距离
  for (const p of nodes) {
    p.level = p.level - minLevel + 1
    const count = p.directDescendantCount <= 1 ? 1 : p.leafDescendantCount

    if (!rowDistanceMap.has(p.level) || rowDistanceMap.get(p.level) < count) {
      rowDistanceMap.set(p.level, count)
    }
  }
}

/**
 * 按rank排序节点
 * @param {Array<PersonInGraphVO>} nodes - 节点列表
 */
export function sortNodesByRank(nodes) {
  nodes.sort((o1, o2) => {
    if (o1.rank == null || o2.rank == null) return 0
    if (o1.rank === o2.rank) return 0
    return o1.rank < o2.rank ? -1 : 1
  })
}
