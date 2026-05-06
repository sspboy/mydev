<!-- 模板说明

网络地址视频上传组件

通过网络视频地址，上传多个视频文件
1、选择文件夹
2、提交网络视频文件地址支持MP4
批量上传视频到素材中心
1. 一次上传视频的数量限制50个；
2. 每个视频大小限200M；
3. 接口同步接受上传视频的请求，异步处理：视频的下载、格式校验、审核等过程；
4. 视频的审核时间根据素材中心素材数量而定，大部分视频在1分钟内能审核完，小部分视频审核时间会达到天级别，请耐心等待
5. 审核拒绝的视频将在15日内被定期清理，请慎用。
6.上传时需要关注文件夹属性，只有0（文件夹）和2（视频文件夹）才可以上传视频。文件夹属性可通过【/material/getFolderInfo】和【/material/searchFolder】查看。
其他问题请参考：https://op.jinritemai.com/docs/guide-docs/171/1719

-->
<template>

</template>
<script>
import { defineComponent,ref,reactive,onMounted,h } from 'vue';
import { ref, reactive } from 'vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import * as TOOL from '@/assets/JS_Model/tool';
import * as utils from '@/assets/JS_Model/public_model';

// 组件引用=====开始
export default {
   name:'NetWorkUploadVideo',
   components:{
   },
props: {
   data:{typr:Object}
},
setup(props,ctx) {

    const tool = new TOOL.TOOL(); // 工具
    const API = new utils.A_Patch();// 接口

    const PAGEDATA = reactive({
        "url":"batchuploadvideo"
    })

       return{
       }
   }
}
</script>
<style scoped>
</style>