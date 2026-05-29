// 新建商品组件：方法调用
import { ref } from 'vue'
import * as TOOL from '@/assets/JS_Model/tool';
import * as TABLE from '@/assets/JS_Model/TableOperate';
import * as utils from '@/assets/JS_Model/public_model';
import axios from 'axios';
const tool = new TOOL.TOOL()            // 工具方法
const API = new utils.A_Patch()         // 请求接口地址合集


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