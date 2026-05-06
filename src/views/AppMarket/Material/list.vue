<!-- 素材列表--模板说明 -->
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


            <!-- 选择文件夹树形结构 开始 -->
            <a-layout-sider width="300">

                <!-- 加载状态 -->
                <div v-if="PAGEDATA.treeData.value == []" style="text-align: center;margin-top: 65%;">
                    <a-spin />
                </div>

                <!-- 为空状态 -->
                <div v-else-if="PAGEDATA.treeData.value === 'undefined'" style="text-align: center;margin-top: 65%;">
                    <a-empty />
                </div>

                <!-- 不为空状态 innerHeight -->
                <div v-else style="height: 100px;"
                    :style="{
                        height: PAGEDATA.innerHeight + 100 + 'px',
                        overflowY:'auto',
                        overflowX:'auto',
                        marginTop:'10px',
                        marginBottom:'10px',
                        padding:'10px 0 0 2px',
                    }"
                >
                    <p style="padding: 15px 0 0 32px;font-size: 12px;">
                        <a-space style="width: 100%">
                        <FolderOutlined /> 根目录
                        <a-progress style="width: 100px;margin: 0px 0 0 0;" :percent="PAGEDATA.netdisk_info" size="small" />
                        </a-space>
                    </p>
                    <a-tree
                        v-model:expandedKeys="PAGEDATA.expandedKeys"
                        v-model:selectedKeys="PAGEDATA.selectedKeys"
                        :load-data="MaterialListMethod.load.onLoadData"
                        :tree-data="PAGEDATA.treeData.value"
                        @select="MaterialListMethod.Tree.handleSelect"
                        show-icon
                        style="font-size: 12px;"
                    >
                    
                        <template #icon="{ key, selected }">
                            <FolderOutlined />
                        </template>
                    </a-tree>
                </div>
            </a-layout-sider>
            <!-- 选择文件夹树形结构 结束 -->

            <!-- 素材列表 不为空状态 -->
            <a-layout-content class="content_border">

                <!-- 查询导航 
                    面包屑、id查询、关键字查询
                    开始
                -->

                <div :style="{
                    width: '100%',
                    height:'42px',
                    backgroundColor:'#f2f2f2',
                    borderRadius:'4px',
                    overflow:'hidden',
                }">

                    <a-row>

                        <!--面包屑导航-->
                        <a-col :span="12">
                            <a-space>
                                <div style="margin: 10px 0 0 20px;"> 
                                    <a-breadcrumb>
                                        <a-breadcrumb-item v-for=" item in PAGEDATA.BreadCrumb" href="#">
                                            <FolderOutlined />
                                            <span 
                                                @click="MaterialListMethod.SelectMaterial.breadcrumb_click(item.folder_id)" 
                                                class="font_size_12"
                                            >
                                            {{ item.folder_name }}
                                            </span>
                                        </a-breadcrumb-item>
                                    </a-breadcrumb>
                                </div>
                            </a-space>
                        </a-col>

                        <a-col :span="12" style="padding:8px 6px 0 0;">
                            <a-space style="width: 100%;justify-content: flex-end;">
                                <a-input 
                                    type="text" 
                                    placeholder="输入素材id"
                                    v-model:value="MaterialListMethod.SelectMaterial.m_id.value"
                                    autoComplete="off"
                                    >
                                </a-input>
                                <a-input 
                                    type="text" 
                                    placeholder="输入关键词"
                                    v-model:value="MaterialListMethod.SelectMaterial.key_word.value"
                                    clearable
                                    autoComplete="off"
                                ></a-input>
                                <a-button 
                                type="primary" 
                                size="small"
                                @click="MaterialListMethod.SelectMaterial.search"
                                >查询</a-button>
                                <a-button type="primary" size="small" @click="networkUploadRef.showNetImageModal()">网络图片上传</a-button>
                                <a-button type="primary" size="small" @click="localUploadRef.showLocalUploadModal()">本地图片上传</a-button>
                            </a-space>
                        </a-col>

                    </a-row>

                </div>
                <!-- 
                    查询导航 
                    面包屑、id查询、关键字查询
                    结束
                -->                


                <!-- 素材列表 不为空状态 -->
                <div :style="{
                    height: PAGEDATA.innerHeight + 'px',
                    overflowY:'auto',
                    overflowX:'hidden',
                    marginTop:'10px',
                    marginBottom:'10px',
                    padding:'10px 0 0 2px'

                }">
                    <a-checkbox-group  v-model:value="PAGEDATA.check_value" style="width: 100%;height: 100%;">
                    <a-list 
                        :grid="{ gutter: 0, column: 5 }"
                        size="default"
                        :data-source="PAGEDATA.datalist"
                        :loading="PAGEDATA.loading"
                    >

                        <template #renderItem="{ item }">

                            <!--图片 显示方式-->
                            <a-card  v-if="item.material_type == 'photo'" size="small" class="card_style" hoverable>

                                <div class="floating-badge"><PictureOutlined /> 图片</div>

                                <div class="image_content_">
                                    <!--图片文件 显示方式-->
                                    <a-image
                                        :style="MaterialListMethod.load.material_width(item.photo_info)"
                                        :src="item.byte_url"
                                    />
                                </div>
                                <div class="material-name" :title="item.materil_name">
                                    {{ item.materil_name }}
                                </div>
                                <template #actions>
                                    <a-checkbox 
                                        :value="item.material_id"
                                        @change="MaterialListMethod.load.select_img_fun(item)"
                                    ></a-checkbox>
                                    <a href="#" class="font_size_12" @click="showChildimgDrawer(item)">详情</a>
                                    <a href="#" class="font_size_12" @click="MaterialListMethod.del.del_open(item)">删除</a>
                                    <a href="#" class="font_size_12" @click="MaterialListMethod.del.RecycleBin_open(item)">回收</a>
                                </template>
                            </a-card>

                            <!--视频 显示方式-->
                            <a-card v-else-if="item.material_type == 'video'" size="small" class="card_style" hoverable>
                                
                                <div class="floating-badge-video"><PlaySquareOutlined />视频</div>

                                <div class="image_content_">
                                <a-image
                                    :style="MaterialListMethod.load.video_cover_width(item)"
                                    :src="item.video_info.video_cover_url"
                                />
                                </div>
                                <div class="material-name" :title="item.materil_name">
                                    {{ item.materil_name }}
                                </div>
                                <template #actions>
                                    <a-checkbox 
                                        :value="item.material_id"
                                        @change="MaterialListMethod.load.select_img_fun(item)"
                                        class="font_size_12" 
                                    ></a-checkbox>
                                    <a href="#" class="font_size_12" @click="showChildvideoDrawer(item)">
                                        详情
                                    </a>
                                    <a href="#" class="font_size_12" @click="MaterialListMethod.del.del_open(item)">
                                        删除
                                    </a>
                                    <a href="#" class="font_size_12" @click="MaterialListMethod.del.RecycleBin_open(item)">
                                        回收
                                    </a>
                                </template>
                            </a-card>

                        </template>

                    </a-list>
                </a-checkbox-group>
                
                </div>


                <!-- 翻页 -->
                <a-layout-footer class="footerStyle">

                    <a-row>

                        <a-col :span="12" style="text-align: left;">
                            
                            <p class="font_size_12" style="padding: 6px 0 0 0;">

                                <a-space>

                                    <a-checkbox v-model:checked="MaterialListMethod.SelectMaterial.checked_status.value" @change="MaterialListMethod.load.onCheckAllChange">全选</a-checkbox>
                                    <a-tag :bordered="false">
                                        <PictureOutlined /> 
                                        已选
                                        {{ PAGEDATA.confirm_img_list.length }}
                                        张
                                    </a-tag>

                                    <a-button type="dashed" 
                                        size="small"
                                        class="font_size_12" 
                                        @click="MaterialListMethod.load.clear_confirm_img_list">
                                        <ClearOutlined />清空
                                    </a-button>
                                    <a-button type="dashed" 
                                        size="small"
                                        class="font_size_12" 
                                        @click="MaterialListMethod.del.BatchDel">
                                        批量删除
                                    </a-button>
                                    <a-button type="dashed" 
                                        size="small"
                                        class="font_size_12" 
                                        @click="MaterialListMethod.del.BatchMovetoRecycleBin">
                                        批量回收
                                    </a-button>

                                </a-space>
                            </p>
                        </a-col>

                        <a-col :span="12">
                            <nav_pagination :fandata="PAGEDATA" v-on:complete="MaterialListMethod.page_turning"/>
                        </a-col>

                    </a-row>
                </a-layout-footer>

            </a-layout-content>

        </a-layout>
            
    </a-layout>


    <!--图片详情 抽屉 -->
    <a-drawer v-model:open="childimgDrawer" title="图片详情" width="520" :closable="false">

        <div v-if="Material_Images.image_detaile !== undefined">

            <!--图片信息-->
            <p>所属文件夹ID：{{ Material_Images.image_detaile.value.folder_id }}</p>
            <p>素材ID：
                <a-typography-paragraph :copyable="{ text: Material_Images.image_detaile.value.material_id }" style="display: inline-block; margin: 0;">
                    {{ Material_Images.image_detaile.value.material_id }}
                </a-typography-paragraph>
            </P>
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
    <a-drawer v-model:open="childvideoDrawer" title="视频详情" width="520" :closable="false">

        <div v-if="Material_Images.video_detaile.value !== undefined">
        <!--视频信息-->
            <p>所属文件夹ID：{{ Material_Images.video_detaile.value.folder_id }}</p>
            <p>素材ID：
                <a-typography-paragraph :copyable="{ text: Material_Images.video_detaile.value.material_id }" style="display: inline-block; margin: 0;">
                    {{ Material_Images.video_detaile.value.material_id }}
                </a-typography-paragraph>
            </P>
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

    <!--删除确认 弹出层 开始-->
    <a-modal v-model:open="MaterialListMethod.del.delOpenStatus.value" 
        title="是否确认删除？"
        okText="彻底删除"
        :centered="true"
        :confirm-loading="MaterialListMethod.del.buttonload.value"
        @ok="MaterialListMethod.del.del_material_ids"
    >
    <p style="margin: 10px 0 0 0;color:blue;font-weight: bold;margin-top: 20px;">注意：删除成功后1-2分钟后生效。</p>
        <p style="margin: 10px 0 0 0;">素材删除后将无法恢复！</p>
    </a-modal>
    <!--删除确认 弹出层 结束-->

    <!--回收确认 弹出层 开始-->
    <a-modal 
        v-model:open="MaterialListMethod.del.RecycleBinOpenStatus.value" 
        title="是否确认回收素材?"
        okText="确认回收"
        :centered="true"
        :confirm-loading="MaterialListMethod.del.RecycleBinbuttonload.value"
        @ok="MaterialListMethod.del.MovetoRecycleBin_ids"
    >
        <p style="margin: 10px 0 0 0;color:blue;font-weight: bold;margin-top: 20px;">注意：回收成功后1-2分钟后生效。</p>
        <p style="margin: 10px 0 0 0;"> 素材将放入回收站，耐心等待后刷新查看。</p>

    </a-modal>
    <!--回收确认 弹出层 结束-->

    <!-- id查询-图片结果-抽屉 开始 -->
    <a-drawer v-model:open="PAGEDATA.queryimage" title="图片详情" width="400" :closable="true">

        <div v-if="PAGEDATA.seach_photo == undefined" class="image_content_" style="height: 100%;">
            <a-spin />
        </div>
        <div v-else style="word-break: break-all;width: 100%;height: 100%;">
            <p>素材ID：{{ PAGEDATA.seach_photo.material_id }}</p>
            <p>所属文件夹ID：{{ PAGEDATA.seach_photo.folder_id }}</p>
            <p>素材源地址：{{ PAGEDATA.seach_photo.origin_url }}</p>
            <p>素材类型：{{ PAGEDATA.seach_photo.material_type }}</p>
            <p>状态：{{ PAGEDATA.seach_photo.operate_status }}</p>
            <p>审核状态：{{ PAGEDATA.seach_photo.audit_status }}</p>
            <p>审核失败原因：{{ PAGEDATA.seach_photo.audit_reject_desc }}</p>
            <p>文件大小：{{ PAGEDATA.seach_photo.size }} kb</p>
            <p>素材名称：{{ PAGEDATA.seach_photo.materil_name }}</p>
            <p>素材地址：{{ PAGEDATA.seach_photo.byte_url }}</p>
            <p>图片信息</p>
            <p>长：{{ PAGEDATA.seach_photo.photo_info.width }} px</p>
            <p>宽：{{ PAGEDATA.seach_photo.photo_info.height }} px</p>
            <p>图片格式：{{ PAGEDATA.seach_photo.photo_info.format }}</p>
            <p>创建时间：{{ PAGEDATA.seach_photo.create_time }}</p>
            <p>更新时间：{{ PAGEDATA.seach_photo.update_time }}</p>
            <img :src="PAGEDATA.seach_photo.byte_url" width="100%"></img>
        </div>

    </a-drawer>
    <!-- id查询-图片结果-抽屉 结束 -->

    <!-- id查询-视频结果-抽屉 开始 -->
    <a-drawer v-model:open="PAGEDATA.queryvideo" title="视频详情" width="400" :closable="true">
        <div v-if="PAGEDATA.seach_video == undefined">
            <a-spin />
        </div>
        <div v-else style="word-break: break-all;width: 100%;height: 100%;">
            <p>视频素材</p>
            <p>素材ID：{{ PAGEDATA.seach_video.material_id }}</p>
            <p>所属文件夹ID：{{ PAGEDATA.seach_video.folder_id }}</p>
            <p>素材名称：{{ PAGEDATA.seach_video.materil_name }}</p>
            <p>素材地址：{{ PAGEDATA.seach_video.origin_url }}</p>
            <p>素材类型：{{ PAGEDATA.seach_video.material_type }}</p>
            <p>状态：{{ PAGEDATA.seach_video.operate_status }}</p>
            <p>审核状态：{{ PAGEDATA.seach_video.audit_status }}</p>
            <p>审核失败原因：{{ PAGEDATA.seach_video.audit_reject_desc }}</p>
            <p>文件大小：{{ PAGEDATA.seach_video.size }} kb</p>
            <p>素材名称：{{ PAGEDATA.seach_video.materil_name }}</p>
            <p>素材地址：{{ PAGEDATA.seach_video.byte_url }}</p>
            <p>图片信息</p>
            <p>长：{{ PAGEDATA.seach_video.video_info.width }} px</p>
            <p>宽：{{ PAGEDATA.seach_video.video_info.height }} px</p>
            <p>图片格式：{{ PAGEDATA.seach_video.video_info.format }}</p>
            <p>创建时间：{{ PAGEDATA.seach_video.create_time }}</p>
            <p>更新时间：{{ PAGEDATA.seach_video.update_time }}</p>
            <video
                :key="PAGEDATA.seach_video.material_id"
                controls
                preload="metadata"
                width="100%"
            >
                <source :src="PAGEDATA.seach_video.origin_url" type="video/mp4">
                您的浏览器不支持视频播放。
            </video>
        </div>
    </a-drawer>
    <!-- id查询-视频结果-抽屉 结束 -->

    <!-- 关键词结果-抽屉 开始 -->
    <keywordseach_components :data="keywordSeachConfig"/>
    <!-- 关键词结果-抽屉 结束 -->

    <!-- 网络图片上传组件 -->
    <networkimageupload_components ref="networkUploadRef" :treeData="PAGEDATA.treeData" @uploadSuccess="handleUploadSuccess" />

    <!-- 本地图片上传组件 -->
    <localimageupload_components ref="localUploadRef" />
    
    <!--批量删除 确认弹窗-->
    <a-modal 
        v-model:open="MaterialListMethod.del.BatchDelOpenStatus.value" 
        title="是否确认批量删除素材?"
        okText="彻底删除"
        :centered="true"
        :confirm-loading="MaterialListMethod.del.BatchDelButtonload.value"
        @ok="MaterialListMethod.del.BatchDel_material_ids"
    >
    <p style="margin: 10px 0 0 0;color:blue;font-weight: bold;margin-top: 20px;">注意：批量删除成功后1-2分钟后生效。</p>
        <p style="margin: 10px 0 0 0;">批量删除后将无法恢复！</p>
    </a-modal>
    <!--批量删除 确认弹窗 结束-->

    <!--批量恢复 确认弹窗 开始-->
    <a-modal 
        v-model:open="MaterialListMethod.del.BatchMovetoRecycleBinOpenStatus.value" 
        title="是否确认批量回收素材?"
        okText="确认回收"
        :centered="true"
        :confirm-loading="MaterialListMethod.del.BatchMovetoRecycleBinButtonload.value"
        @ok="MaterialListMethod.del.BatchRecover_material_ids"
    >
        <p style="margin: 10px 0 0 0;color:blue;font-weight: bold;margin-top: 20px;">注意：批量回收成功后1-2分钟后生效。</p>
        <p style="margin: 10px 0 0 0;">批量回收后素材将放入回收站，耐心等待后刷新查看。</p>
    </a-modal>
    <!--批量恢复 确认弹窗 结束-->

</template>
<script>
import { defineAsyncComponent,computed,ref,reactive,onMounted,h,onUnmounted,watch } from 'vue';
import{Empty, message} from 'ant-design-vue'

import { useStore } from 'vuex'
// 网络请求工具引用FolderOutlined
import { FolderOutlined,CloseCircleOutlined,ClearOutlined,EyeOutlined,DownOutlined,FolderOpenOutlined,DeleteOutlined,PictureOutlined,PlaySquareOutlined} from '@ant-design/icons-vue';
import * as TOOL from '@/assets/JS_Model/tool';
import * as utils from '@/assets/JS_Model/public_model';
import * as MaterialList from '@/assets/douyinshop/productmanagement/material_list';// 商品管理->编辑操作方法

// 组件引用=====开始
import menu_left from '@/components/layout/menu_left.vue'
import menu_head from "@/components/layout/menu_head.vue";
import nav_pagination from "@/components/nav_pagination.vue";

export default {
    name:'materiallist',
    components:{
        menu_left,
        menu_head,
        nav_pagination,
        FolderOutlined,
        EyeOutlined,
        ClearOutlined,
        CloseCircleOutlined,
        DownOutlined,
        FolderOpenOutlined,
        DeleteOutlined,
        PictureOutlined,
        PlaySquareOutlined,
        // 网络图片上传组件
        networkimageupload_components: defineAsyncComponent(() => import('@/components/AppMarket/materialmanage/NetWorkImageUpload.vue')),
        // 本地图片上传组件
        localimageupload_components: defineAsyncComponent(() => import('@/components/AppMarket/materialmanage/LoaclImageUpload.vue')),
        // 关键词搜索组件
        keywordseach_components: defineAsyncComponent(() => import('@/components/AppMarket/materialmanage/KeyWordSeach.vue')),

   },
props: {
   data:{typr:Object}
},
setup(props,ctx) {

    const store = useStore();           // 共享数据
    const tool = new TOOL.TOOL()        // 工具方法
    const API = new utils.A_Patch()     // 请求接口地址合集
    const MaterialListMethod = new MaterialList.MaterialListMethod() // 加载数据方法

    // 组件挂之后---请求数据===============================开始
    const PAGEDATA = reactive({

        title:'素材列表',
        menudata:{      // 菜单选中配置
            'key':'115',
            'openKeys':'cloudstorage',
            },
        loading:true,         // 列表load状态
        justify:'center',     // 列表内容对齐：loading加载居中设定
        align:'center',       // 列表内容对齐：loading加载居中设定
        innerHeight: ref(window.innerHeight - 180), // 初始化列表高度
        innerWidth: ref(window.innerWidth - 230), // 初始化列表高度
        
        datalist:[],// 列表信息
        total_number:0,     // 内容总数
        List_conditions:ref({page:1}),// 翻页-当前页数
        childrenDrawer:ref(false),// 本地上传图片-抽屉状态
        childnetDrawer:ref(false),// 网络上传图片-抽屉状态
        BreadCrumb:ref([// 面包屑导航
            {
                "folder_name":"素材库",
                "folder_id":0
            }
        ]),

        check_value:ref([]),

        // 配置网络图片地址上传组件状态
        // 配置本地文件上传组件状态
        expandedKeys:[],                       // 展开指定的树节点
        selectedKeys:[],                       // 选中的节点树
        treeData:[],

        // 已选图片素材数据列表
        confirm_img_list:ref([]),

        // 网盘信息
        netdisk_info:0,

        //****查询条件-素材id查询、关键词查询 */开始 // 
        queryimage:false,// 查询结果-图片-抽屉状态
        queryvideo:false,// 查询结果-视频-抽屉状态
        querykeyword:false,// 查询结果-关键词-抽屉状态

        seach_photo:ref(undefined),// 查询结果-图片详情
        seach_video:ref(undefined),// 查询结果-视频详情
        seach_keyword:ref(undefined),// 查询结果-关键词详情
        //****查询条件-素材id查询、关键词查询 */结束 // 
    })

    // 关键词查询配置
    const keywordSeachConfig = reactive({
        keyword:ref(''),// 查询关键词
        open:false,// 抽屉状态
    })

    MaterialListMethod.PAGEDATA = PAGEDATA; // 页面数据加载到脚本文件
    MaterialListMethod.keywordSeachConfig = keywordSeachConfig; // 关键词搜索配置加载到脚本文件

    MaterialListMethod.load.getdiskusage();// 网盘使用占比

    const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE;   // 默认为空的图标
    const childimgDrawer = ref(false);                  // 图片详情状态
    const childvideoDrawer = ref(false);                // 视频详情状态

    const networkUploadRef = ref(null);                 // 网络图片上传组件 ref
    const localUploadRef = ref(null);                   // 本地图片上传组件 ref

    // 网络图片上传成功回调
    const handleUploadSuccess = () => {
        // 刷新当前文件夹素材列表
        MaterialListMethod.load.loadproductData(MaterialListMethod.navData.value);
    };

    // 在组件挂载时添加事件监听器
    onMounted(() => {
        window.addEventListener('resize', handleResize);// 窗口变换时候
    });

    // 定义一个函数来处理窗口大小变化 ==
    const handleResize = () => {
      PAGEDATA.innerHeight = window.innerHeight - 180; // 作为表格自适应高度
      PAGEDATA.innerWidth = window.innerWidth - 230; // 作为表格自适应高度

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
            // console.log(Material_Images.video_detaile.value)
        }else{ // 清空详情内容
            // Material_Images.video_detaile.value = undefined;
        }
    };


    // 图片素材管理
    const Material_Images = {
        image_detaile:ref(undefined),// 图片详情
        video_detaile:ref(undefined),// 视频详情
    }

    MaterialListMethod.load.Loadtree()    // 初始化素材菜单

    // 【查询组件 回调方法】========================================结束



       return{
        PAGEDATA,
        store,
        MaterialListMethod, // 外部js方法
        childimgDrawer,
        childvideoDrawer,
        showChildimgDrawer,
        showChildvideoDrawer,
        Material_Images,
        simpleImage,
        handleResize,
        networkUploadRef,
        localUploadRef,
        keywordSeachConfig,
        handleUploadSuccess

       }
   }
}
</script>
<style scoped>
.box-left{background-color: white;height: 100%;overflow-y:auto;width: 100%;white-space:nowrap;padding: 0 6px;}
.headerStyle{text-align: left;background-color: #fff;height: 64px;line-height: 64px;}
.contentStyle{text-align: center;background-color: #fff;height: 100%;}
.footerStyle{text-align: center;background-color: #fff;padding: 0;}
.confimImg{text-align: left;padding: 10px 0 10px 0;margin: 0 0 10px 0;height:300px;width: 100%;overflow-x: auto;overflow-y: auto;border-bottom: 1px #f2f2f2 solid;}
.confimbox{width: 60px;height: 60px;margin: 10px 20px 30px 20px;padding: 4px; float: left;border: 1px #f2f2f2 solid;border-radius: 4px;text-align: center;}
.Listimgbox{border: 1px solid #f2f2f2; border-radius: 6px;padding: 10px 4px 4px 4px;text-align: center;}
.video_list_box{padding: 6px 0 0 0;margin: 4px 0 0 0;width: 100%;height: 28px;overflow: hidden;text-align: left;text-align: center;}
.img_list_box{padding: 2px;margin: 4px 0 0 0;width: 100%;height: 28px;overflow: hidden;text-align: left;}
.sucai_url{width: 90%;font-size:12px;background-color: #f2f2f2;padding: 6px;border-radius: 4px;margin: 0 0 20px 0;}
.ant-list{height: 100%  !important;width: 100% !important;}/**暂无数据垂直居中**/
.card_style{margin:0px 10px 10px 0;font-size: 12px;text-align: center;}
.image_content_{height: 100px;width: 100px;margin: 0 auto;display: flex;
  justify-content: center;  /* 水平居中 */
  align-items: center;      /* 垂直居中 */}
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