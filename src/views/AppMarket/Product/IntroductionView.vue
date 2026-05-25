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

      <a-layout-content class="content_border" >


        <!--功能导航-->
        <a-row :gutter="[12, 12]">

          <a-col :span="6">

                <a-card class="cardStyle cursor" :body-style="{ padding: 0, overflow: 'hidden' }" @click="router.push('/douyinproductlist')">

                  <a-flex justify="space-between">
                    
                    <ProfileTwoTone class="icoStyle"/>

                    <a-flex vertical align="flex-start" justify="space-between" style="padding:0 10px; width: 100%;">
                      <a-typography>
                        <a-typography-title class="cardTitle">商品管理 <RightOutlined /></a-typography-title>
                        <a-typography-paragraph class="cardText">
                        新建商品 快速编辑 图片预览 后台编辑 运费模板 尺码模板
                        </a-typography-paragraph>
                      </a-typography>
                    </a-flex>
                  </a-flex>
              </a-card>
          </a-col>

          <a-col :span="6">
                <a-card class="cardStyle cursor" :body-style="{ padding: 0, overflow: 'hidden' }" @click="router.push('/materiallist')">
                  <a-flex justify="space-between">
                    
                    <ShopTwoTone class="icoStyle"/>
                    <a-flex vertical align="flex-start" justify="space-between" style="padding: 0 10px 0 10px;width: 100%;">
                      <a-typography>
                        <a-typography-title class="cardTitle">
                          网盘素材
                          <RightOutlined />
                        </a-typography-title>
                        <a-typography-paragraph class="cardText">
                            素材空间 图片上传 视频管理
                        </a-typography-paragraph>
                      </a-typography>
                    </a-flex>
                  </a-flex>
              </a-card>
          </a-col>

          <a-col :span="6">
                <a-card class="cardStyle cursor" :body-style="{ padding: 0, overflow: 'hidden' }" @click="router.push('/quality')">
                  <a-flex justify="space-between">
                    
                    <MedicineBoxTwoTone class="icoStyle"/>

                    <a-flex vertical align="flex-start" justify="space-between" style="padding: 0 10px 0 10px;width: 100%;">
                      <a-typography>
                        <a-typography-title class="cardTitle">诊断优化<RightOutlined /></a-typography-title>
                        <a-typography-paragraph class="cardText">
                        主图 关键字 违禁词
                        </a-typography-paragraph>
                      </a-typography>
                    </a-flex>
                  </a-flex>
              </a-card>
          </a-col>

          <a-col :span="6">
              <a-card class="cardStyle cursor" :body-style="{ padding: 0, overflow: 'hidden' }" @click="router.push('/CreatTask')">
                  <a-flex justify="space-between">
                    
                    <CodeTwoTone class="icoStyle"/>

                    <a-flex vertical align="flex-start" justify="space-between" style="padding: 0 10px 0 10px;width: 100%;">
                      <a-typography>
                        <a-typography-title class="cardTitle">批量修改<RightOutlined /></a-typography-title>
                        <a-typography-paragraph class="cardText">
                        修改多个商品字段 
                        </a-typography-paragraph>
                      </a-typography>
                    </a-flex>
                  </a-flex>
              </a-card>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="20">

            <div class="ZhenduanTitle">

                <a-space :size="10">
                  <div class="font_size_12 task_sty" style="width:100px;margin: 4px 0 0 4px;font-weight: bold;">
                    <a-skeleton active :paragraph="{ rows: 1 }" :title="false" :loading="QualityTask.load_vife">
                    <span style="display: block;height: 26px;line-height: 18px;">
                       <DashboardOutlined /> 诊断中心
                    </span>
                    </a-skeleton>
                  </div>

                  <div class="font_size_12 task_sty">
                    <a-skeleton active :paragraph="{ rows: 1 }" :title="false" :loading="QualityTask.load_vife">
                      <span style="display: block;height: 26px;line-height: 18px;"> 任务状态 --{{ QualityTask.transfer_status() }}</span>
                    </a-skeleton>
                  </div>

                  <div class="font_size_12 task_sty">
                     <a-skeleton active :paragraph="{ rows: 1 }" :title="false" :loading="QualityTask.load_vife">
                      <span style="display: block;height: 26px;line-height: 18px;"> 诊断结果 -- {{ QualityTask.transfer_standard() }}</span>
                    </a-skeleton>
                  </div>

                  <div class="font_size_12 task_sty" style="width: 180px;">
                     <a-skeleton active :paragraph="{ rows: 1 }" :title="false" :loading="QualityTask.load_vife">
                        <span style="display: block;height: 26px;line-height: 18px;">完成时间 --{{ QualityTask.task_finish_time }}</span>
                    </a-skeleton>
                  </div>

                  <div class="font_size_12 task_sty" style="width: 180px;">
                     <a-skeleton active :paragraph="{ rows: 1 }" :title="false" :loading="QualityTask.load_vife">
                        <span style="display: block;height: 26px;line-height: 18px;">任务id --{{ QualityTask.task_id }}</span>
                    </a-skeleton>
                  </div>
                </a-space>
            </div>
          </a-col>
          <a-col :span="4">
            <div class="ZhenduanTitle">
                  <div class="font_size_12" style="text-align: right;width: 100%;margin: 6px 0 0 0;height: 26px;padding-right: 10px;">
                        <span style="display: block;height: 26px;line-height: 32px;"><a @click="router.push('/quality');">去诊断>></a></span>
                  </div>
            </div>
          </a-col>
        </a-row>

        <!--商品诊断任务-->
        <a-row :gutter="[12, 0]" class="NumberBox cursor">
          
          <a-col :span="3">
            <p class="Numbertext">    
              <span v-if="QualityTask.standard_rate == undefined">
                <a-skeleton-avatar active shape="square" />
              </span>
              <span v-else class="task_num">
                {{ QualityTask.standard_rate }} <span style="font-size: 12px;">%</span>
              </span>
              
            </p>
            <p class="font_size_12 task_text_bottom">达标率</p>
          </a-col>
          
          <a-col :span="3">
            <p class="Numbertext">
                <span v-if="QualityTask.meet_standard_num == undefined">
                <a-skeleton-avatar active shape="square" />
                </span>
                <span v-else class="task_num">
                {{ QualityTask.meet_standard_num }}
                </span>
            </p>
            <p class="font_size_12 task_text_bottom">达标商品数</p>
          </a-col>

          <a-col :span="3">
            <p class="Numbertext">
              <span v-if="QualityTask.product_num_to_improve_total == undefined">
              <a-skeleton-avatar active shape="square" />
              </span>
              <span v-else class="task_num">
              {{ QualityTask.product_num_to_improve_total }}
              </span>
            </p>
            <p class="font_size_12 task_text_bottom">待优化商品</p>
          </a-col>

          <a-col :span="3">
            <p class="Numbertext">
              <span v-if="QualityTask.problem_num_total == undefined">
              <a-skeleton-avatar active shape="square" />
              </span>
              <span v-else class="task_num">
                {{ QualityTask.problem_num_total }}
              </span>
            </p>
            <p class="font_size_12 task_text_bottom">可优化项</p>
          </a-col>

          <a-col :span="3">
            <p class="Numbertext">
              <span v-if="QualityTask.problem_num_to_improve == undefined">

              <a-skeleton-avatar active shape="square" />
              </span>
              <span v-else class="task_num">
              {{ QualityTask.problem_num_to_improve }}
              </span>
            </p>
            <p class="font_size_12 task_text_bottom">待优化项</p>
          </a-col>

          <a-col :span="3">
            <p class="Numbertext">
              <span v-if="QualityTask.is_not_standardized == undefined">
              <a-skeleton-avatar active shape="square" /></span>
              <span v-else class="task_num">
              {{ QualityTask.is_not_standardized }}
              </span>
              </p>
            <p class="font_size_12 task_text_bottom">信息不规范</p>
          </a-col>

          <a-col :span="3">
            <p class="Numbertext">
              <span v-if="QualityTask.key_information == undefined">
              <a-skeleton-avatar active shape="square" />
              </span>
              <span v-else class="task_num">
              {{ QualityTask.key_information }}
              </span>
            </p>
            <p class="font_size_12 task_text_bottom">关键信息待优化</p>
          </a-col>

          <a-col :span="3">
            <p class="Numbertext">
              <span v-if="QualityTask.missing_materials == undefined">
              <a-skeleton-avatar active shape="square" />
              </span>
              <span v-else class="task_num">
              {{ QualityTask.missing_materials }}
              </span>
            </p>
            <p class="font_size_12 task_text_bottom">素材缺失</p>
          </a-col>

        </a-row>

        <!--无曝光下架商品诊断-->
        <a-row :gutter="[12, 0]" class=" cursor">
          <a-col :span="8" >
            <a-badge-ribbon 
            class="font_size_12"
            text="长期无曝光" 
            :color="Aititlecolor" 
            >
            <a-card 
              title="建议下架商品" 
              size="small"
              style="margin: 16px 0 10px 0;"
              class="font_size_12"
            >建议下架商品</a-card>
            </a-badge-ribbon>
          </a-col>
          <a-col :span="8" >
            <a-badge-ribbon 
              class="font_size_12"
              text="超过建议下架期限" 
              :color="Aititlecolor" 
            >
            <a-card 
              title="已强制下架商品" 
              size="small"
              style="margin: 16px 0 10px 0;"
              class="font_size_12"
            >建议下架商品</a-card>
            </a-badge-ribbon>
          </a-col>
          <a-col :span="8">
            <a-badge-ribbon 
              class="font_size_12"
              text="建议优化" 
              :color="Aititlecolor" 
            >
            <a-card 
              title="潜力商品" 
              size="small"
              style="margin: 16px 0 10px 0;"
              class="font_size_12"
            >建议下架商品</a-card>
            </a-badge-ribbon>
          </a-col>
        </a-row>

                

        <!-- Comfyui-AI-list -->
        <a-row :gutter="[12, 12]" style="padding: 14px 0 0 0;">

          <a-col :span="3">
            <div class="gutter-box">

            <a-card hoverable>
              <template #cover>
                <img alt="example" src="../../../assets/6d23.jpg" />
              </template>
              <a-card-meta title="图片尺寸处理">
                <template #description>1:1尺寸&3：4尺寸截图工具</template>
              </a-card-meta>
            </a-card>
          </div>
          </a-col>

          <a-col :span="3">
            <div class="gutter-box">
            <a-card hoverable>
              <template #cover>
                <img alt="example" src="../../../assets/6d23.jpg" />
              </template>
              <a-card-meta title="白底图处理">
                <template #description>www.instagram.com</template>
              </a-card-meta>
            </a-card>
          </div>
          </a-col>

          <a-col :span="3">
            <div class="gutter-box">
            <a-card hoverable>
              <template #cover>
                <img alt="example" src="../../../assets/6d23.jpg" />
              </template>
              <a-card-meta title="Europe Street beat">
                <template #description>www.instagram.com</template>
              </a-card-meta>
            </a-card>
          </div>
          </a-col>
          <a-col :span="3">
            <div class="gutter-box">
            <a-card hoverable>
              <template #cover>
                <img alt="example" src="../../../assets/6d23.jpg" />
              </template>
              <a-card-meta title="Europe Street beat">
                <template #description>www.instagram.com</template>
              </a-card-meta>
            </a-card>
          </div>
          </a-col>
          <a-col :span="3">
            <div class="gutter-box">
            <a-card hoverable>
              <template #cover>
                <img alt="example" src="../../../assets/6d23.jpg" />
              </template>
              <a-card-meta title="Europe Street beat">
                <template #description>www.instagram.com</template>
              </a-card-meta>
            </a-card>
          </div>
          </a-col>
          <a-col :span="3">
            <div class="gutter-box">
            <a-card hoverable>
              <template #cover>
                <img alt="example" src="../../../assets/6d23.jpg" />
              </template>
              <a-card-meta title="Europe Street beat">
                <template #description>www.instagram.com</template>
              </a-card-meta>
            </a-card>
          </div>
          </a-col>

          <a-col :span="4">
            <!-- <div class="gutter-box">
              <a-card hoverable>
                <template #cover>
                  <img alt="example" src="../../../assets/6d23.jpg" />
                </template>
                <a-card-meta title="Europe Street beat">
                  <template #description>www.instagram.com</template>
                </a-card-meta>
              </a-card>
            </div> -->
          </a-col>

        </a-row>

      </a-layout-content>

      <!--内容右侧 开始-->
      <a-layout-sider class="bodyright" width='300px'>

          <a-badge-ribbon 
            class="font_size_12"
            :text="AititleText" 
            :color="Aititlecolor" 
            v-expose="exposure('block_view','1')">
            <a-card 
              title="AI标题自动优化托管" 
              size="small"
              style="margin: 16px 0 10px 0;"
              class="font_size_12"
            >
              商品类目、卖点、热词优化。提升商品曝光度！
              <a-button 
                @click="Get_title_SEO_status" 
                style="margin: 14px 10px 0 0;"
                :loading="rushLoading"
                >刷新状态</a-button>
              <a-button @click="load_ai_title" style="margin-top: 14px;">管理标题托管</a-button>

            </a-card>
          </a-badge-ribbon>


          <!--加载插件容器哦-->
          <div class="font_size_12 cursor right_tips">
            <div ref="Aititle" id="aititle"></div>
          </div>
        

        <div class="RightMiniBox">

          <h4>AI生图/生视频托管</h4>
          <p 
            class="font_size_12" 
            style="margin:16px 0 16px 0;"
            v-expose="exposure('block_view','6')">
            自动生成1:1/3:4主图和商品视频
            无需制作素材！
          </p>
          
          <a-space>

            1:1主图 
            <a-switch 
              checked-children="开" 
              un-checked-children="关"
              v-model:checked="Aiimgvideo.img_1_1"
              :loading="Aiimgvideo.button_1_1_loading"
              @click="Aiimgvideo.switch_1_1_img"
            />

            主图视频
            <a-switch 
              checked-children="开" 
              un-checked-children="关"
              v-model:checked="Aiimgvideo.videostatus"
              :loading="Aiimgvideo.button_video_loading"
              @click="Aiimgvideo.switch_video"
            />

          </a-space>

          <a-space style="margin-top: 16px;">
            3:4主图 
            <a-switch 
              checked-children="开" 
              un-checked-children="关"
              v-model:checked="Aiimgvideo.img_3_4"
              :loading="Aiimgvideo.button_3_4_loading"
              @click="Aiimgvideo.switch_3_4_img"
            />

          </a-space>

          <div style="margin-top: 16px;">
            <a-button @click="load_ai_img_video" >查看优化记录 >></a-button>
          </div>

        </div>
        <!--加载插件容器哦-->
        <div class="font_size_12 cursor right_tips">
          <div ref="Aiimgvideo.container" id="aiimgvideo"></div>
        </div>

        <div class="RightMiniBox">
          <h4><QuestionCircleFilled style="color:dimgray;"/> 帮助中心</h4>
          <div class="font_size_12" style="padding: 8px 0 0 0;">
            <a-row :gutter="[12, 12]">
              <a-col :span="24">商品查询查询教程</a-col>
            </a-row>
          </div>
        </div>

        <div class="RightMiniBox">
          <h4> <InfoCircleFilled style="color:dimgray;"/> 联系我们 </h4>
          <div class="font_size_12" style="padding: 8px 0 0 0;">
            <a-row :gutter="[12, 12]">
              <a-col :span="24">在线留言 点击反馈</a-col>
              <a-col :span="24">微信: 微信昵称</a-col>
              <a-col :span="24">您也可以详细描述问题，发邮件给我们。</a-col>
              <a-col :span="24">电子邮箱: 123@qq.com</a-col>
            </a-row>
          </div>
        </div>

      </a-layout-sider>
      <!--内容右侧 结束-->
      </a-layout>
</a-layout>







</template>
<script>
import { reactive,ref,computed} from 'vue';
import{ShopTwoTone,ProfileTwoTone,MedicineBoxTwoTone,CodeTwoTone,QuestionCircleFilled,InfoCircleFilled,MehFilled,RightOutlined,LoadingOutlined,DashboardOutlined} from '@ant-design/icons-vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
// 组件引用=====开始
import menu_left from '@/components/layout/menu_left.vue'
import menu_head from "@/components/layout/menu_head.vue";

// 组件引用=====结束
import * as TOOL from '@/assets/JS_Model/tool';
import * as utils from '@/assets/JS_Model/public_model';
import axios from 'axios';
// 平台组件库引用

export default {
    name:'introduction',
    // 引用组件
    components: {
      DashboardOutlined,
        LoadingOutlined,
        menu_left,
        menu_head,
        ShopTwoTone,
        ProfileTwoTone,
        MedicineBoxTwoTone,
        CodeTwoTone,
        QuestionCircleFilled,
        InfoCircleFilled,
        MehFilled,
        RightOutlined,
        
    },
    setup() {

      const router = useRouter() // 路由

      const API = new utils.A_Patch()         // 请求接口地址合集
      const tool = new TOOL.TOOL()            // 工具方法
      const innerHeight = ref(window.innerHeight-100);// 初始化表格高度
      const store = useStore();// 共享数据
      // ai标题托管状态===
      const Aititle = ref(null)     // ai标题托管容器
      const AititleText = ref('loading')// 标题托光状态文字    
      const AititleStatus = ref(false)// 标题seo开启状态
      const Aititlecolor = ref('green') // 标题状态颜色
      const rushLoading = ref(false)
      // ai标题托管状态===

      // ai生图托管状态==
      const Aiimgvideo = reactive({
        container:ref(null),// ai生图托管容器
        img_1_1:false,//1:1开关状态
        button_1_1_loading:ref(false),// 1:1开关状态loading状态
        img_3_4:false,//3:4开关状态
        button_3_4_loading:ref(false),
        videostatus:false,//video开关状态
        button_video_loading:ref(false),
        // 点击事件1：1
        switch_1_1_img:()=>{
          Aiimgvideo.button_1_1_loading = true;
          // 请求1:1状态；
          axios.post(API.AppSrtoreAPI.dou_product.updateMaterialHostingSwitch,{
            "hosting_list": [
              {
                "open": Aiimgvideo.img_1_1, // true：开启；false：关闭
                "scene_type": "3" //生图托管场景。枚举值：1为34图，2为主图视频，3为11图。
              }]
          }).then((res)=>{
            let code = res.data.code;
            if(code === 10000 && Aiimgvideo.img_1_1=== true){
              tool.Fun_.message('success','1:1主图-AI优化开启成功！')
            }else if(code === 10000 && Aiimgvideo.img_1_1=== false){
              tool.Fun_.message('info','1:1主图-AI优化关闭成功！')
            }else{
              tool.Fun_.message('warning','1:1主图-AI优化操作失败！')
            }
            Aiimgvideo.button_1_1_loading = false;
          })
          // 上报点击事件 
          exposure('bu_general_click', '6')
        },
        // 点击事件3：4
        switch_3_4_img:()=>{
          Aiimgvideo.button_3_4_loading = true;
          // 请求3:4状态；
          axios.post(API.AppSrtoreAPI.dou_product.updateMaterialHostingSwitch,{
            "hosting_list": [
              {
                "open": Aiimgvideo.img_3_4, // true：开启；false：关闭
                "scene_type": "1" //生图托管场景。枚举值：1为34图，2为主图视频，3为11图。
              }]
          }).then((res)=>{
            let code = res.data.code;
            if(code === 10000 && Aiimgvideo.img_3_4=== true){
              tool.Fun_.message('success','3:4主图-AI优化开启成功！')
            }else if(code === 10000 && Aiimgvideo.img_3_4=== false){
              tool.Fun_.message('info','3:4主图-AI优化关闭成功！')
            }else{
              tool.Fun_.message('warning','3:4主图-AI优化操作失败！')
            }
            Aiimgvideo.button_3_4_loading = false;
          })
          // 上报==点击事件
          exposure('bu_general_click', '6')
        },
        // 点击事件video
        switch_video:()=>{
          Aiimgvideo.button_video_loading = true;
          // 请求3:4状态；
          axios.post(API.AppSrtoreAPI.dou_product.updateMaterialHostingSwitch,{
            "hosting_list": [
              {
                "open": Aiimgvideo.videostatus, // true：开启；false：关闭
                "scene_type": "2" //生图托管场景。枚举值：1为34图，2为主图视频，3为11图。
              }]
          }).then((res)=>{
            let code = res.data.code;
            if(code === 10000 && Aiimgvideo.videostatus=== true){
              tool.Fun_.message('success','主图视频-AI优化开启成功！')
            }else if(code === 10000 && Aiimgvideo.videostatus=== false){
              tool.Fun_.message('info','主图视频-AI优化关闭成功！')
            }else{
              tool.Fun_.message('warning','主图视频-AI优化操作失败！')
            }
            Aiimgvideo.button_video_loading = false;
          })
          // 上报点击事件
          exposure('bu_general_click', '6')
        },
        // 查询 生图/生视频状态 AI托管状态
        Get_Shop_Hosting_Info:(data)=>{
          console.log(API.AppSrtoreAPI.dou_product.getShopHostingInfo)
          axios.post(API.AppSrtoreAPI.dou_product.getShopHostingInfo,data).then((res)=>{
            console.log(res)
          })
        },
        // 初始化 AI生图生视频 开关状态
        RushAIimgvideofirst:()=>{

          axios.post(API.AppSrtoreAPI.dou_product.getShopHostingInfo,{}).then((res)=>{

            var hosting_infos_list = res.data.data.data.hosting_infos;
            hosting_infos_list.forEach(element => {
              console.log(element)
              let hosting_scene_type = element.hosting_scene_type;
              let hosting_open = element.hosting_open;
              if(hosting_scene_type === 1){// 1为34图
                Aiimgvideo.img_3_4 = hosting_open
              }
              if(hosting_scene_type === 2){// 2为主图视频
                Aiimgvideo.videostatus = hosting_open
              }
              if(hosting_scene_type === 3){// 3为11图
                Aiimgvideo.img_1_1 = hosting_open
              }
            });

          })

          // 上报埋点==曝光上报
          exposure('block_view', '6')
        }
      })  
      // ai生图托管状态==


      const PAGEDATA = computed(()=>{

        return reactive({

          title:'应用首页',
          menudata:{       // 菜单选中配置
            'key':'1',
            'openKeys':'introduction',
          },
          colum:[],           // 表头信息
          datalist:[],        // 列表信息
          total_number:0,     // 内容总数

        })

      })

      // 诊断任务
      const QualityTask = reactive({
        load_vife:true,
        is_standard: undefined,             // 是否达标
        meet_standard_num: undefined,       // 达标商品数
        problem_num_to_improve: undefined,  // 待优化项数量
        problem_num_total: undefined,       // 可优化项总数
        problem_type_distribution: [],      // 问题类型分布
        is_not_standardized:undefined,// 信息不规范
        key_information:undefined,// 关键信息待优化
        missing_materials:undefined,// 素材缺失
        product_num_finished: undefined,    //已经诊断过的商品数
        product_num_to_improve_total: undefined, // 待优化商品数
        product_num_total: undefined,      // 总共需要诊断的商品数
        standard_rate: undefined,          // 达标率，百分比
        task_finish_time: undefined, // 任务完成时间
        task_id:undefined,             // 任务id
        task_status: undefined,             // 任务状态0-初始化，1-进行中，2-已完成
        // 任务状态转义
        transfer_status:()=>{
          if(QualityTask.task_status == '0'){
            return '初始化'
          }else if(QualityTask.task_status  == '1'){
            return '进行中'
          }else if(QualityTask.task_status  == '2'){
            return '已完成'
          }
        },
        // 任务结果转义
        transfer_standard:()=>{
          if(QualityTask.is_standard){
            return '已达标'
          }else{
            return '未达标'
          }
        },
        // 信息不规范转义
        one_transfer:()=>{
          for(let i of QualityTask.problem_type_distribution){
            if(i.type_key == '1'){
              QualityTask.is_not_standardized = i.num
            }else{
              QualityTask.is_not_standardized = 0
            }
          }
        },
        // 关键信息待优化转义
        two_transfer:()=>{
          for(let i of QualityTask.problem_type_distribution){
            if(i.type_key == '2'){
              QualityTask.key_information = i.num
            }else{
              QualityTask.key_information = 0
            }
          }
        },
        // 素材缺失转义
        thr_transfer:()=>{
          for(let i of QualityTask.problem_type_distribution){
            if(i.type_key == '3'){
              QualityTask.missing_materials = i.num
            }else{
              QualityTask.missing_materials = 0
            }
          }
        },
      })

      // 问题转义
      const Functionde = {
        
        // 加载数据
        LoadPageDATA:()=>{

          tool.Http_.post(API.AppSrtoreAPI.dou_product.qualitytask,{

                "brief_only":false

          }).then((res) => {

            // console.log(res)
            // console.log(QualityTask)

            QualityTask.is_standard = res.data.data.is_standard;
            QualityTask.meet_standard_num = res.data.data.meet_standard_num;
            QualityTask.problem_num_to_improve = res.data.data.problem_num_to_improve;
            QualityTask.problem_num_total = res.data.data.problem_num_total;
            QualityTask.problem_type_distribution = res.data.data.problem_type_distribution
            QualityTask.product_num_finished = res.data.data.product_num_finished
            QualityTask.product_num_to_improve_total = res.data.data.product_num_to_improve_total
            QualityTask.product_num_total = res.data.data.product_num_total
            QualityTask.standard_rate = res.data.data.standard_rate
            QualityTask.task_finish_time = res.data.data.task_finish_time
            QualityTask.task_id = res.data.data.task_id
            QualityTask.task_status = res.data.data.task_status
            QualityTask.load_vife = false;
            QualityTask.one_transfer();
            QualityTask.two_transfer();
            QualityTask.thr_transfer();

        })
        }

      }

      setTimeout(() => {
        Functionde.LoadPageDATA() // 异步加载加载诊断数据信息
      }, 1000);

      // 埋点事件上报==异步操作数据
      const exposure = (eventName,params)=>{

        setTimeout(()=>{
          try {
            store.report(eventName, params)// 上报点击时间
          }catch(e) {
            console.log('加载AI标题托管-数据埋点上报错',e)
          }
        },3000)
        
      }


      // 抖店组件SDK初始化----开始
      // 标题托管组件调用===抽屉调用
      const load_ai_title = ()=>{
        // 获取token、shopid、shopName
        var token_obj = JSON.parse(localStorage.getItem('MCtoken'));
        const shop_id = store.state.member.message.shop.id;
        const shop_name = store.state.member.message.shop.shop_name;
        var token = token_obj[shop_id].token
        // console.log(shop_id,shop_name, token)
        ecopen.bixi(Aititle.value, {
                "appId":'583',
                "shopId":shop_id,
                "token":token,
                "componentId": 502,
                "extra": {}
        })
        
        // 上报埋点==点击上报
        exposure('bu_general_click', '1')

      }
      
      // AI生图/生视频托管组件===抽屉调用
      const load_ai_img_video=()=>{
        var token_obj = JSON.parse(localStorage.getItem('MCtoken'));
        const shop_id = store.state.member.message.shop.id;
        const shop_name = store.state.member.message.shop.shop_name;
        var token = token_obj[shop_id].token
        ecopen.bixi(Aiimgvideo.container, {
                "appId":'583',
                "shopId":shop_id,
                "token":token,
                "componentId": 509,
                "extra": {},
        })
      }

      // 查询SEO状态
      const Get_title_SEO_status = ()=>{
        rushLoading.value = true;
        axios.post(API.AppSrtoreAPI.dou_product.getSeoTrusteeshipStrategy,{}).then((res)=>{
          // open_status 为2 开启状态
          var open_status = res.data.data.data.open_status;
          console.log(open_status)
          if(open_status == 2){// 开启时=页面显示开启
            AititleText.value = '已开启';
            AititleStatus.value = true;
            Aititlecolor.value = 'green'
            tool.Fun_.message('success','AI标题托光状态已开启')
          }else{// 关闭是=页面显示关闭
            AititleText.value = '未开启';
            AititleStatus.value = false;
            Aititlecolor.value = 'red'
            tool.Fun_.message('warning','AI标题托光状态未开启')
          }
          rushLoading.value = false;
        })
      }
      Get_title_SEO_status();// 初始化页面SEO状态
      Aiimgvideo.RushAIimgvideofirst() // 初始化Ai生图生视频托管状态
      
      // 查询下架商品列表及其处理建议
      const Get_Product_Suggestion_List = ()=>{
        console.log(API.AppSrtoreAPI.dou_product.getProductSuggestionList)
      }
      // 抖店组件SDK初始化----结束


      // 会员信息

      // 帮助中心

      // 联系我们


        return{
          PAGEDATA,
          store,
          innerHeight,
          QualityTask,
          Functionde,
          router,
          load_ai_title,
          Aititle,
          load_ai_img_video,
          Aiimgvideo,
          exposure,
          AititleStatus,
          AititleText,
          Get_title_SEO_status,
          Aititlecolor,
          rushLoading

        }
    },
}
</script>

<style scoped>
.cardStyle{width: 100%;height: 84px;}
.icoStyle{font-size:52px;margin: 8px 0 0 12px;transition: transform 0.3s ease;}
.icoStyle:hover{transform: scale(1.1); /* 鼠标移入时放大到1.5倍 */}
.imgStyle{display:block;margin: 5px 0 0 5px;height: 72px;width: 72px;border-radius: 6px;}
.cardTitle{font-size: 12px;margin: 0 0 6px 0;padding:22px 0 0 0;height: 36px;overflow: hidden;}
.cardText{font-size: 12px;line-height: 18px;height: 20px;overflow: hidden;}
.gutter-box{background-color: aliceblue;border-radius: 6px;}
.RightMiniBox{margin: 15px 0 0 0;border:1px solid #e5e5e596;border-radius: 4px;padding:12px;}
.ListCard{}
.NumberBox{margin: 4px 0 0 0 !important; border: 1px solid #e5e5e596;border-radius: 6px;padding: 14px 0 4px 0;}
.Numbertext{margin: 4px 0 6px 0;font-size: 22px;text-align: center;height: 42px;}
.ZhenduanTitle{height: 30px;margin: 16px 0 0 0;}
.task_text_bottom{text-align: center;margin: 0 0 20px 0;}
.task_sty{width: 140px;margin: 6px 0 0 0;height: 26px;}
.task_num{height: 56px;display: block;padding: 12px 0 0 0;}
.bodyright{background-color: #fff;margin: 0 0 0 0;padding: 0 14px 0 0}
</style>