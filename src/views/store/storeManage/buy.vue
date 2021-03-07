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
        <el-input v-model="query.goodsName" clearable placeholder="货物名称" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">供应商</label>
        <el-input v-model="query.supplyName" clearable placeholder="供应商" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog ref="dialog" :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="仓库" prop="storeId">
            <el-select v-model="form.storeId" filterable placeholder="请选择" :disabled="inGoods">
              <el-option
                v-for="item in dict.store_id"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="货物编号" prop="goods.goodsCode">
            <el-input v-model="form.goods.goodsCode" style="width: 370px;" :disabled="inGoods" />
          </el-form-item>
          <el-form-item label="货物名称" prop="goods.name">
            <el-input v-model="form.goods.name" style="width: 370px;" :disabled="inGoods" />
          </el-form-item>
          <el-form-item label="货物单位" prop="goods.unit">
            <el-select v-model="form.goods.unit" filterable placeholder="请选择" :disabled="inGoods">
              <el-option
                v-for="item in dict.goods_unit"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="货物单价" prop="goods.price">
            <el-input v-model="form.goods.price" style="width: 370px;" :disabled="inGoods" />
          </el-form-item>
          <el-form-item label="供应商" prop="goods.supply.name">
            <div class="search">
              <input v-model="keyword" style="width: 370px;" placeholder="请输入供应商名称">
            </div>
            <div v-show="isshow" ref="search" class="search-content">
              <ul>
                <li v-for="item of list" :key="item.id" class="search-item border-bottom" @click="handleSupplyClick(item)">{{ item.name }}</li>
                <li v-show="hasNoData" class="search-item border-bottom">没有找到匹配数据</li>
              </ul>
            </div>
          </el-form-item>
          <div v-if="inGoods===0">
            <el-form-item ref="counts" label="新增数量" prop="counts">
              <el-input v-model="form.counts" style="width: 370px;" />
            </el-form-item>
          </div>
          <div v-else-if="inGoods===1">
            <el-form-item ref="counts" label="进货数量" prop="counts">
              <el-input v-model="form.counts" style="width: 370px;" />
            </el-form-item>
          </div>
          <div v-else>
            <el-form-item ref="counts" label="退货数量" prop="counts">
              <el-input v-model="form.counts" style="width: 370px;" />
            </el-form-item>
          </div>
        </el-form>
        <div v-if="inGoods===0" slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
        <div v-else-if="inGoods===1" slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.status.cu === 2" type="primary" @click="doIngoods(form)">确认</el-button>
        </div>
        <div v-else slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.status.cu === 2" type="primary" @click="doOutgoods(form)">确认</el-button>
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
            <el-button
              v-permission="['admin','store:output']"
              :disabled="showButton"
              :loading="menuLoading"
              icon="el-icon-check"
              size="mini"
              style="float: right; padding: 6px 9px"
              type="primary"
              @click="outputGoods(scope.row)"
            >退货</el-button>
            <el-button
              v-permission="['admin','store:input']"
              :disabled="showButton"
              :loading="menuLoading"
              icon="el-icon-check"
              size="mini"
              style="float: right; padding: 6px 9px"
              type="primary"
              @click="inputGoods(scope.row)"
            >进货</el-button>
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
import { getSupplys } from '@/api/store/storeSupply'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'
import Vue from 'vue'
import Bscroll from 'better-scroll'

const defaultForm = { remainId: null, storeId: null, goodsId: null, goods: { goodsId: null, goodsCode: null, name: null, unit: null, price: null, supply: { name: null }}, counts: null, amount: null, createBy: null, updateBy: null, createTime: null, updateTime: null }
export default {
  name: 'StoreBuy',
  components: { pagination, crudOperation, rrOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  dicts: ['store_id', 'goods_unit'],
  cruds() {
    return CRUD({ title: '库存', url: 'api/storeBuy', idField: 'remainId', sort: 'remainId,desc', crudMethod: { ...crudStoreRemain }})
  },
  data() {
    return {
      keyword: '',
      isshow: '',
      list: [],
      supplys: [],
      timer: null,
      permission: {
        add: ['admin', 'storeRemain:add'],
        edit: ['admin', 'storeRemain:edit'],
        del: ['admin', 'storeRemain:del']
      },
      rules: {
        storeId: [
          { required: true, message: '仓库ID，由字典实现不能为空', trigger: 'blur' }
        ],
        goods: {
          goodsCode: [
            { required: true, message: '货物编号不能为空', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '货物名称不能为空', trigger: 'blur' }
          ],
          unit: [
            { required: true, message: '货物单位不能为空', trigger: 'blur' }
          ],
          price: [
            { required: true, message: '货物单价不能为空', trigger: 'blur' }
          ],
          supply: {
            name: [
              { required: true, message: '供应商不能为空', trigger: 'blur' }
            ]
          }
        },
        counts: [
          { required: true, message: '数量不能为空', trigger: 'blur' }
        ],
        amount: [
          { required: true, message: '库存金额不能为空', trigger: 'blur' }
        ]
      },
      inGoods: 0, menuLoading: false, showButton: false,
      queryTypeOptions: [
        { key: 'remainId', display_name: 'ID' },
        { key: 'storeId', display_name: '仓库ID，由字典实现' },
        { key: 'goodsId', display_name: '货物ID' },
        { key: 'updateBy', display_name: '更新者' }
      ]
    }
  },
  computed: {
    hasNoData() {
      return !this.list.length
    }
  },
  watch: {
    keyword() {
      if (this.timer) {
        clearTimeout(this.timer)
      }
      if (!this.keyword) {
        this.list = []
        return
      }
      this.searchSupplys(this.keyword)
      // this.list = this.supplys
      this.timer = setTimeout(() => {
        const result = []
        // eslint-disable-next-line no-unused-vars
        for (const i in this.supplys) {
          this.supplys.forEach((value) => {
            if (value.name.indexOf(this.keyword) > -1) {
              result.push(value)
            }
          })
        }
        this.list = result
        // this.list = this.supplys
      })
    }

  },
  mounted() {
    this.scroll = new Bscroll(this.$refs.search)
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    },
    // 新增前
    [CRUD.HOOK.afterRefresh]() {
    },
    // 提交后
    [CRUD.HOOK.afterSubmit]() {
      this.crud.refresh()
    },
    // 取消前
    [CRUD.HOOK.afterEditCancel]() {
      this.resetForm(this.form)
      this.inGoods = 0
      this.keyword = ''
    },
    handleSupplyClick(supply) {
      this.form.goods.supplyId = supply.supplyId
      this.form.goods.supply.supplyId = supply.supplyId
      this.form.goods.supply.name = supply.name
      this.keyword = supply.name
      this.isshow = ''
      // this.$router.push('/')
    },
    searchSupplys(keyword) {
      this.isshow = '1'
      getSupplys({ name: keyword }).then(res => {
        this.supplys = res
        /* this.supplys = res.content.map(function(obj) {
          if (obj.hasChildren) {
            obj.children = null
          }
          return obj
        }) */
      })
    },
    doIngoods(data) {
      crudStoreRemain.inGoods(data).then(() => {
        this.crud.status.add = CRUD.STATUS.NORMAL
        this.crud.status.edit = CRUD.STATUS.NORMAL
        this.crud.refresh()
      })
      // this.crud.refresh()
      // this.crud.callVmHook(this.crud, CRUD.HOOK.afterSubmit)
      // this.pop = false
      // this.crud.refresh()
      // this.crud.toQuery()
      // this.$router.push('/store/storeManage/buy')
    },
    doOutgoods(data) {
      crudStoreRemain.outGoods(data).then(() => {
        this.crud.status.add = CRUD.STATUS.NORMAL
        this.crud.status.edit = CRUD.STATUS.NORMAL
        this.crud.refresh()
      })
      // this.pop = false
      // this.crud.refresh()
      // this.crud.toQuery()
      // this.$router.push('/store/storeManage/')
    },
    // 进货
    inputGoods(data) {
      this.inGoods = 1
      this.keyword = data.goods.supply.name
      this.crud.toEdit(data)
      // this.toEditGoods(data)
      // this.$refs.counts = '进货数量'
    },
    // 退货
    outputGoods(data) {
      this.inGoods = 2
      this.keyword = data.goods.supply.name
      this.crud.toEdit(data)
      // this.toEditGoods(data)
      // this.$refs.counts = '退货数量'
    },
    /**
     * 启动编辑
     * @param {*} data 数据项
     */
    toEditGoods(data) {
      this.resetForm(JSON.parse(JSON.stringify(data)))
      if (!(this.crud.callVmHook(crud, CRUD.HOOK.beforeToEdit, crud.form) && crud.callVmHook(crud, CRUD.HOOK.beforeToCU, crud.form))) {
        return
      }
      crud.status.edit = CRUD.STATUS.PREPARED
      crud.getDataStatus(crud.getDataId(data)).edit = CRUD.STATUS.PREPARED
      this.crud.callVmHook(crud, CRUD.HOOK.afterToEdit, crud.form)
      this.crud.callVmHook(crud, CRUD.HOOK.afterToCU, crud.form)
    },
    /**
     * 重置表单
     * @param {Array} data 数据
     */
    resetForm(data) {
      const form = data || (typeof crud.defaultForm === 'object' ? JSON.parse(JSON.stringify(crud.defaultForm)) : crud.defaultForm.apply(crud.findVM('form')))
      const crudFrom = this.crud.form
      for (const key in form) {
        if (crudFrom.hasOwnProperty(key)) {
          crudFrom[key] = form[key]
        } else {
          Vue.set(crudFrom, key, form[key])
        }
      }
      // add by ghl 2020-10-04  页面重复添加信息时，下拉框的校验会存在，需要找工取消
      if (this.crud.findVM('form').$refs['form']) {
        this.crud.findVM('form').$refs['form'].clearValidate()
      }
    }
  }
}
</script>

<style scoped>

</style>
