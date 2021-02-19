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
        <el-input v-model="query.enabled" clearable placeholder="资产状态，0-闲置，1-在用，2-报废" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <!--        <el-select v-model="query.enabled" filterable placeholder="请选择">
          <el-option
            v-for="item in dict.property_enabled"
            :key="item.id"
            :label="item.label"
            :value="item.value" />
        </el-select>-->
        <label class="el-form-item-label">资产类别，0-设备，1-仪器，2-工具，3-家具</label>
        <el-input v-model="query.propertyType" clearable placeholder="资产类别，0-设备，1-仪器，2-工具，3-家具" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <!--        <el-select v-model="query.propertyType" filterable placeholder="请选择">
          <el-option
            v-for="item in dict.property_type"
            :key="item.id"
            :label="item.label"
            :value="item.value" />
        </el-select>-->
        <label class="el-form-item-label">存放部门</label>
        <el-input v-model="query.deptId" clearable placeholder="存放部门" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <!--        <treeselect
          v-model="form.dept.id"
          :options="depts"
          :load-options="loadDepts"
          style="width: 178px"
          placeholder="选择部门"
        />-->
        <label class="el-form-item-label">责任人</label>
        <!--        <el-input v-model="query.user.name" clearable placeholder="责任人" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />-->
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="ID">
            <el-input v-model="form.propertyId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="资产名称" prop="name">
            <el-input v-model="form.name" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="资产状态" prop="enabled">
            <!--            <el-select v-model="form.enabled" filterable placeholder="请选择">
              <el-option
                v-for="item in dict.property_enabled"
                :key="item.id"
                :label="item.label"
                :value="item.value" />
            </el-select>-->
          </el-form-item>
          <el-form-item label="资产类别" prop="propertyType">
            <!--            <el-select v-model="form.propertyType" filterable placeholder="请选择">
              <el-option
                v-for="item in dict.property_type"
                :key="item.id"
                :label="item.label"
                :value="item.value" />
            </el-select>-->
          </el-form-item>
          <el-form-item label="存放部门">
            <el-input v-model="form.deptId" style="width: 370px;" />
            <!--            <treeselect
              v-model="form.dept.id"
              :options="depts"
              :load-options="loadDepts"
              style="width: 178px"
              placeholder="选择部门"
            />-->
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
        <el-table-column prop="deptId" label="存放部门">
          <!--          <template slot-scope="scope">
            <div>{{ scope.row.dept.name }}</div>
          </template>-->
        </el-table-column>
        <el-table-column prop="userId" label="责任人">
          <!--          <template slot-scope="scope">
            <div>{{ scope.row.user.name }}</div>
          </template>-->
        </el-table-column>
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
/* import { LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect'
import { getDepts } from '@/api/system/dept' */

const defaultForm = { propertyId: null, name: null, enabled: null, propertyType: null, dept: { id: null }, deptId: null, user: { id: null }, userId: null, createBy: null, updateBy: null, createTime: null, updateTime: null }
export default {
  name: 'AppProperty',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  dicts: ['property_enabled', 'property_type'],
  cruds() {
    return CRUD({ title: 'IfProperty', url: 'api/appProperty', idField: 'propertyId', sort: 'propertyId,desc', crudMethod: { ...crudAppProperty }})
  },
  // 获取弹窗内部门数据
  /* loadDepts({ action, parentNode, callback }) {
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
  }, */
  data() {
    return {
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
        { key: 'deptId', display_name: '存放部门' },
        { key: 'userId', display_name: '责任人' }
      ]
    }
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    }
  }
}
</script>

<style scoped>

</style>
