<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">ID</label>
        <el-input v-model="query.propertyId" clearable placeholder="ID" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">资产名称</label>
        <el-input v-model="query.name" clearable placeholder="资产名称" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">资产状态，0-闲置，1-在用，2-报废</label>
        <el-select v-model="query.enabled" filterable placeholder="请选择">
          <el-option
            v-for="item in dict.property_enabled"
            :key="item.id"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <label class="el-form-item-label">资产类别，0-设备，1-仪器，2-工具，3-家具</label>
        <el-select v-model="query.propertyType" filterable placeholder="请选择">
          <el-option
            v-for="item in dict.property_type"
            :key="item.id"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <label class="el-form-item-label">
          <treeselect
            v-model="query.deptId"
            :options="depts"
            :load-options="loadDepts"
            style="width: 178px"
            placeholder="选择部门"
          />
        </label>
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="ID">
            <el-input v-model="form.propertyId" style="width: 370px;" readonly />
          </el-form-item>
          <el-form-item label="资产名称" prop="name">
            <el-input v-model="form.name" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="资产状态" prop="enabled">
            <el-select v-model="form.enabled" filterable placeholder="请选择">
              <el-option
                v-for="item in dict.property_enabled"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="资产类别" prop="propertyType">
            <el-select v-model="form.propertyType" filterable placeholder="请选择">
              <el-option
                v-for="item in dict.property_type"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="存放部门" prop="dept.id">
            <treeselect
              v-model="form.deptId"
              :options="depts"
              :load-options="loadDepts"
              style="width: 178px"
              placeholder="选择部门"
            />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="propertyId" label="ID" />
        <el-table-column prop="name" label="资产名称" />
        <el-table-column prop="enabled" label="资产状态">
          <template slot-scope="scope">
            {{ dict.label.property_enabled[scope.row.enabled] }}
          </template>
        </el-table-column>
        <el-table-column prop="propertyType" label="资产类别">
          <template slot-scope="scope">
            {{ dict.label.property_type[scope.row.propertyType] }}
          </template>
        </el-table-column>
        <el-table-column prop="dept.name" label="存放部门" />
        <el-table-column prop="user.username" label="责任人" />
        <el-table-column prop="createTime" label="创建日期" />
        <el-table-column v-if="checkPer(['admin','appProperty:edit','appProperty:del'])" label="操作" width="150px" align="center">
          <template slot-scope="scope">
            <udOperation
              :data="scope.row"
              :permission="permission"
            />
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import crudAppProperty from '@/api/appProperty'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import DateRangePicker from '@/components/DateRangePicker'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { getDepts, getDeptSuperior } from '@/api/system/dept'
import { mapGetters } from 'vuex'
import { LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect'

const defaultForm = { propertyId: null, name: null, enabled: null, propertyType: null, deptId: null, userId: null, createBy: null, updateBy: null, createTime: null, updateTime: null }
export default {
  name: 'AppProperty',
  // eslint-disable-next-line vue/no-unused-components
  components: { Treeselect, crudOperation, rrOperation, udOperation, pagination, DateRangePicker },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  dicts: ['property_enabled', 'property_type'],
  cruds() {
    return CRUD({ title: 'IfProperty', url: 'api/appProperty', idField: 'propertyId', sort: 'propertyId,desc', crudMethod: { ...crudAppProperty }})
  },
  data() {
    return {
      height: document.documentElement.clientHeight - 180 + 'px;',
      deptName: '', depts: [], deptDatas: [], jobs: [], level: 3, roles: [],
      jobDatas: [], roleDatas: [], // 多选时使用
      defaultProps: { children: 'children', label: 'name', isLeaf: 'leaf' },
      permission: {
        add: ['admin', 'appProperty:add'],
        edit: ['admin', 'appProperty:edit'],
        del: ['admin', 'appProperty:del']
      },
      rules: {
        name: [
          { required: true, message: '资产名称不能为空', trigger: 'blur' }
        ],
        enabled: [
          { required: true, message: '资产状态，0-闲置，1-在用，2-报废不能为空', trigger: 'blur' }
        ],
        propertyType: [
          { required: true, message: '资产类别，0-设备，1-仪器，2-工具，3-家具不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'propertyId', display_name: 'ID' },
        { key: 'name', display_name: '资产名称' },
        { key: 'enabled', display_name: '资产状态，0-闲置，1-在用，2-报废' },
        { key: 'propertyType', display_name: '资产类别，0-设备，1-仪器，2-工具，3-家具' },
        { key: 'deptId', display_name: '存放部门' }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'user'
    ])
  },
  created() {
    this.crud.msg.add = '新增成功，默认密码：123456'
  },
  /* mounted: function() {
    const that = this
    window.onresize = function temp() {
      that.height = document.documentElement.clientHeight - 180 + 'px;'
    }
  }, */
  methods: {
    // 新增与编辑前做的操作
    [CRUD.HOOK.afterToCU](crud, form) {
      // this.getRoles()
      if (form.propertyId == null) {
        this.getDepts()
      } else {
        this.getSupDepts(form.dept.id)
      }
      // this.getRoleLevel()
      // this.getJobs()
      form.enabled = form.enabled.toString()
      form.propertyType = form.propertyType.toString()
    },
    // 新增前将多选的值设置为空
    [CRUD.HOOK.afterRefresh]() {
      this.getDepts()
    },
    // 提交前做的操作
    [CRUD.HOOK.afterValidateCU](crud) {
      if (!crud.form.deptId) {
        this.$message({
          message: '部门不能为空',
          type: 'warning'
        })
        return false
      } else if (this.roleDatas.length === 0) {
        return true
      }
      return true
    },
    getDepts() {
      getDepts({ enabled: true }).then(res => {
        this.depts = res.content.map(function(obj) {
          if (obj.hasChildren) {
            obj.children = null
          }
          return obj
        })
      })
    },
    getSupDepts(deptId) {
      getDeptSuperior(deptId).then(res => {
        const date = res.content
        this.buildDepts(date)
        this.depts = date
      })
    },
    buildDepts(depts) {
      depts.forEach(data => {
        if (data.children) {
          this.buildDepts(data.children)
        }
        if (data.hasChildren && !data.children) {
          data.children = null
        }
      })
    },
    // 切换部门
    handleNodeClick(data) {
      if (data.pid === 0) {
        this.query.deptId = null
      } else {
        this.query.deptId = data.id
      }
      this.crud.toQuery()
    },
    // 获取弹窗内部门数据
    loadDepts({ action, parentNode, callback }) {
      if (action === LOAD_CHILDREN_OPTIONS) {
        getDepts({ enabled: true, pid: parentNode.id }).then(res => {
          parentNode.children = res.content.map(function(obj) {
            if (obj.hasChildren) {
              obj.children = null
            }
            return obj
          })
          setTimeout(() => {
            callback()
          }, 200)
        })
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .vue-treeselect__control,::v-deep .vue-treeselect__placeholder,::v-deep .vue-treeselect__single-value {
  height: 30px;
  line-height: 30px;
}
</style>
