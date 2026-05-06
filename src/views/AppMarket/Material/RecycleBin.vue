<!-- 回收站 -->
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


            <!-- 回收站内容区域 开始 -->
            <a-layout-content class="content_border">

                <!-- 筛选条件 开始 -->
                <div :style="{
                    width: '100%',
                    height:'42px',
                    backgroundColor:'#f2f2f2',
                    borderRadius:'4px',
                    overflow:'hidden',
                }">
                    <a-row>
                        
                        <a-col :span="24" style="padding:6px 6px 0 10px;">
                            <a-space>
                                <a-input 
                                    type="text" 
                                    placeholder="输入素材ID"
                                    v-model:value="RecycleBinMethod.filterForm.material_id"
                                    autoComplete="off"
                                    style="width: 160px;"
                                />
                                <a-input 
                                    type="text" 
                                    placeholder="输入素材名称"
                                    v-model:value="RecycleBinMethod.filterForm.name"
                                    autoComplete="off"
                                    style="width: 160px;"
                                />

                                <a-button 
                                    type="primary" 
                                    size="small"
                                    @click="RecycleBinMethod.list.handleFilter"
                                >查询</a-button>
                                <a-button 
                                    size="small"
                                    @click="RecycleBinMethod.list.resethandle"
                                >重置</a-button>
                            </a-space>
                        </a-col>
                    </a-row>
                </div>
                <!-- 筛选条件 结束 -->


                <!-- 回收站素材列表 开始 -->
                <div :style="{
                    height: PAGEDATA.innerHeight + 'px',
                    overflowY:'auto',
                    overflowX:'hidden',
                    marginTop:'10px',
                    marginBottom:'10px',
                    padding:'10px 0 0 10px'
                }"
                >
                    <a-checkbox-group v-model:value="RecycleBinMethod.check_value.value" style="width: 100%;height: 100%;">
                    <a-list 
                        :grid="{ gutter: 16, column: 5 }"
                        size="default"
                        :data-source="PAGEDATA.datalist"
                        :loading="PAGEDATA.loading"
                         style="width: 100%;height: 100%;"
                    >
                        <template #renderItem="{ item }">

                            <!--图片 显示方式-->
                            <a-card v-if="item.material_type == 'photo'" size="small" class="card_style" hoverable>
                                <div class="floating-badge"><PictureOutlined /> 图片</div>

                                <div class="image_content_">
                                    <a-image
                                        :style="RecycleBinMethod.load.material_width(item.photoInfo)"
                                        :src="item.byte_url"
                                    />
                                    
                                </div>
                                <div class="material-name" :title="item.materil_name">
                                    {{ item.material_name }}
                                </div>
                                <template #actions>
                                    <a-checkbox 
                                        :value="item.material_id"
                                        @change="RecycleBinMethod.list.select_img_fun(item)"
                                    ></a-checkbox>
                                    <a href="#" class="font_size_12" @click="showDetail(item)">详情</a>
                                    <a href="#" class="font_size_12" @click="RecycleBinMethod.ConfirmRecoverMaterial(item)">恢复</a>
                                    <a href="#" class="font_size_12" @click="RecycleBinMethod.ConfirmDleteMaterial(item)">删除</a>

                                </template>
                            </a-card>

                            <!--视频 显示方式-->
                            <a-card v-else-if="item.material_type == 'video'" size="small" class="card_style" hoverable>
                                
                                <div class="floating-badge-video"><PlaySquareOutlined />视频</div>

                                <div class="image_content_">
                                <a-image
                                    :style="RecycleBinMethod.load.video_cover_width(item)"
                                    :src="item.videoInfo.video_cover_url"
                                />
                                </div>
                                <div class="material-name" :title="item.materil_name">
                                    
                                    {{ item.material_name }}

                                </div>
                                <template #actions>
                                    <a-checkbox 
                                        :value="item.material_id"
                                        @change="RecycleBinMethod.list.select_img_fun(item)"
                                        class="font_size_12" 
                                    ></a-checkbox>
                                    <a href="#" class="font_size_12" @click="showChildvideoDrawer(item)">
                                        详情
                                    </a>
                                    <a href="#" class="font_size_12" @click="RecycleBinMethod.ConfirmRecoverMaterial(item)">恢复</a>

                                    <a href="#" class="font_size_12" @click="RecycleBinMethod.ConfirmDleteMaterial(item)">
                                        删除
                                    </a>
                                </template>
                            </a-card>

                        </template>
                    </a-list>
                    </a-checkbox-group>
                </div>
                <!-- 回收站素材列表 结束 -->


                <!-- 底部翻页 开始 -->
                <a-layout-footer class="footerStyle">
                    <a-row>
                        <a-col :span="10" style="text-align: left;">
                            <p class="font_size_12" style="padding: 6px 0 0 20px;">
                                <a-space>
                                    <a-checkbox 
                                        v-model:checked="RecycleBinMethod.checked_status.value"
                                        @change="RecycleBinMethod.list.onCheckAllChange"
                                    >
                                     全选</a-checkbox>

                                    <a-tag :bordered="false">
                                        <PictureOutlined /> 
                                        已选 {{ RecycleBinMethod.confirm_img_list.value.length }} 条
                                    </a-tag>
                                    <a-button type="dashed" size="small" @click="RecycleBinMethod.list.clear_confirm_img_list">
                                        清空
                                    </a-button>
                                    <a-button type="dashed" size="small" @click="RecycleBinMethod.ConfirmBatchDeleteMaterial">
                                        批量删除
                                    </a-button>
                                    <a-button type="dashed" size="small" @click="RecycleBinMethod.ConfirmBatchRecoverMaterial">
                                        批量恢复
                                    </a-button>
                                </a-space>
                            </p>
                        </a-col>
                        <a-col :span="14">
                            <nav_pagination :fandata="PAGEDATA" v-on:complete="RecycleBinMethod.page_turning"/>
                        </a-col>
                    </a-row>
                </a-layout-footer>
                <!-- 底部翻页 结束 -->

            </a-layout-content>
            <!-- 回收站内容区域 结束 -->

        </a-layout>
            
    </a-layout>


    <!-- 详情查看 抽屉 开始 -->
    <a-drawer v-model:open="detailDrawer" title="素材详情" width="520" :closable="false">
        <div v-if="currentItem">
            <p>素材ID：{{ currentItem.material_id }}</p>
            <p>素材名称：{{ currentItem.materil_name }}</p>
            <p>素材类型：{{ currentItem.material_type === 'photo' ? '图片' : '视频' }}</p>
            <p>文件夹状态：回收站中</p>
            <p>文件大小：{{ currentItem.size }} kb</p>
            <p>删除时间：{{ currentItem.delete_time }}</p>
            <p>创建时间：{{ currentItem.create_time }}</p>
            <div style="margin: 10px 0 10px 0;">
                <p>素材预览：</p>
                <img width="200" :src="currentItem.byte_url" />
            </div>
        </div>
        <a-button size="small" @click="detailDrawer = false">关闭</a-button>
    </a-drawer>
    <!-- 详情查看 抽屉 结束 -->

    <!-- 删除确认 弹出层 开始-->
    <a-modal 
        v-model:open="PAGEDATA.DeleteModalVisible" 
        title="是否确认彻底删除?"
        :centered="true"
        okText="彻底删除"
        @ok="RecycleBinMethod.DelMaterial"
        :confirm-loading="PAGEDATA.DeleteButtonVisible"
    >
        <p style="margin: 10px 0 0 0;color:blue;font-weight: bold;margin-top: 20px;">注意：删除操作1-2分钟后生效。</p>
        <p style="margin: 10px 0 0 0; color: #ff4d4f;">彻底删除后将无法恢复！</p>
    </a-modal>
    <!-- 删除确认 弹出层 结束-->

    <!-- 恢复 弹出层 开始-->
    <a-modal 
        v-model:open="PAGEDATA.RecoverModalVisible" 
        title="是否确认恢复素材？"
        :centered="true"
        okText="确认恢复"
        @ok="RecycleBinMethod.RecoverMaterial"
        :confirm-loading="PAGEDATA.RecoverButtonVisible"
    >
        <p style="margin: 10px 0 0 0;color:blue;font-weight: bold;margin-top: 20px;">注意：恢复操作1-2分钟后生效。</p>
        <p style="margin: 10px 0 0 0;">恢复素材后请在原有文件夹中查看！</p>
    </a-modal>
    <!-- 恢复 弹出层 结束-->

    <!--批量 删除 弹出层-->
    <a-modal 
        v-model:open="PAGEDATA.BatchDeleteModalVisible" 
        title="是否确认批量彻底删除？"
        :centered="true"
        okText="批量彻底删除"
        @ok="RecycleBinMethod.BatchDelMaterial"
        :confirm-loading="PAGEDATA.BatchDeleteButtonVisible"
    >
        <p style="margin: 10px 0 0 0;color:blue;font-weight: bold;margin-top: 20px;">注意：批量删除操作1-2分钟后生效。</p>
        <p style="margin: 10px 0 0 0; color: #ff4d4f;">批量彻底删除后将无法恢复！</p>
    </a-modal>

    <!--批量 恢复 弹出层-->
    <a-modal 
        v-model:open="PAGEDATA.BatchRecoverModalVisible" 
        title="是否确认批量恢复素材？"
        :centered="true"
        okText="确认批量恢复"
        @ok="RecycleBinMethod.BatchRecoverMaterial"
        :confirm-loading="PAGEDATA.BatchRecoverButtonVisible"
    >
        <p style="margin: 10px 0 0 0;color:blue;font-weight: bold;margin-top: 20px;">注意：批量恢复操作1-2分钟后生效。</p>
        <p style="margin: 10px 0 0 0;">批量恢复素材后请在原有文件夹中查看！</p>
    </a-modal>

</template>

<script>
import { ref, reactive, onMounted, computed } from 'vue';
import { useStore } from 'vuex';
import { DeleteOutlined, FolderOpenOutlined,PictureOutlined,PlaySquareOutlined } from '@ant-design/icons-vue';
import * as MaterialList from '@/assets/douyinshop/productmanagement/material_list';// 商品管理->编辑操作方法

// 组件引用 开始
import menu_left from '@/components/layout/menu_left.vue';
import menu_head from "@/components/layout/menu_head.vue";
import nav_pagination from "@/components/nav_pagination.vue";

// 组件引用 结束

export default {
    name: 'RecycleBin',
    components: {
        menu_left,
        menu_head,
        DeleteOutlined,
        FolderOpenOutlined,
        PictureOutlined,
        PlaySquareOutlined,
        nav_pagination
        },
    setup() {

        const store = useStore();
        const RecycleBinMethod = new MaterialList.RecycleBinMethod() // 加载数据方法

        // 页面数据
        const PAGEDATA = reactive({
            title: '回收站',
            innerHeight: ref(window.innerHeight - 180),
            menudata: {
                'key': '116',
                'openKeys': 'cloudstorage',
            },
            loading: true,
            datalist:[],// 列表信息
            total_number:0,     // 内容总数
            List_conditions:ref({page:1}),// 翻页-当前页数
            page: 1,
            pageSize: 10,
            DeleteModalVisible:false,// 确认单个删除弹窗状态
            DeleteButtonVisible: false,// 删除按钮状态
            RecoverModalVisible: false,// 确认单个恢复弹窗状态
            RecoverButtonVisible: false,// 回收按钮状态
            // 恢复按钮状态
            BatchDeleteModalVisible: false,// 确认批量删除弹窗状态
            BatchDeleteButtonVisible: false,// 批量删除按钮状态
            BatchRecoverModalVisible: false,// 确认批量恢复弹窗状态
            BatchRecoverButtonVisible: false,// 批量恢复按钮状态
        });

        RecycleBinMethod.PAGEDATA = PAGEDATA; // 页面数据加载到脚本文件
        RecycleBinMethod.load.getmaterialData(RecycleBinMethod.navData.value)






        // 详情抽屉
        const detailDrawer = ref(false);
        const currentItem = ref(null);
        const showDetail = (item) => {
            currentItem.value = item;
            detailDrawer.value = true;
        };





        // 窗口大小变化
        const handleResize = () => {
            PAGEDATA.innerHeight = window.innerHeight - 180;
        };

        onMounted(() => {
            window.addEventListener('resize', handleResize);
        });

        return {
            store,
            PAGEDATA,
            RecycleBinMethod,
            detailDrawer,
            currentItem,
            showDetail,
        };
    }
};
</script>

<style scoped>
.content_border {
    padding: 10px;
    background-color: #fff;
}
.footerStyle {
    text-align: center;
    background-color: #fff;
    padding: 0;
}
.font_size_12 {
    font-size: 12px;
}
.card_style{margin:0px 10px 10px 0;font-size: 12px;text-align: center;}
.image_content_ {
    height: 100px;
    width: 100px;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
}
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
.ant-list {
    height: 100% !important;
}
.floating-badge {background-color: black;color: #fff;height: 20px;position: absolute;z-index: 100;border-radius: 4px;padding: 0 4px;font-size: 12px;opacity: 0.5}
.floating-badge-video {background-color:blue;color: #fff;height: 20px;position: absolute;z-index: 100;border-radius: 4px;padding: 0 4px;font-size: 12px;opacity: 0.5}

</style>
