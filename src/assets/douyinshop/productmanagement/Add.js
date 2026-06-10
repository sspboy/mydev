// 新建商品组件：方法调用
import { ref,reactive,toRaw } from 'vue'
import * as TOOL from '@/assets/JS_Model/tool';
import * as TABLE from '@/assets/JS_Model/TableOperate';
import * as utils from '@/assets/JS_Model/public_model';
import axios from 'axios';
const tool = new TOOL.TOOL()            // 工具方法
const API = new utils.A_Patch()         // 请求接口地址合集


// 商品发布规则：跟随分类id变化
// 支持那些必填字段
// 字段的输入规范（长度、格式等）
// 点击[预测商品类目Check_Cate]=>获取到类目触发加载规则==ok 赋值[Rule.category_id.value]
// 请求属性:加载到列表[loadFormat]=>触发加载规格==ok 赋值[Rule.category_id.value]
// 监听类目赋值成功后：：启用TAB选项卡：：watch(CATE.cate_value ,(newVal, oldVal)=>{})
// 点击【库存发货】选项卡后click_tab，加载可用发货模式
// 对应读取发货规则,渲染可用发货表单Fulfillment.load


// 【现货发货说明】
// 发货模式：：presell_type=1 
// 承诺发货时间，在现货模式下填写。delivery_delay_day： 承诺发货时间，单位是天,不传则默认为2天。现货发货(presell_type=0)模式下，支持传入9999 、1、 2 （分别表示当日发、次日发、48小时发），具体支持传入的参数范围：/product/getProductUpdateRule。

// 【新-现货+预售说明】
// 现货+预售(逐步下线)：  presell_type=1&&presell_config_level=2；
// 阶梯发货模式(逐步下线)： presell_type=2&&new_step_product=false；
// 上述两种方式的升级版 - (新)现货+预售： presell_type=2&&new_step_product=true；


// 发货模式 presell_type ，0-现货发货，1-预售发货，2-阶梯发货，默认0
export const presell_formdata = reactive({
    // 发货模式==字段开始
    presell_type: 0, // 发货模式，0-现货发货，1-预售发货，2-阶梯发货，默认0
    presell_config_level: 0, // 默认0，0：全款预售，1：sku预售，2：现货+预售 ，3：新预售
    // 发货模式 tab list
    options:[
        {
            label: '现货发货',
            value: 0,
            name:'normal_rule',
            disabled:false // 禁用状态
            
        },
        {
            label: '全款预售发货',
            value: 1,
            name:'product_presell_rule',
            disabled:false
        },
        {
            label: '新预售发货',
            value: 3,
            name:'time_sku_pure_presell_rule',
            disabled:false
        },
        {
            label:'现货+预售发货',
            value:'4',
            name:'time_sku_presell_with_normal_rule',
            disabled:false
            
        },
        {
            label:'新-现货+预售发货',
            value:'5',
            name:'step_rule',
            disabled:false

        }
    ],
})

// 现货表单
export const spot_formdata = reactive({
    // 现货发货
    delivery_delay_day:'9999',// 现货承若发货时间
    //现货发货 承若发货时间--下拉选项
    delay_op:[{
        label: '当日发',
        value: '9999',
    },{
        label: '次日发',
        value: '1',
    },{
        label: '48小时发',
        value: '2',
    }],
})

// 现货表单规则
export const spot_formdata_rule = {
    // 现货发货承若时间
    delivery_delay_day:[{
        required: true,
    }],
}

// 预售表单
export const presale_formdata =  reactive({

    // 现货发货
    delivery_delay_day:'9999',// 现货承若发货时间
    //现货发货 承若发货时间--下拉选项
    delay_op:[{
        label: '当日发',
        value: '9999',
    },{
        label: '次日发',
        value: '1',
    },{
        label: '48小时发',
        value: '2',
    }],

    presell_end_time: undefined, // 预售结束时间
    presell_end_time_status:false,// 是否需要选择结束时间点
    time_selected:0, // 选择发货时间方式
    time_end_op:[
        {
            label: '设置预售结束时间',
            // 预售结束后发货 presell_delivery_type=0 需要传值presell_end_time
            value: 0},
        {
            label: '无预售结束时间',
            // 支付完成后发货 presell_delivery_type=1 不需要传值presell_end_time
            value: 1
        },
    ],

    presell_delivery_type: 0,  // 全款预售和sku预售时传递，其他不传： 0 预售结束后发货 1支付完成后发货
    delivery_op:[{
        label: '预售结束后',
        value: 0
    },{
        label: '支付完成后',
        value: 1
    }],

    presell_delay: '5', //预售承诺发货时间
    
    // 预售时间点==presell_end_time 最多支持设置距离当前30天
    get_end_time:(value)=>{

        let str = value?.format('YYYY-MM-DD HH:mm:ss') || undefined;
        // 获取当前天数
        // 获取 支付结束后 && 预售结束后
        // 获取最长预售结束时间 Rule.info
        presale_formdata.presell_end_time = str

    },
    // 设置预售时间方式
    set_time_selected:(value)=>{

        // 为1，无需设置时间点-支付完成后-指定天数发货
        if(value == '1'){
            presale_formdata.presell_delivery_type = 1
            presale_formdata.delivery_op.forEach(item=>{
                if(item.value == 0){
                    item.disabled = true;
                }
            })
            presale_formdata.presell_end_time_status = true;
            presale_formdata_rule.presell_end_time[0].required = false; // 非必填
        }else if(value == '0'){
            // 为0，需要设置结束时间-预售结束后-指定天数发货
            presale_formdata.presell_end_time_status = false;
            presale_formdata.delivery_op.forEach(item=>{
                if(item.value == 0){
                    item.disabled = false;
                }
            })
            presale_formdata_rule.presell_end_time[0].required = true; // 必填
        }
    }
})

// 预售表单规则
export const presale_formdata_rule = {
    delivery_delay_day:[{
        required: true,
    }],
    time_selected:[{
        required: true,

    }],
    presell_end_time:[{
        required: true,
        message: '时间不能为空!',
        trigger: 'change',
    }],
    presell_delay:[{
        required: true,
        message: '不能为空!',
        trigger: 'change',
    }]
}

// 现货+预售 混合发货表单
export const spot_presale_formdata = reactive({

    // 现货发货
    delivery_delay_day:'9999',// 现货承若发货时间
    //现货发货 承若发货时间--下拉选项
    delay_op:[{
        label: '当日发',
        value: '9999',
    },{
        label: '次日发',
        value: '1',
    },{
        label: '48小时发',
        value: '2',
    }],
    presell_delay:['5'],
    de_op:[
        {
            label: '5天内',
            value: '5'
        },
        {
            label: '15天内',
            value: '15'
        },
        {
            label: '45天内',
            value: '45'
        }
    ],

})

// 现货+预售 规则
export const spot_presale_formdata_rule = {
    delivery_delay_day:[{
        required: true,
    }],
    // 新现货+预售发货模式
    presell_delay:[{
        required: true
    }]

}

export class ProductUpdateRule {

    category_id=ref(1000003396) // 分类id-3396-26491
    senses=ref(undefined) // 闪购定制参数，普通发品忽略
    standard_brand_id=ref(undefined) // 品牌id
    spu_id=ref(undefined) // spu_id
    info=ref(undefined) // 发布规则信息对象

    // 获取发布规则
    get=()=>{

        // 判断类是否选择
        if (!this.category_id.value) {
            tool.Fun_.message('info', '请先选择商品类目后，才能查看对应发布规则.')
            return
        }
        console.log(this.category_id.value)
        axios.post(API.AppSrtoreAPI.dou_product.addrule, {
            category_leaf_id: this.category_id.value,
        }).then((response) => {
            this.info.value = response.data.data; // 规则赋值
            console.log(this.info.value)

        }).catch((error) => {
            console.log(error);
        });
    }

    // 点击tab回调方法 
    // 0 基础信息 1 主图类目 2 商品规格 3 库存发货 5 描述详情 6 资质规则
    click_tab=(value)=>{
        
        if(value === '3'){ // 库存发货
            this.Fulfillment.load(this.info.value)
        }

    }

    // 履约发货
    Fulfillment = {

        // 加载履约方式：：渲染支持的发货方式
        load:(data)=>{

            var data_obj = toRaw(data)

            var fulfillment_rule = data_obj.fulfillment_rule

            Object.keys(fulfillment_rule).forEach(key=>{

                let obj = fulfillment_rule[key]

                let support = obj.support;// 是否支持

                // fulfillment_rule_formdata.options.value.forEach(item=>{
                //     if(item.value === key){
                //         item.disabled = !support
                //     }
                // })

                if(key === 'normal_rule' && support === true){
                    // 现货发货表单渲染方法
                    this.Fulfillment.rendering_normal(obj)
                }else if(key === 'step_rule' && support === true){
                    // 阶梯发货模渲染方法
                }else if(key === 'product_presell_rule' && support === true){
                    // 全款预售发货渲染方法
                }else if(key === 'sku_presell_rule' && support === true){
                    // SKU预售发货模式渲染方法
                }else if(key === 'time_sku_presell_with_normal_rule' && support === true){
                    // 现货+预售发货模式渲染方法
                }else if(key === 'time_sku_pure_presell_rule' && support === true){
                    // 新预售发货模式渲染方法
                }else if(key === 'delay_rule' && support === true){
                    // 特殊延迟发货模式渲染方法
                }
            })
        },

        // 渲染【现货]】表单初始值
        rendering_normal:(data)=>{
            console.log('现货发货', data)
        },

        // 渲染【预售】表单
        rendering_product_presell:(data)=>{
            console.log('预售发货', data)
        },

        // 渲染【现货+预售】表单
        rendering_time_sku_presell_with_normal:(data)=>{
            console.log('现货 + 预售发货', data)
        },

        // 预售门槛价


        
    }

    // 渲染现货+预售表单

    // 获取现货

    // 获取预售

    // 获取现货+预售

    // 商品标题推荐规则recommend_name_rule
    // 参考价相关规则reference_price_rule
    // 商品主图3:4配置规则main_image_three_to_four_rule

    // 售后服务规则after_sale_rule

    // 商品规格约束product_spec_rule

    // 商品尺码模板配置规则component_template_rule

    // sku规则sku_rule

    // 资质规则，类目属性影响资质必填和资质属性必填qualification_rule

    // spu管控规则spu_control_rule
    // 交易相关的规则trade_rule
    // 提取方式规则pick_up_method_rule
    // 金价信息gold_price_rule
    // 其他规则extra_rule
    // 商品【履约发货】

}