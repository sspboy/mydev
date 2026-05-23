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

                

        <!-- Comfyui-AI-list -->
        <a-row :gutter="[12, 12]" style="padding: 14px 0 0 0;">

          <a-col :span="4">
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
      <a-layout-sider style="background-color: #fff;margin: 0 0 0 0;" width='300px'>


        <div class="RightMiniBox">
          <h4>
            AI标题自动优化托管 - 已开启
            <a-switch 
              checked-children="开" 
              un-checked-children="关"  
              @click="load_ai_title"
              />
          </h4>
          <div class="font_size_12">
            商品类目、卖点、热词优化。
            提升商品曝光度！
          </div>
          <div class="font_size_12 cursor right_tips">

            <div ref="Aititle" id="aititle"></div>

          </div>
        </div>

        <div class="RightMiniBox">
          <h4>
            AI生图/生视频托管
            <a-switch 
              checked-children="开" 
              un-checked-children="关"
              @click="load_ai_img_video" 
            />
          </h4>
          <div class="font_size_12">
            自动生成1:1/3:4主图和商品视频
            无需制作素材！
          </div>
          <div class="font_size_12 cursor right_tips">
            <div ref="Aiimgvideo" id="aiimgvideo"></div>
          </div>
        </div>

        <div class="RightMiniBox">
          <h4><QuestionCircleFilled style="color:dimgray;"/> 帮助中心</h4>
          <div class="font_size_12" style="padding: 8px 0 0 0;">
            <a-row :gutter="[12, 12]">
              <a-col :span="24">商品查询查询教程</a-col>
              <a-col :span="24">商品查询查询教程</a-col>
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
        RightOutlined
    },
    setup() {

      const router = useRouter() // 路由

      const API = new utils.A_Patch()         // 请求接口地址合集

      const tool = new TOOL.TOOL()            // 工具方法

      const innerHeight = ref(window.innerHeight-100);// 初始化表格高度

      const store = useStore();// 共享数据

      const Aititle = ref(null)     // ai标题托管容器
      const Aiimgvideo = ref(null)  // ai生图托管容器

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
        Functionde.LoadPageDATA() // 加载诊断数据信息
      }, 1000);

      // 标题托管组件调用
      // 抖店组件SDK初始化----开始
      // 获取token、shopid、shopName
      const load_ai_title = ()=>{
        var token_obj = JSON.parse(localStorage.getItem('MCtoken'));
        const shop_id = store.state.member.message.shop.id;
        const shop_name = store.state.member.message.shop.shop_name;
        var token = token_obj[shop_id].token
        console.log(shop_id,shop_name, token)
        ecopen.bixi(Aititle.value, {
                "appId":'583',
                "shopId":shop_id,
                "token":token,
                "componentId": 502,
                "extra": {},
        })
      }
      
      // AI生图/生视频托管组件调用
      const load_ai_img_video=()=>{
        var token_obj = JSON.parse(localStorage.getItem('MCtoken'));
        const shop_id = store.state.member.message.shop.id;
        const shop_name = store.state.member.message.shop.shop_name;
        var token = token_obj[shop_id].token
        ecopen.bixi(Aiimgvideo.value, {
                "appId":'583',
                "shopId":shop_id,
                "token":token,
                "componentId": 509,
                "extra": {},
        })
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
          Aiimgvideo
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
.RightMiniBox{margin: 15px 14px 0 0;border:1px solid #e5e5e596;border-radius: 4px;padding:12px;}
.ListCard{}
.NumberBox{margin: 4px 0 0 0 !important; border: 1px solid #e5e5e596;border-radius: 6px;padding: 14px 0 4px 0;}
.Numbertext{margin: 4px 0 6px 0;font-size: 22px;text-align: center;height: 42px;}
.ZhenduanTitle{height: 30px;margin: 16px 0 0 0;}
.task_text_bottom{text-align: center;margin: 0 0 20px 0;}
.task_sty{width: 140px;margin: 6px 0 0 0;height: 26px;}
.task_num{height: 56px;display: block;padding: 12px 0 0 0;}
</style>