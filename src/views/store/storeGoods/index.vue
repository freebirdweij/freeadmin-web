<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">ID</label>
        <el-input v-model="query.goodsId" clearable placeholder="ID" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">商品号</label>
        <el-input v-model="query.goodsCode" clearable placeholder="商品号" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">货物名称</label>
        <el-input v-model="query.name" clearable placeholder="货物名称" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">单位，由字典实现</label>
        <el-input v-model="query.unit" clearable placeholder="单位，由字典实现" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">供应商</label>
        <el-input v-model="query.supplyId" clearable placeholder="供应商" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">单价</label>
        <el-input v-model="query.price" clearable placeholder="单价" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">货物类别，由字典实现</label>
        <el-input v-model="query.goodsType" clearable placeholder="货物类别，由字典实现" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="ID">
            <el-input v-model="form.goodsId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="商品号" prop="goodsCode">
            <el-input v-model="form.goodsCode" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="货物名称" prop="name">
            <el-input v-model="form.name" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="单位，由字典实现" prop="unit">
            <el-select v-model="form.unit" filterable placeholder="请选择">
              <el-option
                v-for="item in dict.goods_unit"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="供应商" prop="supplyId">
            <el-input v-model="form.supplyId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="单价" prop="price">
            <el-input v-model="form.price" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="货物类别，由字典实现">
            <el-select v-model="form.goodsType" filterable placeholder="请选择">
              <el-option
                v-for="item in dict.goods_type"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
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
        <el-table-column prop="goodsCode" label="商品号" />
        <el-table-column prop="name" label="货物名称" />
        <el-table-column prop="unit" label="单位，由字典实现">
          <template slot-scope="scope">
            {{ dict.label.goods_unit[scope.row.unit] }}
          </template>
        </el-table-column>
        <el-table-column prop="supplyId" label="供应商" />
        <el-table-column prop="price" label="单价" />
        <el-table-column v-if="checkPer(['admin','storeGoods:edit','storeGoods:del'])" label="操作" width="150px" align="center">
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
import crudStoreGoods from '@/api/store/storeGoods'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { goodsId: null, goodsCode: null, name: null, unit: null, supplyId: null, price: null, goodsType: null, createBy: null, updateBy: null, createTime: null, updateTime: null }
export default {
  name: 'StoreGoods',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  dicts: ['goods_unit', 'goods_type'],
  cruds() {
    return CRUD({ title: '货物', url: 'api/storeGoods', idField: 'goodsId', sort: 'goodsId,desc', crudMethod: { ...crudStoreGoods }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'storeGoods:add'],
        edit: ['admin', 'storeGoods:edit'],
        del: ['admin', 'storeGoods:del']
      },
      rules: {
        goodsCode: [
          { required: true, message: '商品号不能为空', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '货物名称不能为空', trigger: 'blur' }
        ],
        unit: [
          { required: true, message: '单位，由字典实现不能为空', trigger: 'blur' }
        ],
        supplyId: [
          { required: true, message: '供应商不能为空', trigger: 'blur' }
        ],
        price: [
          { required: true, message: '单价不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'goodsId', display_name: 'ID' },
        { key: 'goodsCode', display_name: '商品号' },
        { key: 'name', display_name: '货物名称' },
        { key: 'unit', display_name: '单位，由字典实现' },
        { key: 'supplyId', display_name: '供应商' },
        { key: 'price', display_name: '单价' },
        { key: 'goodsType', display_name: '货物类别，由字典实现' }
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
