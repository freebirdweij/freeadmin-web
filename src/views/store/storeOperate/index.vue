<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">ID</label>
        <el-input v-model="query.operateId" clearable placeholder="ID" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">库存ID</label>
        <el-input v-model="query.remainId" clearable placeholder="库存ID" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">与本次操作相关人员</label>
        <el-input v-model="query.userId" clearable placeholder="与本次操作相关人员" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">操作类型，由字典实现</label>
        <el-input v-model="query.operateType" clearable placeholder="操作类型，由字典实现" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">操作数量</label>
        <el-input v-model="query.counts" clearable placeholder="操作数量" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <date-range-picker
          v-model="query.amount"
          start-placeholder="amountStart"
          end-placeholder="amountStart"
          class="date-item"
        />
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="ID">
            <el-input v-model="form.operateId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="库存ID" prop="remainId">
            <el-input v-model="form.remainId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="与本次操作相关人员" prop="userId">
            <el-input v-model="form.userId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="操作类型，由字典实现" prop="operateType">
            <el-select v-model="form.operateType" filterable placeholder="请选择">
              <el-option
                v-for="item in dict.operate_type"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="操作数量" prop="counts">
            <el-input v-model="form.counts" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="操作金额" prop="amount">
            <el-input v-model="form.amount" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="创建者">
            <el-input v-model="form.createBy" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="创建日期">
            <el-input v-model="form.createTime" style="width: 370px;" />
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
        <el-table-column prop="remainId" label="库存ID" />
        <el-table-column prop="userId" label="与本次操作相关人员" />
        <el-table-column prop="operateType" label="操作类型，由字典实现">
          <template slot-scope="scope">
            {{ dict.label.operate_type[scope.row.operateType] }}
          </template>
        </el-table-column>
        <el-table-column prop="counts" label="操作数量" />
        <el-table-column prop="amount" label="操作金额" />
        <el-table-column v-if="checkPer(['admin','storeOperate:edit','storeOperate:del'])" label="操作" width="150px" align="center">
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
import crudStoreOperate from '@/api/store/storeOperate'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { operateId: null, remainId: null, userId: null, operateType: null, counts: null, amount: null, createBy: null, updateBy: null, createTime: null, updateTime: null }
export default {
  name: 'StoreOperate',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  dicts: ['operate_type'],
  cruds() {
    return CRUD({ title: '仓库操作', url: 'api/storeOperate', idField: 'operateId', sort: 'operateId,desc', crudMethod: { ...crudStoreOperate }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'storeOperate:add'],
        edit: ['admin', 'storeOperate:edit'],
        del: ['admin', 'storeOperate:del']
      },
      rules: {
        remainId: [
          { required: true, message: '库存ID不能为空', trigger: 'blur' }
        ],
        userId: [
          { required: true, message: '与本次操作相关人员不能为空', trigger: 'blur' }
        ],
        operateType: [
          { required: true, message: '操作类型，由字典实现不能为空', trigger: 'blur' }
        ],
        counts: [
          { required: true, message: '操作数量不能为空', trigger: 'blur' }
        ],
        amount: [
          { required: true, message: '操作金额不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'operateId', display_name: 'ID' },
        { key: 'remainId', display_name: '库存ID' },
        { key: 'userId', display_name: '与本次操作相关人员' },
        { key: 'operateType', display_name: '操作类型，由字典实现' },
        { key: 'counts', display_name: '操作数量' }
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
