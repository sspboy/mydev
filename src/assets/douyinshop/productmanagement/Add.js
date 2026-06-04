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

// 发货模式 presell_type ，0-现货发货，1-预售发货，2-阶梯发货，默认0
export const Fulfillment_selected = ref('normal_rule') // 发货模式选中值
export const delivery_delay_day = ref(undefined)// 承诺发货时间

export class ProductUpdateRule {

    category_id=ref(1000003396) // 分类id
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
    // Tab调用发放
    // 0 基础信息 1 主图类目 2 商品规格 3 库存数量 4 履约发货 5 描述详情 6 资质规则
    click_tab=(value)=>{
        
        if(value === '3'){
            console.log(value)
            console.log(Fulfillment_selected.value)
            this.Fulfillment.load(this.info.value)
        }

    }

    // 履约规则fulfillment_rule
    Fulfillment = {
        
        // 履约tab list
        options:[
            {
                label: '现货发货模式',
                value: 'normal_rule',
                disabled:true
            },
            {
                label: '阶梯发货模式',
                value: 'step_rule',
                disabled:true
            },
            {
                label: '全款预售发货模',
                value: 'product_presell_rule',
                disabled:true
            },
            {
                label: 'SKU预售发货模式',
                value: 'sku_presell_rule',
                disabled:true
            },
            {
                label: '现货+预售发货',
                value: 'time_sku_presell_with_normal_rule',
                disabled:true
            },
            {
                label: '新预售发货模式',
                value: 'time_sku_pure_presell_rule',
                disabled:true
            },
            {
                label: '特殊时间延迟发货',
                value: 'delay_rule',
                disabled:true
            },

        ],

        // 现货发货提交字段
        normal_formdata:reactive({

            delivery_delay_day:['999'],// 选中值

            //下拉选项
            de_op:[{
                label: '当日发',
                value: '999',
            },{
                label: '次日发',
                value: '1',
            },{
                label: '48小时发',
                value: '2',
            }]
        }),
        // 阶梯发货模式提交字段
        step_formdata:reactive({

        }),
        // 全款预售发货
        product_presell_formdata:reactive({

        }),
        // SKU预售发货
        sku_presell_formdata:reactive({

        }),
        // 现货+预售发货
        time_sku_presell_with_normal_formdata:reactive({

        }),
        // 新预售发货模式
        time_sku_pure_presell_formdata:reactive({

        }),
        // 特殊时间延迟发货
        delay_formdata:reactive({

        }),

        // 加载履约方式：：渲染支持的发货方式
        load:(data)=>{
            var data_obj = toRaw(data)
            var fulfillment_rule = data_obj.fulfillment_rule
            Object.keys(fulfillment_rule).forEach(key=>{
                let obj = fulfillment_rule[key]
                let support = obj.support;// 是否支持
                this.Fulfillment.options.find(item=>{
                    if(item.value == key){
                        item.disabled = !support
                    }
                })
                
                if(key === 'normal_rule' && support === true){
                    // 现货发货表单渲染方法
                    this.Fulfillment.rendering_normal(obj)
                }else if(key === 'step_rule' && support === true){
                    // 阶梯发货模渲染方法
                    this.Fulfillment.rendering_step(obj)
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
            // console.log(toRaw(data))
        },

        // 渲染现货表单初始值
        rendering_normal:(data)=>{
            // 可选项
            console.log('现货发货规则',data)
        },

        // 渲染阶梯发货表单初始值
        rendering_step:(data)=>{
            console.log('现货发货规则',data)
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

// 【基本信息】


// 主图
export class PicFun  {
    
    PicList=ref([])// 输出的图片列表

    // 删除图片
    del_pic=(index)=>{
        this.PicList.value.splice(index, 1)
    }

    // 添加图片
    add=(data)=>{

        data.forEach((obj,idx)=>{
            // 判断是否图片素材
            var material_type = obj.material_type;

            // console.log(material_type)
            // 是图片=>添加到数组
            if(material_type == 'photo'){
                var photo_info = obj.photo_info;
                var pic_width = photo_info.width;      // 宽度
                var pic_height = photo_info.height;     // 高度
                if(pic_width == pic_height){
                    Pic_Fun.PicList.value.push(obj)
                }else{
                
                    tool.Fun_.message('info','主图长宽比例需要1:1,不小于600X600.')
                
                }
            }else if(material_type == 'video'){

                tool.Fun_.message('info','【主图】不能选择视频，请选择图片素材！')
            
            }
        })

        // 只保留5张主图；
        if(Pic_Fun.PicList.value.length > 5){
            Pic_Fun.PicList.value = Pic_Fun.PicList.value.slice(0, 5)
            tool.Fun_.message('info','最多上传5张主图')
        }

    }
    
    // 获取主图
    get=()=>{

        var pic = Pic_Fun.PicList.value;

        if(pic.length == 0){
            return false
        }else{
            var res_text = ''
            pic.forEach((obj,index)=>{
                res_text = res_text + obj.byte_url  + '|'
            })
            return res_text.slice(0, -1)
        }
    }
}

// 3：4--长图
export class Longimg_Fun {

    PicList=ref([])

    // 删除长图
    del=(idx)=>{
        Longimg_Fun.PicList.value.splice(idx, 1);
    }

    // 添加长图
    add=(data)=>{
        data.forEach((obj,idx)=>{
            Longimg_Fun.PicList.value.push(obj)
        })
        if(Longimg_Fun.PicList.value.length > 5){
            Longimg_Fun.PicList.value = Longimg_Fun.PicList.value.slice(0, 5)
        }
    }

    // 获取长图
    get=()=>{

        var res = Longimg_Fun.PicList.value;

        if(res.length >0){

            var res_text = ''
            res.forEach((obj,index)=>{
                res_text = res_text + obj.byte_url  + '|'
            })

            return res_text.slice(0, -1)

        }else{
            return false
        }
    }
    
}

// 白底图
export class whiteimg_Fun {

}

// 视频
export class video_Fun {

}

// 标题
export class AddProduct {

}

// 分类、属性
export class CATE {

}

// 基础信息

// 规格库存

// 描述详情

// 关闭新建商品按钮

// 商品上传接口方法
export class upload_product{

    data={'product_name': '123'}// 商品商品data对象

    up=()=>{
        console.log(this.data)
    }

}