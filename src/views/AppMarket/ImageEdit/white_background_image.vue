<template>
<!--内容部分 菜单 右侧列表 开始-->
<a-layout style="height: 100vh;width: 100vw;">

    <!--head 导航组件  开始-->
    <menu_head />
    <!--head 导航组件  结束-->
    
    
    <!--内容部分 菜单 右侧列表 开始-->
    <a-layout>

        <!--左侧 菜单组件  开始-->
        <a-layout-sider v-model:collapsed="store.state.menu.coll" :trigger="null" collapsible>
        <menu_left :menudata="PAGEDATA.menudata"/> <!--局部组件-->
        </a-layout-sider>
        <!--左侧 菜单组件  结束-->


        <a-layout-sider style="height: 100%;padding: 6px 4px 0 0;">
          <p>图片操作区域</p>
          <a-button type="">选择本地图片</a-button>
          <a-button type="">选择素材库图片</a-button>
        </a-layout-sider>


        <a-layout-content class="content_border" >

          <h1>白底图</h1>

          <p>图片控制区域</p>

        </a-layout-content>

      </a-layout>
  </a-layout>

</template>

<script>
import { computed,ref,reactive,onMounted,h,onUnmounted } from 'vue';
import { useStore } from 'vuex'
// 网络请求工具引用
import axios from "axios";
import * as TOOL from '@/assets/JS_Model/tool';
import * as utils from '@/assets/JS_Model/public_model';

// 组件引用=====开始
import menu_left from '@/components/layout/menu_left.vue'
import menu_head from "@/components/layout/menu_head.vue";
import nav_pagination from "@/components/nav_pagination.vue";
export default {
  name: 'Size_optimization',
  components: {
    menu_left,
    menu_head,
    nav_pagination
  },
  props: {
    data: { type: Object },
  },
  setup(props, ctx) {

    const store = useStore();// 共享数据
    const tool = new TOOL.TOOL()// 工具方法
    const API = new utils.A_Patch()// 请求接口地址合集
    // 组件挂之后---请求数据===============================开始

    // 定义一个函数来处理窗口大小变化 ==
    const handleResize = () => {
      PAGEDATA.innerHeight = window.innerHeight - 180; // 作为表格自适应高度
    };

    const PAGEDATA = reactive({
        title:'白底图',
        innerHeight: ref(window.innerHeight - 180), // 初始化列表高度
        menudata:{       // 菜单选中配置
            'key':'105',
            'openKeys':'PicEdit',
            },
        loading:true,         // 列表load状态
        justify:'center',     // 列表内容对齐：loading加载居中设定
        align:'center',       // 列表内容对齐：loading加载居中设定
        // 列表信息
        datalist:[],
        total_number:0,     // 内容总数
        List_conditions:ref({
            page:1
        })
    })
    return {
      PAGEDATA,
      store
    };
  }
}
</script>
