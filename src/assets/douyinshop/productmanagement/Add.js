// 新建商品组件：方法调用
import { ref,reactive,toRaw,computed } from 'vue'
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
            label: '现货预售混合发货',
            value: 2,
            name:'step_rule',
            disabled:false
        },
        {
            label: '预售发货',
            value: 1,
            name:'product_presell_rule',
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

// 新-现货+预售 混合发货表单
export const step_formdata = reactive({

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
    
    presell_delay:[],

    de_op:[],

})

// 新-现货+预售 规则
export const step_formRef = ref();
export const step_formdata_rule = {
    delivery_delay_day:[{
        required: true,
    }],
    // 新现货+预售发货模式
    presell_delay:[{
        required: true,
        message: '不能为空!',
        trigger: 'change',
        type: 'array',        // 必须是数组类型
        min: 1,               // 数组长度至少为1
    }]

}

// 库存
export const skulistRef = ref(); // 验证库存表单
export const skulist_formState = reactive({
    skudatelist: []
})

// 库存批量操作表单
export const stock_operation_formdata = reactive({
    spec:[],// 规格树
    price:undefined,// 价格
    stock:undefined,// 现货库存
    presale:[],// 预售类型
    presale_stock:undefined,// 预售库存
    code:undefined// 编码
})

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

            this.Fulfillment.load(this.info.value) // 加载发货方式

        }).catch((error) => {
            console.log(error);
        });
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

                presell_formdata.options.forEach(item=>{
                    if(item.name === key){
                        item.disabled = !support
                    }
                })

                if(key === 'normal_rule' && support === true){
                    // 现货发货表单渲染方法
                    this.Fulfillment.rendering_normal(obj)
                }else if(key === 'step_rule' && support === true){
                    // 阶梯发货模渲染方法
                    this.Fulfillment.step_rule(obj)
                }else if(key === 'product_presell_rule' && support === true){
                    // 全款预售发货渲染方法
                }
            })
        },

        // 渲染【现货]】表单初始值
        rendering_normal:(data)=>{
            console.log('现货发货', data)
        },

        // 渲染【全款预售】表单
        rendering_product_presell:(data)=>{
            console.log('全款预售发货', data)
        },

        // 渲染【现货+预售】表单
        step_rule:(data)=>{
            let step_delay_options = data.delay_options; // 现货时效
            let multi_times = data.multi_times;// 渲染预售发货时效
            step_formdata.de_op = [] // 清空
            step_formdata.presell_delay = [multi_times[0].time_type];
            multi_times.forEach(item=>{
                item.value = item.time_type;
                item.label = item.time_desc;
                step_formdata.de_op.push(item)
            })
        },

        // 获取 发货模式 表单值
        get:()=>{

            if(presell_formdata.presell_type==0){// 现货
                let obj = {
                    presell_type:0,
                    delivery_delay_day:spot_formdata.delivery_delay_day
                }
                console.log('现货', obj)

            }else if(presell_formdata.presell_type==1){// 全款预售

                let obj = {
                    presell_type:1,
                    presell_config_level:0,
                    presell_delivery_type:presale_formdata.presell_delivery_type, // 0 预售结束后发货(不超过当前距离30天) 1支付完成后发货(无需结束时间点)
                    presell_end_time:presale_formdata.presell_end_time,
                    presell_delay:presale_formdata.presell_delay
                }

                console.log('全款预售', obj)

            }else if(presell_formdata.presell_type==2){// 新现货+预售
                
                // 验证表单
                step_formRef.value.validate().then(() => {
                    
                    let obj = {
                        presell_type:2,
                        presell_config_level:0,
                        delivery_delay_day:step_formdata.delivery_delay_day,
                    }
                    console.log('新-现货+预售',obj)
                }).catch(err => {
                    
                    // 指定tab 到 库存发货
                    console.log('校验失败', err);
                    
                    return

                });
                
                // spec_prices_v2.stock_num传现货库存
                // spec_prices_v2.multi_time_stocks数组传各个时效库存

            }

        },
        // 预售库存
        get_same_value:(value)=>{
            console.log(value)
        }
    }

    // 现货库存 预售库存 批量设置价格 批量设置现货库存 批量设置预售库存
    Stock = {

        sepec_info:undefined,

        // 获取SKU信息
        get_specs:()=>{
            let a = this.Stock.get_colums()
            let b = this.Stock.get_data()
            console.log('规格信息',a)
            console.log('规格信息',b)
        },

        // 笛卡尔积方法sku_value数组取值
        get_value_sku_list:() =>{
            
            var res_list = []

            var datalist = this.Stock.sepec_info;
            
            // 规格取值
            for(let i of datalist){
                var v_list = []
                for(let y of i.values){
                    v_list.push(y.value_name)
                }
                res_list.push(v_list)
            }

            // 笛卡尔积方法
            var d_list = tool.Fun_.cartesianProduct(res_list)

            return d_list

        },

        // comlum表头取值
        get_colums:() =>{

            var name_list = this.Stock.get_name_sku_list()

            var res_list = []

            for(let i of name_list){
                let c_obj = {}
                c_obj.title = i;
                c_obj.dataIndex = i;
                if(i){res_list.push(c_obj)}
            }

            if(res_list.length>0){
                let price_obj = {title:'价格',dataIndex:'price',width:'140px'}
                let stock_num_obj = {title:'库存',dataIndex:'stock_num',width:'140px'}
                let code_obj = {title:'编码',dataIndex:'code',width:'140px'}
                res_list.push(price_obj)
                res_list.push(stock_num_obj)
                res_list.push(code_obj)
            }

            return res_list

        },

        // 规格表单data取值(实时)
        get_data:() =>{

            var name_list = this.Stock.get_name_sku_list()//名称列表

            var d_list = this.Stock.get_value_sku_list()// 笛卡尔积-值列表
            

            var data_list = []

            for(let y of d_list){

                var y_text_name = y.join('')

                var data = {}

                for(var i=0;i<name_list.length;i++){

                    data[name_list[i]] = y[i];
                    data['price'] = '';
                    data['stock_num'] = '';

                }

                if(y[0]){data_list.push(data)}
                
            }
            return data_list

        },

        // 提取sku的name数组
        get_name_sku_list:() =>{
            var name_list = []
            var datalist = this.Stock.sepec_info;
            for(let i of datalist){
                name_list.push(i.property_name)
            }
            return name_list
        },

        // 提取-初始情况下-sku_价格、库存
        get_p_s_obj:() => {
            var res_obj = {}
            for(let i of this.Stock.sepec_info){
                for(let y of i.values){
                    if(y.price != undefined){
                        var p_s_obj = {}
                        p_s_obj.price === undefined ? '':y.price
                        p_s_obj.stock_num === undefined ? '':y.stock_num
                        p_s_obj.code = y.code === undefined ? '':y.code
                        res_obj[y.value] = p_s_obj
                    }
                }
            }
            return res_obj
        },
        
        // 获取库存验证
        get_sku_list:async()=>{

            // 库存未初始化
            if(skulistRef.value === undefined){

                tool.Fun_.message('error', '库存信息不能为空！');

                return false

            }

            // 库存以及初始化
            var res = await skulistRef.value.validate().then(()=>{

                var sku_list_res = skulist_formState.skudatelist;
                
                var s_list = []

                sku_list_res.forEach(obj=>{
                    var o = {}
                    var sell_obj = []

                    Object.keys(obj).forEach(key=>{
                        if(key !== 'stock_num' && key !== 'price' && key !== 'code'){
                            var s_obj = {}
                            s_obj.property_name = key;
                            s_obj.value_name = obj[key]
                            sell_obj.push(s_obj)
                        }
                    })

                    o.sell_properties = sell_obj; //名称对象
                    o.sku_type = 0;
                    o.stock_num = obj.stock_num;
                    o.price = obj.price * 100;// 价格转换为分
                    o.code = obj.code; // 商家编码
                    s_list.push(o)

                })

                console.log(s_list)

                return s_list

            }).catch(error => {
                console.log(error)
                tool.Fun_.message('error',error.errorFields[0].errors[0]);
                return false

            })

            return res
        },

        // 批量设置库存
        batch_set:()=>{

            // console.log('批量设置的表单',stock_operation_formdata)
            // console.log('被修改的skuList',skulist_formState.skudatelist)
            let price = stock_operation_formdata.price
            let stock = stock_operation_formdata.stock
            let presale_stock = stock_operation_formdata.presale_stock
            let code = stock_operation_formdata.code
            

            
            // console.log(stock_operation_formdata.stock)// 现货库存
            // console.log(stock_operation_formdata.presale_stock)// 预售库存
            // console.log(stock_operation_formdata.code)// 编码

            skulist_formState.skudatelist.forEach(item=>{
                console.log(stock)// 价格

                if(price){item.price = price}
                if(stock){item.stock_num = stock}
                if(presale_stock){item.presale_stock = presale_stock}
                if(code){item.code = code}
            })
            

        }
    }


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

