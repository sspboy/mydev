<!--
组件说明：
选择素材组件,功能包含如下：
抖音-选择图片、上传图片、本地上传图片 抽屉组件
-->
<template>

    <a-drawer
        v-model:open="props.data.selectimg_open"
        width="80%"
        :closable="false"
        :footer-style="{ textAlign: 'left' }"
        @close="onClose"
    >

        <!-- 素材列表 抽屉内容区域 -->
        <div style="height: 100%;">

            <a-row>

                <a-col :span="18">
                    <!--图片上传按钮-->
                    <a-space>
                        <h3 style="margin: 4px 0 0 0;">选择素材</h3>
                        <!--面包屑导航-->
                        <div style="margin: 8px 0 0 20px;"> 
                            <a-breadcrumb>
                                <a-breadcrumb-item v-for=" item in PAGEDATA.BreadCrumb" href="#">
                                    <FolderOutlined />
                                    <span 
                                        @click="console.log('加载当前文件夹素材列表', item.folder_id)" 
                                        class="font_size_12"
                                    >
                                    {{ item.folder_name }}
                                    </span>
                                </a-breadcrumb-item>
                            </a-breadcrumb>
                        </div>
                    </a-space>
                </a-col>

                <a-col :span="6">
                    <!--图片上传按钮-->
                    <a-space :size="28">
                        <!--本地上传图片 按钮-->
                        <!-- <a-button type="primary" size="small" @click="showrenDrawer">本地上传图片</a-button> -->
                        <!--上传图片 按钮-->
                        <a-button size="small" @click="shownetDrawer">图片地址上传</a-button>
                        <!--上传视频 按钮-->
                        <a-button size="small" @click="showvideouploadDrawer">视频地址上传</a-button>
                        <!--关闭窗口-->
                        <CloseOutlined @click="onClose" />
                    </a-space>
                    
                </a-col>
            </a-row>


            <a-layout style="height: 96%; margin-top: 16px;">
                
                <!-- 左侧素材选择树 菜单 开始-->
                <a-layout-sider class="siderStyle" width="300">

                    <!-- 加载状态 -->
                    <div v-if="treeData.length == 0" style="text-align: center;margin-top: 65%;"><a-spin /></div>

                    <!-- 为空状态 -->
                    <div v-if="treeData.value === 'undefined'" style="text-align: center;margin-top: 65%;"><a-empty /></div>

                    <!-- 不为空状态 -->
                    <a-tree
                        v-model:expandedKeys="expandedKeys"
                        v-model:selectedKeys="selectedKeys"
                        :load-data="onLoadData"
                        :tree-data="treeData"
                        @select="handleSelect"
                        show-icon
                        class="font_size_12"
                    >
                        <template #icon="{ key, selected }">
                            <FolderOutlined />
                        </template>
                    </a-tree>

                </a-layout-sider>
                <!-- 左侧素材选择树 菜单 结束-->

                <a-layout>

                    <!-- 列表 不为空状态 -->
                    <a-checkbox-group  v-model:value="Material_Images.check_value.value" style="width: 100%;height: 100%;">

                        <a-layout-content class="contentStyle">

                            <div class="confimImg">

                                <p style="padding: 0 0 0 20px;">
                                    已选择素材
                                    <a-tag :bordered="false">{{ Material_Images.confirm_img_list.value.length }}</a-tag>
                                    个 ------ 
                                    <a href="#" @click="Material_Images.clear_confirm_img_list"><ClearOutlined />清空</a>
                                </p>

                                <!--暂无数据-->
                                <div v-if="Material_Images.confirm_img_list.value.length == 0" style="margin-top: 110px;">
                                    <a-empty :image="simpleImage" />
                                </div>
                                    
                                <!--列表数据 迭代-->
                                <div v-for="item in Material_Images.confirm_img_list.value" class="confimbox">

                                        <a-image v-if="item.material_type == 'photo'" style="height:50px;" :src="item.byte_url" />
                                        <a-image v-if="item.material_type == 'video'" style="height:50px;" :src="item.video_info.video_cover_url" />
                                        
                                        <p style="margin: 10px 0 0 0;font-size: 12px;">
                                            <a-button type="text" size="small" @click="Material_Images.clear_img_fun(item)"> 
                                            <CloseCircleOutlined />
                                            </a-button>
                                        </p>
                                </div>

                            </div>

                            <!-- 列表 为空状态 -->
                            <div style="height:480px;overflow-x: hidden;overflow-y: auto;padding: 20px 0 0 0;">
                                

                                <a-checkbox-group  v-model:value="PAGEDATA.check_value" style="width: 100%;height: 100%;">

                                <a-list 
                                    :grid="{ gutter: 0, column: 5 }" 
                                    :data-source="PAGEDATA.datalist"
                                    :loading="PAGEDATA.loading"
                                    style="width:100%;height: 100%;"
                                >

                                    <template #renderItem="{ item }">
                                        

                                        <a-list-item key="item.material_id">

                                            <!--图片文件 显示方式-->
                                            <a-card v-if="item.material_type == 'photo'" size="small" class="Listimgbox" hoverable>

                                                <div class="floating-badge"><PictureOutlined /> 图片</div>

                                                <a-image
                                                    :style="Material_Images.material_width(item.photo_info)"
                                                    :src="item.byte_url"
                                                />

                                                <div class="material-name" :title="item.materil_name">
                                                    {{ item.materil_name }}
                                                </div>

                                                <p class="img_list_box" style="text-align: center;">

                                                    <a-space align="center" size="2" >
                                                        
                                                        <template #split>
                                                            <a-divider type="vertical" />
                                                        </template>

                                                        <a-typography-link>
                                                            <a-checkbox 
                                                                :value="item.material_id"
                                                                @change="Material_Images.select_img_fun(item)" 
                                                            ></a-checkbox>
                                                        </a-typography-link>

                                                        <a-typography-link>
                                                            <a href="#" class="font_size_12" @click="showChildimgDrawer(item)">
                                                            <EyeOutlined /> 详情 </a>
                                                        </a-typography-link>

                                                    </a-space>
                                                </p>

                                            </a-card>

                                            <!--视频 显示方式-->
                                            <a-card v-else-if="item.material_type == 'video'" size="small" class="Listimgbox" hoverable>
                                                <div class="floating-badge-video"><PlaySquareOutlined />视频</div>
                                                <a-image
                                                    :height="100"
                                                    :src="item.video_info.video_cover_url"
                                                />

                                                <div class="material-name" :title="item.materil_name">
                                                    {{ item.materil_name }}
                                                </div>
                                                <p class="video_list_box">
                                                    
                                                    <a-space align="center" size="2">
                                                        <template #split>
                                                        <a-divider type="vertical" />
                                                        </template>
                                                        <a-typography-link>
                                                            <a-checkbox 
                                                                :value="item.material_id"
                                                                @change="Material_Images.select_img_fun(item)"
                                                                class="font_size_12" 
                                                            ></a-checkbox>
                                                        </a-typography-link>
                                                        <a-typography-link>
                                                            <a href="#" class="font_size_12" @click="showChildvideoDrawer(item)"><EyeOutlined /> 详情</a>
                                                        </a-typography-link>
                                                    </a-space>
                                                </p>
                                            </a-card>

                                        </a-list-item>

                                    </template>

                                </a-list>
                                </a-checkbox-group>
                            </div>

                        </a-layout-content>

                    </a-checkbox-group>

                    <!-- 翻页 -->
                    <a-layout-footer class="footerStyle">
                        <a-row>
                            <a-col :span="4">
                                <a-checkbox 
                                    style="margin-top: 4px;float: left;" 
                                    v-model:checked="checked_status"
                                    @change="onCheckAllChange">全选</a-checkbox>
                            </a-col>
                            <a-col :span="20">
                                <nav_pagination :fandata="PAGEDATA" v-on:complete="page_turning"/>
                            </a-col>
                        </a-row>     
                    </a-layout-footer>

                </a-layout>

            </a-layout>


        </div>

        <!--本地上传 抽屉 -->
        <a-drawer v-model:open="childrenDrawer" title="本地上传图片" width="320" :closable="false">

            <a-button type="primary" @click="showrenDrawer">关闭</a-button>

        </a-drawer>


        <!--图片地址上传 抽屉 -->
        <a-drawer v-model:open="childnetDrawer" title="图片地址上传" width="520" :closable="false">

            <a-alert
                type="info"
                class="font_size_12"
                style="margin-bottom: 20px;"
            >
                <template #description>
                    <div>   
                    1、素材上传成功后不会立即显示，需要后台审核1分钟内会在文件夹中会显示.
                    2、素材审核通过后，才能被正常使用.
                    </div>
                </template>
            </a-alert>

            <a-form :model="uploadimglist" ref="netimagesformRef">

                <a-form-item
                    :name="['folder_value']"
                    :rules="{
                        required: true,
                        message: '素材文件夹不能为空',
                        trigger: 'change',
                        type: 'array',
                    }"
                >
                    <!--联级选择-文件夹-->
                    <a-cascader
                        v-model:value="uploadimglist.folder_value"
                        :options="uploadimglist.netImageFolderOptions"
                        :load-data="loadNetImageFolder"
                        placeholder="请选择文件夹"
                        change-on-select
                        style="width: 94%;"
                    />

                </a-form-item>

                <a-form-item
                    v-for="(domain, index) in uploadimglist.list"
                    :key="index"
                    :name="['list', index, 'value']"
                    :rules="[
                        {required: true,message: '图片地址不能为空',trigger: 'change'},
                        { pattern: /^http/, message: '图片地址必须以 http 开头', trigger: 'change' }
                    ]"
                >
                <a-input 
                    type="text" 
                    placeholder="输入图片地址"
                    v-model:value="domain.value"
                    clearable
                    autoComplete="off"
                    style="width: 94%;margin-right: 10px;"
                >
                </a-input>

                <MinusCircleOutlined
                    v-if="uploadimglist.list.length > 1"
                    class="dynamic-delete-button"
                    @click="delimaginput(index)"
                />
                </a-form-item>

                <a-form-item>
                <a-button type="dashed" style="width: 94%" @click="addimaginput">
                    <PlusOutlined />
                    添加图片地址
                </a-button>
            </a-form-item>
            </a-form>

            <template #footer>
                <a-space>
                    <a-button 
                        type="primary" 
                        @click="Uploadnetimages"
                        :loading="netimagesbuttonloadstatus"
                    >上传</a-button>
                    <a-button @click="shownetDrawer">取消</a-button>
                </a-space>
            </template>

        </a-drawer>

        <!--视频地址上传 抽屉 -->
        <a-drawer v-model:open="childvideouploadDrawer" title="视频地址上传" width="520" :closable="false">
            
            <a-alert
                type="info"
                class="font_size_12"
                style="margin-bottom: 20px;"
            >
                <template #description>
                    <div>   
                    1、素材上传成功后不会立即显示，需要后台审核1分钟内会在文件夹中会显示.
                    2、素材审核通过后，才能被正常使用.
                    </div>
                </template>
            </a-alert>

            <a-form :model="uploadvideolist" ref="videoformRef">

                <a-form-item
                    :name="['folder_value']"
                    :rules="{
                        required: true,
                        message: '素材文件夹不能为空',
                        trigger: 'change',
                        type: 'array',
                    }"
                >
                    <!--联级选择-文件夹-->
                    <a-cascader
                        v-model:value="uploadvideolist.folder_value"
                        :options="uploadvideolist.videoFolderOptions"
                        :load-data="loadNetImageFolder"
                        placeholder="请选择文件夹"
                        change-on-select
                        style="width: 94%;"
                    />
                </a-form-item>

                  <a-form-item
                    v-for="(domain, index) in uploadvideolist.list"
                    :key="index"
                    :name="['list', index, 'value']"
                    :rules="[
                        {required: true,message: '视频地址不能为空',trigger: 'change'},
                        { pattern: /^http/, message: '视频地址必须以 http 开头', trigger: 'change' }
                        ]"
                  >
                    <a-input 
                        type="text" 
                        placeholder="输入视频地址"
                        v-model:value="domain.value"
                        clearable
                        autoComplete="off"
                        style="width: 94%;margin-right: 10px;"
                    >
                    </a-input>

                    <MinusCircleOutlined
                        v-if="uploadvideolist.list.length > 1"
                        class="dynamic-delete-button"
                        @click="delvideoinput(index)"
                    />
                  </a-form-item>

                  <a-form-item>
                    <a-button type="dashed" style="width: 94%" @click="addivideoinput">
                        <PlusOutlined />
                        添加视频地址
                    </a-button>
                </a-form-item>
            </a-form>

            <template #footer>
                <a-space>
                    <a-button type="primary" :loading="videobuttonloadstatus" @click="Uploadnetvideo">
                        上传
                    </a-button>
                    <a-button @click="showvideouploadDrawer">取消</a-button>
                </a-space>
            </template>
        </a-drawer>


        <!--图片详情 抽屉 -->
        <a-drawer v-model:open="childimgDrawer" title="图片详情" width="320" :closable="false">

            <div v-if="Material_Images.image_detaile !== undefined">

            <!--图片信息-->
                <p>所属文件夹ID：{{ Material_Images.image_detaile.value.folder_id }}</p>
                <p>素材ID：{{ Material_Images.image_detaile.value.material_id }}</P>
                <p>图片名称：{{ Material_Images.image_detaile.value.materil_name }}</p>
                <div v-if="Material_Images.image_detaile.value.origin_url !== ''">
                    <p style="margin: 10px 0 10px 0;">来源地址：</p>
                    <p style="margin: 10px 0 10px 0;">
                        <img width="50" :src="Material_Images.image_detaile.value.origin_url"></img>
                    </p>
                    <p style="width: 90%;font-size:12px;background-color: #f2f2f2;padding: 6px;border-radius: 4px; margin: 8px 0 0 0;">
                        <a-typography-paragraph :copyable="{ tooltip: false }">
                            {{ Material_Images.image_detaile.value.origin_url }}
                        </a-typography-paragraph>
                    </p>
                </div>
                <p style="margin: 10px 0 10px 0;">素材地址：</p>
                <p style="margin: 10px 0 10px 0;"><img width="50" :src="Material_Images.image_detaile.value.byte_url"></img></p>

                <div style="width: 90%;font-size:12px;background-color: #f2f2f2;padding: 6px;border-radius: 4px;margin: 0 0 20px 0;">
                        <a-typography-paragraph :copyable="{ tooltip: false }">
                            {{ Material_Images.image_detaile.value.byte_url }}
                        </a-typography-paragraph>
                </div>

                <p v-if="Material_Images.image_detaile.value.photo_info !== undefined">
                    图片长 {{ Material_Images.image_detaile.value.photo_info.width }}px
                    宽  {{ Material_Images.image_detaile.value.photo_info.height }}px
                    格式  {{ Material_Images.image_detaile.value.photo_info.format }}
                </p>
                <p>审核状态：
                    <!--1-待审核；2-审核中；3-通过 4-拒绝；注意：只有audit_status =3时byte_url才会返回-->
                    <span v-if="Material_Images.image_detaile.value.audit_status == '1'">待审核</span>
                    <span v-else-if="Material_Images.image_detaile.value.audit_status == '2'">审核中</span>
                    <span v-else-if="Material_Images.image_detaile.value.audit_status == '3'">审核通过</span>
                    <span v-else-if="Material_Images.image_detaile.value.audit_status == '4'">拒绝</span>
                </p>

                <p v-if="Material_Images.image_detaile.value.audit_status == '4'">审核失败原因：{{ Material_Images.image_detaile.value.audit_reject_desc }}</p>

                <p material_type="">素材类型：
                    <span v-if="Material_Images.image_detaile.value.material_type == 'photo'">图片</span>
                    <span v-else-if="Material_Images.image_detaile.value.material_type == 'video'">视频</span>
                </p>

                <p operate_status="">文件夹状态：
                    <!--0-待下载；1-有效；4-在回收站中-->
                    <span v-if="Material_Images.image_detaile.value.operate_status == 0">待下载</span>
                    <span v-else-if="Material_Images.image_detaile.value.operate_status == 1">有效</span>
                    <span v-else-if="Material_Images.image_detaile.value.operate_status == 4">回收站中</span>
                </p>
                <p size="">文件大小：{{ Material_Images.image_detaile.value.size }} kb</p>
                <p material_type="">创建时间: {{ Material_Images.image_detaile.value.create_time }}</p>
                <p material_type="">修改时间: {{ Material_Images.image_detaile.value.update_time }}</p>

            </div>

            <div v-if="Material_Images.image_detaile == undefined">
                  <a-spin />
            </div>

            <a-button size="small" @click="showChildimgDrawer">关闭</a-button>

        </a-drawer>

        <!--视频详情 抽屉 -->
        <a-drawer v-model:open="childvideoDrawer" title="视频详情" width="320" :closable="false">

            <div v-if="Material_Images.video_detaile.value !== undefined">
            <!--视频信息-->
                <p>所属文件夹ID：{{ Material_Images.video_detaile.value.folder_id }}</p>
                <p>素材ID：{{ Material_Images.video_detaile.value.material_id }}</P>
                <p>图片名称：{{ Material_Images.video_detaile.value.materil_name }}</p>

                <div v-if="Material_Images.video_detaile.value.origin_url !== ''">

                    <p>来源地址：</p>

                    <p class="sucai_url">
                        <a-typography-paragraph :copyable="{ tooltip: false }">
                            {{ Material_Images.video_detaile.value.origin_url }}
                        </a-typography-paragraph>
                    </p>

                    <video
                        :key="Material_Images.video_detaile.value.material_id"
                        controls
                        preload="metadata"
                        width="100%" 
                    >
                        <source :src="Material_Images.video_detaile.value.origin_url" type="video/mp4"></source>
                    </video>
                </div>

                <div style="margin: 10px 0 10px 0;" v-if="Material_Images.video_detaile.value.byte_url !== ''">
                    素材地址：
                    <p class="sucai_url">
                        <a-typography-paragraph :copyable="{ tooltip: false }">
                            {{ Material_Images.video_detaile.value.byte_url }}
                        </a-typography-paragraph>
                    </p>
                </div>

                <p v-if="Material_Images.video_detaile.value.video_info !== undefined">
                    视频时长 {{ Material_Images.video_detaile.value.video_info.duration }} 秒 
                    格式 {{ Material_Images.video_detaile.value.video_info.format }}
                </p>
            </div> 

            <div v-if="Material_Images.video_detaile.value == undefined">
                  <a-spin />
            </div>

            <a-button size="small" @click="showChildvideoDrawer">关闭</a-button>

        </a-drawer>

        <!--底部按钮-->
        <template #footer>

            <a-button style="margin-right: 8px" type="primary" @click="Material_Images.click_submit">确认</a-button>

            <a-button  @click="onClose">取消</a-button>
            
        </template>

    </a-drawer>

</template>

<script>
import { defineComponent,ref,reactive,computed,onMounted,h,watch } from 'vue';
import{Empty, message} from 'ant-design-vue'
import {
    PlusOutlined,
    MinusCircleOutlined,
    FolderOutlined,
    HomeOutlined,
    UserOutlined,
    CloseOutlined,
    DeleteOutlined,
    CloseCircleOutlined,
    PictureOutlined,
    EditOutlined,
    ClearOutlined,
    EyeOutlined,
    PlaySquareOutlined } from '@ant-design/icons-vue';
import * as TOOL from '@/assets/JS_Model/tool';
import * as utils from '@/assets/JS_Model/public_model';
import axios from "axios";

// 组件引用=====开始
import nav_pagination from "@/components/nav_pagination.vue";

export default defineComponent({
   name:'Materialplus',
   components:{
    PlusOutlined,
    MinusCircleOutlined,
    PlaySquareOutlined,
    FolderOutlined,
    EditOutlined,
    UserOutlined,
    HomeOutlined,
    CloseOutlined,
    DeleteOutlined,
    CloseCircleOutlined,
    PictureOutlined,
    ClearOutlined,
    EyeOutlined,
    nav_pagination, // 翻页组件
   },
    props: {
        data:{typr:Object}
    },
    setup(props,ctx) {

        const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE; // 默认为空的图标
        
        // 数据配置
        const PAGEDATA = reactive({
            total_number:ref(0),            // 图片列表内容总数
            datalist:ref([]),               // 素材列表数据
            loading:ref(true),              // 素材列表加载状态
            f_id:0,                         // 根目录id
            List_conditions:reactive({      // 默认查询配置
                "folder_id":0,              // 当前文件夹id
                "page":1,                   // 当前页面
                "size":10,                  // 显示数量
            }),

            childrenDrawer:ref(false),// 本地上传图片-抽屉状态
            childnetDrawer:ref(false),// 网络上传图片-抽屉状态
            BreadCrumb:ref([// 面包屑导航
                {
                    "folder_name":"素材库",
                    "folder_id":0
                }
            ]),
            check_value:ref([])

        })

        const tool = new TOOL.TOOL()            // 工具方法
        const API = new utils.A_Patch()         // 请求接口地址合集


        const childimgDrawer = ref(false);      // 图片详情状态
        const childvideoDrawer = ref(false);    // 视频详情状态

        const expandedKeys = ref([]); // 展开指定的树节点
        const selectedKeys = ref([]); // 选中的节点树
        const treeData = ref([]);

        // 关闭选择素材抽屉
        const onClose = () => {
            props.data.selectimg_open = false;
        };

        // 显示本地上传--按钮
        const showrenDrawer = () => {
            childrenDrawer.value = !childrenDrawer.value;
        };

        // 显示图片详情--按钮
        const showChildimgDrawer = (item) => {
            childimgDrawer.value = !childimgDrawer.value;
            // Material_Images.image_detaile.value = undefined;
            if(childimgDrawer.value){// 添加详情信息
                Material_Images.image_detaile.value = item;
            }else{ // 清空详情内容
                // Material_Images.image_detaile.value = undefined;
            }
        };
        
        // 显示视频详情--按钮
        const showChildvideoDrawer = (item) => {

            childvideoDrawer.value = !childvideoDrawer.value;

            if(childvideoDrawer.value){// 添加详情信息
                Material_Images.video_detaile.value = undefined;
                Material_Images.video_detaile.value = item;
                console.log(Material_Images.video_detaile.value)
            }else{ // 清空详情内容
                // Material_Images.video_detaile.value = undefined;
            }
        };

        // 图片素材管理
        const Material_Images = {
            
            // 初始化素材菜单
            Loadtree:()=>{

                tool.Http_.post(API.AppSrtoreAPI.material.getfolder,{

                    "folder_id":"0",// 文件夹id
                    "page_num":1,
                    "page_size":10

                }).then((res)=>{

                    // res为空

                    // res不为空
                    PAGEDATA.loading = false
                    
                    // 子文件夹列表
                    var folder_info_list = res.data.data.folder_info.child_folder

                    // 子素材列表
                    var child_material = res.data.data.folder_info.child_material

                    // 符合条件文件夹数量
                    var total_child_material_num = res.data.data.folder_info.total_child_material_num;
                    // console.log(total_child_material_num)
                    PAGEDATA.total_number = total_child_material_num

                    // 添加菜单名称和id
                    folder_info_list.forEach((obj, idx)=>{
                        
                        // console.log(obj.operate_status)

                        // parent_folder_id 父文件夹id
                        obj.title = obj.folder_name;
                        obj.key = obj.folder_id;                      
                        obj.isLeaf = true; 

                        // 面包屑
                        obj.breadcrumb = [
                            {
                            "folder_name":"素材库",
                            "folder_id":0
                            },{
                            "folder_name":obj.folder_name,
                            "folder_id":obj.folder_id
                            }
                        ]

                        tool.Http_.post(API.AppSrtoreAPI.material.getfolder,{
                            "folder_id":obj.folder_id,// 文件夹id
                            "page_num":1,
                            "page_size":10
                        }).then((res)=>{
                            var obj_child_f_list = res.data.data.folder_info.child_folder;
                            if(obj_child_f_list.length !== 0){obj.isLeaf = false;}
                        }).then(()=>{
                            treeData.value=[...folder_info_list]
                        })

                    })

                    // 初始化图片列表
                    PAGEDATA.datalist = [...child_material]

                })

            },

            // 图片尺寸验证
            material_width:(_info)=>{
                
                var width = _info.width;
                var height = _info.height;

                if(height == width){// 1:1
                    var res =  {width:'100px'}
                }else if(width > height){// 长大于宽
                    var res =  {width:'100px'}
                }else if(width < height){// 长小于宽
                    var res =  {height:'100px'}
                }

                return  res
            },

            // 素材图片列表
            data_img_list:ref([]),
            
            // 勾选素材对象
            check_value:ref([]),

            // 已选图片素材数据列表
            confirm_img_list:ref([]),
            

            // 已选图片素材--清空
            clear_confirm_img_list:()=>{
                Material_Images.confirm_img_list.value = [];
                Material_Images.cunt_img_num = 0;
                checked_status.value = false; // 取消素材全选状态
                PAGEDATA.check_value.length = 0; // 取消列表勾选状态
            },

            // 素材抽屉--确认提交按钮
            click_submit:()=>{
                var res_num = Material_Images.confirm_img_list.value.length;
                if(res_num == 0){
                    // 提示选中图片为空
                    tool.Fun_.message('info','已选图片素材不能为空！')
                }else if(res_num > 0){
                    // console.log(props.data.setimg_name)
                    onClose() // 关闭添加素材组件
                    ctx.emit('add_img_callback', Material_Images.confirm_img_list.value)
                }
                
                // 提示添加图片成功
                // 关闭抽屉
                // 回调添加素材图片到页面方法
            },

            // 素材抽屉--取消按钮
            click_cancel:()=>{
                // console.log('取消按钮')
                props.data.selectimg_open = false;
            },

            // 选择素材图片方法
            select_img_fun:(item)=>{
                
                // 判断添加的图片是否重复
                if (Material_Images.confirm_img_list.value.includes(item)) {
                    // console.log('存在');
                    Material_Images.clear_img_fun(item)
                }else{
                    // console.log('不存在');
                    Material_Images.confirm_img_list.value.push(item)
                }
            },
            // 获取checked状态
            get_checked_status:(event)=>{
                var m_checked = event.target.checked; // 选择状态
                var m_id = event.target.value;
                if(!m_checked){
                    Material_Images.confirm_img_list.value.forEach((obj, idx)=>{
                        var s_id = obj.material_id;// 列表中素材id
                        console.log(s_id)
                        console.log(m_id)
                        if(m_id === s_id){
                            Material_Images.confirm_img_list.value.splice(idx, 1);
                        }
                    })
                }

            },
            // 去除选中得素材图片方法
            clear_img_fun:(item)=>{
                const idx = Material_Images.confirm_img_list.value.indexOf(item);
                if (idx > -1) Material_Images.confirm_img_list.value.splice(idx, 1);
            },
            // 图片详情
            image_detaile:ref(undefined),
            // 视频详情
            video_detaile:ref(undefined)
        }

        // 初始化素材菜单
        Material_Images.Loadtree()

        // 点击菜单===》异步加载菜单
        const onLoadData = treeNode => {

            return new Promise(resolve => {

                // 如果存在子菜单 跳过
                if (treeNode.dataRef.children) {
                    resolve();
                    return;
                }

                var F_if = treeNode.key

                // console.log('加载树', F_if)

                // 请求文件夹信息
                tool.Http_.post(API.AppSrtoreAPI.material.getfolder,{

                    "folder_id":F_if,// 文件夹id
                    "page_num":1,
                    "page_size":10

                }).then((res)=>{

                    // 当前文件夹id
                    var folder_id = res.data.data.folder_info.folder_id;

                    // 当前文件夹类型
                    var folder_type = res.data.data.folder_info.folder_type;

                    // 当前文件夹名称
                    var folder_name = res.data.data.folder_info.folder_name;

                    // 文件夹状态：：1-有效 4-在回收站中
                    var operate_status = res.data.data.folder_info.operate_status;

                    // 子文件夹列表
                    var child_folder_list = res.data.data.folder_info.child_folder
                    var chile_folder_number = child_folder_list.length;

                    // 子文件夹数量=0:禁用子菜单
                    if(chile_folder_number == 0){
                        // console.log('子文件夹为空', child_folder_list)
                        treeNode.isLeaf = true;
                        treeData.value = [...treeData.value];
                        resolve();
                    }else {     // 数量!=0：加载子菜单

                        // console.log('子文件夹',child_folder_list)

                        // 添加菜单名称和id
                        child_folder_list.forEach((obj, idx)=>{
                            
                            // 面包屑
                            var breadcrumb = treeNode.dataRef.breadcrumb;

                            obj.title = obj.folder_name;
                            obj.key = obj.folder_id;
                            obj.isLeaf = true;
                            obj.breadcrumb = [...breadcrumb]
                            obj.breadcrumb.push({
                                "folder_id":obj.folder_id,
                                "folder_name":obj.folder_name
                            })

                            tool.Http_.post(API.AppSrtoreAPI.material.getfolder,{
                                "folder_id":obj.folder_id,// 文件夹id
                                "page_num":1,
                                "page_size":10
                            }).then((res)=>{
                                var obj_child_f_list = res.data.data.folder_info.child_folder;
                                if(obj_child_f_list.length !== 0){obj.isLeaf = false;}
                            })



                        })
                        treeNode.dataRef.children = child_folder_list;
                        treeData.value = [...treeData.value];
                        resolve();
                    }

                    // 子素材列表
                    var child_material_list = res.data.data.folder_info.child_material
                    console.log('子素材',child_material_list)

                    // 文件夹下素材总数目
                    var total_child_material_num = res.data.data.folder_info.total_child_material_num;
                    console.log('子素材总数目',total_child_material_num)

                })



            });
        };
        
        // 点击树型菜单方法
        const handleSelect = (keys, event) =>{
            // console.log('文件夹id', keys) // 打印文件夹id
            // console.log('文件信息',event.node) // 打印节点信息
            PAGEDATA.BreadCrumb = [...event.node.breadcrumb] // 刷新面包屑
            // 判断是否刷新右侧素材列表
            if(keys.length > 0){
                navData.value.folder_id = keys[0]
                navData.value.page_num = 1;
                navData.value.page_size = 10;
                loadproductData(navData.value)
            }
        }

        // 请求商品列表接口数据
        const loadproductData = async(data) => {

            PAGEDATA.loading = true;

            // 请求素材接口
            const res = await axios.post(API.AppSrtoreAPI.material.getfolder, data)
            // console.log(res)

            var res_data = res.data.data;

            var folder_info = res_data.folder_info;

            // 素材列表
            var child_material = folder_info.child_material;

            // 素材总数 total_child_material_num
            var total = folder_info.total_child_material_num;

            // 请求数据为空
            if(child_material.length == 0){
                PAGEDATA.justify = 'center';
                PAGEDATA.align = 'center';
                PAGEDATA.loading = false;
                PAGEDATA.datalist = [];
                PAGEDATA.total_number = 0
            }else{
                setTimeout(() => {
                    PAGEDATA.loading = false;
                    PAGEDATA.justify = 'start';
                    PAGEDATA.align = 'start';
                    // 请求数据不为空
                    PAGEDATA.datalist = [...child_material];
                    PAGEDATA.total_number = total;
                }, 1000);
            }
        }

        // 【翻页-组件 回调方法】========================================开始
        const checked_status = ref(false)// 全选状态绑定值

        // 全选方法
        const onCheckAllChange=(e)=>{
            
            var checked = e.target.checked

            checked_status.value = checked;
            

            if (checked) {

                // 全选素材list
                PAGEDATA.datalist.forEach(item => {

                    var material_id = item.material_id;

                    // 判断是否在数组中
                    if(!PAGEDATA.check_value.includes(material_id)){
                        PAGEDATA.check_value.push(material_id)
                    }
                    if(!Material_Images.confirm_img_list.value.includes(item)){ 
                        Material_Images.confirm_img_list.value.push(item)
                    }
                });
            } else {

                PAGEDATA.check_value.length = 0;
                Material_Images.confirm_img_list.value.length = 0;

            }
        }

        // 翻页查询条件
        const navData=ref({
            "folder_id":0,//默认文件夹id
            "page_num":1,
            "page_size":10,
        })

        const page_turning = (data)=>{

            // console.log(data)

            PAGEDATA.justify = 'flex-start';
            
            PAGEDATA.align = 'flex-start';

            navData.value.page_num = data.page;
            
            navData.value.page_size = data.page_size;

            loadproductData(navData.value)

        }
        // 【查询组件 回调方法】========================================结束


        // 【图片地址上传】======================= 开始
        // 异步加载联级选择器子文件夹
        const loadNetImageFolder = (selectedOptions) => {

            const targetOption = selectedOptions[selectedOptions.length - 1];

            targetOption.loading = true;
            
            const folderId = targetOption.value;
            
            tool.Http_.post(API.AppSrtoreAPI.material.getfolder, {
                
                "folder_id": folderId,
                "page_num": 1,
                "page_size": 1000

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
                        uploadimglist.netImageFolderOptions = [...uploadimglist.netImageFolderOptions];
                    });

                } else {

                    targetOption.isLeaf = true;
                    targetOption.loading = false;
                    uploadimglist.netImageFolderOptions = [...uploadimglist.netImageFolderOptions];
                }
            });
        };
        const childnetDrawer = ref(false);// 图片地址上传抽屉--按钮状态
        const netimagesbuttonloadstatus = ref(false);// 按钮load状态
        const shownetDrawer = () => {// 抽屉关闭
            uploadimglist.folder_value = ['0']
            childnetDrawer.value = !childnetDrawer.value;
        };
        // 图片地址上传列表
        const netimagesformRef = ref()// 表单验证
        const uploadimglist=reactive({
            list:[{value:''}],
            folder_value:[], // 文件夹id
            netImageFolderOptions:[{ // 文件夹联级选项
               value: '0',
               label: '素材库',
               isLeaf: false,
            }]
        })
        // 添加输入地址input
        const addimaginput=()=>{
            var list_number = uploadimglist.list.length;
            if(list_number <= 49){
                uploadimglist.list.push({value:''})
            }else{
                tool.Fun_.message('info','图片上传数量最多不超过50！')
            }
        }
        // 删除网络图片地址
        const delimaginput=(index)=>{
            uploadimglist.list.splice(index, 1)
        }
        // 图片上传
        const Uploadnetimages=()=>{

            netimagesbuttonloadstatus.value = true;

            // 验证表单
            netimagesformRef.value.validate().then(() => {// 通过
                
                // 图片地址列表
                let image_list = uploadimglist.list.map((item)=>{
                    return item.value
                })

                let folder_id = uploadimglist.folder_value.at(-1)// 文件夹id
            
                // 图片地址列表
                axios.post(API.AppSrtoreAPI.material.bacthuploadmaterial,{
                    "folder_id": folder_id,
                    "pic_list": image_list
                }).then((res)=>{

                    // console.log(res)

                    let code = res.data.code;

                    if(code == 10000){ //上传成功

                        
                        tool.Fun_.message('success','图片上传成功！')

                    }else{// 上传失败

                        tool.Fun_.message('',res.data.sub_msg)
                    
                    }
                    
                    childnetDrawer.value = false;// 关闭抽屉

                    netimagesbuttonloadstatus.value = false; // 按钮load状态

                }).catch((error)=>{ // 服务异常

                    // console.log('error', error);

                    tool.Fun_.message('error','服务异常！')
                    
                    netimagesbuttonloadstatus.value = false;

                })


            }).catch(error => {// 不通过
                
                console.log('error', error);
                
                netimagesbuttonloadstatus.value = false;

            });

        }
        // 【图片地址上传】======================= 结束



        // 【视频地址上传】======================= 开始
        const childvideouploadDrawer = ref(false);// 视频地址上传抽屉--按钮状态
        const videobuttonloadstatus = ref(false);// 按钮load状态
        const videoformRef = ref()// 表单验证
        const showvideouploadDrawer = () => {// 视频地址上传--关闭方法
            childvideouploadDrawer.value = !childvideouploadDrawer.value;
        };
        // 视频地址上传列表
        const uploadvideolist=reactive({
            list:[{value:''}],
            folder_value:['0'], // 文件夹id
            videoFolderOptions:[{ // 文件夹联级选项
               value: '0',
               label: '素材库',
               isLeaf: false,
            }]
        })
        // 添加输入地址input
        const addivideoinput=()=>{
            var list_number = uploadvideolist.list.length;
            console.log(list_number)
            if(list_number <= 49){
                uploadvideolist.list.push({value:''})
            }else{
                tool.Fun_.message('info','视频上传数量最多不超过50！')
            }
        }
        // 删除网络图片地址
        const delvideoinput=(index)=>{
            uploadvideolist.list.splice(index, 1)
        }
        // 视频上传
        const Uploadnetvideo=()=>{

            videobuttonloadstatus.value = true;

            // 验证表单
            videoformRef.value.validate().then(() => {// 通过

                // 视频地址列表
                let image_list = uploadvideolist.list.map((item)=>{
                    return {"name":"视频_","url":item.value}
                })

                let folder_id = uploadvideolist.folder_value.at(-1)// 文件夹id

                // 图片地址列表
                axios.post(API.AppSrtoreAPI.material.batchuploadvideo,{
                    "folder_id": folder_id,
                    "video_list": image_list
                }).then((res)=>{

                    // console.log(res)

                    let code = res.data.code;

                    if(code == 10000){ //上传成功

                        videobuttonloadstatus.value = false; // 按钮load状态

                        childvideouploadDrawer.value = false;// 关闭抽屉

                        tool.Fun_.message('success','视频上传成功！')

                    }else{// 上传失败

                        tool.Fun_.message('error',res.data.sub_msg)
                        videobuttonloadstatus.value = false; // 按钮load状态

                    }


                }).catch((error)=>{ // 服务异常

                    console.log('error', error);

                    tool.Fun_.message('error','服务异常！')

                    videobuttonloadstatus.value = false;// 按钮load状态


                })
            
            }).catch(error=>{// 不通过

                console.log('error', error);
                videobuttonloadstatus.value = false;// 按钮load状态
            
            })
            

        }
        // 【视频地址上传】======================= 结束



        // 【本地文件上传】======================= 开始
        const childrenDrawer = ref(false);      // 本地上传抽屉状态
        // 【本地文件上传】======================= 结束

        return{
            props,
            PAGEDATA,
            childrenDrawer,
            childimgDrawer,
            childvideoDrawer,
            onClose,
            showrenDrawer,
            
            checked_status, // 全选状态
            onCheckAllChange, // 全选列表
            
            showChildimgDrawer,
            showChildvideoDrawer,
            
            Material_Images,
            expandedKeys,
            selectedKeys,
            treeData,
            onLoadData,
            page_turning,
            handleSelect,
            simpleImage,

            // 图片地址上传-start
            loadNetImageFolder,
            childnetDrawer,
            netimagesbuttonloadstatus,
            shownetDrawer,
            netimagesformRef,
            uploadimglist,
            addimaginput,
            delimaginput,
            Uploadnetimages,
            // 图片地址上传-end

            // 视频地址上传-start
            childvideouploadDrawer,
            showvideouploadDrawer,
            videobuttonloadstatus,
            videoformRef,
            uploadvideolist,
            addivideoinput,
            delvideoinput,
            Uploadnetvideo
            // 视频地址上传-end
        }
    }
})
</script>
<style scoped>
.headerStyle{text-align: left;background-color: #fff;height: 64px;line-height: 64px;}
.contentStyle{text-align: center;background-color: #fff;height: 100%;}
.siderStyle{background-color: #fff;overflow: auto;padding: 10px 10px 10px 0;width: 400px;}
.footerStyle{text-align: center;background-color: #fff;padding: 0 0 0 20px;}
.confimImg{text-align: left;padding: 10px 0 10px 0;margin: 0 0 10px 0;height:300px;width: 100%;overflow-x: auto;overflow-y: auto;border-bottom: 1px #f2f2f2 solid;}
.confimbox{width: 60px;height: 60px;margin: 10px 20px 30px 20px;padding: 4px; float: left;border: 1px #f2f2f2 solid;border-radius: 4px;text-align: center;}
.Listimgbox{border: 1px solid #f2f2f2; border-radius: 6px;margin:0px 10px 10px 0;width: 100%;}
.video_list_box{padding: 6px 0 0 0;margin: 4px 0 0 0;width: 100%;height: 28px;overflow: hidden;text-align: left;text-align: center;}
.img_list_box{padding: 2px;margin: 4px 0 0 0;width: 100%;height: 28px;overflow: hidden;text-align: left;}
.sucai_url{width: 90%;font-size:12px;background-color: #f2f2f2;padding: 6px;border-radius: 4px;margin: 0 0 20px 0;}
.material-name {
    width: 100%;
    height: 28px;
    line-height: 28px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: center;
    font-size: 12px;
    color: #333;
    margin-top: 4px;
}
/**！！！素材类型---相对定位！！！**/
.floating-badge {background-color: black;color: #fff;height: 20px;position: absolute;z-index: 100;border-radius: 4px;padding: 0 4px;font-size: 12px;opacity: 0.5}
.floating-badge-video {background-color:blue;color: #fff;height: 20px;position: absolute;z-index: 100;border-radius: 4px;padding: 0 4px;font-size: 12px;opacity: 0.5}

</style>