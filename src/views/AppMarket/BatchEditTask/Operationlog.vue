<!-- 模板说明 -->
<template>
<!--内容部分 菜单 右侧列表 开始-->
<a-layout style="height: 100vh;width: 100vw;">

    <!--head 导航组件  开始-->
    <menu_head />
    <!--head 导航组件  结束-->
    
    
    <!--内容部分 菜单 右侧列表 开始-->
    <a-layout>

        <!--左侧 菜单组件  开始-->
        <a-layout-sider v-model:collapsed="store.state.menu.coll" :trigger="null" collapsible>
        <menu_left :menudata="PAGEDATA.menudata"/> <!--局部组件-->
        </a-layout-sider>
        <!--左侧 菜单组件  结束-->

        <a-layout-content class="content_border" >

        <!--条件查询栏 开始-->
        <div :style="{
            height:'42px',
            backgroundColor:'#f2f2f2',
            borderRadius:'4px',
            overflow:'hidden',
            }">
          <a-row style="padding: 9px 10px 0 14px;">
            <a-col :span="4">
                    <!--导航收起按钮-->
                  <a-button type="primary" size="small" style="font-size: 12px;margin-right: 16px;" @click="() => {store.commit('menu/change')}">
                    <menu-unfold-outlined v-if="store.state.menu.coll" class="trigger" />
                    <menu-fold-outlined v-else class="trigger" />
                  </a-button>
            </a-col>
            <a-col offset="12" :span="8">
              <a-space-compact block size="small">
                <a-date-picker
                  v-model:value="searchForm.start_time"
                  placeholder="任务开始时间"
                  format="YYYY-MM-DD HH:mm:ss"
                  value-format="YYYY-MM-DD HH:mm:ss"
                  show-time
                  size="small"
                  style="width: 170px;"
                />
                <a-date-picker
                  v-model:value="searchForm.end_time"
                  placeholder="任务结束时间"
                  format="YYYY-MM-DD HH:mm:ss"
                  value-format="YYYY-MM-DD HH:mm:ss"
                  show-time
                  size="small"
                  style="width: 170px;"
                />
                <a-select
                  v-model:value="searchForm.category"
                  placeholder="任务类目"
                  allow-clear
                  size="small"
                  style="width: 130px;"
                >
                  <a-select-option
                    v-for="item in categoryOptions"
                    :key="item.value"
                    :value="item.value"
                    style="font-size: 12px;"
                  >
                    {{ item.label }}
                  </a-select-option>
                </a-select>
                <a-button type="primary" size="small" style="font-size: 12px;" @click="handleSearch">查询</a-button>
                <a-button size="small" style="font-size: 12px;" @click="handleReset">重置</a-button>
              </a-space-compact>
            </a-col>
          </a-row>
        </div>
        <!--条件查询栏 结束-->

        <!--任务列表 开始-->
        <div :style="{ height: innerHeight + 'px', marginTop: '10px' }">
          <a-table
            :loading="loading"
            :columns="columns"
            :data-source="PAGEDATA.datalist"
            :scroll="{ y: innerHeight - 55 }"
            :pagination="false"
            style="font-size: 12px;"
            row-key="id"
          >
            <template #bodyCell="{ record, column }">
              <!--任务类别列-->
              <template v-if="column.key === 'category'">
                <a-tag color="blue" style="font-size: 12px;">
                  {{ getCategoryLabel(record.setting) }}
                </a-tag>
              </template>
              <!--创建时间列-->
              <template v-if="column.key === 'create_time'">
                <span style="font-size: 12px;">{{ record.create_time }}</span>
              </template>
              <!--修改商品数量列-->
              <template v-if="column.key === 'number'">
                <span style="font-size: 12px;">{{ record.number }}</span>
              </template>
              <!--操作列-->
              <template v-if="column.key === 'operation'">
                <a-button type="link" size="small" style="font-size: 12px; padding: 0;" @click="viewDetail(record)">
                  查看详情
                </a-button>
              </template>
            </template>
          </a-table>
        </div>
        <!--任务列表 结束-->

        <!--翻页组件 开始-->
        <nav_pagination :fandata="PAGEDATA" v-on:complete="handlePageChange" />
        <!--翻页组件 结束-->

        </a-layout-content>

      </a-layout>
  </a-layout>

    <!--详情弹窗 开始-->
  <a-modal
    v-model:open="detailModal.open"
    title="任务详情"
    width="700px"
    :footer="null"
  >
    <div style="font-size: 12px;" v-if="detailModal.data">
      <a-descriptions bordered :column="1" size="small">
        <a-descriptions-item label="任务ID">{{ detailModal.data.id }}</a-descriptions-item>
        <a-descriptions-item label="任务类别">{{ getCategoryLabel(detailModal.data.setting) }}</a-descriptions-item>
        <a-descriptions-item label="创建时间">{{ detailModal.data.create_time }}</a-descriptions-item>
        <a-descriptions-item label="修改商品数量">{{ detailModal.data.number }}</a-descriptions-item>
        <a-descriptions-item label="修改内容">
          <pre style="font-size: 12px; background: #f5f5f5; padding: 8px; border-radius: 4px; max-height: 300px; overflow: auto;">{{ formatSetting(detailModal.data.setting) }}</pre>
        </a-descriptions-item>
      </a-descriptions>
    </div>
  </a-modal>
  <!--详情弹窗 结束-->
</template>
<script>
import { ref, reactive, onMounted, onUnmounted, onBeforeMount } from 'vue';
import { MenuFoldOutlined, MenuUnfoldOutlined,PlusOutlined,EditOutlined,EllipsisOutlined,DeleteOutlined,EyeOutlined } from '@ant-design/icons-vue';

// 网络请求工具引用
import axios from "axios";
import { useStore } from 'vuex'

import * as TOOL from '@/assets/JS_Model/tool';
import * as utils from '@/assets/JS_Model/public_model';
import * as TABLE from '@/assets/JS_Model/TableOperate';

// 组件引用=====开始
import menu_left from '@/components/layout/menu_left.vue'
import menu_head from "@/components/layout/menu_head.vue";
import nav_pagination from "@/components/nav_pagination.vue";
// 组件引用=====开始
export default {
   name:'operationlog',
   components:{
        MenuFoldOutlined, 
        MenuUnfoldOutlined,
        EyeOutlined,
        PlusOutlined,
        DeleteOutlined,
        EditOutlined,
        EllipsisOutlined,
        menu_left,
        menu_head,
        nav_pagination
   },
props: {
   data:{type:Object}
},
setup(props,ctx) {
    const store = useStore();// 共享数据
    const tool = new TOOL.TOOL()            // 工具方法
    const API = new utils.A_Patch()         // 请求接口地址合集
    const TO = new TABLE.TableOperate()     // 表格操作方法
    // 组件挂之后---请求数据===============================开始
    const PAGEDATA = reactive({

            title:'任务记录',
            innerHeight: ref(window.innerHeight - 180), // 初始化列表高度

            menudata:{       // 菜单选中配置
                'key':'104',
                'openKeys':'batchedit',
                },
            loading:true,         // 列表load状态
            justify:'center',     // 列表内容对齐：loading加载居中设定
            align:'center',       // 列表内容对齐：loading加载居中设定
            // 列表信息
            datalist:[],
            total_number:0,     // 内容总数
            List_conditions:ref({
                page:1
            })
    })
    const loading = ref(true)               // 列表loading状态
    const innerHeight = ref(window.innerHeight - 180) // 初始化表格高度

    // 查询表单
    const searchForm = reactive({
      start_time: undefined,
      end_time: undefined,
      category: undefined
    })

    // 任务类目下拉选项
    const categoryOptions = [
      { value: 'title', label: '标题' },
      { value: 'main_image', label: '主图' },
      { value: 'recommendation', label: '推荐语' },
      { value: 'remark', label: '备注' },
      { value: 'brand', label: '品牌' },
      { value: 'attribute', label: '属性' },
      { value: 'item_no', label: '货号' },
      { value: 'on_shelf', label: '上架' },
      { value: 'off_shelf', label: '下架' },
      { value: 'price', label: '价格' },
      { value: 'stock', label: '库存' },
      { value: 'sku_code', label: 'SKU编码' },
      { value: 'cross_category', label: '跨类目属性' },
      { value: 'size_template', label: '尺码模板' },
      { value: 'freight_template', label: '运费模板' },
      { value: 'delivery_mode', label: '发货模式' },
      { value: 'after_sales', label: '售后服务' },
      { value: 'purchase_limit', label: '限购策略' },
      { value: 'qualification', label: '商品资质' },
      { value: 'delete_product', label: '删除商品' },
      { value: 'detail_desc', label: '详情描述' },
      { value: 'merchant_code', label: '商家编码' },
    ]

    // 表头定义
    const columns = [
      {
        title: '任务类别',
        key: 'category',
        dataIndex: 'category',
        align: 'center',
        width: 140,
      },
      {
        title: '创建时间',
        key: 'create_time',
        dataIndex: 'create_time',
        align: 'center',
        width: 180,
      },
      {
        title: '修改商品数量',
        key: 'number',
        dataIndex: 'number',
        align: 'center',
        width: 120,
      },
      {
        title: '操作',
        key: 'operation',
        align: 'center',
        width: 120,
        fixed: 'right',
      },
    ]

    // 详情弹窗
    const detailModal = reactive({
      open: false,
      data: null
    })

    // 页面数据=========================================结束

    // 任务类别映射
    const categoryMapping = {
      'title': '标题',
      'main_image': '主图',
      'recommendation': '推荐语',
      'remark': '备注',
      'brand': '品牌',
      'attribute': '属性',
      'item_no': '货号',
      'on_shelf': '上架',
      'off_shelf': '下架',
      'price': '价格',
      'stock': '库存',
      'sku_code': 'SKU编码',
      'cross_category': '跨类目属性',
      'size_template': '尺码模板',
      'freight_template': '运费模板',
      'delivery_mode': '发货模式',
      'after_sales': '售后服务',
      'purchase_limit': '限购策略',
      'qualification': '商品资质',
      'delete_product': '删除商品',
      'detail_desc': '详情描述',
      'merchant_code': '商家编码',
      'mobile': '客服电话',
      'reduce_type': '库存类型',
      'freight_id': '运费模板',
      'presell_config_level': '发货模式',
    }

    // 解析setting获取任务类别
    const getCategoryLabel = (settingStr) => {
      if (!settingStr) return '未知类型'
      try {
        const setting = typeof settingStr === 'string' ? JSON.parse(settingStr) : settingStr
        const keys = Object.keys(setting)
        if (keys.length === 0) return '未知类型'
        // 查找第一个匹配的类别
        for (const key of keys) {
          if (categoryMapping[key]) {
            return categoryMapping[key]
          }
        }
        return keys[0] || '未知类型'
      } catch (e) {
        return '未知类型'
      }
    }

    // 格式化setting显示
    const formatSetting = (settingStr) => {
      if (!settingStr) return ''
      try {
        const setting = typeof settingStr === 'string' ? JSON.parse(settingStr) : settingStr
        return JSON.stringify(setting, null, 2)
      } catch (e) {
        return settingStr
      }
    }

    // 查看详情
    const viewDetail = (record) => {
      detailModal.data = record
      detailModal.open = true
    }

    // 构建查询条件
    const buildConditions = () => {
      const conditions = [
        {
          type: "orderby",
          condition: [{ 'column_name': 'create_time', 'value': 'DESC' }]
        }
      ]

      const whereConditions = []

      // 时间范围查询
      if (searchForm.start_time) {
        whereConditions.push({
          'column_name': 'create_time',
          'value': searchForm.start_time,
          'operator': '>='
        })
      }
      if (searchForm.end_time) {
        whereConditions.push({
          'column_name': 'create_time',
          'value': searchForm.end_time,
          'operator': '<='
        })
      }

      // 任务类目查询（setting字段模糊查询）
      if (searchForm.category) {
        whereConditions.push({
          'column_name': 'setting',
          'value': searchForm.category,
          'operator': 'like'
        })
      }

      if (whereConditions.length > 0) {
        conditions.push({
          type: "where",
          condition: whereConditions
        })
      }

      return conditions
    }

    // 查询列表
    const Get_list = (message) => {
      loading.value = true
      TO.message.url = API.AppSrtoreAPI.batch.list

      TO.actions.list(message, (res) => {
        if (res.data && res.data !== "None") {
          PAGEDATA.datalist = res.data
        } else {
          PAGEDATA.datalist = []
        }
        PAGEDATA.total_number = res.total_number || 0
        loading.value = false
      })
    }

    // 查询方法
    const handleSearch = () => {
      loading.value = true

      let message = {
        page: 1,
        page_size: TO.message.page_size || 10,
        condition: buildConditions()
      }

      PAGEDATA.List_conditions.page = 1
      Get_list(message)
    }

    // 重置查询
    const handleReset = () => {
      searchForm.start_time = undefined
      searchForm.end_time = undefined
      searchForm.category = undefined
      handleSearch()
    }

    // 翻页回调
    const handlePageChange = (pageMessage) => {
      loading.value = true

      let message = {
        page: pageMessage.page,
        page_size: pageMessage.page_size,
        condition: buildConditions()
      }

      Get_list(message)
    }

    // 窗口大小变化处理
    const handleResize = () => {
      innerHeight.value = window.innerHeight - 180
    }

    // 组件挂载
    onBeforeMount(() => {
      let message = {
        page: 1,
        page_size: 10,
        condition: [
          {
            type: "orderby",
            condition: [{ 'column_name': 'create_time', 'value': 'DESC' }]
          }
        ]
      }
      Get_list(message)
    })

    onMounted(() => {
      window.addEventListener('resize', handleResize)
    })

    onUnmounted(() => {
      window.removeEventListener('resize', handleResize)
    })




       return{
            PAGEDATA,
            store,
            loading,
            innerHeight,
            searchForm,
            categoryOptions,
            columns,
            detailModal,
            getCategoryLabel,
            formatSetting,
            viewDetail,
            handleSearch,
            handleReset,
            handlePageChange,
       }
   }
   
}
</script>
<style scoped>
</style>