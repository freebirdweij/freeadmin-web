<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">ID</label>
        <el-input v-model="query.supplyId" clearable placeholder="ID" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">供应商号</label>
        <el-input v-model="query.supplyCode" clearable placeholder="供应商号" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">供应商名称</label>
        <el-input v-model="query.name" clearable placeholder="供应商名称" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">联系人</label>
        <el-input v-model="query.contact" clearable placeholder="联系人" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">联系电话</label>
        <el-input v-model="query.phone" clearable placeholder="联系电话" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">地址</label>
        <el-input v-model="query.address" clearable placeholder="地址" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">网址</label>
        <el-input v-model="query.webadd" clearable placeholder="网址" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">邮箱</label>
        <el-input v-model="query.email" clearable placeholder="邮箱" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="ID">
            <el-input v-model="form.supplyId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="供应商号" prop="supplyCode">
            <el-input v-model="form.supplyCode" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="供应商名称" prop="name">
            <el-input v-model="form.name" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="联系人" prop="contact">
            <el-input v-model="form.contact" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="联系电话" prop="phone">
            <el-input v-model="form.phone" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="传真">
            <el-input v-model="form.fax" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="地址" prop="address">
            <el-input v-model="form.address" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="邮政编码">
            <el-input v-model="form.zipcode" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="网址">
            <el-input v-model="form.webadd" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="form.email" style="width: 370px;" />
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
        <el-table-column prop="supplyCode" label="供应商号" />
        <el-table-column prop="name" label="供应商名称" />
        <el-table-column prop="contact" label="联系人" />
        <el-table-column prop="phone" label="联系电话" />
        <el-table-column prop="webadd" label="网址" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column v-if="checkPer(['admin','storeSupply:edit','storeSupply:del'])" label="操作" width="150px" align="center">
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
import crudStoreSupply from '@/api/store/storeSupply'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = {
  supplyId: null,
  supplyCode: null,
  name: null,
  contact: null,
  phone: null,
  fax: null,
  address: null,
  zipcode: null,
  webadd: null,
  email: null,
  createBy: null,
  updateBy: null,
  createTime: null,
  updateTime: null
}
export default {
  name: 'StoreSupply',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({
      title: '供应商',
      url: 'api/storeSupply',
      idField: 'supplyId',
      sort: 'supplyId,desc',
      crudMethod: { ...crudStoreSupply }
    })
  },
  data() {
    return {
      permission: {
        add: ['admin', 'storeSupply:add'],
        edit: ['admin', 'storeSupply:edit'],
        del: ['admin', 'storeSupply:del']
      },
      rules: {
        supplyCode: [
          { required: true, message: '供应商号不能为空', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '供应商名称不能为空', trigger: 'blur' }
        ],
        contact: [
          { required: true, message: '联系人不能为空', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '联系电话不能为空', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '地址不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'supplyId', display_name: 'ID' },
        { key: 'supplyCode', display_name: '供应商号' },
        { key: 'name', display_name: '供应商名称' },
        { key: 'contact', display_name: '联系人' },
        { key: 'phone', display_name: '联系电话' },
        { key: 'address', display_name: '地址' },
        { key: 'webadd', display_name: '网址' },
        { key: 'email', display_name: '邮箱' }
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
