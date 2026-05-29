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
        <div>
            <p>品牌列表</p>
        </div>

        <div>下拉加载更多品牌</div>

        <template #footer>
            <a-space align="end" style="height: 100%;">
                <a-button type="primary" @click="console.log('确认')">确认</a-button>
                <a-button @click="onClose">取消</a-button>
            </a-space>
        </template>
    </a-drawer>
</template>

<script>
import { defineComponent,ref } from 'vue';
// 网络请求工具引用
import * as TOOL from '@/assets/JS_Model/tool';
import * as utils from '@/assets/JS_Model/public_model';
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

        console.log(props.data) // 主模板
        
        // 默认品牌列表查询
        const load_get_brand=(c_id)=>{

            tool.Http_.post(API.AppSrtoreAPI.dou_product.brand, {
                "category_id":c_id
            }).then((res)=>{
                console.log(res)
                // 成功
                // 失败
            })

        }

        // load_get_brand()

        // category_id 必填 - 按类目id推荐品牌

        // query 按关键词查询品牌品牌前缀

        // brand_ids按品牌id查询
      // 取消
      const onClose = () =>{

         props.data.brand_list_open = !props.data.brand_list_open;

      }
    
        return{
            props,
            visible:ref(false),
            onClose
        }
    }
    })
</script>
<style lang="less" scoped>
</style>