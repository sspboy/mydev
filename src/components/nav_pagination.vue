<!-- 翻页组件 
  传递参数：
    fandata: {
      List_conditions: {
        page: 1, // 当前页
        page_size: 10, // 每页条数
      },
      total_number: 0, // 数据总条数
    }
  }
  返回参数：
    page_message: {
      page: 1, // 当前页
      page_size: 10, // 每页条数
    }
-->
<template>
  <div id="components-pagination-demo-mini" class="nav_s">
    <a-pagination 
      style="font-size: 12px;" 
      @change="onChange"
      size="small"
      v-model:current="props.fandata.List_conditions.page"
      :total="props.fandata.total_number" 
      :show-total="total => `总共 ${ total } 条数据`" 
      show-size-changer 
      show-quick-jumper 
    />
  </div>
</template>

<script>

import {defineComponent} from 'vue'

export default defineComponent({

  // 翻页组件
  name: "nav_pagination",

  // 接受父组件数据
  props:{
    fandata:{
      type:Object // 数据类型为数字
    }

  },

  setup(props, ctx){

    const onChange = (page, pageSize)=>{
      let page_message = {}
      page_message.page = page
      page_message.page_size = pageSize
      ctx.emit('complete', page_message) // 【翻页数据】发送到父组件中

    }

    return{
      onChange,
      props
    }
  }
})
</script>

<style scoped>
#components-pagination-demo-mini .ant-pagination:not(:last-child) {margin-bottom: 24px;}
.nav_s{margin: 6px 0 0 0;float: right;}
</style>