// 新建商品组件：方法调用
import { ref } from 'vue'
import * as TOOL from '@/assets/JS_Model/tool';
import * as TABLE from '@/assets/JS_Model/TableOperate';
import * as utils from '@/assets/JS_Model/public_model';
import axios from 'axios';
const tool = new TOOL.TOOL()            // 工具方法
const API = new utils.A_Patch()         // 请求接口地址合集


// 商品发布规则：跟随分类id变化
// 1、支持那些必填字段
// 2、字段的输入规范（长度、格式等）
// 点击[预测商品类目]=>获取到类目触发加载规则==ok
// 切换商品类目=>触发加载规格==ok
export class ProductUpdateRule {

    category_id=ref(undefined) // 分类id
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
        
        if(value === '4'){
            console.log(value)
            console.log(this.Fulfillment.hehe.value)
            // this.Fulfillment.load(this.info.value)
        }
    }

    

    // 履约规则fulfillment_rule
    Fulfillment = {

        hehe:ref('a'), // 履约方式tab key
        // 履约tab list
        panes:ref([
            {
                title: 'tab标题',
                content: `Content of Tab Pane`,
                key: 'a',
                closable:false // 是否允许关闭
            }
        ]),

        // 加载履约方式
        load:(data)=>{
            console.log(data)
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