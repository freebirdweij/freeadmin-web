<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">ID</label>
        <el-input v-model="query.remainId" clearable placeholder="ID" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">仓库ID，由字典实现</label>
        <el-input v-model="query.storeId" clearable placeholder="仓库ID，由字典实现" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">货物ID</label>
        <el-input v-model="query.goodsId" clearable placeholder="货物ID" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">更新者</label>
        <el-input v-model="query.updateBy" clearable placeholder="更新者" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <date-range-picker
          v-model="query.updateTime"
          start-placeholder="updateTimeStart"
          end-placeholder="updateTimeStart"
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
            <el-input v-model="form.remainId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="仓库ID，由字典实现" prop="storeId">
            <el-select v-model="form.storeId" filterable placeholder="请选择">
              <el-option
                v-for="item in dict.store_id"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="货物ID" prop="goodsId">
            <el-input v-model="form.goodsId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="库存数量" prop="counts">
            <el-input v-model="form.counts" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="库存金额" prop="amount">
            <el-input v-model="form.amount" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="创建者">
            <el-input v-model="form.createBy" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="更新者">
            <el-input v-model="form.updateBy" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="创建日期">
            <el-input v-model="form.createTime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="更新时间">
            <el-input v-model="form.updateTime" style="width: 370px;" />
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
        <el-table-column prop="remainId" label="ID" />
        <el-table-column prop="storeId" label="仓库ID，由字典实现">
          <template slot-scope="scope">
            {{ dict.label.store_id[scope.row.storeId] }}
          </template>
        </el-table-column>
        <el-table-column prop="goodsId" label="货物ID" />
        <el-table-column prop="counts" label="库存数量" />
        <el-table-column prop="amount" label="库存金额" />
        <el-table-column prop="updateBy" label="更新者" />
        <el-table-column prop="updateTime" label="更新时间" />
        <el-table-column v-if="checkPer(['admin','storeRemain:edit','storeRemain:del'])" label="操作" width="150px" align="center">
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
import crudStoreRemain from '@/api/store/storeRemain'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { remainId: null, storeId: null, goodsId: null, counts: null, amount: null, createBy: null, updateBy: null, createTime: null, updateTime: null }
export default {
  name: 'StoreRemain',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  dicts: ['store_id'],
  cruds() {
    return CRUD({ title: '库存', url: 'api/storeRemain', idField: 'remainId', sort: 'remainId,desc', crudMethod: { ...crudStoreRemain }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'storeRemain:add'],
        edit: ['admin', 'storeRemain:edit'],
        del: ['admin', 'storeRemain:del']
      },
      rules: {
        storeId: [
          { required: true, message: '仓库ID，由字典实现不能为空', trigger: 'blur' }
        ],
        goodsId: [
          { required: true, message: '货物ID不能为空', trigger: 'blur' }
        ],
        counts: [
          { required: true, message: '库存数量不能为空', trigger: 'blur' }
        ],
        amount: [
          { required: true, message: '库存金额不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'remainId', display_name: 'ID' },
        { key: 'storeId', display_name: '仓库ID，由字典实现' },
        { key: 'goodsId', display_name: '货物ID' },
        { key: 'updateBy', display_name: '更新者' }
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
