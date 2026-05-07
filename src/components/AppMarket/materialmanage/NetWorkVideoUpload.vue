<!-- 
 ###模板说明::网络视频上传组件
 1.组件命名规范：驼峰命名法，首字母大写，如：MyComponent.vue
 2、当前组件的父组件为：AppMarket/materialmanage
 3、当前组件的子组件为：无
 4、当前组件的功能：网络视频上传组件

 通过网络视频地址，上传多个视频文件
 1、选择文件夹
 2、提交网络视频文件地址支持MP4
 批量上传视频到素材中心

 folder_id String 是 2 文件夹id，0为根目录
 url String 否 http://xxx.xxx、视频url，必须是公网可访问。
 material_name String 是 视频名称.mp4 视频名称，开发者自定义，不得超过50个字符。
-->
<template>
    <!-- 上传网络视频 弹出层 开始-->
    <a-modal 
        v-model:open="netVideoModalVisible" 
        title="上传网络视频"
        :confirm-loading="confirmLoading"
        @ok="handleNetVideoOk"
        @cancel="handleNetVideoCancel"
    >
        <a-form 
            ref="netVideoFormRef"
            :model="netVideoForm"
            :rules="netVideoRules"
            layout="vertical"
            style="padding: 20px 0 0 0;"
        >

            <a-form-item label="选择文件夹" name="folderId">
                <a-cascader
                    v-model:value="netVideoForm.folderId"
                    :options="netVideoFolderOptions"
                    :load-data="loadNetVideoFolder"
                    placeholder="请选择素材文件夹"
                    change-on-select
                />
            </a-form-item>
            
            <div style="margin-bottom: 16px;">

               <label style="display: block; margin: 0 0 8px 0;font-size: 12px;">
                    <span style="color: #ff4d4f;">*</span> 视频地址 
                </label>

                <div v-for="(url, index) in netVideoForm.videoUrls" :key="index" style="margin-bottom: 8px;">
                        <a-form-item
                            :name="['videoUrls', index]"
                            :rules="[
                                { required: true, message: '请输入视频地址', trigger: 'blur' },
                                { pattern: /^http/, message: '视频地址必须以 http 开头', trigger: 'change' }
                            ]"
                            style="margin-bottom: 0;"
                        >
                            <a-row>
                                <a-col :span="20">
                                    <a-input 
                                        v-model:value="netVideoForm.videoUrls[index]"
                                        :placeholder="'请输入视频地址'"
                                        size="middle"
                                        autoComplete="off"
                                    />
                                </a-col>
                                <a-col :span="4">
                                    <a-button 
                                        type="dashed" 
                                        size="small"
                                        @click="removeVideoUrl(index)"
                                        style="margin: 2px 0 0 10px;width: 80%;"
                                    >
                                    删除
                                    </a-button>
                                </a-col>

                            </a-row>

                            
                        </a-form-item>

                </div>
                <div >
                    <a-button 
                        type="dashed" 
                        size="small"
                        @click="addVideoUrl"
                        :disabled="netVideoForm.videoUrls.length >= 10"
                        style="margin: 18px 0 18px 0;"
                    >
                        <PlusOutlined /> 添加地址
                    </a-button>
                    <span v-if="netVideoForm.videoUrls.length >= 10" style="color: #ff4d4f; font-size: 12px; margin-left: 8px;">
                        最多添加10个视频地址
                    </span>
                </div>
            </div>
        </a-form>
    </a-modal>
    <!-- 上传网络视频 弹出层 结束-->
</template>
<script>
import { ref, reactive } from 'vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import * as TOOL from '@/assets/JS_Model/tool';
import * as utils from '@/assets/JS_Model/public_model';
import axios from 'axios';

export default {
   name:'NetWorkVideoUpload',
   components:{
      PlusOutlined
   },
   props: {
      treeData: {
         type: Object,
         default: () => ({ value: [] })
      }
   },
   emits: ['uploadSuccess'],
   setup(props, { emit }) {

      const tool = new TOOL.TOOL();
      const API = new utils.A_Patch();
      const netVideoModalVisible = ref(false);            // 上传网络视频弹出层状态
      const confirmLoading = ref(false);                  // 确认按钮加载状态
      const netVideoFormRef = ref(null);                  // 网络视频表单 ref
      const netVideoFolderOptions = ref([]);              // 联级选择器文件夹选项

      // 网络视频表单数据
      const netVideoForm = reactive({
         folderId: [],
         videoUrls: ['']
      });

      // 网络视频表单验证规则
      const netVideoRules = {
         folderId: [
            { required: true, message: '请选择素材文件夹', trigger: 'change', type: 'array' }
         ]
      };


      // 将 treeData 转换为 Cascader 选项
      const convertTreeToCascader = (nodes) => {
         if (!nodes || nodes.length === 0) return [];
         return nodes.map(node => ({
            value: String(node.key),
            label: node.title,
            isLeaf: node.isLeaf,
            children: node.children ? convertTreeToCascader(node.children) : undefined
         }));
      };

      // 显示上传网络视频弹出层
      const showNetVideoModal = () => {

         netVideoModalVisible.value = true;
         
         // 初始化文件夹选项（添加根节点素材库）
         const treeValue = props.treeData?.value || [];
         
         if (treeValue.length > 0) {

            netVideoFolderOptions.value = [{
               value: '0',
               label: '素材库',
               isLeaf: false,
               children: convertTreeToCascader(treeValue)
            }];
         }
      };

      // 添加视频地址输入框
      const addVideoUrl = () => {
         if (netVideoForm.videoUrls.length < 10) {
            netVideoForm.videoUrls.push('');
         }
      };

      // 删除视频地址输入框
      const removeVideoUrl = (index) => {
         if (netVideoForm.videoUrls.length > 1) {
            netVideoForm.videoUrls.splice(index, 1);
         }
      };

      // 确认上传网络视频
      const handleNetVideoOk = () => {

         netVideoFormRef.value.validate().then(() => {

            const folderId = netVideoForm.folderId[netVideoForm.folderId.length - 1];
            const urls = netVideoForm.videoUrls.filter(url => url.trim() !== '');

            if (urls.length === 0) {
               tool.Fun_.message('error', '请至少输入一个视频地址');
               return;
            }

            // 构建批量上传参数
            const params = {
               folder_id: folderId,
               video_list: urls.map(url => ({
                  url: url.trim(),
                  name: 'video_'
               }))
            };

            confirmLoading.value = true;

            console.log(params)

            axios.post(API.AppSrtoreAPI.material.batchuploadvideo, params).then((res) => {
               
               console.log(res)

               confirmLoading.value = false;

               if (res.data.code === 10000) {
                  const data = res.data.data;
                  let successCount = 0;
                  let failCount = 0;

                  // 判断返回结果结构
                  if (Array.isArray(data)) {
                     data.forEach(item => {
                        if (item.success || item.code === 10000 || item.code === 0) {
                           successCount++;
                        } else {
                           failCount++;
                        }
                     });
                  } else if (data && typeof data === 'object') {
                     // 可能返回 { success_list: [], fail_list: [] } 或类似结构
                     successCount = data.success_count || data.success_list?.length || urls.length;
                     failCount = data.fail_count || data.fail_list?.length || 0;
                  } else {
                     // 默认全部成功
                     successCount = urls.length;
                  }

                  if (failCount > 0) {
                     tool.Fun_.message('warning', `上传完成：成功 ${successCount} 个，失败 ${failCount} 个`);
                  } else {
                     tool.Fun_.message('success', `上传成功 ${successCount} 个视频`);
                  }

                  netVideoModalVisible.value = false;
                  // 重置表单
                  netVideoForm.folderId = [];
                  netVideoForm.videoUrls = [''];

                  // 通知父组件上传成功
                  emit('uploadSuccess', { successCount, failCount, data });


               } else {

                  const errorMsg = res.data.sub_msg || res.data.msg || '上传失败';
                  console.log(errorMsg)

                  tool.Fun_.message('error', errorMsg);
               }


            }).catch((err) => {
               confirmLoading.value = false;
               console.log('批量上传接口调用失败', err);
               tool.Fun_.message('error', '网络请求失败，请稍后重试');
            });
         }).catch((error) => {
            console.log('表单验证失败', error);
         });
      };

      // 取消上传网络视频
      const handleNetVideoCancel = () => {
         netVideoModalVisible.value = false;
         netVideoForm.folderId = [];
         netVideoForm.videoUrls = [''];
      };

      // 异步加载联级选择器子文件夹
      const loadNetVideoFolder = (selectedOptions) => {
         const targetOption = selectedOptions[selectedOptions.length - 1];
         targetOption.loading = true;
         
         const folderId = targetOption.value;
         
         tool.Http_.post(API.AppSrtoreAPI.material.getfolder, {
            "folder_id": folderId,
            "page_num": 1,
            "page_size": 10
         }).then((res) => {
            const child_folder_list = res.data.data.folder_info.child_folder;
            
            if (child_folder_list.length > 0) {
                  targetOption.children = child_folder_list.map(obj => ({
                     value: String(obj.folder_id),
                     label: obj.folder_name,
                     isLeaf: true
                  }));
                  
                  // 检查子文件夹是否还有子文件夹
                  const checks = targetOption.children.map(child => {
                     return tool.Http_.post(API.AppSrtoreAPI.material.getfolder, {
                        "folder_id": child.value,
                        "page_num": 1,
                        "page_size": 10
                     }).then((childRes) => {
                        const grandChildren = childRes.data.data.folder_info.child_folder;
                        child.isLeaf = grandChildren.length === 0;
                     });
                  });
                  
                  Promise.all(checks).then(() => {
                     targetOption.loading = false;
                     netVideoFolderOptions.value = [...netVideoFolderOptions.value];
                  });
            } else {
                  targetOption.isLeaf = true;
                  targetOption.loading = false;
                  netVideoFolderOptions.value = [...netVideoFolderOptions.value];
            }
         });
      };

      return {
         netVideoModalVisible,
         confirmLoading,
         netVideoFormRef,
         netVideoForm,
         netVideoRules,
         netVideoFolderOptions,
         showNetVideoModal,
         handleNetVideoOk,
         handleNetVideoCancel,
         addVideoUrl,
         removeVideoUrl,
         loadNetVideoFolder,
      };
   }
}
</script>
<style scoped>
</style>
