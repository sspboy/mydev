<!-- 

    名称：品牌列表查询组件
    获取当前店铺的品牌列表
    品牌id，通过/brand/list获取，无品牌id则传596120136；
    入参：当前商品category_id （推荐使用，必填）类目id
    入参：query 品牌前缀（中文或者英文），适用于不需要品牌资质的场景，根据前缀搜索品牌
    入参：brand_ids （选填）品牌ids，传了品牌ids默认直接拿品牌id搜索并返回结果(放在brand_list里)，不会使用其他入参

-->
<template>
    <a-drawer
        title="品牌列表"
        v-model:open="props.data.brand_list_open"
        root-class-name="root-class-name"
        :root-style="{ color: 'blue' }"
        size="large"
        style="color: #666"
        width="50%"
        placement="right"

    >
        <!-- 商品分类id未选择 提示-->
        <a-alert
            v-if="category_id === '' || category_id === undefined"
            style="margin:0 0 20px 0;padding: 8px;line-height: 24px;"
            class="font_size_12"
            description="未选择商品类目，无法查询品牌列表，请先选择商品类目。"
            type="info"
            banner
        />

        <!--
            <p>品牌列表</p>
            更具当前选择的类目查询品牌列表
            1、默认无品牌
            2、无其它品牌列表 去添加
            3、有品牌列表 选择品牌后 进行下一步操作
            4、支持点击加载更多加载品牌列表
            5、点击确认回填品牌id以及品牌名称
            6、参考选择尺码模板组件方式设计

            <div>auth_required : 类目是否要求品牌有授权</div>
            <div>授权的品牌列表</div>
            <div>未授权的品牌列表</div>
        -->


        <a-form
            layout="inline"
            :model="formState"
            @finish="formState.handleFinish"
            @finishFailed="formState.handleFinishFailed"
        >
                <a-form-item label="ID" name="brand_id">
                    <a-input v-model:value="formState.brand_id" placeholder="请输入品牌id" />
                </a-form-item> 

                <a-form-item label="名称" name="brand_name">
                    <a-input v-model:value="formState.brand_name" placeholder="请输入品牌名称" />
                </a-form-item>

                <a-form-item>
                    <a-button type="primary" html-type="submit" size="small">查询</a-button>
                </a-form-item>
        </a-form>
        
        <!-- 商品分类id未选择 -->
        <a-radio-group v-model:value="BrandFun.radio_value" style="width: 100%;margin-top: 20px;">
        <a-list :grid="{ gutter: [0,10], column: 1 }" :data-source="BrandFun.list" >
            <template #renderItem="{ item }">
                <a-list-item style="margin: 0;padding: 0;">
                    <a-card>
                        <a-radio :value="item.brand_id" class="font_size_12">
                            <span> 名称：： {{item.name_cn}}</span>
                        </a-radio>
                        <span style="color: #999;float: right;display: block;" class="font_size_12">id: {{item.brand_id}}</span>
                    </a-card>
                </a-list-item>
            </template>
        
        </a-list>
        </a-radio-group>
        <!-- 商品分类id已选择 -->


        <template #footer>
            <a-space align="end" style="height: 100%;">
                <a-button type="primary" @click="onSubmit">确认</a-button>
                <a-button @click="onClose">取消</a-button>
            </a-space>
        </template>
    </a-drawer>
</template>

<script>
import { defineComponent,ref,reactive } from 'vue';
// 网络请求工具引用
import * as TOOL from '@/assets/JS_Model/tool';
import * as utils from '@/assets/JS_Model/public_model';
import { t } from '@wangeditor/editor';
export default defineComponent({

    name: "brandlist",  // 运费详情组件
    // 引用组件
    components: {

    },

    // 父组件数据
    props: {

        data:{typr:Object}
  
    },
    
    setup(props, ctx) {

        const tool = new TOOL.TOOL()            // 工具方法
        const API = new utils.A_Patch()         // 请求接口地址合集
        
        // category_id 必填 - 按类目id推荐品牌
        var category_id = props.data.category_id; // 当前选择的类目id
        
        // 查询表单
        const formState = reactive({
            brand_id: '', // 品牌id
            brand_name: '', // 品牌名称
            // 查询正确执行方法
            handleFinish: (values) => {
                console.log(values);
            },
            // 查询异常执行方法
            handleFinishFailed: (errors) => {
                console.log(errors);
            }
        });

        console.log(category_id) // 主模板

        const BrandFun=reactive({

            // 596120136 默认品牌id-==无品牌
            // 品牌列表
            list:[
                {
                    brand_id:"596120136",
                    name_cn:"无品牌",
                    name_en:"无品牌"
                },
                {
                    brand_id:"59612013611",
                    name_cn:"无品牌",
                    name_en:"无品牌"
                }
            ], 
            brand_list_open:false, // 品牌列表抽屉开关
            radio_value:undefined, // 品牌列表单选框选中值
            selectcondition:{
                    category_id:category_id, // 当前选择的类目id
                    query:'', // 品牌前缀（中文或者英文），适用于不需要品牌资质的场景，根据前缀搜索品牌
                    brand_ids:[] // 品牌ids，传了品牌ids默认直接拿品牌id搜索并返回结果(放在brand_list里)，不会使用其他入参
            }, // 查询条件

            // 默认品牌列表查询
            load_get_brand:(data)=>{
                tool.Http_.post(API.AppSrtoreAPI.dou_product.brand, data).then((res)=>{
                    console.log(res)
                })
            }
        })

        


        // 页面底部===取消
        const onClose = () =>{

            props.data.brand_list_open = !props.data.brand_list_open;

        }
        // 页面底部===确认提交
        const onSubmit = () =>{
            // find到当前选中品牌的品牌信息
            let select_brand = BrandFun.list.find(item=>item.brand_id === BrandFun.radio_value)
            console.log(select_brand,BrandFun.radio_value)
        }

    
        return{
            props,
            visible:ref(false),
            category_id,// 分类id
            BrandFun,
            onClose,
            onSubmit,
            formState,
        }
    }
    })
</script>
<style lang="less" scoped>
</style>