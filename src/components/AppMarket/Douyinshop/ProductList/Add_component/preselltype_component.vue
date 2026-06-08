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

    <a-radio-group 
        v-model:value="fulfillment_rule_formdata.Fulfillment_selected" 
        option-type="button" 
        :options="fulfillment_rule_formdata.options" 
        size="small"
        style="margin-top: 20px;"
        @change="console.log(fulfillment_rule_formdata.Fulfillment_selected)"
    />

    <!--现货发货-->
    <a-form style="margin-top: 20px;" v-show="fulfillment_rule_formdata.Fulfillment_selected === 'normal_rule'">
        <a-form-item label="现货发货时间">
            <a-radio-group 
                v-model:value="fulfillment_rule_formdata.delivery_delay_day" 
                :options="fulfillment_rule_formdata.de_op"
                class="custom-radio"
            />
        </a-form-item>
    </a-form>

    <!--阶梯发货模-->
    <a-form style="margin-top: 20px;" v-show="fulfillment_rule_formdata.Fulfillment_selected === 'step_rule'">
        <a-form-item label="现货发货时间">
            <a-radio-group 
                v-model:value="fulfillment_rule_formdata.delivery_delay_day" 
                :options="fulfillment_rule_formdata.de_op"
                class="custom-radio"
            />
        </a-form-item>
        <a-form-item label="阶梯发货时间">
        <!-- <a-select
            ref="select"
            v-model:value="value"
            style="width: 120px"
            :options="options3"
            @focus="focus"
            @change="handleChange"
        /> -->
        </a-form-item>
    </a-form>

    <!--全款预售发货-->
    <a-form style="margin-top: 20px;" v-show="fulfillment_rule_formdata.Fulfillment_selected === 'product_presell_rule'">
        <a-form-item label="现货发货时间">
            <a-radio-group 
                v-model:value="fulfillment_rule_formdata.delivery_delay_day" 
                :options="fulfillment_rule_formdata.de_op"
                class="custom-radio"
            />
        </a-form-item>
        <a-form-item label="预售结束时间">
        </a-form-item>
        <a-form-item label="预售结束时间点">
        </a-form-item>
        <a-form-item label="预售发货时间">
            <!-- <a-select
            ref="select"
            v-model:value="value"
            style="width: 120px"
            :options="options3"
            @focus="focus"
            @change="handleChange"
        /> -->
        </a-form-item>
    </a-form>

    <!--SKU预售发货-->
    <a-form style="margin-top: 20px;" v-show="fulfillment_rule_formdata.Fulfillment_selected === 'sku_presell_rule'">
        <span>SKU预售发货</span>
    </a-form>

    <!--现货+预售发货-->
    <a-form style="margin-top: 20px;" v-show="fulfillment_rule_formdata.Fulfillment_selected === 'time_sku_presell_with_normal_rule'">
        <span>现货+预售发货</span>
    </a-form>

    <!--新预售发货模式-->
    <a-form style="margin-top: 20px;" v-show="fulfillment_rule_formdata.Fulfillment_selected === 'time_sku_pure_presell_rule'">
        <span>新预售发货模式</span>
    </a-form>

    <!--特殊时间延迟发货-->
    <a-form style="margin-top: 20px;" v-show="fulfillment_rule_formdata.Fulfillment_selected === 'delay_rule'">
        <span>特殊时间延迟发货</span>
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
        
        return{
            fulfillment_rule_formdata,
            Rule, // 发布规则实力
            
        }
    }
})
</script>
<style scoped>

</style>