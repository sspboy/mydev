<!-- 模板说明 -->
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
          <div class="control-panel">
            <!-- 导入图片 -->
            <div class="panel-section">
              <h3>导入图片</h3>
              <a-upload
                :show-upload-list="false"
                :before-upload="beforeUpload"
                accept="image/*"
              >
                <a-button type="primary" size="small" block>
                  <upload-outlined /> 选择本地图片
                </a-button>
              </a-upload>

              <p class="hint-text">支持 JPG、PNG、WEBP</p>
            </div>

            <!-- 裁剪模式选择 -->
            <div class="panel-section">
              <h3>裁剪比例模式</h3>
              <a-radio-group 
                v-model:value="cropMode" 
                size="small"
                @change="onCropModeChange"
              >
                <a-radio-button value="square" class="font_size_12" >1:1</a-radio-button>
                <a-radio-button value="ratio34" class="font_size_12" >3:4</a-radio-button>
              </a-radio-group>
            </div>

            <!-- 1:1 设置 -->
            <div class="panel-section" v-if="cropMode === 'square'">
              <h3>边长设置（像素）</h3>
              <a-input-number
                v-model:value="squareSize"
                :min="100"
                :max="2000"
                :step="10"
                style="width: 100%"
                @change="onSquareSizeChange"
                addon-after="px"
              />
              <a-slider v-model:value="squareSize" :min="100" :max="2000" :step="10" @change="onSquareSizeChange" />
            </div>

            <!-- 3:4 尺寸选择 -->
            <div class="panel-section" v-if="cropMode === 'ratio34'">
              <h3>尺寸选择</h3>
              <a-radio-group v-model:value="ratio34Size" size="small" @change="onRatio34SizeChange">
                <a-radio-button value="large" class="font_size_12" title="900×1200">大</a-radio-button>
                <a-radio-button value="medium" class="font_size_12" title="750×1000">中</a-radio-button>
                <a-radio-button value="small" class="font_size_12" title="600×800">小</a-radio-button>
              </a-radio-group>
            </div>

            <!-- 操作按钮 -->
            <div class="panel-section actions">
              <a-button type="primary" block @click="handlePreview" :disabled="!imageSrc">
                <eye-outlined /> 预览效果
              </a-button>
              <a-button type="primary" block @click="handleDownload" style="margin-top: 12px;" :disabled="!imageSrc">
                <download-outlined /> 下载裁剪图
              </a-button>
              <a-button block @click="handleReset" style="margin-top: 12px;" :disabled="!imageSrc">
                <redo-outlined /> 重置裁剪区域
              </a-button>
              <a-button block danger @click="handleClear" style="margin-top: 12px;" :disabled="!imageSrc">
                <delete-outlined /> 清除图片
              </a-button>
            </div>

            <!-- 图片信息 -->
            <div class="panel-section" v-if="imageInfo.width">
              <h3>图片信息</h3>
              <p>原始尺寸：{{ imageInfo.width }} × {{ imageInfo.height }} px</p>
              <p v-if="previewSize.width">裁剪尺寸：{{ previewSize.width }} × {{ previewSize.height }} px</p>
            </div>
          </div>  
        </a-layout-sider>
        
        <!-- 图片裁剪区域 -->
        <a-layout-content class="content_border" style="padding: 0; display: flex; flex-direction: column;" >


          <div class="cropper-wrapper">
            
            <template v-if="imageSrc">
              <img ref="cropperImage" :src="imageSrc" class="cropper-target" />
            </template>

            <template v-else>
              <div class="cropper-placeholder">
                <picture-outlined class="placeholder-icon" />
                <p class="placeholder-text">请导入图片以开始裁剪</p>
                <a-upload
                  :show-upload-list="false"
                  :before-upload="beforeUpload"
                  accept="image/*"
                >
                  <a-button type="primary" ghost>
                    <upload-outlined /> 导入图片
                  </a-button>
                </a-upload>
              </div>
            </template>
          </div>


          <!-- 预览弹窗 -->
          <a-modal
            v-model:open="previewVisible"
            title="裁剪预览"
            :footer="null"
            width="fit-content"
            :centered="true"
          >
            <div class="preview-wrapper">
              <img :src="previewSrc" class="preview-image" />
              <p v-if="previewSize.width" class="preview-size">
                输出尺寸：{{ previewSize.width }} × {{ previewSize.height }} px
              </p>
            </div>
          </a-modal>

        </a-layout-content>

      </a-layout>
  </a-layout>
</template>
<script>
import { computed,ref,reactive,onMounted,onUnmounted,nextTick } from 'vue';
import { useStore } from 'vuex'
import { UploadOutlined, EyeOutlined, DownloadOutlined, RedoOutlined, DeleteOutlined, PictureOutlined } from '@ant-design/icons-vue';
// 网络请求工具引用
import axios from "axios";
import * as TOOL from '@/assets/JS_Model/tool';
import * as utils from '@/assets/JS_Model/public_model';

// 图片处理器
import ImageProcessor, { CROP_PRESETS, createSquareCropper, create34Cropper } from '@/assets/douyinshop/ImageProcessor.js';

// 组件引用=====开始
import menu_left from '@/components/layout/menu_left.vue'
import menu_head from "@/components/layout/menu_head.vue";
import nav_pagination from "@/components/nav_pagination.vue";
// 组件引用=====开始
export default {
   name:'Sizeoptimization',
   components:{
    menu_left,
    menu_head,
    nav_pagination,
    UploadOutlined,
    EyeOutlined,
    DownloadOutlined,
    RedoOutlined,
    DeleteOutlined,
    PictureOutlined
   },
props: {
   data:{typr:Object}
},
setup(props,ctx) {
    const store = useStore();// 共享数据
    const tool = new TOOL.TOOL()// 工具方法
    const API = new utils.A_Patch()// 请求接口地址合集

    // 裁剪相关 Ref
    const cropperImage = ref(null);
    const imageSrc = ref('');
    const cropMode = ref('square');
    const squareSize = ref(800);
    const ratio34Size = ref('medium');
    const previewVisible = ref(false);
    const previewSrc = ref('');
    const previewSize = reactive({ width: 0, height: 0 });

    // 图片信息
    const imageInfo = reactive({ width: 0, height: 0 });

    // 处理器实例
    let processor = null;

    // 组件挂之后---请求数据===============================开始


    const PAGEDATA = reactive({
        title:'尺寸优化',
        innerHeight: ref(window.innerHeight - 180), // 初始化列表高度
        menudata:{      // 菜单选中配置
            'key':'107',
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

    // 上传前处理（阻止默认上传，直接读取本地文件）
    const beforeUpload = (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        tool.MsgW('请上传图片文件！');
        return false;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        imageSrc.value = e.target.result;
        // 获取图片原始尺寸
        const img = new Image();
        img.onload = () => {
          imageInfo.width = img.naturalWidth;
          imageInfo.height = img.naturalHeight;
        };
        img.src = e.target.result;

        // 等待 DOM 更新后初始化 cropper
        nextTick(() => {
          initCropper();
        });
      };
      reader.readAsDataURL(file);
      return false;
    };

    // 初始化裁剪器
    const initCropper = () => {
      if (!cropperImage.value) return;

      const img = cropperImage.value;

      const doInit = () => {
        // 清理旧实例
        if (processor) {
          processor.destroy();
          processor = null;
        }

        if (cropMode.value === 'square') {
          processor = createSquareCropper(img, squareSize.value);
        } else {
          processor = create34Cropper(img, ratio34Size.value);
        }

        updatePreviewSize();
      };

      // 确保图片已加载完成，并延迟一帧让浏览器完成布局后再初始化
      const runInit = () => {
        requestAnimationFrame(() => {
          setTimeout(() => {
            doInit();
          }, 50);
        });
      };

      if (img.complete && img.naturalWidth > 0) {
        runInit();
      } else {
        img.onload = runInit;
        img.onerror = () => {
          tool.MsgW('图片加载失败，请重试');
        };
      }
    };

    // 更新预览尺寸显示
    const updatePreviewSize = () => {
      if (cropMode.value === 'square') {
        previewSize.width = squareSize.value;
        previewSize.height = squareSize.value;
      } else {
        const presetMap = {
          large: CROP_PRESETS.RATIO_3_4_LARGE,
          medium: CROP_PRESETS.RATIO_3_4_MEDIUM,
          small: CROP_PRESETS.RATIO_3_4_SMALL
        };
        const preset = presetMap[ratio34Size.value];
        if (preset) {
          previewSize.width = preset.width;
          previewSize.height = preset.height;
        }
      }
    };

    // 裁剪模式切换
    const onCropModeChange = () => {
      if (!processor || !cropperImage.value) return;

      nextTick(() => {
        if (cropMode.value === 'square') {
          processor.setAspectRatio(1);
          processor.setCropBoxData(squareSize.value, squareSize.value);
        } else {
          const presetMap = {
            large: CROP_PRESETS.RATIO_3_4_LARGE,
            medium: CROP_PRESETS.RATIO_3_4_MEDIUM,
            small: CROP_PRESETS.RATIO_3_4_SMALL
          };
          const preset = presetMap[ratio34Size.value];
          processor.setAspectRatio(preset.ratio);
          processor.setCropBoxData(preset.width, preset.height);
        }
        updatePreviewSize();
      });
    };

    // 1:1 边长变化
    const onSquareSizeChange = () => {
      if (!processor) return;
      processor.setCropBoxData(squareSize.value, squareSize.value);
      updatePreviewSize();
    };

    // 3:4 尺寸变化
    const onRatio34SizeChange = () => {
      if (!processor) return;
      const presetMap = {
        large: CROP_PRESETS.RATIO_3_4_LARGE,
        medium: CROP_PRESETS.RATIO_3_4_MEDIUM,
        small: CROP_PRESETS.RATIO_3_4_SMALL
      };
      const preset = presetMap[ratio34Size.value];
      if (preset) {
        processor.setAspectRatio(preset.ratio);
        processor.setCropBoxData(preset.width, preset.height);
      }
      updatePreviewSize();
    };

    // 预览效果
    const handlePreview = async () => {
      if (!processor || !processor.isReady()) {
        tool.Fun_.message('info','请先上传图片');
        return;
      }
      const base64 = await processor.getCroppedImageBase64();
      if (base64) {
        previewSrc.value = base64;
        previewVisible.value = true;
      }
    };

    // 下载裁剪图
    const handleDownload = async () => {
      if (!processor || !processor.isReady()) {
        tool.MsgW('请先上传图片');
        return;
      }
      const timestamp = new Date().getTime();
      let suffix = '';
      if (cropMode.value === 'square') {
        suffix = `square_${squareSize.value}x${squareSize.value}`;
      } else {
        const presetMap = {
          large: '900x1200',
          medium: '750x1000',
          small: '600x800'
        };
        suffix = `3x4_${presetMap[ratio34Size.value]}`;
      }
      await processor.downloadCroppedImage(`cropped_${suffix}_${timestamp}.jpg`);
      tool.MsgS('下载成功');
    };

    // 重置裁剪区域
    const handleReset = () => {
      if (processor) {
        processor.reset();
        // 重置后重新应用尺寸
        nextTick(() => {
          if (cropMode.value === 'square') {
            processor.setCropBoxData(squareSize.value, squareSize.value);
          } else {
            const presetMap = {
              large: CROP_PRESETS.RATIO_3_4_LARGE,
              medium: CROP_PRESETS.RATIO_3_4_MEDIUM,
              small: CROP_PRESETS.RATIO_3_4_SMALL
            };
            const preset = presetMap[ratio34Size.value];
            if (preset) {
              processor.setCropBoxData(preset.width, preset.height);
            }
          }
        });
      }
    };

    // 清除图片
    const handleClear = () => {
      if (processor) {
        processor.destroy();
        processor = null;
      }
      imageSrc.value = '';
      imageInfo.width = 0;
      imageInfo.height = 0;
      previewSize.width = 0;
      previewSize.height = 0;
    };

    const value1 = ref('lucy');

    const options1 = ref([
        {
            value: '1',
            label: 'Jack',
        },
        {
            value: '2',
            label: 'Lucy',
        },
        {
            value: '3',
            label: 'Disabled',
            disabled: true,
        },
        {
            value: '4',
            label: 'Yiminghe',
        },
    ]);

    const focus = () => {
        console.log('focus');
    };

    const handleChange = value => {
        console.log(value1.value);
    };

    onUnmounted(() => {
      if (processor) {
        processor.destroy();
      }
    });

       return{
        PAGEDATA,
        store,
        value1,
        options1,
        focus,
        handleChange,
        // 裁剪相关
        cropperImage,
        imageSrc,
        cropMode,
        squareSize,
        ratio34Size,
        previewVisible,
        previewSrc,
        previewSize,
        imageInfo,
        beforeUpload,
        onCropModeChange,
        onSquareSizeChange,
        onRatio34SizeChange,
        handlePreview,
        handleDownload,
        handleReset,
        handleClear
       }
   }
}
</script>
<style scoped>
.cropper-wrapper {
  flex: 1;
  width: 100%;
  min-height: 400px;
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: stretch;
  justify-content: center;
}

/* cropperjs v2 创建的 custom element 需强制撑满容器 */
.cropper-wrapper cropper-canvas {
  display: block !important;
  width: 100% !important;
  height: 100% !important;
  flex: 1;            /* 撑满剩余空间 */

}

.cropper-target {
  display: block;
  max-width: 100%;
}

.cropper-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #999;
}

.placeholder-icon {
  font-size: 64px;
  margin-bottom: 16px;
  color: #d9d9d9;
}

.placeholder-text {
  font-size: 16px;
  margin-bottom: 16px;
  color: #999;
}

.control-panel {
  padding: 16px;
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
}

.panel-section {
  margin-bottom: 20px;
}

.panel-section h3 {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 10px;
  color: #333;
}

.panel-section p {
  margin: 4px 0;
  color: #666;
  font-size: 13px;
}

.hint-text {
  padding: 28px 0 0 0;
  font-size: 12px;
  color: #999;
}

.actions .ant-btn {
  border-radius: 4px;
}

.preview-wrapper {
  text-align: center;
  padding: 16px;
}

.preview-image {
  max-width: 100%;
  max-height: 600px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.preview-size {
  margin-top: 12px;
  color: #666;
  font-size: 14px;
}

/* cropperjs v2 使用 Shadow DOM，内部样式无法通过 :deep() 穿透，
   通过上方 .cropper-wrapper cropper-canvas 控制尺寸 */
</style>
