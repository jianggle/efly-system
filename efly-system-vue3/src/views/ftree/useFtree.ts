/* eslint-disable */
// @ts-nocheck
export function treeAlign(raw_family_tree_data) {
  let raw_nodes = raw_family_tree_data.nodes
  let raw_links = raw_family_tree_data.links
  let nextRowDistanceMap = raw_family_tree_data.nextRowDistance

  // build a relation map for later reference
  let linkMap = {}
  for (let l in raw_links) {
    let link = raw_links[l]
    let link_key = link.source + '-' + link.target
    linkMap[link_key] = link.higher
  }

  let levelListMap = {}
  for (let n in raw_nodes) {
    let nd = raw_nodes[n]
    if (levelListMap[nd.level] != null) {
      levelListMap[nd.level].push(nd)
    } else {
      levelListMap[nd.level] = []
      levelListMap[nd.level].push(nd)
    }
  }

  function directdye(a_nodelist, i, a_linkmap) {
    let result = []
    // result.push(a_nodelist[i]);
    for (let j = 0; j < a_nodelist.length; j++) {
      if (j === i) {
        continue
      }
      let nodei = a_nodelist[i]
      let nodej = a_nodelist[j]
      let keyij = nodei.id + '-' + nodej.id
      let keyji = nodej.id + '-' + nodei.id

      if (Object.prototype.hasOwnProperty.call(a_linkmap, keyij) && Object.prototype.hasOwnProperty.call(a_linkmap, keyji)) {
        result.push(j)
      }
    }

    return result
  }

  function union(setA, setB) {
    let _union = new Set(setA)
    for (let elem of setB) {
      _union.add(elem)
    }
    return _union
  }

  // 注意返回的集合是id的集合，不是对象的集合
  function dye(a_nodelist, i, a_linkmap, accessRecordSet) {
    if (accessRecordSet.has(a_nodelist[i].id)) {
      // this is unexpected case
      return []
    } else {
      let resultIdSet = new Set([])
      resultIdSet.add(a_nodelist[i].id)
      accessRecordSet.add(a_nodelist[i].id)
      let listOfNeighborsIndex = directdye(a_nodelist, i, a_linkmap)
      for (let m = 0; m < listOfNeighborsIndex.length; m++) {
        let subDyeResultIdSet = dye(a_nodelist, listOfNeighborsIndex[m], a_linkmap, accessRecordSet)
        resultIdSet = union(resultIdSet, subDyeResultIdSet)
      }

      return resultIdSet
    }
  }

  function sortBySex(nodeList) {
    // put male first, femail after
    nodeList.sort(function (f1, f2) {
      // Ascending: first age less than the previous
      if (f1.sex === f2.sex && f1.sex === 0) {
        return f1.id - f2.id
      }
      return f2.sex - f1.sex
    })
  }

  function subGroupByHusbandWife(a_nodelist, a_linkmap) {
    // input : a_nodelist, this is nodes of the same level

    // 构建一个id到对象的映射，因为id好做set操作，对象不好做
    let nodeIdMap = {}
    for (let k = 0; k < a_nodelist.length; k++) {
      nodeIdMap[a_nodelist[k].id] = a_nodelist[k]
    }
    let marriage_group_list = []
    let accessRecordSet = new Set([])
    for (let i = 0; i < a_nodelist.length; i++) {
      if (accessRecordSet.has(a_nodelist[i].id)) {
        continue
      } else {
        let idlistset = dye(a_nodelist, i, a_linkmap, accessRecordSet)
        let idlist = Array.from(idlistset)

        if (idlist.length > 0) {
          let objlist = []
          for (let n = 0; n < idlist.length; n++) {
            objlist.push(nodeIdMap[idlist[n]])
          }
          sortBySex(objlist)
          marriage_group_list.push(objlist)
        }
      }
    }
    return marriage_group_list
  }
  // till now, levelListMap is the node data grouped by level, top level is 1

  // next, subgroup each level by husband-wife relation(same level relation)
  let svgHeightIndex = 0

  // key is level, value is list of node of that particular level
  for (const key in levelListMap) {
    levelListMap[key] = subGroupByHusbandWife(levelListMap[key], linkMap)
  }

  let levels = Object.keys(levelListMap)
  levels.sort(function (f1, f2) {
    // Ascending: first age less than the previous
    return f1 - f2
  })

  let heightPosMap = {}
  heightPosMap[1] = 0
  for (const k in levels) {
    const key = levels[k]
    svgHeightIndex += Math.max(parseInt(nextRowDistanceMap[key] / 2) * 0.5, 1)
    if (key < Object.keys(levelListMap).length) {
      heightPosMap[Number(key) + 1] = svgHeightIndex
    }
  }

  // till now , each level is filled with subgroups, with each group has husband and wives inside, and husband on the left most

  // next, loop from the top most level, for the first level, grouping by husband and wife is enough, order between groups is not important, keep track of each marriage group and its members for the next level usage
  // from the second level, do second level subgrouping by looping from upper marriage group first and find all each groups decendants, for each level, at the end, is a well ordered list of marriage group, well formed for the next level to use, until it reaches the last level
  //
  function findAncestorGroupIndex(currentMarriageGroup, previousLevel, linkMap, parentIndexMap) {
    for (let cindex in currentMarriageGroup) {
      for (let pindex in previousLevel) {
        for (let pii in previousLevel[pindex]) {
          let nodeleft = currentMarriageGroup[cindex]
          let noderight = previousLevel[pindex][pii]
          let key = nodeleft.id + '-' + noderight.id
          let keyRev = noderight.id + '-' + nodeleft.id

          if (Object.prototype.hasOwnProperty.call(linkMap, key) && Object.prototype.hasOwnProperty.call(linkMap, keyRev)) {
            for (let spreadId in currentMarriageGroup) {
              parentIndexMap[currentMarriageGroup[spreadId].id] = Number(pindex) + 1
            }
            return Number(pindex) + 1
          }
        }
      }
    }
    return -1
  }

  function maxChildCountOfMarriageGroup(mgp) {
    let ret = 0
    for (let ind in mgp) {
      if (mgp[ind].leafDescendantCount > ret) {
        ret = mgp[ind].leafDescendantCount
      }
    }
    return ret
  }

  let previousLevel = []
  let maxWidth = 0
  let parentIndexMap = {}

  for (const m in levels) {
    const currentLevel = levels[m]
    if (currentLevel === '1') {
      let previousColumn = 0

      let accumuWidth = 0
      for (let vi in levelListMap[currentLevel]) {
        // in this iteration is a marriage group
        let col = 1
        let childCountOfCurrentGroup = 0
        for (let widx in levelListMap[currentLevel][vi]) {
          if (levelListMap[currentLevel][vi][widx].leafDescendantCount > childCountOfCurrentGroup) {
            childCountOfCurrentGroup = levelListMap[currentLevel][vi][widx].leafDescendantCount
          }
        }
        // now we have got the children count of the current group
        for (let wii in levelListMap[currentLevel][vi]) {
          levelListMap[currentLevel][vi][wii].column = Math.max(
            previousColumn + 1,
            accumuWidth + col + parseInt(childCountOfCurrentGroup / 2)
          )
          previousColumn = levelListMap[currentLevel][vi][wii].column
          if (levelListMap[currentLevel][vi][wii].column > maxWidth) {
            maxWidth = levelListMap[currentLevel][vi][wii].column
          }
          col += 1
        }

        accumuWidth =
          previousColumn - parseInt(levelListMap[currentLevel][vi].length / 2) + parseInt(childCountOfCurrentGroup / 2)
      }
      previousLevel = levelListMap[currentLevel]
      continue
    } else {
      let currentLevelList = levelListMap[currentLevel]
      let currentRowGroupHolder = {}
      for (let cgIndex in currentLevelList) {
        let cg = currentLevelList[cgIndex]
        let grp_position = findAncestorGroupIndex(cg, previousLevel, linkMap, parentIndexMap)

        if (currentRowGroupHolder[grp_position] == null) {
          currentRowGroupHolder[grp_position] = []
          currentRowGroupHolder[grp_position].push(cg)
        } else {
          currentRowGroupHolder[grp_position].push(cg)
        }
      }
      // spread from currentRowGroupHolder to currentLevelList
      let parentOrders = Object.keys(currentRowGroupHolder)
      parentOrders.sort(function (f1, f2) {
        // Ascending: first age less than the previous
        return f1 - f2
      })

      let tmpLevelList = []
      for (let i = 0; i < parentOrders.length; i++) {
        tmpLevelList = tmpLevelList.concat(currentRowGroupHolder[parentOrders[i]])
      }

      let accumuWidth = 0
      let previousColumn = 0
      for (let mgroupIndex in tmpLevelList) {
        let col = 1
        let childrenCountOfThisMarriageGroup = 0

        for (let ndIdx in tmpLevelList[mgroupIndex]) {
          if (tmpLevelList[mgroupIndex][ndIdx].leafDescendantCount > childrenCountOfThisMarriageGroup) {
            childrenCountOfThisMarriageGroup = tmpLevelList[mgroupIndex][ndIdx].leafDescendantCount
          }
        }
        // now we got the children count of the current marriage group

        for (let ndIndex in tmpLevelList[mgroupIndex]) {
          let parentgroupindex =
            parentIndexMap[tmpLevelList[mgroupIndex][ndIndex].id] == null
              ? 0
              : parentIndexMap[tmpLevelList[mgroupIndex][ndIndex].id] - 1
          let parentBase =
            previousLevel[parentgroupindex][0].column -
            parseInt(maxChildCountOfMarriageGroup(previousLevel[parentgroupindex]) / 2)

          tmpLevelList[mgroupIndex][ndIndex].column = Math.max(
            parentBase,
            Math.max(accumuWidth + col + parseInt(childrenCountOfThisMarriageGroup / 2), previousColumn + 1)
          )
          previousColumn = tmpLevelList[mgroupIndex][ndIndex].column
          if (tmpLevelList[mgroupIndex][ndIndex].column > maxWidth) {
            maxWidth = tmpLevelList[mgroupIndex][ndIndex].column
          }
          col += 1
        }

        accumuWidth =
          previousColumn - parseInt(tmpLevelList[mgroupIndex].length / 2) + parseInt(childrenCountOfThisMarriageGroup / 2)
      }

      levelListMap[currentLevel] = tmpLevelList

      previousLevel = tmpLevelList
    }
  }

  let result = {}
  let rnodes = []
  for (let li in levelListMap) {
    for (let mgi in levelListMap[li]) {
      for (let pi in levelListMap[li][mgi]) {
        rnodes.push(levelListMap[li][mgi][pi])
      }
    }
  }

  result.nodes = rnodes
  result.links = raw_links
  result['column-count'] = maxWidth
  result['level-count'] = Object.keys(levelListMap).length
  result['svgHeightIndex'] = svgHeightIndex
  result['heightPosMap'] = heightPosMap
  return result
}

export const manicons = [
  { id: 'shusheng.png', name: '书生' },
  { id: 'xizhuangnan.png', name: '西装男' },
  { id: 'shibing.png', name: '军人' },
  { id: 'shuaige.png', name: '帅哥' },
  { id: 'qingdi.png', name: '清帝' },
  { id: 'mingdi.png', name: '明帝' },
  { id: 'qibing.png', name: '骑兵' },
  { id: 'huangdi.png', name: '皇帝' },
  { id: 'huajinan.png', name: '滑稽男' },
  { id: 'shaomin.png', name: '少民' },
  { id: 'llj.png', name: '现代男' },
  { id: 'square.png', name: '方' },
]

export const womanicons = [
  { id: 'nvhai.png', name: '女孩' },
  { id: 'nvbing.png', name: '女兵' },
  { id: 'shunv.png', name: '淑女' },
  { id: 'menggumei.png', name: '蒙古妹' },
  { id: 'gege.png', name: '格格' },
  { id: 'hanshi.png', name: '韩国美女' },
  { id: 'zhixing.png', name: '知性美女' },
  { id: 'girlfriend.png', name: '女友' },
  { id: 'huanghou.png', name: '皇后' },
  { id: 'huajinv.png', name: '滑稽女' },
  { id: 'qipao.png', name: '旗袍女' },
  { id: 'weijiu.png', name: '日系美女' },
  { id: 'meinv2.png', name: '美女回眸' },
  { id: 'circle.png', name: '圆' },
]
