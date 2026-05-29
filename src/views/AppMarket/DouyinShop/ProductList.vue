

<template>
  
  <!-- 动态渲染异步组件 -->
  <add_components v-if="PAGEDATA.AddDate" :data="PAGEDATA" @add_call_back="add_call_back"/>
  <edit_components v-if="PAGEDATA.EditDate" :data="PAGEDATA"/>
  <detaile_components v-if="PAGEDATA.DetaileDate" :data="PAGEDATA"/>
  <more_select :data="PAGEDATA" @moer_select_callback="sift_select"/><!--更多筛选组件-->
  <manage_images v-if="PAGEDATA.ImageDate" :data="PAGEDATA"/><!--图片预览-->
  <!--运费模板-->
  <feight_detaile_components v-if="PAGEDATA.FreightDate" :data="PAGEDATA"/>


  <a-layout style="height: 100vh;width: 100vw;">

    <!--head 导航组件  开始-->
    <menu_head />
    <!--head 导航组件  结束-->

    <!--右侧内容部分 开始-->
    <a-layout>

      <!--左侧 菜单组件  开始-->
      <a-layout-sider v-model:collapsed="store.state.menu.coll" :trigger="null" collapsible>
        <menu_left :menudata="PAGEDATA.menudata"/><!--局部组件-->
      </a-layout-sider>
      <!--左侧 菜单组件  结束-->


      <!--右侧 内容组件  开始-->
      <a-layout-content class="content_border">
  
        <!--条件查询组件 开始 -->        
          <div :style="{
            width: PAGEDATA.innerWidth + 'px',
            height:'40px',
            backgroundColor:'#f2f2f2',
            borderRadius:'4px',
            overflow:'hidden'
            }">
            <Siftcondition :data="PAGEDATA" @sift_callback="sift_select"/>
          </div>
          
        <!--条件查询组件 结束 -->


        <!--列表组件 开始 -->
        
        <div :style="{
          height: PAGEDATA.innerHeight + 'px',
          overflowY:'auto',
          overflowX:'hidden',
          marginTop:'10px',
          marginBottom:'10px'
          }">
        <!--列表 浏览方式 -->
        <a-checkbox-group v-model:value="PAGEDATA.check_value_list" style="width: 100%;height: 100%;">
        <a-list
          :data-source="PAGEDATA.datalist" 
          :loading="PAGEDATA.loading" 
          style="width: 100%;"
          size="small"
          :split="true"
          :bordered="false"
          >            

            <template #renderItem="{ item }">

              <a-list-item style="padding-left: 0;">

                  <div style="width: 20px;height: 20px;float: left;margin-right: 10px;">
                    <a-checkbox :value="item.product_id"></a-checkbox>
                  </div>

                  <a-list-item-meta>
                    <template #avatar>
                      <div class="cursor ListImg">
                        <!--懒加载方法-->
                        <!-- <img v-lazy="{
                          src: item.img, 
                          loading: '/logo.png', 
                          error: 'your error image url' }" 
                          style="width: 100%;height: 100%;border-radius: 5px;" 
                        /> -->

                        <a-image
                          :src="item.img"
                          alt="" 
                          style="width: 100%;height: 100%;border-radius: 5px;" 
                        />
                      </div>
                    </template>

                    <template #title>
                      <a-row>
                        <a-col :span="18">

                          <div class="title_div_box">
                                <a href="#" style="color:black;" @click="showDetaile(item.product_id)">
                                  {{ item.name }}
                                </a>
                          </div>
                          <div style="overflow: hidden;">
                            <a-space align="end" :size="10" style="height: 32px;font-weight:normal;">
                              <div class="title_text_span ProductIDStyle cursor" @click="tool.Fun_.copyToClipboard(item.product_id)">
                                <a-tooltip placement="top">
                                  <template #title>
                                    <span class="font_size_12">{{ item.product_id }}</span>
                                  </template>

                                  ID-<CopyOutlined />


                                </a-tooltip>
                              </div>

                              <div class="title_text_span">
                                {{ Profun.Field_translation.product_type_info(item.product_type) }}
                              </div>

                              <div class="title_text_span">
                                <span class="left_box status_0" v-if="item.status == 0"></span>
                                <span class="left_box status_1" v-if="item.status == 1"></span>
                                <span class="left_box status_2" v-if="item.status == 2"></span>
                                {{ Profun.Field_translation.product_status(item.status) }}
                              </div>
                              
                              <div class="title_text_span">
                                <span class="left_box check_status_1" v-if="item.check_status == 1"></span>
                                <span class="left_box check_status_2" v-if="item.check_status == 2"></span>
                                <span class="left_box check_status_3" v-if="item.check_status == 3"></span>
                                <span class="left_box check_status_4" v-if="item.check_status == 4"></span>
                                <span class="left_box check_status_5" v-if="item.check_status == 5"></span>
                                <span class="left_box check_status_7" v-if="item.check_status == 7"></span>

                                {{ Profun.Field_translation.product_check_status_info(item.check_status) }}

                                    <span class="font_size_12 cursor" v-if="item.have_audit_reject_suggest == true && item.audit_reject_suggestion !== undefined"> 

                                      <a-tooltip placement="top">

                                            <template  #title>
                                              
                                              <div v-if="item.audit_reject_suggestion.reject_reason !== ''" style="font-size: 12px;">
                                                驳回原因：<span v-html="item.audit_reject_suggestion.reject_reason"></span>
                                              </div>

                                            </template>

                                            <ExclamationCircleFilled style="color:#eb2f96;font-size: 10px;" /><span> 驳回建议</span>

                                          </a-tooltip>
                                    </span>
                                    <span class="font_size_12" v-else>
                                    </span>


                              </div>

                              <div class="title_text_span cursor">
                                <a-tooltip placement="top">
                                  <template  #title>
                                    <span class="font_size_12">
                                      {{ Profun.Field_translation.product_cate_name_info(item.category_detail).full_cate }}
                                    </span>
                                  </template>
                                  {{ Profun.Field_translation.product_cate_name_info(item.category_detail).last_cate }}
                                </a-tooltip>
                              </div>

                              <div class="title_text_span">销量{{ item.sell_num }}</div>

                              <!--商品状态判断-->
                              <div>
                                <span v-if="item.status == 0 && item.check_status == 1"><a-tag color="#2db7f5">草稿</a-tag></span>
                                <span v-else-if="item.status == 0 && item.check_status == 3"><a-tag color="#87d068">售卖中</a-tag></span>
                                <span v-else-if="item.status == 1 && item.check_status == 7"><a-tag color="#999999">已下架</a-tag></span>
                                <span v-else-if="item.status == 1 && item.check_status == 1"><a-tag color="orange" :bordered="false">待审核</a-tag></span>
                                <span v-else-if="item.status == 0 && item.check_status == 2"><a-tag color="orange" :bordered="false">审核中</a-tag></span>
                                <span v-else-if="item.status == 2 && item.check_status == 1"><a-tag :bordered="false">回收站</a-tag></span>
                                <span v-else-if="item.check_status == 4"><a-tag color="#f50">驳回</a-tag></span>
                                <span v-else-if="item.status == 0 && item.check_status == 5"><a-tag :bordered="false">封禁中</a-tag></span>
                              </div>
                              <!-- {{ item.status }}-{{ item.check_status }} -->
                            </a-space>
                          </div>
                          <div style="overflow: hidden;">
                            <a-space align="end" :size="10" style="height: 32px;font-weight:normal;">
                                    <div class="font_size_12" v-if="item.need_check_out">
                                      <CloseSquareOutlined style="color:#eb2f96;" />  需要核销 
                                    </div>
                                    <div class="font_size_12" v-else>
                                      <CheckSquareOutlined style="color:#52c41a;" /> 无需核销
                                    </div>
                                    <div class="font_size_12" v-if="item.can_combine"> 
                                      <CheckSquareOutlined style="color:#52c41a;" /> 可以搭配 
                                    </div>
                                    <div class="font_size_12 cursor" v-else> 
                                        <a-tooltip placement="top">
                                            <template  #title>
                                              <span class="font_size_12">
                                                {{ item.can_not_combine_reason }}
                                              </span>
                                            </template>
                                            <CloseSquareOutlined style="color:#eb2f96;" /> 不可搭配 
                                          </a-tooltip>
                                    </div>
                                    <div class="list_span_one">
                                      <a-space>
                                      <span class="font_size_12">
                                        创建时间：{{ moment.unix(item.create_time).format('YYYY-MM-DD HH:mm:ss') }}
                                      </span>
                                      <span class="font_size_12">
                                        更新时间：{{ moment.unix(item.update_time).format('YYYY-MM-DD HH:mm:ss') }}
                                      </span>
                                      </a-space>
                                    </div>
                            </a-space>
                          </div>

                        </a-col>


                      </a-row>

                    </template>

                  </a-list-item-meta>

                  <template #actions>
                    <div style="height: 60px;width: 260px;">
                      <a-row justify="center" align="middle" style="height: 100%;">
                        <a-col :span="12"><a class="font_size_12" @click="showDetaile(item.product_id)"><EyeOutlined /> 查看详情</a></a-col>
                        <a-col :span="12"><a class="font_size_12" @click="showImage(item.product_id)"><PictureOutlined /> 图片预览</a></a-col>
                        <!-- <a-col :span="8"><a class="font_size_12" @click="showFeight(item.freight_id)"><EyeOutlined /> 运费模板</a></a-col> -->
                        <!-- <a-col :span="8"><a class="font_size_12" @click="showEdit(item.product_id)"><FormOutlined /> 快捷编辑</a></a-col> -->
                        <a-col :span="12"><a class="font_size_12" @click="edit_douyinshop_product(item.product_id)"><edit-outlined /> 抖店编辑</a></a-col>
                        <a-col :span="12"><a class="font_size_12" @click="deldata.play(item.product_id)"><DeleteOutlined />移入回收站</a></a-col>
                      </a-row>
                    </div>
                  </template>

              </a-list-item>

            </template>

        </a-list>
        </a-checkbox-group>
        </div>
        <!--列表组件 结束 -->


        <!--翻页组件 -->
        <span style="display: block;float: left;">
          <a-button size="small" type="default" style="font-size: 12px;float: right;margin:4px 0 0 6px;"><RedoOutlined /> 刷新列表</a-button>
          <a-button size="small" type="default" style="font-size: 12px;float: right;margin:4px 0 0 6px;"><DeleteOutlined /> 批量删除</a-button>
          <a-button size="small" type="default" style="font-size: 12px;float: right;margin:4px 0 0 6px;"><EditOutlined /> 批量修改</a-button>
          <a-button size="small" type="default" style="font-size: 12px;float: right;margin:4px 0 0 0;" @click="check_list"><CheckCircleOutlined /> 全选</a-button>
        </span>
          
        <nav_pagination :fandata="PAGEDATA" v-on:complete="page_turning"/>

        <!--翻页组件 -->

      </a-layout-content>

    </a-layout>
    <!--右侧内容部分 结束-->


  </a-layout>
  


<!--确认删除-->
<a-modal v-model:open="deldata.open" title="确认删除" :confirm-loading="deldata.del_loading" @ok="deldata.confirm_fun">
  <p>确认删除选中商品吗？</p>
</a-modal>

</template>

<script>

import {reactive,ref,onMounted,onUnmounted,computed,defineAsyncComponent,markRaw} from 'vue';
import { useStore } from 'vuex'

// 组件引用=====开始
import menu_left from '@/components/layout/menu_left.vue'
import menu_head from "@/components/layout/menu_head.vue";
import {
  PictureOutlined,
  FormOutlined,
  DeleteOutlined,
  EditOutlined,
  RedoOutlined,
  CheckCircleOutlined,
  SettingOutlined,
  CheckSquareOutlined,
  CloseSquareOutlined,
  CopyOutlined,
  ExclamationCircleFilled,
  EyeOutlined,
  PlusOutlined } from '@ant-design/icons-vue';


// 筛选条件查询组件
import Siftcondition from '@/components/AppMarket/Douyinshop/ProductList/siftcondition.vue';
import more_select from '@/components/AppMarket/Douyinshop/ProductList/more_select.vue';
import nav_pagination from "@/components/nav_pagination.vue";
import moment from 'moment' // 时间戳转换

// 网络请求工具引用
import axios from "axios";
import * as TOOL from '@/assets/JS_Model/tool';
import * as utils from '@/assets/JS_Model/public_model';
import * as PL from '@/assets/douyinshop/ProductList';

// 组件引用=====结束
export default {
  // 模版名称
  name: "ProductList",
  // 引用组件
  components: {
    PictureOutlined,
    PlusOutlined,
    FormOutlined,
        EyeOutlined,
        ExclamationCircleFilled,
        CopyOutlined,
        CheckSquareOutlined,
        CloseSquareOutlined,
        SettingOutlined,
        CheckCircleOutlined,
        DeleteOutlined,
        EditOutlined,
        RedoOutlined,
        menu_left,
        menu_head,
        Siftcondition,
        nav_pagination,
        more_select,

        // 添加组件
        add_components: defineAsyncComponent(() => import('@/components/AppMarket/Douyinshop/ProductList/Add.vue')),
        // 编辑组件
        edit_components: defineAsyncComponent(() => import('@/components/AppMarket/Douyinshop/ProductList/edit.vue')),
        // 商品详情
        detaile_components: defineAsyncComponent(() => import('@/components/AppMarket/Douyinshop/ProductList/detaile.vue')), 
        // 图片预览组件 
        manage_images: defineAsyncComponent(() => import('@/components/AppMarket/Douyinshop/ProductList/manage_images.vue')),
        // 运费模板
        feight_detaile_components:defineAsyncComponent(() => import('@/components/AppMarket/Douyinshop/productDetaile/feightdetaile.vue')),


      },
  // 父组件数据
  props: {},

  // 组合API返回到模版
  setup(props) {

    const store = useStore();               // 共享数据
    // const moment = require('moment');       // 时间戳转换
    const tool = new TOOL.TOOL()            // 工具方法
    const API = new utils.A_Patch()         // 请求接口地址合集
    const Profun = new PL.ProductList_fun() // 商品列表方法model引用

    // 组件挂之后---请求数据===============================开始
    // 定义一个函数来处理窗口大小变化 ==
    const handleResize = () => {
      PAGEDATA.innerHeight = window.innerHeight - 180; // 作为表格自适应高度
      PAGEDATA.innerWidth = window.innerWidth - 230; // 作为表格自适应高度

    };

    // 在组件挂载时添加事件监听器
    onMounted(() => {
        window.addEventListener('resize', handleResize);// 窗口变换时候
        loadproductData(FromData.value,'all')
    });

    // 在组件卸载时移除事件监听器
    onUnmounted(() => {
      window.removeEventListener('resize', handleResize);
    });

    // 【组件挂载】========================================结束

    // 页面初始化数据
    const PAGEDATA = reactive({

      title:'商品管理', // 页面标题

      menudata:{      // 菜单选中配置
            'key':'78',
            'openKeys':'douyinshop'
      },

      colum:[],             // 表头信息
      datalist:[],          // 列表信息
      total_number:0,       // 内容总数

      check_value_list:ref([]), // 复选框选中值

      loading:true,         // 列表load状态
      justify:'center',     // 列表内容对齐：loading加载居中设定
      align:'center',       // 列表内容对齐：loading加载居中设定

      allNumber:"",         // 全部数量
      OnSaleNumber:"",      // 售卖中数量
      WaitreviewNumber:"",  // 待审核数量
      UnderReviewNumber:"", // 审核中数量
      RejectNumber:"",      // 驳回数量
      WareHouseNumber:"",   // 已下架数量
      BanNumber:"",         // 封禁数量

      DraftNumber:"",       // 草稿箱数量
      RecycleBinNumber:"",  // 回收站数量

      // 查询组件配置
      List_conditions:reactive({

        "page":1,            // 当前页面
        "size":10,           // 显示数量

        "product_type":ref(undefined),    // 商品类型

        "product_type_op":[
          {
            "label":"普通商品",
            "value":0
          },
          {
            "label":"新客商品",
            "value":1
          },
          {
            "label":"虚拟商品",
            "value":3
          },
          {
            "label":"玉石闪购",
            "value":6
          },
          {
            "label":"云闪购",
            "value":7
          },
          {
            "label":"其他",
            "value":127
          },
        ],

        "status":ref(undefined),         //  在线状态

        "status_op":[
          {
            "label":"在线",
            "value":0
          },
          {
            "label":"下线",
            "value":1
          },
          {
            "label":"删除",
            "value":2
          }

        ],

        "check_status":ref(undefined),   // 审核状态

        "check_status_op":[
          {
            "label":"未提交",
            "value":1
          },
          {
            "label":"待审核",
            "value":2
          },
          {
            "label":"审核通过",
            "value":3
          },
          {
            "label":"审核未通过",
            "value":4
          },
                    {
            "label":"封禁",
            "value":5
          },
                    {
            "label":"审核通过待上架",
            "value":7
          },
        ],

        "can_combine_product":true, // 是否可搭配
        
        // 查询option
        "lookup_option":ref({
          "need_name_affix":true,       // 是否需要获取标题前后缀
          "need_title_limit":true,      //是否需要获取商品标题长度限制规则
        }),


        "title_key": undefined,                  // 标题关键字

        "options":ref([]),                // 分类选项
        "create_time":ref(undefined),     // 创建时间
        "update_time":ref(undefined),     // 更新时间


        "product_id":ref(undefined),      // id查询
        "sku_codes":ref(undefined),       // 商家编码查询
        "store_id":ref(undefined),        // 小时达商家门店id


        "need_rectification_info":true, // 是否需要自动整改信息

        "need_check_out":ref(false), // 只显示需要核销商品

        "exist_audit_reject_suggest":ref(false), // 只显示驳回商品

      }),

      innerHeight: ref(window.innerHeight - 180), // 初始化列表高度
      innerWidth: ref(window.innerWidth - 230), // 初始化列表高度

      AddDate:ref(false),              // 新建显示状态
      EditDate:ref(false),             // 编辑显示状态
      DetaileDate:ref(false),          // 详情页显示状态
      ImageDate:ref(false),            // 图片预览显示状态
      FreightDate:ref(false),           // 运费模板显示状态
      MoreSelectData:ref(false),       // 更多查询显示状态
      product_id:ref(null),            // 商品id
      freight_id:ref(null),             // 运费模板id


    })
    
    // 查询条件初始化====默认配置
    const FromData = ref({

        // "status":0,         //  0-在线；1-下线；2-删除；
        // "check_status":3,   // 1-未提交；2-待审核；3-审核通过；4-审核未通过；5-封禁；7-审核通过待上架；

        // 固定查询字段
        "page":1,
        "size":10,
        "can_combine_product":true, // 是否可搭配
        // 查询option
        "lookup_option":{
          "need_name_affix":true,       // 是否需要获取标题前后缀
          "need_title_limit":true,      // 是否需要获取商品标题长度限制规则
        },
        "need_rectification_info":true, // 是否需要自动整改信息

    })

    // 翻页查询条件配置:每次翻页只需替换 page size即可
    const navData=ref({

        "page":1,
        "size":10,

        // 固定查询字段
        "can_combine_product":true,     // 是否可搭配
        // 查询option
        "lookup_option":{
          "need_name_affix":true,       // 是否需要获取标题前后缀
          "need_title_limit":true,      //是否需要获取商品标题长度限制规则
        },
        "need_rectification_info":true, // 是否需要自动整改信息
    })

    // 请求商品列表接口数据
    const loadproductData = async(data,number_type='null') => {

        PAGEDATA.loading = true;

        // 请求商品接口
        const res = await axios.post(API.AppSrtoreAPI.dou_product.list, data)
        var res_data = res.data.data;
        var res_list = res_data.data;
        var total = res_data.total;

        // 请求数据为空
        if(res_list.length == 0){
          PAGEDATA.justify = 'center';
          PAGEDATA.align = 'center';
          PAGEDATA.loading = false;
          PAGEDATA.datalist = [];
          PAGEDATA.total_number = 0
        }else{
          setTimeout(() => {
            PAGEDATA.loading = false;
            PAGEDATA.justify = 'start';
            PAGEDATA.align = 'start';
            // 请求数据不为空
            PAGEDATA.datalist = [...res_list];
            PAGEDATA.total_number = total;
          }, 100);
        }
        // 数量统计
        if(number_type == 'all'){
          PAGEDATA.allNumber = total;
        }else if(number_type == 'OnSale'){
          PAGEDATA.OnSaleNumber = total;
        }else if(number_type == 'Waitreview'){
          PAGEDATA.WaitreviewNumber = total;
        }else if(number_type == 'UnderReview'){
          PAGEDATA.UnderReviewNumber = total;
        }else if(number_type == 'Reject'){
          PAGEDATA.RejectNumber = total;
        }else if(number_type == 'WareHouse'){
          PAGEDATA.WareHouseNumber = total;
        }else if(number_type == 'Ban'){
          PAGEDATA.BanNumber = total;
        }else if(number_type == 'Draft'){
          PAGEDATA.DraftNumber = total;
        }else if(number_type == 'RecycleBin'){
          PAGEDATA.RecycleBinNumber = total;
        }
    }

    // 【翻页-组件 回调方法】========================================开始
    const page_turning = (data)=>{

      PAGEDATA.justify = 'flex-start';
    
      PAGEDATA.align = 'flex-start';

      navData.value.page = data.page;
    
      navData.value.size = data.page_size;

      loadproductData(navData.value)

    }
    // 【查询组件 回调方法】========================================结束
    

    // 【查询组件 回调方法】========================================开始
    const sift_select = (data)=>{

      PAGEDATA.List_conditions.page = 1 // 初始化翻页

      if(data == true){   // 重置刷新列表
        loadproductData(FromData.value,'all'); // 加载列表数据
      }else if(data == 'Reject'){ // 驳回商品
        navData.value = {...FromData.value}; // 重置查询条件
        navData.value.status = 0;
        navData.value.check_status = 4;
        loadproductData(navData.value,'Reject');
      }else if(data == 'Draft'){ // 草稿箱商品
        navData.value = {...FromData.value};
        navData.value.check_status = 1;
        navData.value.status = 0;
        loadproductData(navData.value,'Draft');
      }else if(data == 'All'){ // 全部商品
        navData.value = {...FromData.value}; // 重置查询条件
        loadproductData(navData.value,'all');
      }else if(data == 'OnSale'){ // 售卖中商品
        navData.value = {...FromData.value};
        navData.value.status = 0;
        navData.value.check_status = 3;
        loadproductData(navData.value,'OnSale');
      }else if(data == 'Waitreview'){ // 待审核商品
        navData.value = {...FromData.value};
        navData.value.status = 1;
        navData.value.check_status = 1;
        loadproductData(navData.value,'Waitreview');
      }else if(data == 'UnderReview'){ // 审核中商品
        navData.value = {...FromData.value};
        navData.value.status = 0;
        navData.value.check_status = 2;
        loadproductData(navData.value,'UnderReview');
      }else if(data == 'RecycleBin'){ // 回收站商品
        navData.value = {...FromData.value};
        navData.value.status = 2;
        navData.value.check_status = 1;
        loadproductData(navData.value,'RecycleBin');
      }else if(data == 'WareHouse'){ // 已下架商品
        navData.value = {...FromData.value};
        navData.value.status = 1;
        navData.value.check_status = 7;
        loadproductData(navData.value,'WareHouse');
      }else if(data == 'Ban'){ // 封禁商品
        navData.value = {...FromData.value};
        navData.value.status = 0;
        navData.value.check_status = 5;
        loadproductData(navData.value,'Ban');
      }
      else{ // 查询按钮
        navData.value = data;// 查询条件到翻页使用
        loadproductData(navData.value);
      }
    }
    // 【查询组件 回调方法】========================================结束


    // 编辑方法加载
    const showEdit = (pro_id) => {
      PAGEDATA.EditDate = true;
      PAGEDATA.product_id = pro_id
    };

    // 详情方法加载
    const showDetaile = (pro_id) =>{
      PAGEDATA.DetaileDate = true;
      PAGEDATA.product_id = pro_id
    }
    // 图片预览方法加载
    const showImage = (pro_id) =>{
      PAGEDATA.ImageDate = true;
      PAGEDATA.product_id = pro_id
    }
    // 运费模板方法加载
    const showFeight = (freight_id) =>{
      PAGEDATA.FreightDate = true;
      PAGEDATA.freight_id = freight_id
    }

    // 删除方法
    const deldata = reactive({
      product_id:ref(undefined),
      open:ref(false),
      // 弹出删除确认框
      play:(product_id)=>{
        deldata.open = true;
        deldata.product_id = product_id;
      },

      // 删除loading状态
      del_loading:ref(false),

      // 删除确认方法
      confirm_fun:()=>{

        deldata.del_loading = true;        // 删除loading状态

        // 删除接口
        axios.post(API.AppSrtoreAPI.dou_product.delete,{
          product_id:deldata.product_id,
          delete_forever: true
        }).then(res=>{
          console.log(res)
          deldata.del_loading = false;        // 删除loading状态
          deldata.open = false;
          deldata.product_id = undefined;
          tool.Fun_.message('success','删除成功');

          // 刷新列表
          loadproductData(navData.value)
          // if(res.data.code == 200){}
        })

      }
    })

    // 【全选】复选框选中值
    const check_list = ()=>{

      var list_number = PAGEDATA.datalist.length;// 列表数据数量

      if(list_number == 0){
        tool.Fun_.message('warning','当前列表无数据可选中');
        return false;
      }else{
        // 列表数据id集合
        var id_list = []
        for (var i=0;i<PAGEDATA.datalist.length;i++){
          id_list.push(PAGEDATA.datalist[i].product_id)
        }
        // 已全选
        if(PAGEDATA.check_value_list.length == id_list.length){
          PAGEDATA.check_value_list = []
          return false;
        }else if(PAGEDATA.check_value_list.length < id_list.length){ // 未全选
          PAGEDATA.check_value_list = id_list
          return false;
        }


      }
      
      PAGEDATA.check_value_list = id_list
    }


    // 【批量修改】

    // 【批量删除】

    // 去抖店后台编辑商品
    const edit_douyinshop_product = (product_id)=>{
      const douyinshop_edit_url = "https://fxg.jinritemai.com/ffa/g/create?product_id=" + product_id;
      window.open(douyinshop_edit_url, '_blank');
    }

    // 新建商品回调刷新列表
    const add_call_back = ()=>{
      setTimeout(() => {
        loadproductData(FromData.value)
      }, 2000);
    }





    return {
      tool,
      Profun,
      FromData,
      moment,
      PAGEDATA,
      store,
      sift_select,
      page_turning,
      showEdit,
      showDetaile,
      showImage,
      showFeight,
      deldata,
      check_list,
      add_call_back,
      edit_douyinshop_product

    }

  }


}
</script>

<style scoped>
.ListImg{width: 100px;height: 100px; background-color:white;border:1px #f2f2f2 solid;padding:5px;border-radius: 5px;}
.title_div_box{width: 100%; height: 26px;overflow: hidden;padding: 4px 0 0 0;font-size: 14px;}
.ProductIDStyle{height: 16px;border-radius: 4px;font-size: 12px;color: darkgray;}
.title_text_span{height: 20px;font-size:12px;color: darkgray;font-weight:normal;background-color: #f2f2f2;padding: 0 5px;border-radius: 5px;}
.list_span_one{height: 24px;padding: 2px 0 0 0;color: darkgray;overflow: hidden;font-weight:normal;}
.list_span_two{height: 28px;padding: 8px 0 0 0;color: darkgray;overflow: hidden;font-weight:normal;}
.FlexBox{overflow:auto; transition:height 0s ease;margin:0;padding:200px 0 0 0;}


.left_box{border-radius: 4px;display: block;width: 8px;height: 8px;float: left;margin: 6px 4px 0 0;}
.status_0{background-color: #52c41a;}
.status_1{background-color: darkgray;}
.status_2{background-color: #ff0000;}
.check_status_1{background-color: darkgray;}
.check_status_2{background-color: #0066FF;}
.check_status_3{background-color: #52c41a;}
.check_status_4{background-color: #FF9900;}
.check_status_5{background-color: #ff0000;}
.check_status_7{background-color: #66FFFF;}
.ant-card .ant-card-body {padding: 0px}

</style>
