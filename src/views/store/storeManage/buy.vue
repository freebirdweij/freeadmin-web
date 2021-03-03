<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">仓库</label>
        <el-select v-model="query.storeId" filterable placeholder="请选择">
          <el-option
            v-for="item in dict.store_id"
            :key="item.id"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <label class="el-form-item-label">货物编号</label>
        <el-input v-model="query.goodsCode" clearable placeholder="货物ID" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">货物名称</label>
        <el-input v-model="query.goodsName" clearable placeholder="货物ID" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">供应商</label>
        <el-input v-model="query.supplyName" clearable placeholder="货物ID" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="仓库" prop="storeId">
            <el-select v-model="form.storeId" filterable placeholder="请选择">
              <el-option
                v-for="item in dict.store_id"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="货物编号" prop="goods.goodsCode">
            <el-input v-model="form.goods.goodsCode" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="货物名称" prop="goods.name">
            <el-input v-model="form.goods.name" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="货物单位" prop="goods.unit">
            <el-select v-model="form.goods.unit" filterable placeholder="请选择">
              <el-option
                v-for="item in dict.goods_unit"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="货物单价" prop="goods.price">
            <el-input v-model="form.goods.price" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="供应商" prop="goods.supply.name">
            <el-input v-model="form.goods.supply.name" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="新增数量" prop="counts">
            <el-input v-model="form.counts" style="width: 370px;" />
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
        <el-table-column prop="storeId" label="仓库">
          <template slot-scope="scope">
            {{ dict.label.store_id[scope.row.storeId] }}
          </template>
        </el-table-column>
        <el-table-column prop="goods.goodsCode" label="货物编号" />
        <el-table-column prop="goods.name" label="货物名称" />
        <el-table-column prop="goods.unit" label="货物单位">
          <template slot-scope="scope">
            {{ dict.label.goods_unit[scope.row.goods.unit] }}
          </template>
        </el-table-column>
        <el-table-column prop="goods.supply.name" label="供应商" />
        <el-table-column prop="counts" label="库存数量" />
        <el-table-column prop="amount" label="库存金额" />
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
import crudStoreRemain from '@/api/store/storeBuy'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { remainId: null, storeId: null, goodsId: null, goods: { goodsId: null, goodsCode: null, name: null, unit: null, price: null, supply: { name: null }}, counts: null, amount: null, createBy: null, updateBy: null, createTime: null, updateTime: null }
export default {
  name: 'StoreBuy',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  dicts: ['store_id', 'goods_unit'],
  cruds() {
    return CRUD({ title: '库存', url: 'api/storeBuy', idField: 'remainId', sort: 'remainId,desc', crudMethod: { ...crudStoreRemain }})
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
