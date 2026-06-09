<template>
  <a-config-provider :locale="zhCN">
    <router-view />
  </a-config-provider>
</template>
<script>
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
dayjs.locale('zh-cn');

export default {

  data() {
    return {
      zhCN,
    };
  },
};

</script>

<style>
html{margin: 0px; padding: 0px;font-size: 12px;overflow: hidden;}
.cursor{cursor: pointer}

/* 页面内容区域背景色全局定义 */
.ant-layout{background-color: #fff !important;}
.ant-layout-sider{background-color: #fff !important;border-right:1px #f2f2f2 solid ;}
.ant-menu-light{border: none !important;}
/* 全局内容区域圆角样式定义*/
.content_border{margin: 0 0 0 0; padding:14px;background:#fff;}

/* 在全局样式文件（如 `styles.css` 或 `App.vue` 的 `<style>` 中） */
.ant-form-item-label > label {font-size: 12px !important; /* 设置表单标签的字体大小 */}
.ant-form-item-control {font-size: 12px !important; /* 设置表单控件的字体大小 */}
.font_size_12{font-size: 12px;}
.font_size_14{font-size: 14px;}
.font_size_16{font-size: 16px;}
/* .ant-menu-item-only-child {font-size: 12px !important;} /* 设置左侧子菜单项的字体大小 */

/* 按钮默认字体大小 */
.ant-btn{font-size: 12px !important;}
.ant-input{font-size: 12px !important;}
.ant-input-number-input{font-size: 12px !important;}
 /* 设置下拉框的字体大小 */
.ant-select{font-size: 12px !important; }
.ant-select-dropdown {font-size: 12px !important;}
.ant-select-selection-item{font-size: 12px !important;}
.ant-select-item-option-content {font-size: 12px !important;}
.ant-select-selection-placeholder {font-size: 12px !important;}
/* 时间选择器 默认字体 设置字体大小 */
.ant-picker-input input::placeholder {font-size: 12px;}
.ant-col{font-size: 12px;}
/* 修改 checkbox 标签字体大小 */
.ant-checkbox + span {font-size: 12px !important;}
/**model对话框报错设置**/
div[aria-hidden="true"]{display: none !important;}
/**暂无数据高度100%**/
.ant-spin-nested-loading {height: 100% !important;}
.ant-spin-container{height: 100% !important;}
.ant-list-empty-text{height: 70% !important;display: flex;align-items: center;justify-content: center;}
/* 定义滚动条样式 */
::-webkit-scrollbar {
  width: 6px; /* 滚动条宽度 */
  height: 6px;
  cursor: pointer;
}
 
/* 定义滑块样式 */
::-webkit-scrollbar-thumb {
  background-color: #9b9b9b; /* 滑块背景颜色 */
  border-radius: 5px; /* 滑块圆角 */
}
 
/* 鼠标悬停在滑块上的样式 */
::-webkit-scrollbar-thumb:hover {
  background-color: #868686; /* 鼠标悬停时滑块背景颜色 */
}
 
/* 滚动条轨道样式 */
::-webkit-scrollbar-track {
  background-color: #f1f1f1; /* 滚动条轨道背景颜色 */
  border-radius: 5px; /* 轨道圆角 */
}
/* 穿透修改 InputNumber 的 addon */
.ant-input-number-group-addon{
  font-size: 12px !important;
}
</style>