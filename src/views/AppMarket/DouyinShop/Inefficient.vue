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
            <div>
                <a-form
                    ref="formRef"
                    name="advanced_search"
                    class="ant-advanced-search-form"
                    :model="formState"
                    @finish="onFinish"
                >
                    <a-row :gutter="24">
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
                    </a-row>
                    <a-row>
                        <a-col :span="12">
                            <a-space>
                                <a-radio-group v-model:value="Select_the_column" size="small" >
                                    <a-radio-button value="large" class="font_size_12">建议下架</a-radio-button>
                                    <a-radio-button value="middle" class="font_size_12">强制下架</a-radio-button>
                                    <a-radio-button value="small" class="font_size_12">潜力优化商品</a-radio-button>
                                </a-radio-group>
                            </a-space>
                        </a-col>
                        <a-col :span="12" style="text-align: right">
                            <a-button type="primary" html-type="submit" :size="'small'" :loading="formState.select_loading">查询</a-button>
                            <a-button style="margin: 0 8px" type="primary" size="small" @click="batchOptimize" :loading="loading">批量优化</a-button>
                            <a-button size="small" @click="exportData">导出数据</a-button>
                            <a-button style="margin: 0 8px" :size="'small'" @click="() => formRef.resetFields()">重置</a-button>
                            <a style="font-size: 12px" @click="expand = !expand">
                                <template v-if="expand">
                                <UpOutlined />
                                </template>
                                <template v-else>
                                <DownOutlined />
                                </template>
                                {{ expand ? '收起' : '展开' }}
                            </a>
                        </a-col>
                    </a-row>
                </a-form>

                <!-- 数据表格 -->
                <a-table
                    style="margin-top: 10px;"
                    :columns="columns"
                    :data-source="tableData"
                    :pagination="pagination"
                    :loading="tableLoading"
                    @change="handleTableChange"
                    rowKey="id"
                    :scroll="{ y: innerHeight }"
                >
                    <template #bodyCell="{ column, record }">
                        <template v-if="column.key === 'operation'">
                            <a-space>
                                <a-button type="link" size="small" @click="viewDetail(record)">查看</a-button>
                                <a-button type="link" size="small" @click="optimizeItem(record)">优化</a-button>
                            </a-space>
                        </template>
                        <template v-if="column.key === 'inefficient_type'">
                            <a-tag color="orange">{{ record.inefficient_type }}</a-tag>
                        </template>
                        <template v-if="column.key === 'status'">
                            <a-tag :color="record.status === 0 ? 'green' : 'red'">
                                {{ record.status === 0 ? '在线' : '下线' }}
                            </a-tag>
                        </template>
                    </template>
                </a-table>
            </div>
        </a-layout-content>

    </a-layout>

</a-layout>
</template>

<script>
import { MenuFoldOutlined, MenuUnfoldOutlined, UpOutlined, DownOutlined } from '@ant-design/icons-vue';
import { defineComponent, onMounted, reactive, ref } from 'vue';
import { useStore } from 'vuex'
import * as utils from '@/assets/JS_Model/public_model';
import * as TABLE from '@/assets/JS_Model/TableOperate';
import * as TOOL from '@/assets/JS_Model/tool';
import axios from "axios";

// 组件引用=====开始
import menu_left from "@/components/layout/menu_left.vue";
import menu_head from "@/components/layout/menu_head.vue";

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
    },
    // 父组件数据
    props: {},
    // 组合API返回到模版
    setup() {

        // 【数据绑定】=======================================>开始
        const API = new utils.A_Patch()         // 请求接口地址合集
        const TO = new TABLE.TableOperate()     // 表格操作方法
        const store = useStore();               // 共享数据
        const tool = new TOOL.TOOL()            // 工具方法
        const innerHeight = ref(window.innerHeight - 300);  // 初始化表格高度
        const Select_the_column = ref('middle');
        const PAGEDATA = reactive({
            title: '低效商品',
            menudata: {
                'key': '105',
                'openKeys': 'douyinshop'
            },            // 菜单选中配置
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

        // 表格列定义
        const columns = [
            {
                title: '商品ID',
                dataIndex: 'id',
                key: 'id',
                width: 120,
            },
            {
                title: '商品标题',
                dataIndex: 'title',
                key: 'title',
                ellipsis: true,
            },
            {
                title: '商品图片',
                dataIndex: 'image',
                key: 'image',
                width: 100,
            },
            {
                title: '类目',
                dataIndex: 'category_name',
                key: 'category_name',
                width: 120,
            },
            {
                title: '低效类型',
                dataIndex: 'inefficient_type',
                key: 'inefficient_type',
                width: 120,
            },
            {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                width: 100,
            },
            {
                title: '创建时间',
                dataIndex: 'create_time',
                key: 'create_time',
                width: 160,
            },
            {
                title: '操作',
                key: 'operation',
                fixed: 'right',
                width: 150,
            },
        ];

        // 表格数据
        const tableData = ref([]);
        const tableLoading = ref(false);
        const loading = ref(false);

        // 分页配置
        const pagination = reactive({
            current: 1,
            pageSize: 20,
            total: 0,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`,
        });

        // 查询数据
        const fetchData = () => {
            tableLoading.value = true;
            const params = {
                page: pagination.current,
                page_size: pagination.pageSize,
                title: formState.title,
                product_id: formState.product_id,
                status: formState.status,
                category: formState.category,
                create_time: formState.create_time,
            };

            // 这里替换为实际的接口地址
            // tool.Http_.post(API.AppSrtoreAPI.inefficient.list, params).then(res => {
            //     tableData.value = res.data.data.list || [];
            //     pagination.total = res.data.data.total || 0;
            //     tableLoading.value = false;
            // }).catch(() => {
            //     tableLoading.value = false;
            // });

            // 模拟数据
            setTimeout(() => {
                tableData.value = [];
                tableLoading.value = false;
            }, 500);
        };

        // 表格分页/排序/筛选变化
        const handleTableChange = (pag) => {
            pagination.current = pag.current;
            pagination.pageSize = pag.pageSize;
            fetchData();
        };

        // 搜索
        const onFinish = (values) => {
            console.log('Search values:', values);
            pagination.current = 1;
            fetchData();
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

        onMounted(() => {
            // 分类信息初始化
            // tool.Http_.post(API.AppSrtoreAPI.dou_product.cate, { "cid": 0 }).then(res => {
            //     let obj_list = res.data.data;
            //     formState.options = getCateList(obj_list);
            // });

            fetchData();
        });

        // 类目列表转换
        const getCateList = (obj) => {
            var obj_list = []
            for (let i of obj) {
                let cate_obj = {}
                cate_obj.value = i.id;
                cate_obj.label = i.name;
                cate_obj.isLeaf = i.is_leaf;
                obj_list.push(cate_obj)
            }
            return obj_list
        };

        return {
            store,
            loading,
            innerHeight,
            PAGEDATA,
            formState,
            formRef,
            expand,
            onFinish,
            columns,
            tableData,
            tableLoading,
            pagination,
            handleTableChange,
            viewDetail,
            optimizeItem,
            batchOptimize,
            exportData,
            Select_the_column
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
    background-color: #f0f2f5;
}

.ant-advanced-search-form {
    background: #fff;
    padding: 20px;
    border-radius: 4px;
}
</style>
