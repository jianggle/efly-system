<template>
  <div v-loading="wholePageLoading" class="app-container" style="width: 100%; height: 100%">
    <el-dialog title="新建人物节点" v-model="visibleAddPerson" width="640px">
      <el-form ref="addPersonRef" :model="addPersonForm" label-width="auto">
        <el-form-item
          label="人物姓名"
          prop="name"
          :rules="[
            { required: true, message: '不能为空', trigger: 'blur' },
            { min: 2, max: 30, message: '人物姓名2~30个字符', trigger: 'blur' },
          ]"
        >
          <el-input v-model="addPersonForm.name" placeholder="请输入..." />
        </el-form-item>
        <el-form-item label="人物性别" prop="sex" :rules="[{ required: true, message: '请选择性别', trigger: 'change' }]">
          <el-radio-group v-model="addPersonForm.sex">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="0">女</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button :loading="isAddPersonSubmit" type="primary" @click="submitAddPerson()">创建</el-button>
        <el-button :disabled="isAddPersonSubmit" @click="visibleAddPerson = false">取消</el-button>
      </template>
    </el-dialog>

    <el-dialog title="建立人物关系" v-model="visibleBuildRelation" width="640px">
      <el-form ref="buildRelationRef" :model="buildRelationForm" label-width="auto">
        <el-form-item
          :label="buildRelationForm.relationTip"
          prop="relation_type"
          :rules="[{ required: true, message: '请选择关系', trigger: 'change' }]"
        >
          <el-select v-model="buildRelationForm.relation_type" placeholder="请选择关系" style="width: 100%">
            <el-option v-for="item in relation_types" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button :loading="isBuildRelationSubmit" type="primary" @click="submitBuildRelation()">建立关系</el-button>
        <el-button :disabled="isBuildRelationSubmit" @click="visibleBuildRelation = false">取消</el-button>
      </template>
    </el-dialog>

    <el-dialog title="添加关系人物" v-model="visibleAddRelation" width="640px">
      <el-form ref="addRelationRef" :model="addRelationForm" label-width="auto">
        <el-form-item
          :label="contextName + '的'"
          prop="relation_type"
          :rules="[{ required: true, message: '请选择关系', trigger: 'change' }]"
        >
          <el-select v-model="addRelationForm.relation_type" placeholder="请选择关系" style="width: 100%">
            <el-option v-for="item in relation_types_4sex" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item
          label="人物姓名"
          prop="name"
          :rules="[
            { required: true, message: '不能为空', trigger: 'blur' },
            { min: 2, max: 30, message: '人物姓名2~30个字符', trigger: 'blur' },
          ]"
        >
          <el-input v-model="addRelationForm.name" placeholder="请输入..." />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button :loading="isAddRelationSubmit" type="primary" @click="submitAddRelation()">添加</el-button>
        <el-button :disabled="isAddRelationSubmit" @click="visibleAddRelation = false">取消</el-button>
      </template>
    </el-dialog>

    <div class="page-ftree-desk">
      <div class="panel-sidebar">
        <table class="side-op">
          <!-- <tr style="height: 40px">
            <td colspan="2" align="center" height="50px">
              <el-button style="background-color: #fbc8c1" round @click="openAddTree">创建家谱</el-button>
            </td>
          </tr> -->
          <tr style="height: 40px">
            <td colspan="2" align="center" height="50px">
              <el-select v-model="selected_family_tree" filterable placeholder="我的家谱" @change="onFtreeChange">
                <!-- <el-option-group v-for="group in myfamilytrees" :key="group.groupLabel" :label="group.groupLabel">
                  <el-option v-for="item in group.groupData" :key="item.id" :label="item.name" :value="item.id" />
                </el-option-group> -->
                <el-option v-for="item in myfamilytrees" :key="item.treeId" :label="item.treeName" :value="item.treeId" />
              </el-select>
            </td>
          </tr>
          <tr style="height: 60px">
            <td width="40%">男性头像</td>
            <td width="60%" align="center" height="50px">
              <el-select v-model="man_select" placeholder="男性头像" @change="onManIconChange()">
                <el-option v-for="item in manicons" :key="item.id" :label="item.name" :value="item.id">
                  <span style="float: left">
                    <img width="20" height="20" :src="avatarBaseUrl + item.id" />
                  </span>
                  <span style="float: right; font-size: 13px; color: #8492a6">{{ item.name }}</span>
                </el-option>
              </el-select>
            </td>
          </tr>
          <tr style="height: 60px">
            <td width="40%">女性头像</td>
            <td width="60%" align="center" height="50px">
              <el-select v-model="woman_select" placeholder="女性头像" @change="onWomanIconChange()">
                <el-option v-for="item in womanicons" :key="item.id" :label="item.name" :value="item.id">
                  <span style="float: left">
                    <img width="20" height="20" :src="avatarBaseUrl + item.id" />
                  </span>
                  <span style="float: right; font-size: 13px; color: #8492a6">{{ item.name }}</span>
                </el-option>
              </el-select>
            </td>
          </tr>
          <tr width="100%">
            <td width="30%">列间距</td>
            <td width="70%">
              <el-slider v-model="columnWidth" :min="50" :max="300" :step="10" show-stops @change="updateColumnWidth" />
            </td>
          </tr>
          <tr width="100%">
            <td width="30%">层间距</td>
            <td width="70%">
              <el-slider v-model="heightWidthRatio" :min="1" :max="3" :step="0.1" show-stops @change="updateHeightWidthRatio" />
            </td>
          </tr>
        </table>
      </div>
      <div id="boardEl" v-loading="panel_loading" class="panel-board">
        <svg id="svgEl" width="960" height="700" style="background-color: rgba(192, 192, 192, 30%)"></svg>
      </div>
      <div class="board-ratio">缩放比:{{ (svg_scale * 100).toFixed(2) }}%</div>
      <div class="panel-tools">
        <button
          v-if="current_access_right == 'admin' || current_access_right == 'creator'"
          title="新建人物"
          class="btn-item add-person-plus"
          @click="openAddPerson()"
        />
        <button
          v-if="current_access_right == 'admin' || current_access_right == 'creator'"
          class="btn-item clear-person-plus"
          title="清空人物"
          @click="clearPeople"
        />
        <button title="导出图片" class="btn-item export-img-plus" @click="exportImage" />
        <button title="导出Excel表格" class="btn-item export-excel-plus" @click="exportExcel" />
        <button title="缩放平移复位" class="btn-item reset-pos" @click="resetPosition" />
      </div>
    </div>
  </div>
</template>

<script>
import * as d3 from 'd3'
import FileSaver from 'file-saver'
import 'canvas-toBlob'
import modal from '@/plugins/modal'
import request from '@/utils/request'
import { list_ftree } from '@/api/ftree'
import { manicons, womanicons, treeAlign } from './useFtree'

export default defineComponent({
  name: 'MainPage',
  data() {
    return {
      svg_scale: 1,
      previousSearchName: '',
      searchName: '',
      searchIndex: 0,
      heightWidthRatio: 1,
      avatarBaseUrl: './images/',
      rest_base: '.',
      current_access_right: 'creator',
      wholePageLoading: false,

      manicons,
      womanicons,
      man_select: 'shusheng.png',
      woman_select: 'nvhai.png',

      visibleAddPerson: false,
      isAddPersonSubmit: false,
      addPersonForm: {
        name: '',
        sex: undefined,
      },

      visibleBuildRelation: false,
      isBuildRelationSubmit: false,
      buildRelationForm: {
        relation_type: '',
        relationTip: '',
      },
      relation_types: [],
      fromsex: '',
      from_person_id: '',
      tosex: '',
      to_person_id: '',

      visibleAddRelation: false,
      isAddRelationSubmit: false,
      addRelationForm: {
        relation_type: '',
        name: '',
      },
      relation_types_4sex: [],
      contextName: '',
      contextId: '',

      state,
      left_margin: 160,
      top_margin: 150,
      panel_loading: false,
      manicon: '',
      womanicon: '',
      clickSwitch: false,
      rowDistance: 190,
      columnWidth: 90,
      selected_family_tree: '',
      myfamilytrees: [],
      familytreedata: '',
      zoom_handler: {},
      nodes_connected: false,
      expect_level_gap: 0,
    }
  },
  mounted() {
    this.selected_family_tree = this.state.currentFt
    this.state.currentFt = ''
    this.initAvatarIcon()
    // if (this.selected_family_tree) {
    //   this.onFtreeChange()
    // }
    this.getMyFamilyTrees()
  },
  methods: {
    async fetchImageToPureBase64(url) {
      const response = await fetch(url)
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      const blob = await response.blob()
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
          resolve(reader.result)
        }
        reader.onerror = reject
        reader.readAsDataURL(blob)
      })
    },
    initAvatarIcon() {
      this.fetchImageToPureBase64(this.avatarBaseUrl + this.woman_select).then((res) => {
        this.womanicon = res
      })
      this.fetchImageToPureBase64(this.avatarBaseUrl + this.man_select).then((res) => {
        this.manicon = res
      })
    },
    onWomanIconChange() {
      this.fetchImageToPureBase64(this.avatarBaseUrl + this.woman_select).then((res) => {
        this.womanicon = res
        this.loadFamilyTree(false)
      })
    },
    onManIconChange() {
      this.fetchImageToPureBase64(this.avatarBaseUrl + this.man_select).then((res) => {
        this.manicon = res
        this.loadFamilyTree(false)
      })
    },

    removeFromPublic() {
      if (!this.selected_family_tree) return modal.alert('您尚未选中一个家谱')
      this.$confirm('确认撤离公共区？')
        .then(() => {
          request
            .delete('/api/v1/familytree/public-tree/' + this.selected_family_tree)
            .then((response) => {
              if (response.data.ok === true) {
                modal.msgSuccess(response.data.message)
              } else {
                modal.msgError(response.data.message)
              }
            })
            .catch(() => {
              modal.msgError('未知错误')
            })
        })
        .catch(() => {})
    },
    publishTree() {
      if (!this.selected_family_tree) return modal.alert('您尚未选中一个家谱')
      this.$confirm('发布到公共区会允许所有用户看到该家谱，确认发布？')
        .then(() => {
          request
            .post('/api/v1/familytree/public-tree', {
              family_tree_id: this.selected_family_tree,
            })
            .then((response) => {
              if (response.data.ok === true) {
                modal.msgSuccess(response.data.message)
              } else {
                modal.msgError(response.data.message)
              }
            })
            .catch(() => {
              modal.msgError('未知错误')
            })
        })
        .catch(() => {})
    },
    updateHeightWidthRatio() {
      if (!this.selected_family_tree) return
      this.loadFamilyTree(false)
    },
    updateColumnWidth() {
      if (!this.selected_family_tree) return
      this.loadFamilyTree(false)
    },
    updateRowDistance() {
      if (!this.selected_family_tree) return
      this.loadFamilyTree(false)
    },
    resetPosition() {
      let svg_cont = d3.select('#boardEl')
      let t = d3.zoomIdentity.translate(0, 0).scale(1)
      svg_cont.call(this.zoom_handler.transform, t)
    },
    loadRelationBySex() {
      request.get(`/ftree/getRelationBySex?fromsex=${this.fromsex}&tosex=${this.tosex}`).then((res) => {
        this.relation_types = res.data
        this.loadPanelTree()
      })
    },
    loadRelationBySingleSex(sex) {
      request.get('/ftree/getRelationBySingleSex?sex=' + sex).then((res) => {
        this.relation_types_4sex = res.data
      })
    },

    loadPanelTree() {
      let storeThis = this
      let lastClickNode = null
      let svg_container = d3.select('#boardEl')
      let svg = d3.select('#svgEl')
      // var width = +svg.attr('width')
      // var height = +svg.attr('height')
      // var color = d3.scaleOrdinal(d3.schemeCategory20)
      // var x = d3.scaleLog().rangeRound([0, width])
      // var y = d3.scaleLog().rangeRound([0, height])
      let simulation = d3
        .forceSimulation()
        .force(
          'link',
          d3
            .forceLink()
            .distance(function (d) {
              return d.higher === 0 ? 90 : 160
            })
            .id(function (d) {
              return d.id
            })
        )
        .force('charge', d3.forceManyBody())

      this.zoom_handler = d3.zoom().on('zoom', zoom_actions)

      this.zoom_handler(svg_container)

      for (let i = 0, n = 250; i < n; ++i) {
        simulation.tick()
      }
      // .force("y", d3.forceY(function(d) { return y(height/2+d.level*height); }).strength(0.2))
      // .force("x",d3.forceX(width/2).strength(0.01))
      // .force("center", d3.forceCenter(width/3, height/3));

      let g = svg.append('g').attr('class', 'everything')

      let link = g
        .selectAll('.links')
        .data(this.familytreedata.links)
        .enter()
        .append('g')
        .attr('class', 'links')
        .append('line')
        .attr('stroke', '#7E08F1')
        .attr('opacity', 0.1)
        .attr('stroke-width', function (d) {
          return 3
        })

      let node = g.selectAll('.nodes').data(this.familytreedata.nodes).enter().append('g').attr('class', 'nodes')
      // .call(d3.drag()
      //    .on("start", dragstarted)
      //    .on("drag", dragged)
      //    .on("end", dragended));
      // .call(d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended));
      let heightPosMap = this.familytreedata['heightPosMap']

      let drag_line = g
        .append('svg:path')
        .attr('class', 'link dragline hidden')
        .attr('style', 'stroke:black;fill:none;')
        .attr('stroke-width', '2')
        .attr('d', 'M0,0L0,0')

      node
        .append('image')
        .attr('xlink:href', function (d) {
          return d.sex === 1 ? storeThis.manicon : storeThis.womanicon
        })
        .attr('x', -8)
        .attr('y', -8)
        .attr('width', 50)
        .attr('height', 50)

      node
        .append('text')
        .attr('dx', -2)
        .attr('dy', '-0.5em')
        .text(function (d) {
          return d.name
        })

      node.append('title').text(function (d) {
        return d.name
      })

      simulation.nodes(this.familytreedata.nodes).on('tick', ticked)

      svg.on('mousemove', function () {
        // update drag line
        if (storeThis.clickSwitch) {
          let tmpx = d3.mouse(this)[0]
          let tmpy = d3.mouse(this)[1]
          if (tmpx > lastClickNode.x) {
            // on the right side
            tmpx = tmpx - 2
          } else if (tmpx < lastClickNode.x) {
            // on the left side
            tmpx = tmpx + 2
          } else {
            // compare Y
            if (tmpy < lastClickNode.y) {
              // drag downwards
              tmpy = tmpy + 2
            } else if (tmpy > lastClickNode.y) {
              // drag upwards
              tmpy = tmpy - 2
            } else {
              // do nothing
            }
          }
          drag_line.attr('d', 'M' + lastClickNode.x + ',' + lastClickNode.y + 'L' + tmpx + ',' + tmpy)
        }
      })

      // cc.on("dblclick", function(d){ alert("node was double clicked"); console.log(d); });

      function checkConnection(from_id, to_id) {
        console.log('hell---')
        console.log(storeThis.familytreedata.links)
        let neighborMap = {}
        for (let i in storeThis.familytreedata.links) {
          let link = storeThis.familytreedata.links[i]
          let source_id = link.source.id
          let target_id = link.target.id

          if (source_id in neighborMap) {
            neighborMap[source_id].add(target_id)
          } else {
            neighborMap[source_id] = new Set([])
            neighborMap[source_id].add(target_id)
          }

          if (target_id in neighborMap) {
            neighborMap[target_id].add(source_id)
          } else {
            neighborMap[target_id] = new Set([])
            neighborMap[target_id].add(source_id)
          }
        }

        function union(setA, setB) {
          let _union = new Set(setA)
          for (let elem of setB) {
            _union.add(elem)
          }
          return _union
        }
        let visitSet = new Set([])
        let neighborSet = neighborMap[from_id]
        if (neighborSet == null) {
          neighborSet = new Set([])
        }
        let oldSize = neighborSet == null ? 0 : neighborSet.size
        let newSize = oldSize
        let finalSet = new Set([])
        finalSet.add(from_id)
        neighborSet.add(from_id)
        do {
          oldSize = newSize
          // eslint-disable-next-line space-in-parens
          for (let it = neighborSet.values(), val = null; (val = it.next().value); ) {
            if (visitSet.has(val)) {
              // do nothing
            } else {
              visitSet.add(val)
              finalSet = union(neighborMap[val], finalSet)
            }
          }
          neighborSet = finalSet
          newSize = neighborSet == null ? 0 : neighborSet.size
        } while (newSize > oldSize)

        if (finalSet.has(to_id)) {
          console.log('is connected')
          return true
        }
        console.log('not connected')
        return false
      }

      node.on('click', function (d) {
        if (!['admin', 'creator'].includes(storeThis.current_access_right)) return
        if (!storeThis.clickSwitch) {
          storeThis.clickSwitch = !storeThis.clickSwitch
          // first click
          // select node
          let click_node = d
          lastClickNode = d

          drag_line
            .classed('hidden', false)
            .attr('stroke-width', '2')
            .attr('d', 'M' + click_node.x + ',' + click_node.y + 'L' + click_node.x + ',' + click_node.y)
        } else {
          // second click
          storeThis.fromsex = lastClickNode.sex
          storeThis.from_person_id = lastClickNode.id
          let firstLevel = lastClickNode.level
          let relationLabel = ''
          relationLabel += lastClickNode.name
          relationLabel += '是'

          lastClickNode = d
          let secondLevel = lastClickNode.level
          relationLabel += lastClickNode.name
          relationLabel += '的:'
          storeThis.tosex = lastClickNode.sex
          storeThis.to_person_id = lastClickNode.id

          storeThis.nodes_connected = checkConnection(storeThis.from_person_id, storeThis.to_person_id)
          storeThis.expect_level_gap = firstLevel - secondLevel

          if (storeThis.to_person_id === storeThis.from_person_id) {
            storeThis.clickSwitch = !storeThis.clickSwitch
            drag_line.attr('stroke-width', '0').style('hidden', 'true').classed('hidden', true)
            return
          }

          storeThis.clickSwitch = !storeThis.clickSwitch
          drag_line.attr('stroke-width', '0').style('hidden', 'true').classed('hidden', true)

          storeThis.buildRelationForm.relationTip = relationLabel
          storeThis.visibleBuildRelation = true
          storeThis.$refs.buildRelationRef?.resetFields()
          storeThis.loadRelationBySex()
        }
      })

      simulation.force('link').links(this.familytreedata.links)

      function contextMenu(menu, openCallback) {
        // create the div element that will hold the context menu
        d3.select('body').selectAll('.d3-context-menu').data([1]).enter().append('div').attr('class', 'd3-context-menu')
        // close menu
        d3.select('body').on('click.d3-context-menu', function () {
          // d3.select('.d3-context-menu').style('display', 'none');
          d3.select('body').select('.d3-context-menu').style('display', 'none')
          // d3.select('body').select('.d3-context-menu').classed('hidden', 'true');
        })

        // this gets executed when a contextmenu event occurs
        return function (data, index) {
          let elm = this

          d3.select('body').selectAll('.d3-context-menu').html('')
          let list = d3.select('body').selectAll('.d3-context-menu').append('ul')
          list
            .selectAll('li')
            .data(menu)
            .enter()
            .append('li')
            .html(function (d) {
              return typeof d.title === 'string' ? d.title : d.title(data)
            })
            .on('click', function (d, i) {
              d.action(elm, data, index)
              // d3.select('.d3-context-menu').style('display', 'none');
              d3.select('body').select('.d3-context-menu').style('display', 'none')
              // d3.select('body').select('.d3-context-menu').classed('hidden', 'true');
            })

          // the openCallback allows an action to fire before the menu is displayed
          // an example usage would be closing a tooltip
          if (openCallback) {
            if (openCallback(data, index) === false) {
              return
            }
          }

          d3.select('.d3-context-menu')
            .style('left', d3.event.pageX - 2 + 'px')
            .style('top', d3.event.pageY - 2 + 'px')
            .style('display', 'block')

          d3.event.preventDefault()
          d3.event.stopPropagation()
        }
      }

      let menu = [
        {
          title: '删除人物',
          action: function (elm, d, i) {
            let personId = d.id
            storeThis
              .$confirm('如果无快照不能恢复哦，确认删除吗？')
              .then(() => {
                storeThis.wholePageLoading = true
                request
                  .delete('/api/v1/person/' + personId)
                  .then((response) => {
                    if (response.data.ok === true) {
                      storeThis.$notify({
                        title: '删除成功',
                        type: 'success',
                        message: response.data.message,
                      })
                      storeThis.wholePageLoading = false
                      storeThis.loadFamilyTree(true)
                    } else {
                      storeThis.$notify.error({
                        title: '删除失败',
                        message: response.data.message,
                      })
                      storeThis.wholePageLoading = false
                    }
                  })
                  .catch(() => {
                    storeThis.$notify.error({
                      title: '删除失败',
                      type: 'error',
                      message: '未知错误',
                    })
                    this.panel_loading = false
                  })
              })
              .catch(() => {})
          },
        },
        {
          title: '人物生平',
          action: function (elm, d, i) {
            storeThis.$router.push('person/' + d.id)
          },
        },
        {
          title: '添加关系',
          action: function (elm, d, i) {
            storeThis.contextName = d.name
            storeThis.contextId = d.id
            storeThis.loadRelationBySingleSex(d.sex)
            storeThis.visibleAddRelation = true
            storeThis.$refs.addRelationRef?.resetFields()
          },
        },
      ]

      let menu_readonly = [
        {
          title: '人物生平',
          action: function (elm, d, i) {
            storeThis.$router.push('person/' + d.id)
          },
        },
      ]
      let menu_droplink = [
        {
          title: '删除关系',
          action: function (elm, d, i) {
            let srcId = d.source.id
            let targetId = d.target.id

            request
              .delete('/api/v1/relation/' + srcId + '/' + targetId)
              .then((response) => {
                if (response.data.ok === true) {
                  storeThis.$notify({
                    title: '成功',
                    type: 'success',
                    message: response.data.message,
                  })

                  storeThis.loadFamilyTree(true)
                } else {
                  storeThis.$notify.error({
                    title: '错误',
                    message: response.data.message,
                  })
                }
              })
              .catch(() => {
                storeThis.$notify.error({
                  title: '错误',
                  message: '未知错误',
                })
              })
          },
        },
      ]

      if (this.current_access_right === 'viewer') {
        node.on('contextmenu', contextMenu(menu_readonly))
      } else {
        node.on('contextmenu', contextMenu(menu))
        link.on('click', contextMenu(menu_droplink))
      }

      // Zoom functions
      function zoom_actions() {
        svg.attr('transform', d3.event.transform)
        storeThis.svg_scale = Number(d3.event.transform.k)
      }
      function ticked() {
        link
          .attr('x1', function (d) {
            return d.source.x + 15
          })
          .attr('y1', function (d) {
            return d.source.y + 15
          })
          .attr('x2', function (d) {
            return d.target.x + 15
          })
          .attr('y2', function (d) {
            return d.target.y + 15
          })

        node
          .attr('transform', function (d) {
            return 'translate(' + d.x + ',' + d.y + ')'
          })
          .attr('cx', function (d) {
            return (d.x = (d.column - 1) * storeThis.columnWidth + storeThis.left_margin)
          })
          .attr('cy', function (d) {
            return (d.y = storeThis.top_margin + storeThis.columnWidth * storeThis.heightWidthRatio * heightPosMap[d.level])
          })
      }

      // function dragged(d) {
      //   d.fx = d3.event.x
      //   d.fy = d3.event.y
      // }
      // function dragended(d) {
      //   if (!d3.event.active) simulation.alphaTarget(0)
      //   d.fx = null
      //   d.fy = null
      // }
      // function chooseColor(d) {
      //   if (d.sex == 1) {
      //     return 'blue'
      //   } else {
      //     return 'red'
      //   }
      // }
    },
    onFtreeChange() {
      this.loadFamilyTree(true)
    },
    clearSVG() {
      // d3.select('svg').selectAll('*').remove()
      d3.select('#svgEl').selectAll('*').remove()
    },
    adjustPanelSize() {
      let svg = d3.select('#svgEl')
      let graphWidth = (this.familytreedata['column-count'] - 1) * this.columnWidth + this.left_margin * 2
      let graphHeight = this.columnWidth * this.familytreedata['svgHeightIndex'] * this.heightWidthRatio + this.rowDistance

      svg.attr('width', graphWidth)
      svg.attr('height', graphHeight)
    },

    async loadFamilyTree(loadRemote) {
      try {
        if (!this.selected_family_tree) return
        if (loadRemote) {
          this.panel_loading = true
          const res = await request.get('/ftree/getFtTreeById?id=' + this.selected_family_tree)
          this.familytreedata = treeAlign(res.data)
        }
        this.clearSVG()
        this.adjustPanelSize()
        this.loadPanelTree()
        this.clickSwitch = false
      } catch (error) {
        // ...
      } finally {
        this.panel_loading = false
      }
    },
    submitBuildRelation() {
      this.$refs.buildRelationRef.validate((valid) => {
        if (!valid) return false
        if (this.nodes_connected) {
          const parent_relation_id = [1, 2]
          const child_relation_id = [5, 6]
          if (parent_relation_id.indexOf(this.buildRelationForm.relation_type) !== -1 && this.expect_level_gap >= 0) {
            return modal.alert('不合情理的关系，请重选(づ￣ 3￣)づ')
          }
          if (child_relation_id.indexOf(this.buildRelationForm.relation_type) !== -1 && this.expect_level_gap <= 0) {
            return modal.alert('不合情理的关系，请重选(づ￣ 3￣)づ')
          }
        }
        this.isBuildRelationSubmit = true
        request
          .post('/ftree/buildFtRelation', {
            treeId: this.selected_family_tree,
            relationType: this.buildRelationForm.relation_type,
            fromPersonId: this.from_person_id,
            toPersonId: this.to_person_id,
          })
          .then(() => {
            this.isBuildRelationSubmit = false
            this.visibleBuildRelation = false
            modal.msgSuccess('操作成功')
            this.loadFamilyTree(true)
          })
          .catch(() => {
            this.isBuildRelationSubmit = false
          })
      })
    },
    submitAddRelation() {
      this.$refs.addRelationRef.validate((valid) => {
        if (!valid) return false
        this.isAddRelationSubmit = true
        request
          .post('/ftree/addFtRelation', {
            treeId: this.selected_family_tree,
            relationType: this.addRelationForm.relation_type,
            fromPersonId: this.contextId,
            toPersonName: this.addRelationForm.name,
          })
          .then(() => {
            this.isAddRelationSubmit = false
            this.visibleAddRelation = false
            modal.msgSuccess('操作成功')
            this.loadFamilyTree(true)
          })
          .catch(() => {
            this.isAddRelationSubmit = false
          })
      })
    },
    openAddTree() {
      this.$router.push('/create-family-tree')
    },
    openAddPerson() {
      if (!this.selected_family_tree) return modal.alert('您尚未选中一个家谱')
      this.visibleAddPerson = true
      this.$refs.addPersonRef?.resetFields()
    },
    submitAddPerson() {
      this.$refs.addPersonRef.validate((valid) => {
        if (!valid) return false
        this.isAddPersonSubmit = true
        request
          .post('/ftree/addFtPerson', {
            name: this.addPersonForm.name,
            sex: this.addPersonForm.sex,
            treeId: this.selected_family_tree,
          })
          .then(() => {
            this.isAddPersonSubmit = false
            this.visibleAddPerson = false
            modal.msgSuccess('创建成功')
            this.loadFamilyTree(true)
          })
          .catch(() => {
            this.isAddPersonSubmit = false
          })
      })
    },
    clearPeople() {
      if (!this.selected_family_tree) return modal.alert('您尚未选中一个家谱')
      if (this.familytreedata.nodes == null || this.familytreedata.nodes.length < 1) {
        return modal.alert('当前家谱没有人物节点')
      }
      this.$confirm('删除本家谱所有人物，请谨慎操作，确认删除？')
        .then(() => {
          this.wholePageLoading = true
          request
            .delete('/api/v1/familytree/familytreepeople/' + this.selected_family_tree)
            .then(() => {
              modal.msgSuccess('清空家谱人物成功')
              this.wholePageLoading = false
              this.loadFamilyTree(true)
            })
            .catch(() => {
              modal.msgError('清空发生了错误')
              this.wholePageLoading = false
            })
        })
        .catch(() => {})
    },
    exportExcel() {
      if (!this.selected_family_tree) return modal.alert('您尚未选中一个家谱')
      if (this.familytreedata.nodes == null || this.familytreedata.nodes.length < 1) {
        modal.alert('当前家谱没有人物节点')
        return
      }
      this.wholePageLoading = true
      request
        .post('/api/v1/familytree/excel', {
          family_tree_id: this.selected_family_tree,
        })
        .then((response) => {
          this.wholePageLoading = false
          let downloadForm = document.createElement('form')
          downloadForm.setAttribute('method', 'post')
          downloadForm.setAttribute('action', this.rest_base + '/api/v1/familytree/download')
          let pathfield = document.createElement('input')
          pathfield.setAttribute('type', 'hidden')
          pathfield.setAttribute('name', 'path')
          pathfield.setAttribute('value', response.data.data)
          downloadForm.appendChild(pathfield)
          document.body.appendChild(downloadForm)
          downloadForm.submit()
        })
        .catch(() => {
          this.wholePageLoading = false
        })
    },
    exportImage() {
      if (!this.selected_family_tree) return modal.alert('您尚未选中一个家谱')
      if (this.familytreedata.nodes == null || this.familytreedata.nodes.length < 1) {
        return modal.alert('当前家谱没有人物节点')
      }

      this.resetPosition()
      this.wholePageLoading = true
      let doctype =
        '<?xml version="1.0" standalone="no"?>' +
        '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">'

      // serialize our SVG XML to a string.
      let source = new XMLSerializer().serializeToString(d3.select('#svgEl').node())
      let blob = new Blob([doctype + source], { type: 'image/svg+xml;charset=utf-8' })
      let url = window.URL.createObjectURL(blob)
      console.log(url)
      let downloadImg = document.createElement('img')
      downloadImg.src = url

      let storeThis = this

      downloadImg.onload = function () {
        let canvas = document.createElement('canvas')
        canvas.width = d3.select('#svgEl').attr('width')
        canvas.height = d3.select('#svgEl').attr('height')
        let ctx = canvas.getContext('2d')
        // this.setAttributeNS(xlinkNS, 'href', canvas.toDataURL());
        ctx.font = '28px Arial'
        ctx.fillStyle = 'rgba(180,180,180,0.9)'
        ctx.fillText('家谱海 familytreesea.com', 0, 30)
        ctx.drawImage(downloadImg, 0, 0)

        try {
          if (canvas.toBlobHD != null) {
            canvas.toBlobHD(function (blob) {
              FileSaver.saveAs(blob, 'family.png')
            }, 'image/png')
            storeThis.wholePageLoading = false
          } else {
            modal.alert('该功能仅支持谷歌(Chrome)，火狐(Firefox)，猎豹和遨游等浏览器')
          }
        } catch (err) {
          modal.alert('该功能仅支持谷歌(Chrome)，火狐(Firefox)，猎豹和遨游等浏览器')
        }
      }
    },
    getMyFamilyTrees() {
      list_ftree().then((res) => {
        this.myfamilytrees = res.data
      })
    },
  },
})
</script>

<style lang="scss">
.page-ftree-desk {
  position: relative;
  box-sizing: border-box;
  display: flex;
  width: 100%;
  height: 100%;
  background-color: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  transition: 0.3s;
  .panel-sidebar {
    box-sizing: border-box;
    width: 300px;
    height: 100%;
    border-right: 1px solid #e4e7ed;
    .side-op {
      margin: 10px 50px 0;
    }
  }
  .panel-board {
    position: relative;
    box-sizing: border-box;
    flex: 1;
    min-width: 0;
    height: 100%;
    overflow: hidden;
  }
  .board-ratio {
    position: absolute;
    bottom: 20px;
    left: 310px;
  }
  .panel-tools {
    position: absolute;
    top: 20px;
    left: 310px;
    width: 30px;
    .btn-item {
      width: 30px;
      height: 30px;
      border: none;
      & + .btn-item {
        margin-top: 10px;
      }
      &:hover {
        cursor: pointer;
        opacity: 0.8;
      }
    }
    .add-person-plus {
      background: url('@/assets/images/plus30.png') no-repeat;
      background-size: 100% 100%;
    }
    .clear-person-plus {
      background: url('@/assets/images/clear.png') no-repeat;
      background-size: 100% 100%;
    }
    .export-img-plus {
      background: url('@/assets/images/screenshot.png') no-repeat;
      background-size: 100% 100%;
    }
    .export-excel-plus {
      background: url('@/assets/images/excel30.png') no-repeat;
      background-size: 100% 100%;
    }
    .reset-pos {
      background: url('@/assets/images/resetpos.png') no-repeat;
      background-size: 100% 100%;
    }
  }
  .nodes circle {
    stroke: #fff;
    stroke-width: 1.5px;
  }
  path.link {
    cursor: default;
    fill: none;
    stroke: #000;
    stroke: black;
    stroke-width: 4px;
  }
  svg:not(.active, .ctrl) path.link {
    cursor: pointer;
  }
  path.link.selected {
    stroke-dasharray: 10, 2;
  }
  path.link.dragline {
    pointer-events: none;
  }
  path.link.dragline.hidden {
    stroke-width: 0;
  }
  path.link.hidden {
    stroke-width: 0;
  }
}
</style>
