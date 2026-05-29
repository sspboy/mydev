<template>
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

        <a-layout-content class="content_border">
            
            <div
            :style="{
                height: PAGEDATA.innerHeight + 'px',
                overflowY:'auto',
                overflowX:'hidden',
                marginBottom:'10px'
                }"
            >
                <a-form
                    ref="formRef"
                    name="advanced_search"
                    class="ant-advanced-search-form"
                    :model="formState"
                    @finish="onFinish"
                >
                    <!-- <a-row :gutter="24">
                        <a-col :span="8">
                            <a-form-item
                            name="title"
                            label="商品标题"
                            >
                            <a-input v-model:value="formState.title" placeholder="请输入商品标题" allowClear></a-input>
                            </a-form-item>
                        </a-col>
                        <a-col :span="8">
                            <a-form-item
                            name="product_id"
                            label="商品ID"
                            >
                            <a-input v-model:value="formState.product_id" placeholder="请输入商品ID" allowClear></a-input>
                            </a-form-item>
                        </a-col>
                        <a-col :span="8">
                            <a-form-item
                            name="status"
                            label="商品状态"
                            >
                            <a-select v-model:value="formState.status" placeholder="请选择商品状态" allowClear>
                                <a-select-option v-for="item in formState.state_list" :key="item.value" :value="item.value">{{ item.label }}</a-select-option>
                            </a-select>
                            </a-form-item>
                        </a-col>
                        <a-col v-show="expand" :span="8">
                            <a-form-item
                            name="category"
                            label="商品类目"
                            >
                            <a-cascader
                                v-model:value="formState.category"
                                :options="formState.options"
                                placeholder="请选择商品类目"
                                allowClear
                            />
                            </a-form-item>
                        </a-col>
                        <a-col v-show="expand" :span="8">
                            <a-form-item
                            name="create_time"
                            label="创建时间"
                            >
                            <a-range-picker v-model:value="formState.create_time" style="width: 100%;" />
                            </a-form-item>
                        </a-col>
                    </a-row> -->
                    <a-row>
                        <a-col :span="12">
                            <a-space>
                                <a-radio-group v-model:value="Select_the_column" size="small" >
                                    <a-radio-button value="suggest_offline" class="font_size_12" @click="Selecttable.Get_suggest_offline_list">建议下架</a-radio-button>
                                    <a-radio-button value="force_offline" class="font_size_12" @click="Selecttable.Get_force_offline_list">强制下架</a-radio-button>
                                    <a-radio-button value="optimize" class="font_size_12" @click="Selecttable.Get_optimize_list">潜力优化商品</a-radio-button>
                                </a-radio-group>
                            </a-space>
                        </a-col>
                        <a-col :span="12" style="text-align: right">
                            <!-- <a-button type="primary" html-type="submit" :size="'small'" :loading="formState.select_loading">查询</a-button>
                            <a-button style="margin: 0 8px" type="primary" size="small" @click="batchOptimize" :loading="loading">批量优化</a-button> -->
                            <!-- <a-button size="small" @click="exportData">导出数据</a-button> -->
                            <!-- <a-button style="margin: 0 8px" :size="'small'" @click="() => formRef.resetFields()">重置</a-button> -->
                            <!-- <a style="font-size: 12px" @click="expand = !expand">
                                <template v-if="expand">
                                <UpOutlined />
                                </template>
                                <template v-else>
                                <DownOutlined />
                                </template>
                                {{ expand ? '收起' : '展开' }}
                            </a> -->
                        </a-col>
                    </a-row>
                </a-form>

                <!-- 数据表格 -->
                <a-table
                    class="full-body-table"
                    :columns="Selecttable.columns"
                    :data-source="Selecttable.tableData"
                    :loading="Selecttable.tableloading"
                    :pagination="false"
                    rowKey="product_id"
                    :scroll="{ y: innerHeight }"
                    :row-selection="rowSelection"
                >
                    <template #bodyCell="{ column, record }">
                        <template v-if="column.key === 'operation'">
                            <a-space v-if="record.suggestion === 'suggest_offline'">
                                <!-- <a-button type="link" size="small" @click="console.log('下架商品')">查看</a-button> -->
                                <a-button type="primary" size="small" @click="Selecttable.setofflineproduct(record)">下架</a-button>
                            </a-space>
                            <a-space v-if="record.suggestion === 'force_offline'">
                                <!-- <a-button type="link" size="small" @click="console.log('强制下架')">查看</a-button> -->
                                <a-button type="primary" size="small" @click="Selecttable.setofflineproduct(record)">下架</a-button>
                            </a-space>
                            <a-space v-if="record.suggestion === 'optimize'">
                                <!-- <a-button type="link" size="small" @click="console.log('优化商品')">查看</a-button> -->
                                <a-button type="primary" size="small" @click="console.log('优化商品')">优化</a-button>
                            </a-space>
                        </template>
                        <template v-if="column.key === 'title'">
                            <div class="font_size_12">{{ record.product_name }}</div>
                            <span class="font_size_12" style="color: #999;"> ID-{{ record.product_id }}</span>
                        </template>
                        <template v-if="column.key === 'image'">
                            <a-image :src="record.main_url" width="80px" style="border-radius: 6px;" />
                        </template>
                        <template v-if="column.key === 'suggestion'">
                            <span class="font_size_12" v-if="record.suggestion === 'force_offline'">强制下架</span>
                            <span class="font_size_12" v-else-if="record.suggestion === 'suggest_offline'">建议下架</span>
                            <span class="font_size_12" v-else-if="record.suggestion === 'optimize'">牵引优化</span>
                        </template>
                        <template v-if="column.key === 'suggestion_reason'">
                            <span class="font_size_12">{{ record.suggestion_reason }}</span>
                        </template>
                    </template>
                </a-table>

            </div>
            <!-- 表格底部栏：全选/反选 + 已选数量 -->
            <a-row>
                <a-col :span="8" style="padding:6px 0 0 20px;">
                <a-space>
                    <a-checkbox
                        :checked="selectedRowKeys.length === (Selecttable.tableData || []).length && (Selecttable.tableData || []).length > 0"
                        :indeterminate="selectedRowKeys.length > 0 && selectedRowKeys.length < (Selecttable.tableData || []).length"
                        @change="toggleSelectAll"
                    >
                        全选/反选
                    </a-checkbox>
                    <span class="selected-count">已选<strong>{{ selectedRowKeys.length }}</strong> 条</span>

                    <a-button size="small" type="primary" @click="Selecttable.batchsetofflineproduct">一键批量下架</a-button>
                </a-space>
            </a-col>

            <a-col :span="16">
                <nav_pagination :fandata="PAGEDATA" v-on:complete="page_turning"/>
            </a-col>
            </a-row>
            
            

        </a-layout-content>

    </a-layout>

</a-layout>
</template>

<script>
import { MenuFoldOutlined, MenuUnfoldOutlined, UpOutlined, DownOutlined } from '@ant-design/icons-vue';
import { defineComponent, onMounted, reactive, ref , onUnmounted } from 'vue';
import { useStore } from 'vuex'
import * as utils from '@/assets/JS_Model/public_model';
import * as TABLE from '@/assets/JS_Model/TableOperate';
import * as TOOL from '@/assets/JS_Model/tool';
import axios from "axios"; 

// 组件引用=====开始
import menu_left from "@/components/layout/menu_left.vue";
import menu_head from "@/components/layout/menu_head.vue";
import nav_pagination from "@/components/nav_pagination.vue";
import { timePickerProps } from 'ant-design-vue/es/time-picker/time-picker';

export default {

    // 模版名称【低效商品】
    name: "Inefficient",
    // 引用组件
    components: {
        MenuFoldOutlined,
        MenuUnfoldOutlined,
        UpOutlined,
        DownOutlined,
        menu_left,
        menu_head,
        nav_pagination
    },
    // 父组件数据
    props: {},
    // 组合API返回到模版
    setup() {

        // 【数据绑定】=======================================>开始
        const API = new utils.A_Patch()         // 请求接口地址合集
        const store = useStore();               // 共享数据
        const tool = new TOOL.TOOL()            // 工具方法
        const innerHeight = ref(window.innerHeight - 226);  // 初始化表格高度
        const Select_the_column = ref('suggest_offline'); // 选择类别
        const selectedRowKeys = ref([]); // 选中的行 keys
        const selectedRows = ref([]); // 选中的行数据
        const PAGEDATA = reactive({
            innerHeight: ref(window.innerHeight - 130), // 初始化列表高度
            innerWidth: ref(window.innerWidth - 230), // 初始化列表宽度
            title: '低效商品',
            // 菜单选中配置
            menudata: {
                'key': '117',
                'openKeys': 'douyinshop'
            },
            List_conditions: {
                page: 1, // 当前页
                page_size: 10, // 每页条数
            },
            total_number: 0, // 数据总条数
        })

        // 表单数据绑定
        const formRef = ref();

        // 查询表单数据绑定
        const formState = reactive({
            title: undefined,           // 商品标题
            product_id: undefined,      // 商品ID
            status: undefined,          // 商品状态
            category: undefined,        // 商品类目
            create_time: undefined,     // 创建时间
            select_loading: false,      // 查询按钮loading
            options: ref([]),           // 分类选项

            // 状态下拉列表
            state_list: ref([
                { value: 0, label: '在线' },
                { value: 1, label: '下线' },
                { value: 2, label: '删除' }
            ]),
        });

        // 表格数据LISt
        const Selecttable = reactive({

            // 查询条件配置
            navdata:{
                "page_no":PAGEDATA.List_conditions.page,
                "page_size":PAGEDATA.List_conditions.page_size,
                "suggestion":"suggest_offline"  // force_offline强制下架, suggest_offline建议下架, optimize牵引优化
            },
            
            // 查询方法
            fetchData: () => {

                Selecttable.tableloading = true;
                // 这里替换为实际的接口地址
                tool.Http_.post(API.AppSrtoreAPI.dou_product.getProductSuggestionList, Selecttable.navdata).then(res => {
                    // console.log('接口返回数据:', res);
                    // res.data.data.product_list ||
                    Selecttable.tableData = res.data.data.product_list || [];
                    PAGEDATA.total_number = res.data.data.total || 0; // 总页数
                    Selecttable.tableloading = false;
                }).catch(() => {
                    console.error('接口请求失败');  
                    Selecttable.tableloading = false;

                });
            },
            // 建议下架tab查询
            Get_suggest_offline_list: () => {
                Selecttable.navdata.suggestion = 'suggest_offline';
                Selecttable.fetchData();
            },
            // 强制下架tab查询
            Get_force_offline_list: () => {
                Selecttable.navdata.suggestion = 'force_offline';
                Selecttable.fetchData();
            },
            // 牵引优化tab查询
            Get_optimize_list: () => {
                Selecttable.navdata.suggestion = 'optimize';
                Selecttable.fetchData();
            },
            // 表头config
            columns:[
            {
                title: '商品图片',
                dataIndex: 'image',
                key: 'image',
                width: 80,
                align: 'center',

            },
            {
                title: '商品标题',
                dataIndex: 'title',
                key: 'title',
                width: 220,
            },
            {
                title: '处理建议',
                dataIndex: 'suggestion',
                align: 'center',
                key: 'suggestion',
                width: 120,
            },
            {
                title: '下架的原因',
                dataIndex: 'suggestion_reason',
                key: 'suggestion_reason',
                width: 120,
            },
            {
                title: '首次上架时间',
                dataIndex: 'first_publish_time',
                key: 'first_publish_time',
                width: 60,
                align: 'center',
                ellipsis: true,

            },
            {
                title: '操作',
                key: 'operation',
                width: 150,
                align: 'center',
            },
            ],
            // 列表加载状态
            tableloading: true,
            // 列表数据
            tableData: undefined,
            // 下架商品
            setofflineproduct: (record) => {
                // console.log('下架商品:', record);
                var product_id = record.product_id;
                
                console.log('要下架的商品ID:', product_id);
                tool.Http_.post(API.AppSrtoreAPI.dou_product.setoffline, {
                    "product_id":product_id
                }).then(res => {

                    var code = res.data.code;
                    console.log('接口返回数据:', code, res);
                    if(code === 10000){
                        tool.Fun_.message('success', '商品已下架');
                    }else{
                        tool.Fun_.message('error', '下架失败，'+ res.data.msg);
                    }

                    setTimeout(() => {
                        Selecttable.fetchData(); // 刷新列表
                    }, 2000);
                
                }).catch(() => {
                    console.error('接口请求失败');  
                    tool.Fun_.message('error', '下架失败，请重试');
                });
            },
            // 批量下架商品
            batchsetofflineproduct: () => {

                var checkednumber = selectedRowKeys.value.length; // 判断是否勾选商品
                console.log('选中的商品ID列表:',checkednumber, selectedRowKeys.value);
                if(checkednumber == 0){
                    // 如果未勾选
                    tool.Fun_.message('warning', '请至少选择一件商品进行批量下架');
                    return;
                }else{
                    // 如果已勾选
                    // tool.Http_.post(API.AppSrtoreAPI.dou_product.batchoffline, {
                    //     "product_ids":selectedRowKeys.value
                    // }).then(res => {

                    //     console.log('接口返回数据:', res);
                    //     tool.Fun_.message('success', '批量下架任务已提交');

                    //     Selecttable.fetchData(); // 刷新列表
                    // }).catch(() => {
                    //     console.error('接口请求失败');  
                    //     tool.Fun_.message('error', '批量下架失败，请重试');
                    // });
                }

                




            },

        });

        // 【翻页-组件 回调方法】========================================开始
        const page_turning = (data)=>{

            PAGEDATA.List_conditions.page = data.page;
            PAGEDATA.List_conditions.page_size = data.page_size;

            Selecttable.navdata.page_no = data.page;
            Selecttable.navdata.page_size = data.page_size;

            Selecttable.fetchData();

        }
        // 【查询组件 回调方法】========================================结束





        // 按钮loading状态
        const loading = ref(false);


        // 搜索
        const onFinish = (values) => {
            console.log('Search values:', values);
            Selecttable.fetchData();
        };

        // 查看详情
        const viewDetail = (record) => {
            console.log('View detail:', record);
        };

        // 优化单个商品
        const optimizeItem = (record) => {
            console.log('Optimize item:', record);
        };

        // 批量优化
        const batchOptimize = () => {
            loading.value = true;
            setTimeout(() => {
                loading.value = false;
                tool.Fun_.message('success', '批量优化任务已提交');
            }, 1000);
        };

        // 导出数据
        const exportData = () => {
            tool.Fun_.message('info', '数据导出中...');
        };

        // 展开/收起
        const expand = ref(false);

        // 表格行选择配置
        // 原理：Ant Design Vue 的 a-table 只要传入 row-selection 配置对象，就会自动在表格左侧渲染一列 checkbox。selectedRowKeys 控制哪些行被选中，onChange 在勾选/取消时回调，返回当前选中的 keys 和完整 rows 数据。
        const rowSelection = {
            selectedRowKeys: selectedRowKeys,
            onChange: (keys, rows) => {
                selectedRowKeys.value = keys; // 选中的行 keys
                selectedRows.value = rows; // 选中的行数据
            },
        };

        // 全选/反选当前页
        const toggleSelectAll = () => {
            if (!Selecttable.tableData || Selecttable.tableData.length === 0) return;
            if (selectedRowKeys.value.length === Selecttable.tableData.length) {
                selectedRowKeys.value = [];
                selectedRows.value = [];
            } else {
                selectedRowKeys.value = Selecttable.tableData.map(item => item.product_id);
                selectedRows.value = [...Selecttable.tableData];
            }
        };

        // 组件挂之后---请求数据===============================开始
        // 定义一个函数来处理窗口大小变化 ==
        const handleResize = () => {
            PAGEDATA.innerHeight = window.innerHeight - 130; // 作为表格自适应高度
            PAGEDATA.innerWidth = window.innerWidth - 230; // 作为表格自适应高度
            innerHeight.value = window.innerHeight - 226; // 同步更新表格滚动高度
        };
        // 页面初始话加载
        onMounted(() => {
            window.addEventListener('resize', handleResize);// 窗口变换时候
            Selecttable.fetchData();
        });
        // 在组件卸载时移除事件监听器
        onUnmounted(() => {
            window.removeEventListener('resize', handleResize);
        });
        // 【组件挂载】========================================结束


        return {
            store,
            loading,
            innerHeight,
            PAGEDATA,
            formState,
            formRef,
            expand,
            onFinish,
            viewDetail,
            optimizeItem,
            batchOptimize,
            exportData,
            Select_the_column,
            Selecttable,
            page_turning,
            selectedRowKeys,
            selectedRows,
            rowSelection,
            toggleSelectAll
        }
    }
}
</script>
<style scoped>
.font_size_12 {
    font-size: 12px;
}

.content_border {
    padding: 10px;
}

.ant-advanced-search-form {
    background: #f2f2f2;
    padding: 8px;
    border-radius: 4px;
}
/*表格表头 字体大小定义*/
:deep(.ant-table-thead > tr > th) {
    font-size: 12px;
    /* 还可以同时调整其他样式 */
    /* font-weight: 500; */
    /* padding: 8px 16px; */
}

/* tbody 高度 100%：固定滚动容器高度，并让 table/tbody 撑满 */
:deep(.full-body-table .ant-table-body) {
    height: v-bind(innerHeight + 'px') !important;
    max-height: none !important;
}

:deep(.full-body-table table) {
    height: 100%;
}

:deep(.full-body-table .ant-table-tbody) {
    height: 100%;
}



.selected-count {
    color: #666;
    font-size: 13px;
}

</style>
