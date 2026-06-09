<!-- 发货履约 + 库存 --- 页面组件 

    1-现货发货模式规则
    2-阶梯发货模式规则
    3-全款预售发货模式规则
    4-SKU预售发货模式规则
    5-现货+预售发货规则（现货预售混合）
    6-新预售发货模式规则（现货预售混合）
    7-特殊时间延迟发货规则

-->

<template>

    <!--现货发货-->
    <a-form>
        <a-row :gutter="[16]">
            <a-col :span="24">
                <a-form-item label="发货模式">
                    <a-radio-group 
                        v-model:value="fulfillment_rule_formdata.Fulfillment_selected" 
                        option-type="button" 
                        :options="fulfillment_rule_formdata.options" 
                        size="small"
                        @change="console.log(fulfillment_rule_formdata.Fulfillment_selected)"
                    />
                </a-form-item>
            </a-col>
            
            <!--现货发货-->
            <a-col :span="4">
                <a-form-item label="现货发货">
                    <a-select
                        ref="select"
                        v-model:value="fulfillment_rule_formdata.delivery_delay_day" 
                        :options="fulfillment_rule_formdata.delay_op"
                        class="custom-radio"
                    />
                </a-form-item>
            </a-col>

            <!--全款预售发货-->
            <a-col :span="6" v-show="fulfillment_rule_formdata.Fulfillment_selected === 'product_presell_rule'">
                <a-form-item label="预售发货时效">
                    <a-select
                        ref="select"
                        v-model:value="fulfillment_rule_formdata.time_selected" 
                        :options="fulfillment_rule_formdata.time_end_op"
                        class="custom-radio"
                        @focus="console.log('预售结束时间')"
                        @change="console.log('预售结束时间')"
                    />
                </a-form-item>
            </a-col>
            <a-col :span="4" v-show="fulfillment_rule_formdata.Fulfillment_selected === 'product_presell_rule'">
                <a-form-item>
                    <a-date-picker show-time placeholder="选择预售结束时间点" @change="console.log('选择时间')" @ok="console.log('选择时间')" />
                </a-form-item>
            </a-col>
            
            <a-col :span="8" v-show="fulfillment_rule_formdata.Fulfillment_selected === 'product_presell_rule'">
                <a-form-item>
                    <a-space>
                    <a-select
                        ref="select"
                        v-model:value="fulfillment_rule_formdata.presell_delivery_type"
                        style="width: 120px"
                        :options="fulfillment_rule_formdata.delivery_op"
                        @focus="console.log('选择发货时间')"
                        @change="console.log('选择发货时间')"
                    />
                    <a-input-number 
                        addon-after="天后发货"
                        placeholder="输入天数"
                        style="width: 130px;"
                        v-model:value="fulfillment_rule_formdata.presell_delay" :min="1" :max="10" 
                    />
                    </a-space>
                </a-form-item>
            </a-col>

            <!--新现货+预售发货模式-->
            <a-col :span="12" v-show="fulfillment_rule_formdata.Fulfillment_selected === 'time_sku_pure_presell_rule'">
                <a-form-item label="预售发货时效">
                    <a-checkbox-group 
                        v-model:value="fulfillment_rule_formdata.new_presell_delay" 
                        :options="fulfillment_rule_formdata.de_op" 
                        />
                </a-form-item>
            </a-col>

        </a-row>

    </a-form>



</template>


<script>

// 导入方法
import { defineComponent,defineAsyncComponent,ref,reactive,onMounted,computed,shallowRef,onBeforeUnmount,toRaw, watch } from 'vue';
import { 
    fulfillment_rule_formdata,
    ProductUpdateRule } from '@/assets/douyinshop/productmanagement/Add';

// 组件引用=====开始
export default defineComponent({
    name:'发货方式',
    components:{
        
    },
    props: {
        data:{typr:Object}
    },
    setup(props,ctx) {

        const Rule = new ProductUpdateRule()    // 实例化商品发布规则
        console.log(props.data)
        return{
            props,
            fulfillment_rule_formdata,
            Rule, // 发布规则实力
            
        }
    }
})
</script>
<style scoped>

:deep(.ant-radio-wrapper) {
  font-size: 12px;
}

</style>