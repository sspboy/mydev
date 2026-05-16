<!-- 商品详情 组件 -->

<template>

     <a-float-button @click="handlebottomClick" />

    <!--尺码模板-->
    <template_detaile_components v-if="size_detaile.open" :data="size_detaile"/>
    <!--运费模板-->
    <feight_detaile_components v-if="freight_detaile.FreightDate" :data="freight_detaile"/>

    <a-modal
      v-model:open="props.data.DetaileDate"
      width="100%"
      wrap-class-name="full-modal"
    >



    <a-layout-content class="content">

        <div style="width: 950px;margin: 0 auto;">
               
            <!--头图 标题-->
            <div>
                <a-row>
                    <a-col :span="16"  style="background-color: aliceblue;border-radius: 6px;">
                        <div v-if="productdata.obj.name !== undefined" style="width: 100px;height:100px;float: left;margin: 20px;">
                            <a-image :src="productdata.obj.img" alt="" style="width: 100%;height: 100%;border-radius: 6px;" />
                        </div>
                        <div v-if="productdata.obj.name === undefined" style="width: 100px;height: 100px;float: left;margin: 20px;text-align: center;border-radius: 6px;">
                            <a-skeleton-image style="width: 100px;height: 100px;" active />
                        </div>
                        <div  style="width: 100%;margin: 30px 0 0 0;">
                            
                            <p v-if="productdata.obj.name !== undefined" style="margin:10px 0 10px 0;padding: 0;">
                                <a-row>
                                    <a-col :span="3">
                                        主标题： 
                                    </a-col>
                                    <a-col :span="21">
                                        {{ productdata.obj.name }}
                                    </a-col>
                                </a-row>
                            </p>
                            <p v-if="productdata.obj.name === undefined" style="margin: 0;padding: 0;">
                                    <a-row>
                                    <a-col :span="3">
                                        主标题： 
                                    </a-col>
                                    <a-col :span="21">
                                        <a-skeleton :title="false" :paragraph="{ rows: 1}" active/>
                                    </a-col>
                                </a-row>
                            </p>

                            <p v-if="productdata.obj.short_product_name !== undefined" style="margin: 0 0 12px 0;padding: 0;">
                                <a-row>
                                    <a-col :span="3">
                                        短标题： 
                                    </a-col>
                                    <a-col :span="21">
                                        {{ Profun.Field_translation.short_product_name(productdata.obj.short_product_name) }}
                                    </a-col>
                                </a-row>
                            </p>
                            <p v-if="productdata.obj.short_product_name === undefined" style="margin: 0;padding: 0;">
                                    <a-row>
                                        <a-col :span="3">
                                            短标题： 
                                        </a-col>
                                        <a-col :span="21">
                                            <a-skeleton :title="false" :paragraph="{ rows: 1}" style="width: 70%;" active/>
                                        </a-col>
                                </a-row>
                            </p>

                            <p style="height: 24px;width: 100%;margin: 0;padding: 0;">
                                <a-row justify="start">
                                    <a-col :span="3">划线价:</a-col>
                                    <a-col :span="4">
                                        <span v-if="productdata.obj.market_price === undefined">
                                            <a-skeleton :title="false" :paragraph="{ rows: 1}" active/>
                                        </span>
                                        <span v-if="productdata.obj.market_price !== undefined">
                                            <a-typography-text delete>￥{{ productdata.obj.market_price * 0.01 }}</a-typography-text>
                                        </span>
                                    </a-col>
                                    <a-col :span="2"><span>售卖价</span></a-col>
                                    <a-col :span="4">
                                        <span v-if="productdata.obj.discount_price === undefined">
                                            <a-skeleton :title="false" :paragraph="{ rows: 1}" active/>
                                        </span>
                                        <span v-if="productdata.obj.discount_price !== undefined">￥{{ productdata.obj.discount_price * 0.01 }}</span>
                                    </a-col>

                                    <a-col :span="2"><span>销量</span></a-col>
                                    <a-col :span="4">
                                        <span v-if="productdata.obj.sell_num === undefined">
                                            <a-skeleton :title="false" :paragraph="{ rows: 1}" active/>
                                        </span>
                                        <span v-if="productdata.obj.sell_num !== undefined">{{ productdata.obj.sell_num }}</span>
                                    </a-col>
                                </a-row>
                            </p>

                        </div>
                    </a-col>

                    <a-col :span="7" :offset="1" style="background-color: aliceblue;border-radius: 6px;">

                        <div class="zhenduan">

                            <div v-if="productdata.obj.check_status === undefined" style="text-align: center;padding: 50px 0 0 0">
                                <a-spin tip="Loading...">
                                </a-spin>
                            </div>

                            <div v-if="productdata.obj.check_status === 1" style="text-align: center;border-radius: 6px;padding:20px 0 0 0;">
                                <div class="check_ico"><InfoCircleTwoTone /></div>
                                <p>商品待提交</p>
                            </div>

                            <div v-if="productdata.obj.check_status === 2" style="text-align: center;border-radius: 6px;padding:20px 0 0 0;">
                                <div class="check_ico"><ClockCircleTwoTone /></div>
                                <p>商品待审核</p>
                            </div>
                            
                            <div v-if="productdata.obj.check_status === 3" style="text-align: center;padding:6px 0 0 0;">
                                <div class="check_ico"><CheckCircleTwoTone /></div>
                                <p style="margin: 0;padding: 0;">审核通过 <a href="#" @click="showDrawer">查看优化建议</a></p>
                                <p style="margin: 0;padding: 0;"><a-rate :value="fen.value" disabled /></p>
                            </div>

                            <div v-if="productdata.obj.check_status === 4" style="text-align: center;padding:20px 0 0 0;">
                                <div class="check_ico"><CloseCircleTwoTone /></div>
                                <p>审核未通过 <a href="#" @click="showreject">查看驳回原因</a></p>
                            </div>

                            <div v-if="productdata.obj.check_status === 5" style="text-align: center;padding:20px 0 0 0;">
                                <div class="check_ico"><WarningTwoTone /></div>
                                <p>封禁 <a href="#" @click="showreject">查看驳回原因</a></p>
                            </div>

                            <div v-if="productdata.obj.check_status === 7" style="padding: 20px 0 0 0;text-align: center;">
                                <div class="check_ico"><UpSquareTwoTone /></div>
                                审核通过待上架
                            </div>
                        </div>
                        <!--提示错误，-->
                    </a-col>
                </a-row>
            </div>

            <!--图片：主图、白底图、视频、长图3:4、主图3:4-->
            <a-divider orientation="left" orientation-margin="0px">主图&视频</a-divider>

            <div class="top_img_box">

                <!---img-->
                <div style="height: 140px;float: left;margin: 0 10px 0 0;">
                    
                    <h5>商品主图</h5>

                    <div v-if="productdata.obj.pic === undefined">
                        <a-space>
                            <a-skeleton-avatar :size="94" active shape="square"/>
                            <a-skeleton-avatar :size="94" active shape="square"/>
                            <a-skeleton-avatar :size="94" active shape="square"/>
                            <a-skeleton-avatar :size="94" active shape="square"/>
                            <a-skeleton-avatar :size="94" active shape="square"/>
                        </a-space>
                    </div>

                    <div v-else-if="productdata.obj.pic !== undefined">
                        <a-image-preview-group>
                            <a-space>
                                <div v-for="img in productdata.obj.pic" :key="img.index">
                                    <p class="img_80"><a-image :src="img" :width="80" style="border-radius: 6px;"/></p>
                                </div>
                            </a-space>
                        </a-image-preview-group>
                    </div>
                </div>

                <!--white_back_ground_pic_url 白底图 视频-->
                <div style="height: 120px;float: left;">
                    <div style="width: 90px;margin: 0 16px 0 0;float: left;">
                        <div v-if="productdata.obj.white_back_ground_pic_url === undefined">
                            <h5 class="text_center">白底图</h5>
                            <a-skeleton-avatar :size="94" active shape="square" style="margin: 0 4px 0 0;"/>
                        </div>
                        <div v-else-if="productdata.obj.white_back_ground_pic_url === null">
                            <h5 class="text_center">白底图</h5>
                            <p class="img_80 text_center_12 cursor">暂无</p>
                        </div>
                        <div v-else-if="productdata.obj.white_back_ground_pic_url !== null">
                            <h5 class="text_center">白底图</h5>
                            <p class="img_80 cursor"><a-image :width="80" style="border-radius: 6px;" :src="productdata.obj.white_back_ground_pic_url"/></p>
                        </div>
                    </div>

                    <div style="width: 90px;float: left;">
                        <div v-if="productdata.obj.material_video_id === undefined">
                            <h5 class="text_center">视频</h5>
                            <a-skeleton-avatar :size="94" active shape="square" />
                        </div>
                        <div v-else-if="productdata.obj.material_video_id === null">
                            <h5 class="text_center">视频</h5>
                            <p class="img_80 text_center_12 cursor">暂无</p>
                        </div>
                        <div v-else>
                            <h5 class="text_center">视频</h5>
                            <p class="img_80 cursor">
                                <a :href="videoData.url" target="_blank">
                                    <img :src="videoData.img_src" style="width: 80px;height: 80px;"/>
                                </a>
                            </p>
                        </div>
                    </div>
                </div>

                
                <div style="height: 120px;float: left;width: 100%;clear: both;">
                    <a-row>
                            
                        <!--商品主图3:4 main_image_three_to_four-->
                        <a-col :span="14">
                            
                            <div style="margin-bottom: 4px;">3:4主图</div>
                            <a-list :grid="{ gutter:1, column: 5 }" :data-source="pic_3_4.list">
                                <template #renderItem="{ item }">
                                    <a-list-item style="padding: 0;margin: 0;">
                                    <div v-if="item.url === undefined" class="img_loading_3_4 text_center_12 cursor">暂无</div>
                                    <div v-else class="img_loading_3_4">
                                        <a-image :src="item.url" :width="80" style="border-radius: 6px;" />
                                    </div>
                                    </a-list-item>
                                </template>
                            </a-list>
                        </a-col>

                    </a-row>

                </div>

            </div>

            <a-divider orientation="left" orientation-margin="0px">基本信息</a-divider>

            <div style="height: 240px;width: 100%;">
                <a-row :gutter="[16,24]">
                            <a-col :span="6">
                                <span v-if="productdata.obj.product_id === undefined">
                                    <a-skeleton :title="false" :paragraph="{ rows: 1}" class="skelestlye" active/>
                                </span>
                                <span v-else-if="productdata.obj.product_id !== undefined">
                                    商品ID：{{ productdata.obj.product_id }}
                                </span>
                            </a-col>
                            <a-col :span="6">
                                <span v-if="productdata.obj.out_product_id === undefined">
                                    <a-skeleton :title="false" :paragraph="{ rows: 1}" class="skelestlye" active/>
                                </span>
                                <span v-else-if="productdata.obj.out_product_id !== '0'" class="basestyle">
                                    外部商家编码：{{ productdata.obj.out_product_id }}
                                </span>
                                <span v-else-if="productdata.obj.out_product_id === '0'" class="basestyle">
                                    外部商家编码：暂无
                                </span>
                            </a-col>
                            <a-col :span="6">
                                <span v-if="productdata.obj.product_type === undefined">
                                    <a-skeleton :title="false" :paragraph="{ rows: 1}" class="skelestlye" active/>
                                </span>
                                <span v-else-if="productdata.obj.product_type !== undefined" class="basestyle">
                                    商品类型：{{ Profun.Field_translation.product_type_info(productdata.obj.product_type) }}
                                </span>
                            </a-col>
                            <a-col :span="6">
                                <span v-if="productdata.obj.status === undefined">
                                    <a-skeleton :title="false" :paragraph="{ rows: 1}" class="skelestlye" active/>
                                </span>
                                <span v-else-if="productdata.obj.status !== undefined" class="basestyle">
                                    商品状态：{{ Profun.Field_translation.product_status(productdata.obj.status ) }}
                                </span>
                            </a-col>
                            <a-col :span="6">
                                <span v-if="productdata.obj.check_status === undefined">
                                    <a-skeleton :title="false" :paragraph="{ rows: 1}" class="skelestlye" active/>
                                </span>
                                <span v-else-if="productdata.obj.check_status !== undefined" class="basestyle">
                                    审核状态：{{ Profun.Field_translation.product_check_status_info(productdata.obj.check_status) }}
                                </span>
                            </a-col>
                            <a-col :span="6">
                                <span v-if="productdata.obj.draft_status === undefined">
                                    <a-skeleton :title="false" :paragraph="{ rows: 1}" class="skelestlye" active/>
                                </span>
                                <span v-else-if="productdata.obj.draft_status !== undefined" class="basestyle">
                                    草稿状态：{{ Profun.Field_translation.product_draft_status_info(productdata.obj.draft_status) }}
                                </span>
                            </a-col>
                            <a-col :span="6">
                                <span v-if="productdata.obj.sell_channel === undefined">
                                    <a-skeleton :title="false" :paragraph="{ rows: 1}" class="skelestlye" active/>
                                </span>
                                <span v-else-if="productdata.obj.sell_channel !== undefined" class="basestyle">
                                    售卖方式：{{ Profun.Field_translation.product_sale_type_info(productdata.obj.sell_channel) }}
                                </span>
                            </a-col>
                            <a-col :span="6">
                                <span v-if="productdata.obj.reduce_type === undefined">
                                    <a-skeleton :title="false" :paragraph="{ rows: 1}" class="skelestlye" active/>
                                </span>
                                <span v-else-if="productdata.obj.reduce_type !== undefined" class="basestyle">
                                    库存扣减方式：{{ Profun.Field_translation.product_reduce_type(productdata.obj.reduce_type) }}
                                </span>
                            </a-col>
                            <a-col :span="6">
                                <span v-if="productdata.obj.after_sale_service_v2 === undefined">
                                    <a-skeleton :title="false" :paragraph="{ rows: 1}" class="skelestlye" active/>
                                </span>
                                <span v-else-if="productdata.obj.after_sale_service_v2 !== undefined" class="basestyle">
                                    售后服务：{{ Profun.Field_translation.product_after_sale_service_v2(productdata.obj.after_sale_service_v2) }}
                                </span>
                            </a-col>
                            <a-col :span="6">
                                <span v-if="productdata.obj.after_sale_service === undefined">
                                    <a-skeleton :title="false" :paragraph="{ rows: 1}" class="skelestlye" active/>
                                </span>
                                <span v-else-if="productdata.obj.after_sale_service !== undefined" class="basestyle">
                                    <a-typography-text
                                        :style="{ width: '200px', fontSize: '12px' }"
                                        :ellipsis="true"
                                        :content="'7天无理由：' + Profun.Field_translation.product_after_sale_service(productdata.obj.after_sale_service)"
                                    />
                                </span>
                            </a-col>
                            <a-col :span="6">
                                <span v-if="productdata.obj.freight_id === undefined">
                                    <a-skeleton :title="false" :paragraph="{ rows: 1}" class="skelestlye" active/>
                                </span>
                                <span v-else-if="productdata.obj.freight_id === 0" class="basestyle">
                                    运费模版：包邮
                                </span>
                                <span v-else-if="productdata.obj.freight_id !== 0 && productdata.obj.freight_id !== undefined" class="basestyle">
                                    运费模版：<a href="#" @click="freight_detaile.play">查看 </a> {{ productdata.obj.freight_id }}
                                </span>
                            </a-col>
                            
                            <a-col :span="6">
                                <span v-if="productdata.obj.size_info_template_id === undefined">
                                    <a-skeleton :title="false" :paragraph="{ rows: 1}" class="skelestlye" active/>
                                </span>
                                <span v-else-if="productdata.obj.size_info_template_id === null" class="basestyle">
                                    尺码模板：暂无
                                </span>
                                <span v-else-if="productdata.obj.size_info_template_id === 'None'" class="basestyle">
                                    尺码模板：暂无
                                </span>
                                <span v-else-if="size_detaile.data !== undefined" class="basestyle">
                                    <a-typography-text
                                    :style="{ width: '180px', fontSize: '12px'}"
                                    :ellipsis="true"
                                    :content="'尺码模板：'+ size_detaile.data.component_template_info_list[0].template_name"
                                    />
                                    <a href="#" @click="size_detaile.play">查看</a>
                                    
                                </span>
                            </a-col>

                            <a-col :span="6">
                                <span v-if="productdata.obj.standard_brand_id === undefined">
                                    <a-skeleton :title="false" :paragraph="{ rows: 1}" class="skelestlye" active/>
                                </span>
                                <span v-else-if="productdata.obj.standard_brand_id === 596120136" class="basestyle">品牌：无品牌</span>
                                <span v-else-if="productdata.obj.standard_brand_id !== 596120136 && productdata.obj.standard_brand_id !== undefined" class="basestyle">
                                    品牌：{{ brand_detaile.data }}
                                </span>
                                <span v-else>
                                    品牌：暂无
                                </span>
                            </a-col>

                            <a-col :span="6">
                                <span v-if="productdata.obj.pickup_method === undefined">
                                    <a-skeleton :title="false" :paragraph="{ rows: 1}" class="skelestlye" active/>
                                </span>
                                <span v-else-if="productdata.obj.pickup_method !== undefined" class="basestyle">
                                    提取方式：{{ Profun.Field_translation.product_pickup_method(productdata.obj.pickup_method) }}
                                </span>
                            </a-col>

                            <!-- <a-col :span="6">
                                <div style="height: 24px;width: 100%;">重量 </div>
                                <div v-if="productdata.obj.weight_value === undefined">
                                    <a-skeleton :title="false" :paragraph="{ rows: 1}" class="skelestlye" active/>
                                </div>
                                <div v-if="productdata.obj.weight_value !== undefined" class="basestyle">
                                    {{ productdata.obj.weight_value }} {{ Profun.Field_translation.product_weight_unit(productdata.obj.weight_unit) }}
                                </div>
                            </a-col> -->

                            <a-col :span="6">
                                <span v-if="productdata.obj.create_time === undefined">
                                    <a-skeleton :title="false" :paragraph="{ rows: 1}" class="skelestlye" active/>
                                </span>
                                <span v-else class="basestyle">创建时间：{{ productdata.obj.create_time }}</span>
                            </a-col>

                            <a-col :span="6">
                                <span v-if="productdata.obj.update_time === undefined">
                                    <a-skeleton :title="false" :paragraph="{ rows: 1}" class="skelestlye" active/>
                                </span>
                                <span v-else class="basestyle">更新时间：{{ productdata.obj.update_time }}</span>
                            </a-col>
                            <a-col :span="6">
                                <span v-if="productdata.obj.minimum_per_order === undefined">
                                    <a-skeleton :title="false" :paragraph="{ rows: 1}" class="skelestlye" active/>
                                </span>
                                <span v-else class="basestyle">最小购买数量：{{ productdata.obj.minimum_per_order }} 件</span>
                            </a-col>
                            <a-col :span="6">
                                <span v-if="productdata.obj.maximum_per_order === undefined">
                                    <a-skeleton :title="false" :paragraph="{ rows: 1}" class="skelestlye" active/>
                                </span>
                                <span v-else class="basestyle">最大购买数量：{{ productdata.obj.maximum_per_order }} 件</span>
                            </a-col>
                            <a-col :span="6">
                                <span v-if="productdata.obj.limit_per_buyer === undefined">
                                    <a-skeleton :title="false" :paragraph="{ rows: 1}" class="skelestlye" active/>
                                </span>
                                <span v-else class="basestyle">单用户累计限购件数：{{ productdata.obj.limit_per_buyer }} 件</span>
                            </a-col>
                            
                </a-row>
            </div>

            <a-divider orientation="left" orientation-margin="0px">规格库存</a-divider>

            <div style="width: 100%;margin:0 0 50px 0;">

                <a-row :gutter="[16,16]">

                    <a-col :span="24">

                        <div v-for="(item,index) in productdata.obj.specs" :key="index" style="width: 100%;margin: 0 0 10px 0;clear:both;">

                            <p>{{ item.name }}</p>

                            <div class="font_size_12 specbox" v-for="(val,index) in item.values" :key="index">
                                
                                <span v-for="(val2,index2) in productdata.obj.spec_pics" :key="index2" >
                                    <a-image v-if="val2.spec_detail_id == val.id" :width="50" :height="50" style="margin: 0 5px 0 0;" :src="API.AppSrtoreAPI.meiuri + val2.pic"/>
                                </span>

                                <span>{{ val.name }}</span>

                            </div>

                        </div>

                    </a-col>

                    <a-col :span="24">

                        <a-table 
                            :columns="columns" 
                            :data-source="data" 
                            size="small" 
                            :pagination="false"
                            style="font-size:12px;width: 100%;"
                            bordered
                            >
                                <template #bodyCell="{ column, text }">
                                    <template v-if="column.dataIndex === 'price'">
                                        <span >￥ {{ text }}</span>
                                    </template>
                                </template>
                            </a-table>
                    </a-col>
                </a-row>
            </div>

            <a-divider orientation="left" orientation-margin="0px">类目&属性</a-divider>
            <div style="width: 100%;margin:0 0 50px 0;">
                <h5>商品类目：{{ cate_name }}</h5>

                <a-row :gutter="[0,16]" style="margin: 20px 0 0 0;" v-if="productdata.obj.product_format_new !== undefined">

                  <a-col :span="6" v-for="(item,index) in JSON.parse(productdata.obj.product_format_new)" :key="index">
                    {{ item[0].PropertyName }}：{{ item[0].Name }}
                </a-col>
                </a-row>
            </div>

            <a-divider orientation="left" orientation-margin="0px">描述详情</a-divider>
            <div style="width: 100%;float: left;">
                <div class="desbox">
                    <div v-html="productdata.obj.description" style="margin: 40px 0 40px 0;"></div>
                </div>
            </div>

        </div>
    </a-layout-content>


    <!-- 自定义 footer，只放一个按钮 -->
    <template #footer>

      <a-button type="default" @click="close">关闭</a-button>

    </template>
    </a-modal>

    <!--质量分 可优化 抽屉-->
    <a-drawer
        v-model:open="fen.open"
        class="custom-class"
        root-class-name="root-class-name"
        :root-style="{ color: 'blue' }"
        size="large"
        style="color: #666"
        title="质量分可优化建议"
        placement="right"
    >
        <div v-if="fen.field_problem_list !== undefined">

            <p style="margin: 0 0 30px 0 ;">质量{{ fen.value }}分： <a-rate :value="fen.value" disabled /></p>

            <div v-for="(item,index) in fen.field_problem_list" :key="index" style="font-size: 12px;border: 1px silver solid; border-radius: 6px;padding: 14px;margin:10px 0;">
                <p style="padding: 6px 0 0 0;font-weight: bold;font-size: 14px;">{{ item.field_name }} - {{ item.problem_name }}</p>
                <p style="line-height: 26px;">{{ item.suggestion }}</p>
            </div>

        </div>

    </a-drawer>


    <!--审核驳回 驳回原因 抽屉-->
    <a-drawer
        v-model:open="reject_info.open"
        class="custom-class"
        root-class-name="root-class-name"
        :root-style="{ color: 'blue' }"
        size="large"
        title="驳回原因"
        placement="right"
    >
        <div v-if="reject_info.records_list !== undefined">

            <div v-for="(item,index) in reject_info.records_list" :key="index">
                
                <div class="rejectinfo">

                    <p style="font-size: 14px;">驳回字段：{{ item.title }}-{{ item.type }}</p>

                    <div v-for="(val,index) in item.reject_reason_list" :key="index">

                            <div v-if="item.type == 'description_pic'">

                                <p v-html="val.reason_text" style="font-size: 12px;line-height: 28px;"></p>
                                <a-space align="end" :size="10" wrap>

                                <span v-for="(img,index) in val.reject_img_list" :key="index">
                                    <a-image :src="img.url" width="100px" height="100px"></a-image>
                                </span>
                                </a-space>

                            </div>

                            <div v-else-if="item.type == 'name'">
                                <p v-html="val.reason_text" style="font-size: 12px;line-height: 28px;" ></p>
                            </div>
                            
                            <div v-else-if="item.type == 'product_pic'">
                                <p v-html="val.reason_text" style="font-size: 12px;line-height: 28px;"></p>
                                <a-space align="end" :size="10">
                                <span v-for="(img,index) in val.reject_img_list" :key="index">
                                    <a-image :src="img.url" width="100px" height="100px"></a-image>
                                </span>
                                </a-space>
                            </div>

                            <div v-else-if="item.type == 'product_format'">
                                <p v-html="val.reason_text" style="font-size: 12px;line-height: 28px;"></p>
                            </div>

                            <div v-else>
                                <p v-html="val.reason_text" style="font-size: 12px;line-height: 28px;"></p>
                            </div>

                    </div>

                </div>

            </div>
            
        </div>
    </a-drawer>

</template>
<script>
import { defineComponent,defineAsyncComponent,ref,reactive,onMounted,h } from 'vue';
import {LoadingOutlined,CheckCircleTwoTone,InfoCircleTwoTone,UpSquareTwoTone,WarningTwoTone,ClockCircleTwoTone,CloseCircleTwoTone} from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';

// 网络请求工具引用
import * as TOOL from '@/assets/JS_Model/tool';
import * as utils from '@/assets/JS_Model/public_model';
import * as PL from '@/assets/douyinshop/ProductList';
// 视频组件

export default defineComponent({

    name: "detaile",  // 筛选条件查询组件
    

    // 引用组件
    components: {
        LoadingOutlined,
        CheckCircleTwoTone,
        InfoCircleTwoTone,
        UpSquareTwoTone,
        WarningTwoTone,
        ClockCircleTwoTone,
        CloseCircleTwoTone,
        // 尺码模板
        template_detaile_components:defineAsyncComponent(() => import('@/components/AppMarket/Douyinshop/templateSize/templatedetaile.vue')),
        // 运费模板
        feight_detaile_components:defineAsyncComponent(() => import('@/components/AppMarket/Douyinshop/productDetaile/feightdetaile.vue')),


    },

    // 父组件数据
    props: {

        data:{typr:Object}
  
    },
    
    setup(props, ctx) {

        const tool = new TOOL.TOOL()            // 工具方法
        const API = new utils.A_Patch()         // 请求接口地址合集
        const Profun = new PL.ProductList_fun() // 商品列表方法model引用
        
        // 商品详情
        const productdata = reactive({
            obj:ref({}),
        })

        // 商品主图
        const pic_main = (data)=>{}

        // 商品3:4主图数据处理
        const pic_3_4 = reactive({
            list:[{},{},{},{},{}],
        })

        // 商品长图long_image_url
        const pic_long_url = reactive({
            list:[{},{},{},{},{}],
        })

        // 质量分
        const fen =reactive({
            value: ref(0),                      // 默认分值
            field_problem_list:ref(undefined),  // 可优化项目
            open:ref(false)
        })

        // 查看质量分可优化建议
        const showDrawer = () => {
            fen.open = true;
        };

        // 审核驳回
        const reject_info = reactive({
            records_list:ref(undefined), // 驳回原因列表 
            open:ref(false)
        })

        // 查看审核驳回
        const showreject = () => {
            reject_info.open = true;
            console.log(reject_info.records_list)
        };

        // 商品视频
        const videoData = reactive({
            img_src:ref(undefined), // 封面地址
            url:ref(undefined),     // 视频播放地址
            // 新开页面
            play:()=>{
                window.open(videoData.url,"_blank")
                console.log(videoData.url)
            }
        })

        // 运费详情
        const freight_detaile = reactive({
            FreightDate:ref(false),// 运费详情抽屉显示
            freight_id:ref(null),// 运费模板id
            play:()=>{
                freight_detaile.FreightDate = true;
                freight_detaile.freight_id = productdata.obj.freight_id;
            }
        })

        // 尺码详情
        const size_detaile = reactive({
            open:ref(false),
            data:ref(undefined),
            play:()=>{
                size_detaile.open = true
            }
        })

        // 品牌详情
        const brand_detaile = reactive({
            open:ref(false),
            data:ref(undefined),
            play:()=>{
                brand_detaile.open = true
            }
        })

        // 类目
        const cate_name = ref(undefined)

        
        // 库存列表
        const columns = ref([])
        const data = ref([])


        // 请求商品详情信息
        onMounted(()=>{
            
            // 请求详情信息
            tool.Http_.post(API.AppSrtoreAPI.dou_product.detaile, {

                product_id:props.data.product_id,
                show_draft:"false"

            }).then((responese)=>{

                setTimeout(()=>{

                    // console.log('运费模板id',responese.data.data.freight_id)
                    load_get_brand(responese.data.data.standard_brand_id)   // 品牌
                    load_get_video(responese.data.data.material_video_id)   // 视频
                    load_get_size(responese.data.data.size_info_template_id)// 尺码
                    load_cate_format(responese.data.data) // 类目&属性
                    load_pic_3_4(responese.data.data) // 3:4主图
                    // console.log('资质',responese.data.data.quality_list)

                    // 规格库存-表头、内容
                    const spec_res_obj = load_spec(responese.data.data)
                    columns.value = spec_res_obj.column  // 表头
                    data.value = spec_res_obj.data // 列表内容

                    productdata.obj = responese.data.data
                    console.log('商品详情',productdata.obj)


                },1000)
            
            })

            // 审核结果：被驳回的原因 audit
            tool.Http_.post(API.AppSrtoreAPI.dou_product.audit, {
                product_id:props.data.product_id,
                publish_status:2, //0-审核中 1-审核通过 2-审核拒绝
                page:0,
                size:10
            }).then((res)=>{
                if(res.data.data.total > 0){reject_info.records_list = res.data.data.records[0].audit_reason_details}
            })

            // 质量分(审核通过才又质量分)
            tool.Http_.post(API.AppSrtoreAPI.dou_product.qualitydetaile, {
                product_id:props.data.product_id,
            }).then((res)=>{
                fen.value = res.data.data.quality_score.score
                fen.field_problem_list = [...res.data.data.field_problem]
            })

            // 品牌查询
            const load_get_brand=(b_id)=>{
                if(b_id !== undefined && b_id !== null){
                    tool.Http_.post(API.AppSrtoreAPI.dou_product.brand, {
                        brand_ids:[b_id]
                    }).then((res)=>{
                        console.log('品牌',b_id,res.data.data.brand_list)
                        var name_cn = res.data.data.brand_list[0].name_cn;
                        var name_en = res.data.data.brand_list[0].name_en;;
                        brand_detaile.data = name_cn + ' ' + name_en
                    })
                }
            }

            // 视频查询
            const load_get_video=(v_id)=>{
                if(v_id !== undefined && v_id !== null){
                    tool.Http_.post(API.AppSrtoreAPI.material.videolist, {
                        vid_list:[v_id]
                    }).then((res)=>{
                        console.log('视频',res.data.data)
                        videoData.img_src = res.data.data.success_map[v_id].VideoCoverUrl
                        videoData.url = res.data.data.success_map[v_id].MainUrl
                    })
                }
            }

            // 尺码模板查询
            const load_get_size=(s_id)=>{

                if(s_id !== undefined && s_id !== null && s_id !== 'None'){
                    tool.Http_.post(API.AppSrtoreAPI.size.list, {
                        template_type:"size_info",
                        page_num:0,
                        page_size:10,
                        template_id:s_id
                    }).then((res)=>{
                        size_detaile.data = res.data.data
                    })
                }
            }


            // 规格转移-规格图片、规格、库存列表
            const load_spec=(data)=>{

                var res_obj = {}
                
                var column_list = []
                var sell_p = data.spec_prices[0].sell_properties

                for(let i=0;i<sell_p.length;i++){
                    column_list.push({
                        title:sell_p[i].property_name,
                        dataIndex:sell_p[i].property_name,
                    })
                }

                var c_obj = [...column_list,...[{
                    title:'价格',
                    dataIndex:'price',
                    align:'center',
                },{
                    title:'库存',
                    dataIndex:'stock_num',
                    align:'center'

                },{
                    title:'编码',
                    dataIndex:'code',
                }]]

                // 规格库存-内容
                var data_list = []

                var spec_obj = data.spec_prices
                for(let i=0;i<spec_obj.length;i++){
                    let o = {}
                    let r = spec_obj[i].sell_properties
                    for(let j of r){o[j.property_name] = j.value_name}
                    o.key = i;
                    o.price = Math.round(spec_obj[i].price * 0.01 * 100) / 100;
                    o.stock_num = spec_obj[i].stock_num;
                    o.code = spec_obj[i].code;
                    data_list.push(o)
                }

                res_obj.column = c_obj
                res_obj.data = data_list
                return res_obj
            }

            // 类目
            const load_cate_format=(data)=>{

                var category_detail = data.category_detail;
                let first_cname = category_detail.first_cname;
                let second_cname = category_detail.second_cname;
                let third_cname = category_detail.third_cname;
                let fourth_cname = category_detail.fourth_cname;
                let arr = [first_cname,second_cname,third_cname,fourth_cname] 
                let res_list = arr.filter(Boolean);
                
                var cate_test = ''
                for(let i of res_list){
                    cate_test = cate_test + i + '>'
                }

                cate_name.value = cate_test.slice(0,-1)

            }

            // 3:4 主图加载
            const load_pic_3_4=(data)=>{
                var pic_3_4_list = []
                if(data.main_pic_3_4 !== undefined){
                    for(let i of data.main_pic_3_4){
                        let o = {}
                        o.url = i
                        pic_3_4_list.push(o)
                    }
                }
                pic_3_4.list = pic_3_4_list
            }

        })

        // 关闭弹窗
        const close = e => {
            props.data.DetaileDate = false;
        };

        // 漂浮按钮
        const handlebottomClick = () =>{
            console.log('click')
        }


        return{
            API,
            Profun,
            productdata,
            props,
            close,
            fen,
            reject_info,
            showreject,
            showDrawer,
            pic_3_4,
            pic_long_url,
            videoData,
            size_detaile,
            freight_detaile,
            brand_detaile,
            cate_name,
            columns,
            data,
            handlebottomClick
        }
    }
})
</script>
<style scoped>
.content{padding: 0;margin: 20px 0 0 0;background: '#fff';overflow-y: auto;overflow-x: hidden;height: 88vh;}
.head_title_img{height: 140px;width: 100%;}
.zhenduan{width: 100%;height:140px;}
.top_img_box{height: 304px; width: 100%;}
.img_loading_3_4{width: 100px;height: 120px;border: 1px #f2f2f2 solid;text-align: center;border-radius: 6px;padding: 6px;}
.skelestlye{margin: 0;padding: 0;width: 100%;}
.basestyle{height: 30px;width: 100%;}
.desbox{width:100%;background-color: #333;padding: 10px;border-radius:6px;margin: 0 auto;text-align: center;}
.specbox{display: block;float: left;margin:0 10px 10px 0;text-align: center;margin:0 10px 10px 0;border: 1px solid #e8e8e8;border-radius: 6px;padding:10px;}
.check_ico{width: 100px;margin: 0 auto;font-size: 44px;text-align: center;}
.rejectinfo{padding:20px 10px 10px 20px;margin: 0 0 20px 0;}
.img_80{border-radius: 6px;border: 1px #f2f2f2 solid;padding: 6px;height: 94px;width: 94px;}
.img_107{height: 114px;width: 88px;border-radius: 6px;border: 1px #f2f2f2 solid;padding: 4px;}
.text_center_12{justify-content: center;display: flex;align-items: center;font-size: 12px;color: #e8e8e8;}/*文字垂直居中*/
.text_center{text-align: center;}

</style>