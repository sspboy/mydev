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

    <!--现货模式-->
    <a-radio-group 
        v-model:value="presell_formdata.presell_type" 
        option-type="button" 
        :options="presell_formdata.options" 
        size="small"
        @change="console.log(presell_formdata.presell_type)"
    />

    <!--现货发货-->
    <a-form
        :model="spot_formdata"
        :rules="spot_formdata_rule"
        v-show="presell_formdata.presell_type === 0"
        style="margin: 20px 0 0 0;"
    >
          <a-row :gutter="[16]">
            <a-col :span="24">
                <a-form-item 
                    style="width: 200px;"
                    label="现货发货" 
                    name="delivery_delay_day"
                >
                    <a-select
                        ref="select"
                        v-model:value="spot_formdata.delivery_delay_day" 
                        :options="spot_formdata.delay_op"
                    />
                </a-form-item>
            </a-col>
        </a-row>


    </a-form>

    <!--预售发货-->
    <a-form 
        :model="presale_formdata"
        :rules="presale_formdata_rule"
        v-show="presell_formdata.presell_type === 1" style="margin: 20px 0 0 0;"
    >
      <a-row :gutter="[16]">
            <!--全款预售发货-->
            <a-col>
                <a-form-item 
                    style="width: 200px;"
                    label="现货发货" 
                    name="delivery_delay_day"
                >
                <a-select
                    ref="select"
                    v-model:value="presale_formdata.delivery_delay_day" 
                    :options="presale_formdata.delay_op"
                />
            </a-form-item>
            </a-col>
            <a-col :span="6" >
                <a-form-item label="预售发货时效" name="time_selected">
                    <a-select
                        ref="select"
                        v-model:value="presale_formdata.time_selected" 
                        :options="presale_formdata.time_end_op"
                        class="custom-radio"
                        @change="presale_formdata.set_time_selected"
                    />
                </a-form-item>
            </a-col>
            <a-col :span="4">
                <a-form-item name="presell_end_time">
                    <a-date-picker 
                        show-time 
                        :disabled="presale_formdata.presell_end_time_status"
                        format="YYYY-MM-DD HH:mm:ss"
                        placeholder="选择预售结束时间点"
                        @change="presale_formdata.get_end_time" 
                     />
                </a-form-item>
            </a-col>
            
            <a-col :span="4">
                <a-form-item>
                    <a-select
                        ref="select"
                        v-model:value="presale_formdata.presell_delivery_type"
                        :options="presale_formdata.delivery_op"
                        @focus="console.log('选择发货时间')"
                        @change="console.log('选择发货时间')"
                    />
                </a-form-item>
            </a-col>
            <a-col :span="4">
                <a-form-item name="presell_delay">
                <a-input-number 
                        addon-after="天后发货"
                        placeholder="输入天数"
                        style="width: 130px;"
                        v-model:value="presale_formdata.presell_delay" :min="3" :max="10" 
                    />
                    </a-form-item>
            </a-col>
        </a-row>
    </a-form>

    <!--现货+预售发货-->
    <a-form 
        :model="spot_presale_formdata"
        :rules="spot_presale_formdata_rule"
        v-show="presell_formdata.presell_type === 3" style="margin: 20px 0 0 0;">
        <a-row :gutter="[16]">
            <a-col>
                <a-form-item 
                    style="width: 200px;"
                    label="现货发货" 
                    name="delivery_delay_day"
                >
                <a-select
                    ref="select"
                    v-model:value="spot_presale_formdata.delivery_delay_day" 
                    :options="spot_presale_formdata.delay_op"
                />
            </a-form-item>
            </a-col>
            <a-col :span="12">
                <a-form-item label="预售发货时效" name="presell_delay">
                    <a-checkbox-group 
                        v-model:value="spot_presale_formdata.presell_delay" 
                        :options="spot_presale_formdata.de_op" 
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
    ProductUpdateRule,
    presell_formdata,
    spot_formdata,
    spot_formdata_rule,
    presale_formdata,
    presale_formdata_rule,
    spot_presale_formdata,
    spot_presale_formdata_rule
} from '@/assets/douyinshop/productmanagement/Add';

// 组件引用=====开始
export default defineComponent({
    name:'发货方式',
    components:{
        
    },
    props: {
        data:{typr:Object},
    },
    setup(props,ctx) {

        const Rule = new ProductUpdateRule()    // 实例化商品发布规则
        
        return{

            Rule, // 发布规则实力

            presell_formdata, // 发货模式

            spot_formdata,              // 现货发货 表单
            spot_formdata_rule,         // 现货发货 表单规则

            presale_formdata,// 预售 表单
            presale_formdata_rule,// 预售表单规则

            spot_presale_formdata,      // 现货+预售
            spot_presale_formdata_rule  // 现货+预售规则
            
        }
    }
})
</script>
<style scoped>

:deep(.ant-radio-wrapper) {
  font-size: 12px;
}

</style>