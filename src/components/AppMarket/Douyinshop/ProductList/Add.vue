<!-- 抖店铺==新建商品组件 -->
<template>

    <!-- 动态渲染异步组件--选择素材 -->
    <selectimg v-if="PAGEDATA.selectimg_open" v-on:add_img_callback="PAGEDATA.Add_Callback" :data="PAGEDATA"/>

    <!-- 动态渲染异步组件--选择运费模板 -->
    <selectFreightid v-if="PAGEDATA.freighttemplate_open" v-on:freight_callback="selectfreight_callback" :data="PAGEDATA"/>

    <!-- 动态渲染异步组件--选择尺码模板 -->
    <selectsizetemplateid v-if="PAGEDATA.sizetemplate_open" v-on:sizetemplate_callback="selectsizetemplate_callback" :data="PAGEDATA"/>

    <!--dynamic rendering asynchronous component--select brand template-->
    <selectbrandid v-if="PAGEDATA.brand_list_open" v-on:selectbrand_callback="selectbrand_callback" :data="PAGEDATA" :FormData="CATE"/>

    <a-modal
      v-model:open="props.data.AddDate"
      width="100%"
      wrap-class-name="full-modal"
      :footer="null"
    >
        <a-layout-content class="content">

            <div style="width: 950px;margin: 0 auto;height: 100%;">

                <a-tabs v-model:activeKey="activeKey" @change="refesh_stock_number(activeKey)">

                    <template #leftExtra >
                        <div style="margin: 0 40px 0 10px;font-size: 18px;font-weight: b;">新建商品</div>
                    </template>

                    <a-tab-pane key="1" tab="主图类目">
                        <!--基本信息-->
                        <a-row>
                            <!----主图--pic-->
                            <a-col :span="24">

                                <!-- <a-divider orientation="left" orientation-margin="0px">主图</a-divider> -->

                                <div style="width: 100%; height: 120px;margin: 20px 0 30px 0;">

                                    <p class="img_pic" v-for="(item,index) in Pic_Fun.PicList.value">

                                        <a-image :src="item.byte_url" />
                                        <!--图片尺寸不复合情况下-->

                                        <!--图片尺寸1：1情况下-->
                                        <span style="display:block;margin: 16px 0 0 0;width: 100%;text-align: center;">
                                            <a-button type="text" size="small" @click="Pic_Fun.del_pic(index)"> 
                                                <DeleteOutlined />
                                            </a-button>
                                        </span>

                                    </p>

                                    <!--添加按钮-->
                                    <p 
                                        @click="PAGEDATA.change_material_type('PicList')" 
                                        class="cursor Add_img"
                                        v-if="Pic_Fun.PicList.value.length < 5"
                                        >
                                        <a-flex justify="center" align="center" style="height: 100%;font-size: 12px;">
                                            +主图
                                        </a-flex>
                                    </p>

                                </div>

                            </a-col>

                        </a-row>



                        <div style="width: 100%;">

                            <a-form
                                ref="formRef"
                                name="ProductInfo"
                                :model="formState"
                                :rules="rules"
                            >
                                <a-row :gutter="[16,0]">

                                    <a-col :span="14">
                                        <a-form-item label="商品标题" name="name">
                                            <a-input v-model:value="formState.name" autoComplete="off" placeholder="输入商品标题" show-count :maxlength="30" />
                                        </a-form-item>
                                    </a-col>

                                    <!--非必填信息-->

                                    <a-col :span="10">
                                        <a-form-item
                                            label="导购标题"
                                            name="short_product_name"
                                        >
                                            <a-input v-model:value="formState.short_product_name" 
                                            autoComplete="off" 
                                            show-count :maxlength="24" 
                                            placeholder="输入商品导购短标题"
                                            />
                                        </a-form-item>
                                    </a-col>
                                    
                                </a-row>
                            </a-form>


                        <!--分类开始-->
                        <a-divider orientation="left" orientation-margin="0px">商品分类</a-divider>
                        <p style="margin-bottom: 30px;">
                            <a-button 
                                type="dashed" 
                                @click="CATE.Check_Cate(formState)"
                                :loading="CATE.predict_status.value"
                                >点击预测商品分类
                            </a-button>
                            <a-select 
                                ref="select"
                                v-model:value="CATE.cate_value.value" 
                                placeholder="请选择推荐类目" 
                                :disabled="CATE.select_loading.value"
                                :options="CATE.options.value"
                                @change="CATE.loadFormat"
                                style="width: 400px;margin-left: 10px;"
                            >
                            </a-select>
                            
                            <span style="margin-left:10px;font-size:12px;">
                                PS:需要填写【标题】、【主图】后获取系统推荐的类目、以及属性;
                            </span>

                        </p>


                        <!--属性开始-->
                        <a-divider orientation="left" orientation-margin="0px">
                            商品属性
                            <a-button 
                                type="dashed"
                                size="small"
                                style="margin-left: 10px;"
                                @click="CATE.Ceck_format"
                            >智能预测填充属性
                            </a-button>
                            <a-button 
                                type="dashed"
                                size="small"
                                style="margin-left: 10px;"
                                @click="CATE.Clear_format"
                            >清空属性
                            </a-button>
                        </a-divider>
                        
                        <a-form :ref="CATE.form_ref" :model="CATE.format_formRef">

                            <a-row v-if="CATE.format.value.length !== 0" loading="true" :gutter="[16,6]">
                                
                                <template v-for="item in CATE.format.value">

                                    <!--度量衡-多选-->
                                    <template v-if="item.type == 'multi_value_measure'">

                                         <a-col :span="24" style="margin-bottom: 10px;">
                                            
                                            <!-- 内层嵌套 row -->
                                             <p>面料材质 <span v-show="item.required ==1" style="color: red;">*必填</span></p>

                                            <a-row :gutter="[16,6]">
                                                
                                                <a-col :span="6">
                                                    <!-- 吊牌 开始-->
                                                    <!--洗水标上传 开始
                                                        available    是否可用	true-可用，false-不可用
                                                        required     是否必填	true-必填，false-选填
                                                    -->
                                                    <template v-if="item.property_pic_rule.available == true">

                                                        <div v-if="CATE.category_property_pics.value != undefined" class="cursor call_shui_img">
                                                            <a-image style="height:78px;" :src="CATE.category_property_pics.value"></a-image>
                                                            <span class="clear_shui_img">
                                                                <a-button type="text" size="small" @click="CATE.clear_img"> 
                                                                    <DeleteOutlined />
                                                                </a-button>
                                                            </span>
                                                        </div>

                                                        <!-- <p>水洗标/吊牌图</p> -->
                                                        <div class="cursor Add_shui_img" v-else-if="CATE.category_property_pics.value == undefined" 
                                                            @click="PAGEDATA.change_material_type('tag_img')"">
                                                            <a-flex justify="center" align="center" style="height: 100%;font-size: 12px;">
                                                            + 水洗标/吊牌
                                                            </a-flex>
                                                        </div>

                                                    </template>
                                                    <!--吊牌 结束-->
                                                </a-col>

                                                <!--多材质列表 开始-->
                                                <a-col :span="6" v-for="(olist, dIndex) in CATE.format_formRef[item.property_id]">

                                                    <a-form-item 
                                                        :name="[item.property_id, dIndex, 'value']"
                                                        :rules="[{ required: true, message: item.property_name + '不能为空！',trigger: 'change',}]"
                                                    >

                                                        <a-select
                                                            v-model:value="olist.value"
                                                            placeholder="请选择材质"
                                                            style="width: 100%"
                                                            allow-clear
                                                            show-search
                                                            :filter-option="filterOption"
                                                            :options="item.options"
                                                            :field-names="{
                                                                label: 'name',
                                                                value: 'value_id',
                                                            }"
                                                            @focus="CATE.material_change(CATE.format_formRef[item.property_id],item.options)"
                                                        >

                                                            <template #dropdownRender="{ menuNode: menu }">
                                                                <v-nodes :vnodes="menu" />
                                                                <a-divider style="margin: 4px 0" />
                                                                <a-space style="padding: 4px 8px">
                                                                <a-input ref="inputRef" 
                                                                    v-model:value="CATE.diy_name.value" 
                                                                    placeholder="自定义面料"
                                                                    autoComplete="off"
                                                                />
                                                                <a-button type="text" @click="CATE.addItem(item.options)">
                                                                    <template #icon><PlusOutlined /></template>添加
                                                                </a-button>
                                                                </a-space>
                                                            </template>

                                                        </a-select>

                                                    </a-form-item>

                                                    <a-form-item
                                                        :name="[item.property_id, dIndex, 'percentage']"
                                                        :rules="[{ required: true, message:'数值不能为空！',trigger: 'change',}]"
                                                    >
                                                        <a-space-compact block size="middle">
                                                            
                                                            <a-input-number
                                                                v-model:value="olist.percentage"
                                                                placeholder="输入百分比"
                                                                suffix="%"
                                                                :min="0"
                                                                :max="100"
                                                                addon-after="%"
                                                                style="width: 100%;"
                                                            ></a-input-number>

                                                            <!--删除按钮-->
                                                            <a-button
                                                                v-show="CATE.format_formRef[item.property_id].length > 1"
                                                                type="dashed"
                                                                style="margin-left: 10px;"
                                                                @click="CATE.material_del(dIndex,CATE.format_formRef[item.property_id])"
                                                            >删除</a-button>
                                                        </a-space-compact>

                                                    </a-form-item>

                                                </a-col>
                                                <!--多材质列表 结束-->

                                                <!--添加材质 开始-->
                                                <a-col :span="6">
                                                    <div class="cursor Add_shui_img" " 
                                                        @click="CATE.add_limit(CATE.format_formRef[item.property_id],item.multi_select_max)">
                                                        <a-flex justify="center" align="center" style="height: 100%;font-size: 12px;">
                                                        + 添加材质
                                                        </a-flex>
                                                    </div>
                                                </a-col>
                                                <!--添加材质 结束-->
                                            </a-row>
                                        </a-col>

                                    </template>

                                </template>

                                <!--必填属性-->

                                <!--非必填属性-->
                                <template v-for="item in CATE.format.value" >
                                    
                                    <!--文本-->
                                    <a-col :span="6" v-if="item.type == 'text'">
                                        <p>
                                            {{ item.property_name }}
                                            <span v-if="item.required ==1" style="color: red;">--必填</span>
                                        </p>
                                        
                                        <p v-if="item.required == 1">
                                            <a-form-item :name="item.property_id" :rules="[{ required: true, message: item.property_name + '不能为空！',trigger: 'change',}]">
                                                <a-input 
                                                    placeholder="请输入"
                                                    autoComplete="off"
                                                    v-model:value="CATE.format_formRef[item.property_id]"
                                                    allow-clear
                                                />
                                            </a-form-item>
                                        </p>
                                        <p v-else-if="item.required !== 1">
                                            <a-form-item :name="item.property_id">
                                            <a-input 
                                                placeholder="请输入"
                                                autoComplete="off"
                                                v-model:value="CATE.format_formRef[item.property_id]"
                                                allow-clear
                                            />
                                            </a-form-item>
                                        </p>
                                    </a-col>

                                    <!--单选-->
                                    <a-col :span="6" v-else-if="item.type == 'select'">

                                        <p>
                                            {{ item.property_name }}
                                            <span v-if="item.required ==1" style="color: red;">--必填</span>
                                        </p>

                                        <p v-if="item.required ==1">
                                            <a-form-item 
                                                :name="item.property_id" 
                                                :rules="[{ required: true, message: item.property_name + '不能为空！',trigger: 'change',}]"
                                            >
                                                <a-select
                                                    ref="select"
                                                    v-model:value="CATE.format_formRef[item.property_id]"
                                                    placeholder="请选择"
                                                    allow-clear
                                                    style="width: 120px;width: 100%;"
                                                >
                                                    <a-select-option v-for="opt in item.options" :value="opt.value_id" >
                                                        {{ opt.name }}
                                                    </a-select-option>
                                                    <template #dropdownRender="{ menuNode: menu }" v-if="item.diy_type==1">
                                                        <v-nodes :vnodes="menu" />
                                                        <a-divider style="margin: 4px 0" />
                                                        <a-space style="padding: 4px 8px">
                                                        <a-input ref="inputRef" 
                                                            v-model:value="CATE.diy_name.value" 
                                                            placeholder="自定义面料"
                                                            autoComplete="off"
                                                        />
                                                        <a-button type="text" @click="CATE.addItem(item.options)">
                                                            <template #icon><PlusOutlined /></template>添加
                                                        </a-button>
                                                        </a-space>
                                                    </template>
                                                </a-select>
                                            </a-form-item>
                                        </p>

                                        <p v-else-if="item.required !==1">
                                            <a-form-item :name="item.property_id">
                                                <a-select
                                                    ref="select"
                                                    v-model:value="CATE.format_formRef[item.property_id]"
                                                    placeholder="请选择"
                                                    allow-clear
                                                    style="width: 120px;width: 100%;"
                                                >
                                                    <a-select-option v-for="opt in item.options" :value="opt.value_id" >
                                                        {{ opt.name }}
                                                    </a-select-option>
                                                    <template #dropdownRender="{ menuNode: menu }" v-if="item.diy_type==1">
                                                        <v-nodes :vnodes="menu" />
                                                        <a-divider style="margin: 4px 0" />
                                                        <a-space style="padding: 4px 8px">
                                                        <a-input ref="inputRef" 
                                                            v-model:value="CATE.diy_name.value" 
                                                            placeholder="自定义面料"
                                                            autoComplete="off"
                                                        />
                                                        <a-button type="text" @click="CATE.addItem(item.options)">
                                                            <template #icon><PlusOutlined /></template>添加
                                                        </a-button>
                                                        </a-space>
                                                    </template>
                                                </a-select>
                                            </a-form-item>
                                        </p>
                                    </a-col>

                                    <!--多选-->
                                    <a-col :span="6" v-else-if="item.type == 'multi_select'">
                                        <p>
                                            {{ item.property_name }}
                                            <span v-if="item.required ==1" style="color: red;">--必填</span>
                                        </p>
                                        <p v-if="item.required == 1">

                                            <a-form-item :name="item.property_id" :rules="[{ required: true, message: item.property_name + '不能为空！',trigger: 'change',}]">

                                            <a-select
                                                ref="select"
                                                v-model:value="CATE.format_formRef[item.property_id]"
                                                placeholder="请选择"
                                                mode="multiple"
                                                :maxTagCount="1"
                                                allow-clear
                                                @change="CATE.dis_ops(item, CATE.format_formRef[item.property_id])"
                                                style="width: 120px;width: 100%;"
                                            >
                                                <a-select-option v-for="opt in item.options" :value="opt.value_id" :disabled="opt.disabled">
                                                    {{ opt.name }}
                                                </a-select-option>
                                                <template #dropdownRender="{ menuNode: menu }" v-if="item.diy_type==1">
                                                    <v-nodes :vnodes="menu" />
                                                    <a-divider style="margin: 4px 0" />
                                                    <a-space style="padding: 4px 8px">
                                                    <a-input ref="inputRef" 
                                                        v-model:value="CATE.diy_name.value" 
                                                        placeholder="自定义面料"
                                                        autoComplete="off"
                                                    />
                                                    <a-button type="text" @click="CATE.addItem(item.options)">
                                                        <template #icon><PlusOutlined /></template>添加
                                                    </a-button>
                                                    </a-space>
                                                </template>
                                            </a-select>
                                        </a-form-item>
                                        </p>
                                        <p v-if="item.required !==1">
                                            <a-form-item :name="item.property_id">
                                            <a-select
                                                ref="select"
                                                v-model:value="CATE.format_formRef[item.property_id]"
                                                placeholder="请选择"
                                                mode="multiple"
                                                :maxTagCount="1"
                                                allow-clear
                                                @change="CATE.dis_ops(item, CATE.format_formRef[item.property_id])"
                                                style="width: 120px;width: 100%;"
                                            >
                                                <a-select-option v-for="opt in item.options" :value="opt.value_id" :disabled="opt.disabled">
                                                    {{ opt.name }}
                                                </a-select-option>
                                                <template #dropdownRender="{ menuNode: menu }" v-if="item.diy_type==1">
                                                    <v-nodes :vnodes="menu" />
                                                    <a-divider style="margin: 4px 0" />
                                                    <a-space style="padding: 4px 8px">
                                                    <a-input ref="inputRef" 
                                                        v-model:value="CATE.diy_name.value" 
                                                        placeholder="自定义面料"
                                                        autoComplete="off"
                                                    />
                                                    <a-button type="text" @click="CATE.addItem(item.options)">
                                                        <template #icon><PlusOutlined /></template>添加
                                                    </a-button>
                                                    </a-space>
                                                </template>
                                            </a-select>
                                            </a-form-item>
                                        </p>
                                    </a-col>

                                    <!--度量衡 单选 measure 多值输入-->
                                    <a-col 
                                        v-else-if="item.type == 'measure' && item.measure_templates[0].value_modules.length>1" 
                                        :span="12">

                                        <p>
                                            {{ item.property_name }} 
                                            <span v-show="item.required ==1" style="color: red;">*必填</span>
                                        </p>

                                        <p v-if="item.required == 1">
                                            <a-space >

                                            <template v-for="(items, key) in CATE.format_formRef[item.property_id]">
                                                <a-form-item 
                                                    :name="[item.property_id, items.module_id, 'value']"
                                                    :rules="[{ required: true, message: item.property_name + '不能为空！',trigger: 'change',}]"
                                                    style="padding: 0;margin: 0;width: 100%"
                                                >
                                                    <a-input-number
                                                        v-model:value="items.value"
                                                        autoComplete="off"
                                                        :placeholder="'输入-'+ items.prefix"

                                                    >
                                                        <template  #addonAfter v-if="items.unit_id != undefined">
                                                            <a-select 
                                                            :options="items.op"
                                                            v-model:value="items.unit_id"
                                                            style="width: 60px;"
                                                            :field-names="{
                                                                label: 'unit_name',
                                                                value: 'unit_id',
                                                            }"
                                                            >
                                                            </a-select>
                                                        </template>
                                                    </a-input-number>
                                                </a-form-item>
                                            </template>
                                            </a-space>
                                        </p>

                                        <p v-else>

                                            <a-space >
                                            <template v-for="(items, key) in CATE.format_formRef[item.property_id]">
                                                <a-form-item 
                                                    :name="[item.property_id, items.module_id, 'value']"
                                                    style="padding: 0;margin: 0;width: 100%"
                                                >
                                                    <a-input-number
                                                        v-model:value="items.value"
                                                        autoComplete="off" 
                                                        :placeholder="'输入-'+ items.prefix"
                                                    >
                                                        <template  #addonAfter v-if="items.unit_id != undefined">
                                                            <a-select 
                                                            :options="items.op"
                                                            v-model:value="items.unit_id"
                                                            style="width: 60px;"
                                                            :field-names="{
                                                                label: 'unit_name',
                                                                value: 'unit_id',
                                                            }"
                                                            >
                                                            </a-select>
                                                        </template>
                                                </a-input-number>
                                                </a-form-item>
                                            </template>
                                            </a-space>
                                        </p>
                                    </a-col>

                                    <!--度量衡 单选 measure 单值输入-->
                                    <a-col 
                                        v-else-if="item.type == 'measure' && item.measure_templates[0].value_modules.length == 1" 
                                        :span="6">
                                        <p>
                                            {{ item.property_name }} 
                                            <span v-show="item.required ==1" style="color: red;">*必填</span>
                                        </p>

                                        <p v-if="item.required == 1"><!--迭代 多度量衡 输入值 必填-->

                                            <template v-for="(items,key) in CATE.format_formRef[item.property_id]">

                                                <a-form-item 
                                                    :name="[item.property_id, items.module_id, 'value']"
                                                    :rules="[{ required: true, message: item.property_name + '不能为空！',trigger: 'change',}]"
                                                >

                                                    <a-input-number
                                                        v-model:value="items.value" 
                                                        :placeholder="'输入-'"
                                                    >
                                                        <template  #addonAfter>
                                                            <a-select 
                                                            :options="items.op"
                                                            v-model:value="items.unit_id"
                                                            style="width: 60px;"
                                                            :field-names="{
                                                                label: 'unit_name',
                                                                value: 'unit_id',
                                                            }"
                                                            >
                                                            </a-select>
                                                        </template>
                                                    </a-input-number>
                                                
                                                </a-form-item>
                                                
                                            </template>
                                        </p>

                                        <p v-else><!--迭代 多度量衡 输入值 非必填-->

                                            <template v-for="(items,key) in CATE.format_formRef[item.property_id]">

                                                <a-form-item 
                                                    :name="[item.property_id, items.module_id, 'value']"
                                                >
                                                    <a-input-number
                                                        v-model:value="items.value" 
                                                        :placeholder="'输入-'"
                                                    >
                                                        <template  #addonAfter>
                                                            <a-select 
                                                            :options="items.op"
                                                            v-model:value="items.value"
                                                            style="width: 60px;"
                                                            :field-names="{
                                                                label: 'unit_name',
                                                                value: 'unit_id',
                                                            }"
                                                            >
                                                            </a-select>
                                                        </template>
                                                    </a-input-number>
                                                
                                                </a-form-item>
                                                
                                            </template>

                                        </p>

                                    </a-col>

                                    <!--时间戳-->
                                    <a-col :span="6" v-else-if="item.type == 'timestamp'">
                                        <p>
                                            {{ item.property_name }}
                                            <span v-if="item.required ==1" style="color: red;">--必填</span>
                                        </p>
                                    </a-col>

                                    <!--时间段-->
                                    <a-col :span="6" v-else-if="item.type == 'timerange'">
                                        <p>
                                            {{ item.property_name }}
                                            <span v-if="item.required ==1" style="color: red;">--必填</span>
                                        </p>
                                    </a-col>

                                </template>
                                
                            </a-row>

                            <p v-if="CATE.format.value.length == 0">
                                <a-empty :image="simpleImage" />
                            </p>

                        </a-form>

                        </div>

                    </a-tab-pane>

                    <a-tab-pane key="0" tab="基础信息">

                        <a-row>
                            <!--白底图 -- white_back_ground_pic_url -->
                            <a-col :span="4">
                                
                                <div style="width: 100%;height:120px;margin: 20px 0 0 0;">

                                    <p class="img_pic" v-for="item in whiteimg_Fun.PicList.value">

                                        <a-image :src="item.byte_url" />

                                        <span style="display:block;margin: 16px 0 0 0;width: 100%;text-align: center;">
                                            <a-button type="text" size="small" @click="whiteimg_Fun.del"> 
                                                <DeleteOutlined />
                                            </a-button>
                                        </span>
                                    </p>

                                    <!--添加按钮-->
                                    <p 
                                        @click="PAGEDATA.change_material_type('white_img')" 
                                        class="cursor Add_img"
                                        v-if="whiteimg_Fun.PicList.value < 1"
                                    >
                                        <a-flex justify="center" align="center" style="height: 100%;" class="font_size_12">
                                            + 白底图
                                        </a-flex>
                                    </p>

                                </div>

                            </a-col>

                            <!--视频 -- material_video_id -->
                            <a-col :span="4">

                                <div style="width: 100%;height:120px;margin: 20px 0 0 0;">

                                    <p class="img_3_4_pic" v-for="item in video_Fun.PicList.value">
                                        <a-image :height="80" :src="item.video_info.video_cover_url" />
                                        <span style="display:block;margin: 16px 0 0 0;width: 100%;text-align: center;">
                                            <a-button type="text" size="small" @click="video_Fun.del"> 
                                                <DeleteOutlined />
                                            </a-button>
                                        </span>
                                    </p>

                                    <!--添加按钮-->
                                    <p 
                                        @click="PAGEDATA.change_material_type('video_info')" 
                                        class="cursor Add_3_4_img font_size_12"
                                        v-if="video_Fun.PicList.value.length < 1"
                                    >
                                        <a-flex justify="center" align="center" style="height: 100%;" class="font_size_12">
                                            + 视频
                                        </a-flex>
                                    </p>
                                </div>
                            </a-col>

                            <!--3比4长图 -- long_pic_url -->
                            <a-col :span="16">
                                
                                <div style="width: 100%;height: 160px;margin: 20px 0 0 0;">

                                    <p class="img_3_4_pic" v-for="(item,index) in Longimg_Fun.PicList.value">
                                        
                                        <a-image :height="80" :src="item.byte_url" />

                                        <span style="display:block;margin: 16px 0 0 0;width: 100%;text-align: center;">
                                            <a-button type="text" size="small" @click="Longimg_Fun.del(index)"> 
                                                <DeleteOutlined />
                                            </a-button>
                                        </span>
                                    </p>


                                    <!--添加按钮-->
                                    <p 
                                        @click="PAGEDATA.change_material_type('long_img_List')" 
                                        class="cursor Add_3_4_img font_size_12"
                                        v-if="Longimg_Fun.PicList.value.length < 5"
                                    >
                                        <a-flex justify="center" align="center" style="height: 100%;" class="font_size_12">
                                            + 3:4长图
                                        </a-flex>
                                    </p>

                                </div>

                            </a-col>

                            

                        </a-row>

                        <!-- 基础信息 -->
                        <a-form
                        ref="formRef"
                        name="ProductInfo"
                        :model="formState"
                        :rules="rules"
                    >
                        <a-row :gutter="[16,0]">

                            <a-col :span="8">
                                <a-form-item 
                                    label="商品类型" 
                                    name="product_type"
                                >
                                    <a-select v-model:value="formState.product_type" placeholder="选择类型">
                                        <a-select-option value="0">普通</a-select-option>
                                        <a-select-option value="3">虚拟</a-select-option>
                                        <a-select-option value="3">玉石闪购</a-select-option>
                                        <a-select-option value="3">云闪购</a-select-option>
                                    </a-select>
                                </a-form-item>
                            </a-col>

                            <a-col :span="8">
                                <a-form-item 
                                    label="支付方式" 
                                    name="pay_type"
                                >
                                    <a-select v-model:value="formState.pay_type" placeholder="选择支付方式">
                                        <a-select-option value="0">货到付款</a-select-option>
                                        <a-select-option value="1">在线支付</a-select-option>
                                        <a-select-option value="2">货到付款+在线支付</a-select-option>
                                    </a-select>
                                </a-form-item>
                            </a-col>
                            
                            <a-col :span="8">
                                <a-form-item 
                                    label="库存类型" 
                                    name="reduce_type"
                                >
                                    <a-select v-model:value="formState.reduce_type" placeholder="选择方式">
                                        <a-select-option value="1">拍下减库存</a-select-option>
                                        <a-select-option value="2">付款减库存</a-select-option>
                                    </a-select>
                                </a-form-item>
                            </a-col>

                            <a-col :span="8">
                                <a-form-item
                                    label="客服电话"
                                    name="mobile"
                                >
                                    <a-input v-model:value="formState.mobile" placeholder="输入客服电话"/>
                                </a-form-item>
                            </a-col>

                            <a-col :span="8">
                                <a-form-item
                                    label="运费模板"
                                    name="freight_id"
                                >
                                    <a-input-group compact>
                                        <a-input v-model:value="formState.freight_id.name" placeholder="选择运费模板" disabled style="width: calc(74%);padding: 5.5px;" />
                                        <a-button class="font_size_12" @click="PAGEDATA.chang_freighttemplate">选择</a-button>
                                    </a-input-group>
                                </a-form-item>                                    
                            </a-col>

                            <a-col :span="8">
                                <a-form-item
                                    label="选择品牌"
                                    name="standard_brand_id"
                                >
                                  <a-input-group compact>
                                    <a-input v-model:value="formState.standard_brand_id.brand_name" placeholder="选择品牌" disabled style="width: calc(74%);padding: 5.5px;" />
                                    <a-button class="font_size_12" @click="PAGEDATA.change_brand_list">选择</a-button>
                                  </a-input-group>
                                </a-form-item>
                            </a-col>

                            <a-col :span="8">
                                <a-form-item
                                    label="推荐语"
                                    name="recommend_remark"
                                >
                                    <a-input v-model:value="formState.recommend_remark" 
                                    autoComplete="off" 
                                    show-count :maxlength="30" 
                                    placeholder="输入商品推荐语"
                                    />
                                </a-form-item>
                            </a-col>

                            <a-col :span="8">
                                <a-form-item
                                    label="商家备注"
                                    name="remark"
                                >
                                    <a-input v-model:value="formState.remark" autoComplete="off" placeholder="商家可见备注"  show-count :maxlength="30" />
                                </a-form-item>
                            </a-col>

                            <a-col :span="8">
                                <a-form-item
                                    label="尺码模板"
                                    name="size_info_template_id"
                                >
                                    <a-input-group compact>
                                        <a-input v-model:value="formState.size_info_template_id.name" placeholder="请选择尺码模板" disabled style="width: calc(74%);padding: 5.5px;" />
                                        <a-button @click="PAGEDATA.chang_sizetemplate">选择</a-button>
                                    </a-input-group>
                                </a-form-item>                                    
                            </a-col>

                            <a-col :span="8" >
                                <a-form-item 
                                    label="售后服务" 
                                    name="after_sale_service"
                                >
                                    <a-select v-model:value="formState.after_sale_service" placeholder="选择方式">
                                        <a-select-option value="1">支持7天无理由</a-select-option>
                                        <a-select-option value="0">不支持7天无理由</a-select-option>
                                    </a-select>
                                </a-form-item>
                            </a-col>

                            <a-col :span="8">
                                <a-form-item 
                                    label="发货模式" 
                                    name="presell_type"
                                >
                                    <a-select v-model:value="formState.presell_type" placeholder="选择方式">
                                        <a-select-option value="0">现货发货</a-select-option>
                                    </a-select>
                                </a-form-item>

                            </a-col>

                            <a-col :span="8">
                                <a-form-item
                                    label="最少购买"
                                    name="minimum_per_order"
                                >
                                    <a-input-number placeholder="用户每次下单最少限购件数"
                                    style="width: calc(100%);"
                                        v-model:value="formState.minimum_per_order"
                                    :min="1" :max="1000000" />

                                </a-form-item>
                            </a-col>

                            <a-col :span="8">
                                <a-form-item
                                    label="最多购买"
                                    name="maximum_per_order"
                                >
                                    <a-input-number 
                                        placeholder="用户每次下单最多限购件数" 
                                        style="width: calc(100%);" 
                                        v-model:value="formState.maximum_per_order" 
                                        :min="1" :max="1000000" 
                                        />

                                </a-form-item>
                            </a-col>

                            <a-col :span="8">
                                <a-form-item
                                    label="累计限购"
                                    name="limit_per_buyer"
                                >
                                    <a-input-number 
                                        placeholder="每个用户累计限购件数" 
                                        style="width: calc(100%);"
                                        v-model:value="formState.limit_per_buyer" 
                                        :min="1" :max="1000000" />

                                </a-form-item>
                            </a-col>

                        </a-row>
                        </a-form>

                    </a-tab-pane>

                    <a-tab-pane key="2" tab="商品规格">

                        <a-divider orientation="left" orientation-margin="0px">
                            规格
                            <a-checkbox 
                                v-model:checked="SPECS.SpecImag" 
                                @change="SPECS.SpecImagState_change_fun"
                            >上传图片</a-checkbox>
                        </a-divider>

                        <a-form ref="sku_formRef" name="SPECS" :model="SPECS.Obj">

                            <a-form-item 
                                v-for="(item, index) in SPECS.Obj" 
                                :name="[index, 'property_name']"
                                :key="item.index"
                                :rules="{required: true, trigger: 'change', message:' '}"
                            >
                                <!--规格名称 开始-->
                                <a-input 
                                    v-model:value="item.property_name"
                                    placeholder="输入规格名称" 
                                    style="width: 200px;" 
                                    autocomplete="off"
                                    allow-clear
                                />
                    
                                <a-button type="dashed" size="small" class="add_btn_class" block @click="SPECS.pushvalue(index)">
                                    <PlusOutlined />
                                </a-button>

                                <a-button type="dashed" size="small" class="add_btn_class" block @click="SPECS.del(item,index)">
                                    <MinusOutlined />
                                </a-button>
                                <!--规格名称 结束-->

                                <!--规格值 开始-->
                                <div style="width: 100%;clear: both; margin:4px 0 0 0;">

                                <a-space 
                                    v-for="(v_item, spec_value_index) in item.values" 
                                    :key="v_item.index" 
                                    style="margin:2px 4px 0 0;" 
                                    align="baseline"
                                >

                                    <a-form-item 
                                        v-if="index === 0" 
                                        :name="[index, 'values', spec_value_index,'value_name']" 
                                        :rules="{required: true, trigger: 'change', message:''}"
                                    >

                                        <div style="width: 200px;margin: 0 0 4px 0;">
                                            <a-input v-model:value="v_item.value_name" 
                                                placeholder="输入值" 
                                                style="font-size: 12px;margin:0 0 6px 0;" 
                                                autocomplete="off"
                                                allow-clear
                                            />
                                        </div>
                                        
                                        <div v-if="SPECS.SpecImag">

                                            <span v-if="v_item.url== undefined || v_item.url == ''">
                                                <span style="width: 42px;margin-top: 5px;height: 42px;display: block;border:1px #f2f2f2 solid;border-radius:4px;float: left;">
                                                    <a-skeleton-avatar :active="false" size="large" shape="avatarShape" class="cursor" @click="PAGEDATA.change_spec_imng_fun('spec_img',v_item)"/>
                                                </span>
                                            </span>

                                            <span v-else-if="v_item.url != undefined"" style="float: left;">

                                                <a-image style="border-radius:4px;" :width="42" :height="42" :src="v_item.url" />

                                                <a-button type="text" size="small" style="margin-left: 10px;" @click="SPECS.remove_img(v_item)"> 
                                                    <DeleteOutlined />
                                                </a-button>
                                            </span>
                                        </div>

                                    </a-form-item>

                                    <a-form-item
                                        v-if="index !== 0"
                                        :name="[index, 'values', spec_value_index,'value_name']" 
                                        :rules="{required: true, trigger: 'change', message:''}"
                                        >

                                        <a-input 
                                            v-model:value="v_item.value_name"
                                            placeholder="输入值" 
                                            autocomplete="off"
                                            allow-clear
                                            style="font-size: 12px;width: 200px;" 
                                        />

                                    </a-form-item>

                                    <MinusCircleOutlined @click="SPECS.removevalue(v_item, index)" style="margin: 0 5px 0 0;" />

                                </a-space>

                                </div>
                                <!--规格值 结束-->

                            </a-form-item>

                            <a-form-item>
                                <a-button type="dashed" @click="SPECS.add" size="middle">添加规格</a-button>
                            </a-form-item>

                        </a-form>

                    </a-tab-pane>

                    <a-tab-pane key="3" tab="库存数量">

                        <!--库存开始-->
                        <a-divider orientation="left" orientation-margin="0px">库存</a-divider>
                        
                        <a-form 
                            ref="skulistRef" 
                            :model="skumodel" 
                            name="basic"
                        >
                            
                            <a-table 
                                :columns="skumodel.skucolumns"
                                :data-source="skumodel.skudatelist"
                                :pagination="false"
                                style="font-size: 12px;"
                                size="small"
                                bordered
                            >

                            <template #bodyCell="{ column, text, record, index }">
                                
                                <template v-if="column.dataIndex === 'name'">
                                    <a>{{ text }}</a>
                                </template>

                                <template v-if="column.dataIndex === 'price'">

                                    <a-form-item
                                        :name="['skudatelist', index, 'price']"
                                        :rules="{required: true, trigger: 'change', message:'价格不能为空'}"
                                        >
                                        <a-input-number 
                                            placeholder="输入价格" 
                                            v-model:value="record.price" 
                                            prefix="￥" 
                                            :min="0" 
                                            :step="0.01"
                                            autocomplete="off"
                                            allow-clear
                                            style="font-size: 12px;width: 100%;margin-top: 22px;"/>
                                    </a-form-item>
                                </template>

                                <template v-if="column.dataIndex === 'stock_num'">
                                <a-form-item 
                                    :name="['skudatelist', index, 'stock_num']"
                                    :rules="{required: true, trigger: 'change', message:'库存不能为空'}"
                                    :style="{ 'margin': '0 0 0px 0' }"

                                >
                                    <a-input-number 
                                        placeholder="输入库存" 
                                        :min="0"
                                        :max="999999999"
                                        v-model:value="record.stock_num" 
                                        autocomplete="off"
                                        allow-clear
                                        style="font-size: 12px;width: 100%;margin-top: 22px;"
                                    />
                                </a-form-item>
                                </template>
                                
                                <template v-if="column.dataIndex === 'code'">
                                    <a-form-item :style="{ 'margin': '0 0 0px 0' }">
                                        <a-input
                                            placeholder="商家编码"
                                            autocomplete="off"
                                            v-model:value="record.code" 
                                            style="font-size: 12px;width: 100%;margin-top: 22px;" />
                                    </a-form-item>
                                </template>
                                
                            </template>
                            
                            </a-table>
                        </a-form>
                        <!--库存结束-->

                    </a-tab-pane>

                    <a-tab-pane key="5" tab="描述详情">

                        <div style="margin: 0 0 10px 0;">

                            <a-space>

                                <a-button 
                                    type="dashed" 
                                    @click="PAGEDATA.change_material_type('des')" 
                                    block
                                >插入素材</a-button>

                                <a-button type="dashed" @click="DES.clear_img" block>清空</a-button>
                            </a-space>
                        </div>

                        <div style="border: 1px solid #ccc;height: 100%;">
          
                            <Toolbar
                                style="border-bottom: 1px solid #ccc"
                                :editor="editorRef"
                                :defaultConfig="DES.toolbarConfig"
                                :mode="DES.mode.value"
                            />

                            <Editor
                                style="height: 600px; overflow-y: hidden;"
                                v-model="DES.valueHtml.value"
                                :defaultConfig="DES.editorConfig"
                                :mode="DES.mode.value"
                                @onCreated="DES.handleCreated"
                            />
                        </div>
                    </a-tab-pane>
                </a-tabs>

            </div>

        </a-layout-content>

        <!--底部按钮--开始-->
        <a-affix :offset-bottom="1">
            <div style="width: 950px;margin: 0 auto;text-align: center;padding: 10px 0 0 0;">
                <a-space align="end" style="height: 100%;">
                    <a-button type="primary" @click="handleOk" :loading="PAGEDATA.upload_product_loading">发布到线上售卖</a-button>
                    <a-button @click="console.log('放入草稿')">放入草稿箱</a-button>
                    <a-button @click="closed">关闭</a-button>
                </a-space>
            </div>
        </a-affix>
        <!--底部按钮--结束-->



    </a-modal>
</template>
<script>
import { defineComponent,defineAsyncComponent,ref,reactive,onMounted,computed,shallowRef,onBeforeUnmount,toRaw } from 'vue';
import { useStore } from 'vuex'
import { PlusOutlined,DeleteOutlined,MinusOutlined,MinusCircleOutlined} from '@ant-design/icons-vue';
import axios from 'axios';
import { Empty, Space } from 'ant-design-vue';
import * as TOOL from '@/assets/JS_Model/tool';
import * as TABLE from '@/assets/JS_Model/TableOperate';
import * as utils from '@/assets/JS_Model/public_model';
import { Editor, Toolbar } from '@wangeditor/editor-for-vue' // 描述详情富媒体
import '@wangeditor/editor/dist/css/style.css' // 引入富媒体编辑器样式 css
import { CATE } from '@/assets/douyinshop/productmanagement/Add';

// 商品管理->编辑操作方法
// import {
//     PicFun,
//     Longimg_Fun
// } from '@/assets/douyinshop/productmanagement/Add';

// 组件引用=====开始
export default defineComponent({
    name:'新建商品',
    components:{
        PlusOutlined,
        DeleteOutlined,
        MinusOutlined,
        MinusCircleOutlined,
        Editor, // 详情编辑
        Toolbar, // 编辑工具栏
        selectimg:defineAsyncComponent(() => import('@/components/AppMarket/Douyinshop/ProductList/selectImg.vue')),//素材组件
        selectFreightid:defineAsyncComponent(() => import('@/components/AppMarket/Douyinshop/templatefreight/selectFreightId.vue')),// 运费模板组件
        selectsizetemplateid:defineAsyncComponent(() => import('@/components/AppMarket/Douyinshop/templateSize/selectsizetemplateid.vue')),// 尺码模板组件
        format_cp:defineAsyncComponent(()=>import('@/components/AppMarket/Douyinshop/ProductList/edit_component/format_cp.vue')),// 商品属性组件
        selectbrandid:defineAsyncComponent(()=>import('@/components/AppMarket/Douyinshop/brand/brandlist.vue')),// 商品品牌组件
        // 产品属性>面料属性》多选组件
        VNodes:defineComponent({
            props: {
                vnodes: {
                    type: Object,
                    required: true,
                },
            },
            render() {
            return this.vnodes;
            },
        })
    },
    props: {
        data:{typr:Object}
    },
    // ✅ 必须添加 emits 声明:指定该组件可能会触发的事件
    emits: ['add_call_back'],
    setup(props,ctx) {
        
        const tool = new TOOL.TOOL()            // 工具方法
        const TO = new TABLE.TableOperate()     // 表格操作方法
        const API = new utils.A_Patch()         // 请求接口地址合集
        const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE;// 默认为空图标
        const buttonload = ref(true)            // 新建按钮loading状态；
        const activeKey = ref('1');             // 默认选项卡
        
        // 添加商品配置
        const PAGEDATA=reactive({

            selectimg_open:false,          // 添加主图-图片显示状态配置
            freighttemplate_open:false,    // 运费模板-图片显示状态配置
            sizetemplate_open:false,       // 尺码模板-图片显示状态配置
            brand_list_open:false,         // 品牌列表-组件显示状态配置
            setimg_name:'',             // 添加图片的对象['PicList','long_img_List','white_img','video','des']
            sku_img_obj:'',             // 规格图片对象

            // 图片组件获取地址后添加到页面容器：：：回调方法
            Add_Callback:(data)=>{
                var type = PAGEDATA.setimg_name;        // 添加类型
                if(type == 'PicList'){                  // 判断回调type：：：主图添加
                    Pic_Fun.add(data)                   // 添加主图方法
                }else if(type == 'long_img_List'){      // 判断回调type：：：3:4长图添加
                    Longimg_Fun.add(data)               // 添加长图方法
                }else if(type == 'white_img'){          // 判断回调type：：：白底图添加
                    whiteimg_Fun.add(data)              // 添加白底图方法
                }else if(type == 'video_info'){
                    video_Fun.add(data)                 // 添加视频方法
                }else if(type == 'des'){                // 添加描述详情
                    DES.add_img(data)
                }else if(type == 'spec_img'){           // 添加规格图片
                    SPECS.add_img(data)
                }else if(type == 'tag_img'){            // 添加吊牌水洗标
                    CATE.add_img(data)
                }
            },
            // 变更添加素材类型
            change_material_type:(typeName)=>{
                PAGEDATA.selectimg_open = true;
                PAGEDATA.setimg_name = typeName; // 指定添加图片的对象
            },
            // 规格图片
            change_spec_imng_fun:(typeName, item)=>{
                PAGEDATA.selectimg_open = true;
                PAGEDATA.setimg_name = typeName; // 指定添加图片的对象
                PAGEDATA.sku_img_obj = item;
            },
            // 选择尺码
            chang_sizetemplate:()=>{
                PAGEDATA.sizetemplate_open = true;
            },
            // 选择运费模板
            chang_freighttemplate:()=>{
                PAGEDATA.freighttemplate_open = true;
            },
            // 选择品牌
            change_brand_list:()=>{
                PAGEDATA.brand_list_open = true;
            },
            // 上传按钮状态
            upload_product_loading:ref(false)
        })

        // 主图对象
        const Pic_Fun = {

            PicList:ref([]),

            // 删除图片
            del_pic:(index)=>{
                Pic_Fun.PicList.value.splice(index, 1)
            },

            // 添加图片
            add:(data)=>{

                data.forEach((obj,idx)=>{
                    // 判断是否图片素材
                    var material_type = obj.material_type;

                    // console.log(material_type)
                    // 是图片=>添加到数组
                    if(material_type == 'photo'){
                        var photo_info = obj.photo_info;
                        var pic_width = photo_info.width;      // 宽度
                        var pic_height = photo_info.height;     // 高度
                        if(pic_width == pic_height){
                            Pic_Fun.PicList.value.push(obj)
                        }else{
                        
                            tool.Fun_.message('info','主图长宽比例需要1:1,不小于600X600.')
                        
                        }
                    }else if(material_type == 'video'){

                        tool.Fun_.message('info','【主图】不能选择视频，请选择图片素材！')
                    
                    }
                })

                // 只保留5张主图；
                if(Pic_Fun.PicList.value.length > 5){
                    Pic_Fun.PicList.value = Pic_Fun.PicList.value.slice(0, 5)
                    tool.Fun_.message('info','最多上传5张主图')
                }

            },
            
            // 获取主图
            get:()=>{

                var pic = Pic_Fun.PicList.value;
                if(pic.length == 0){
                    return false
                }else{
                    var res_text = ''
                    pic.forEach((obj,index)=>{
                        res_text = res_text + obj.byte_url  + '|'
                    })
                    return res_text.slice(0, -1)
                }
            }

        }

        // 3:4长图
        const Longimg_Fun = {
            PicList:ref([]),
            // 删除长图
            del:(idx)=>{
                Longimg_Fun.PicList.value.splice(idx, 1);
            },
            // 添加长图
            add:(data)=>{
                data.forEach((obj,idx)=>{
                    Longimg_Fun.PicList.value.push(obj)
                })
                if(Longimg_Fun.PicList.value.length > 5){
                    Longimg_Fun.PicList.value = Longimg_Fun.PicList.value.slice(0, 5)
                }
            },
            // 获取长图
            get:()=>{

                var res = Longimg_Fun.PicList.value;

                if(res.length >0){

                    var res_text = ''
                    res.forEach((obj,index)=>{
                        res_text = res_text + obj.byte_url  + '|'
                    })

                    return res_text.slice(0, -1)

                }else{
                    return false
                }
            }
        }

        // 白底图
        const whiteimg_Fun={
            PicList:ref([]),
            // 删除白底图
            del:()=>{
                whiteimg_Fun.PicList.value.length = 0
            },
            // 添加白底图
            add:(data)=>{
                whiteimg_Fun.PicList.value.length = 0;
                var obj = data[0];
                var material_type = obj.material_type;
                if(material_type == 'photo'){
                    var photo_info = obj.photo_info;
                    var pic_width = photo_info.width;      // 宽度
                    var pic_height = photo_info.height;     // 高度
                    if(pic_width == pic_height){
                        whiteimg_Fun.PicList.value.push(obj)
                    }else{
                        tool.Fun_.message('info','主图长宽比例需要1:1,不小于600X600.')
                    }
                }else if(material_type == 'video'){
                    tool.Fun_.message('info','【白底图】不能选择视频，请选择图片素材！')
                }
            },
            // 验证白底图
            get:()=>{
                var res = whiteimg_Fun.PicList.value;
                if(res.length >0){
                    return res[0].byte_url
                }else{
                    return false
                }
            }
        }

        // 视频video
        const video_Fun={

            PicList:ref([]),

            // 删除视频
            del:()=>{
                video_Fun.PicList.value.length = 0;
            },
            // 添加视频
            add:(data)=>{

                var obj = data[0]
                var material_type = obj.material_type; // 对象类型图片、视频

                // 判断添加素材类型：仅允许添加
                if(material_type == 'photo'){
                    tool.Fun_.message('info', '请选择视频文件')
                }else if(material_type == 'video'){
                    video_Fun.PicList.value.length = 0;
                    video_Fun.PicList.value.push(data[0])
                }
            },
            get:()=>{

                var res = video_Fun.PicList.value;

                if(res.length >0){
                    
                    return res
                
                }else{
                
                    return false
                
                }
            }
        }

        // 基础信息
        const formRef = ref();

        // 基础信息验证规则
        const rules = {

            // 标题
            name: [
                {
                    required: true,
                    message: '商品标题不能为空',
                    trigger: 'change',
                },
                {
                    min: 4,
                    max: 30,
                    message: '至少4个汉字,不超过30个汉字,不能含emoj表情.',
                    trigger: 'blur',
                },
            ],

            // 客服电话
            mobile:[{
                    required: true,
                    message: '客服电话不能为空',
                    trigger: 'change',
            }],

            // 商品类型
            product_type:[{
                required: true,
                message: '类型不能为空!',
                trigger: 'change',
            }],
            // 支付方式
            pay_type:[
                {
                    required: true,
                    message: '支付方式不能为空!',
                    trigger: 'change',
            }],
            // 减库存方式
            reduce_type:[
                {
                    required: true,
                    message: '减库存方式不能为空!',
                    trigger: 'change',
            }],
            // 提交方式
            commit:[
                {
                    required: true,
                    message: '提交方式不能为空!',
                    trigger: 'change',
            }],
            // 运费模板
            freight_id:[
                {
                    required: true,
                    message: '运费模板不能为空!',
                    trigger: 'change',
            }]
        }

        // 基础信息表单数据
        const formState = reactive({
            product_type:'0',               // 商品类别
            mobile:'18888888888',           // 客服电话
            name:undefined,                 // 商品标题
            recommend_remark:undefined,     // 推荐语：不能含emoj表情
            standard_brand_id:{brand_id: undefined, brand_name: undefined},    //品牌id
            pay_type:'1',                   // 支付类型
            reduce_type:'1',                // 减库存类型
            freight_id:{"name":"包邮","value":0},           // 运费模板
            size_info_template_id:{"name":undefined,"value":undefined},// 尺码模板
            commit:'false',                 // 提交
            remark:undefined,               // 商家备注
            presell_type:"0",         // 发货模式
            presell_delay_time:undefined,   // 预售发货时间
            
            // 限购
            limit_per_buyer:undefined,          // 每个用户累计限购件数
            maximum_per_order:undefined,        // 每个用户每次下单限购件数
            minimum_per_order:undefined,        // 每个用户每次下单至少购买的件数

            // 导购短标题
            short_product_name:undefined,
            // 售后保障-7天无理由 "after_sale_service":"{\"supply_day_return_selector\":\"7-0\"}" 
            after_sale_service:"1"
            
        })
        
        // 获取商品基础信息
        const GetInfo = async()=>{

           var res = await formRef.value.validate().then(() => {

                var res = toRaw(formState)// 标题
                // Object.keys(res).forEach(key=>{
                //     if(res.key === undefined){delete res.key} // 清除值为undefind的键值
                // })

                return res
                
            }).catch(error => {
                tool.Fun_.message('error',error.errorFields[0].errors[0]);
                activeKey.value = '1';
                return false
            })
            return res
        }

        // 规格库存
        const sku_formRef = ref()
        const SPECS = reactive({

            SpecImag:true,// 是否添加规格图片
            sku_listRef:ref(null),
            sku_columns:ref([]),
            sku_spece_data:ref([]),

            // 规格数据对象
            Obj:ref([{
                property_name:undefined,
                values:[{
                    value_name:undefined,  // 值名称
                    url:undefined      // 规格图片
                }],
            }]),

            // 添加规格
            add:() =>{

                var obj_number = SPECS.Obj.length;

                if(obj_number>=3){
                
                    tool.Fun_.message('info','规格最多不能超过三组！');
                    
                    return false

                }else if(obj_number == 0){

                    SPECS.Obj.push({
                        property_name:undefined,
                        values:[{
                            value_name:undefined,   // 值名称
                            url:undefined           // 图片地址
                        }],
                    })

                }else if(obj_number >= 1){

                    SPECS.Obj.push({
                        property_name:undefined,
                        values:[{
                            value_name:undefined,       // 值名称
                        }],
                    })
                }
            },

            // 删除规格
            del:(item)=>{

                let index = SPECS.Obj.indexOf(item);
                if (index !== -1) {
                    SPECS.Obj.splice(index, 1);
                }
            },

            // 添加规格值
            pushvalue:(data)=>{
                var value_number = SPECS.Obj[data].values.length;
                if(value_number >= 20){
                    tool.Fun_.message('error', '规格值最多不能超过20组！')
                    return false
                }else{
                    SPECS.Obj[data].values.push({
                        value_name:undefined,// 值名称
                        url:undefined//
                    });

                }
            },

            // 删除规格值
            removevalue:(item,data)=>{
                let index = SPECS.Obj[data].values.indexOf(item);
                if (index !== -1) {
                    SPECS.Obj[data].values.splice(index, 1);
                }
            },

            // 点击勾选
            SpecImagState_change_fun:()=>{SPECS.SpecImag = !!SPECS.SpecImag},

            // 选择规格图片
            add_img:(data)=>{
                var img_byte_url = data[0].byte_url
                PAGEDATA.sku_img_obj.url = img_byte_url
            },

            // 清除规格图片
            remove_img:(item)=>{
                item.url = ''
            },

            get_specs_obj: async()=>{

                // 规格未初始化
                if(sku_formRef.value === undefined){

                    tool.Fun_.message('error', '规格信息不能为空！');

                    activeKey.value = '2'

                    return false

                }

                // 验证规格
                var res = await sku_formRef.value.validate().then(() => {

                    var spec_list = toRaw(SPECS.Obj)  // 

                    var spece_value_number = spec_list[0].values.length;// 主规格值 数量;

                    var spec_img_list = [] // 规格图片列表

                    spec_list[0].values.forEach((obj, index)=>{// 迭代规格图片

                        var o_img_u = obj.url;

                        if(o_img_u !== undefined && o_img_u !== ''){
                            spec_img_list.push(obj.url)
                        }

                    })

                    var s_img_number = spec_img_list.length; // 主规格值图片数量;

                    // 如果需要上传图片
                    if(SPECS.SpecImag){

                        if(spece_value_number == s_img_number){

                            var spec_pic = spec_img_list.join(',');// 规格图片:图片数量需要好与主规格值数量一直

                        }else{

                            tool.Fun_.message('error', '规格图片需要填写，图片数量要与规格数量一致！');

                            activeKey.value = '2';

                            return false
                        }
                    }

                    var copy_list = structuredClone(spec_list)// 拷贝

                    copy_list[0].values.forEach((obj,index)=>{delete obj.url;})// 删除url键值

                    var result = {"spec_pic": spec_pic, "spec_values":copy_list}// 规格文案对象获取

                    return result

                }).catch( error => {

                    tool.Fun_.message('error', '规格信息不能为空！');// 规格错误提示
                    
                    activeKey.value = '2';

                    return false

                })

                return res
            },

            // 获取价格库存商家编码

        })

        // 根据规格-->构造价格、库存、商家编码
        const skulistRef = ref()
        const skumodel = reactive({
            skucolumns:[],
            skudatelist:[]
        })

        const sku_list = {
            
            // 提取sku的name数组
            get_name_sku_list:() =>{
                var name_list = []
                var datalist = SPECS.Obj;
                for(let i of datalist){
                    name_list.push(i.property_name)
                }
                return name_list
            },

            // 提取-初始情况下-sku_价格、库存
            get_p_s_obj:() => {
                var res_obj = {}
                for(let i of SPECS.Obj){
                    for(let y of i.values){
                        if(y.price != undefined){
                            var p_s_obj = {}
                            p_s_obj.price === undefined ? '':y.price
                            p_s_obj.stock_num === undefined ? '':y.stock_num
                            p_s_obj.code = y.code === undefined ? '':y.code
                            res_obj[y.value] = p_s_obj
                        }
                    }
                }
                return res_obj
            },

            // 笛卡尔积方法sku_value数组取值
            get_value_sku_list:() =>{
            
                var res_list = []

                var datalist = SPECS.Obj;
                
                // 规格取值
                for(let i of datalist){
                    var v_list = []
                    for(let y of i.values){
                        v_list.push(y.value_name)
                    }
                    res_list.push(v_list)
                }

                // 笛卡尔积方法
                var d_list = tool.Fun_.cartesianProduct(res_list)

                return d_list

            },

            // comlum取值
            get_colums:() =>{

                var name_list = sku_list.get_name_sku_list()
                var res_list = []
                for(let i of name_list){
                    let c_obj = {}
                    c_obj.title = i;
                    c_obj.dataIndex = i;
                    res_list.push(c_obj)
                }

                let price_obj = {title:'价格',dataIndex:'price'}
                let stock_num_obj = {title:'库存',dataIndex:'stock_num'}
                let code_obj = {title:'编码',dataIndex:'code'}
                res_list.push(price_obj)
                res_list.push(stock_num_obj)
                res_list.push(code_obj)
                return res_list
            },

            // 规格表单data取值(实时)
            get_data:() =>{

                var p_s_obj = sku_list.get_p_s_obj();

                var name_list = sku_list.get_name_sku_list()//名称列表

                var d_list = sku_list.get_value_sku_list()// 值列表

                var o_sku_v_obj = sku_list.load_old_sku(d_list, skumodel.skudatelist)// 历史数据匹配关系

                var data_list = []

                for(let y of d_list){

                    var y_text_name = y.join('')

                    var data = {}

                    for(var i=0;i<name_list.length;i++){

                        data[name_list[i]] = y[i];

                    }
                    if(o_sku_v_obj[y_text_name] !== undefined &&o_sku_v_obj[y_text_name] !== ''){
                            var o_obj = o_sku_v_obj[y_text_name]
                            data.price = o_obj.price
                            data.stock_num = o_obj.stock_num
                            data.code = o_obj.code
                    }

                    data_list.push(data)

                }

                return data_list

            },

            // 规格历史值保留
            load_old_sku:(sku_value_list, data)=>{
                var d_list = sku_value_list// 值列表
                var res_obj = {};
                for(let i=0;i<d_list.length;i++){
                    var name = d_list[i].join('')
                    res_obj[name]=data[i]
                }
                return res_obj
            }


        }

        // 库存验证
        const get_sku_list = async()=>{

            // 库存未初始化
            if(skulistRef.value === undefined){

                tool.Fun_.message('error', '库存信息不能为空！');

                refesh_stock_number('3') // 刷新库存

                activeKey.value = '3'

                return false

            }

            // 库存以及初始化
            var res = await skulistRef.value.validate().then(()=>{

                var sku_list_res = skumodel.skudatelist;
                var s_list = []
                sku_list_res.forEach(obj=>{
                    var o = {}
                    var sell_obj = []

                    Object.keys(obj).forEach(key=>{
                        if(key !== 'stock_num' && key !== 'price' && key !== 'code'){
                            var s_obj = {}
                            s_obj.property_name = key;
                            s_obj.value_name = obj[key]
                            sell_obj.push(s_obj)
                        }
                    })

                    o.sell_properties = sell_obj; //名称对象
                    o.sku_type = 0;
                    o.stock_num = obj.stock_num;
                    o.price = obj.price * 100;// 价格转换为分
                    o.code = obj.code; // 商家编码
                    s_list.push(o)
                })
                return s_list

            }).catch(error => {

                tool.Fun_.message('error',error.errorFields[0].errors[0]);

                activeKey.value = '3';

                return false

            })

            return res
        }

        // 刷新库存
        const refesh_stock_number = (activate_key) =>{
            
            // 选择的是库存tag;
            if(activate_key == '3'){
                var colums = sku_list.get_colums();
                var data_list = sku_list.get_data();
                skumodel.skucolumns = colums
                skumodel.skudatelist = data_list
            }
        }

        // 分类&属性
        const CATE = {

            cate_name:ref([]),          // 分类

            predict_status:ref(false),  // 预测按钮状态

            select_loading:ref(true),  // 预测选项状态

            cate_value:ref(undefined),  // 选中分类

            options:ref([]),            // 分类选项

            // 商品属性结构数据：：渲染表单格式
            format:ref([]),

            // 表单数据绑定:
            form_ref:ref(),

            format_formRef:reactive({}),

            // 吊牌-水洗标
            category_property_pics:ref(undefined),

            // 自定义【面料材质】的名称
            diy_name:ref(),

            // 添加自定义【面料材质】name -方法
            addItem:(op) => {

                var diy_name = CATE.diy_name.value; // 自定义名称
                if(diy_name == undefined){
                    tool.Fun_.message('error','自定义值不能为空')
                }else{
                    op.unshift({
                        name: diy_name,
                        value: op.length + 1 + '',
                        value_id:op.length + 1,
                        value_text:false // 自定义值标识
                    });
                }

                CATE.diy_name.value = undefined;
            },
            // 对选度量衡添加限制-不超过
            add_limit:(data_list,maxnumber)=>{
                if(data_list.length >= maxnumber){
                    tool.Fun_.message('error','超过最大限制数量了，最多10个选项。')
                }else{
                    data_list.push({value:undefined, percentage:undefined})
                }
            },
            // 删除面料材质属性
            material_del:(index,data)=>{
                data.splice(index,1)
            },

            // 变化选项时禁选
            material_change:(select_data,data)=>{
                var s_list = [] // 选中的id
                select_data.forEach(item=>{
                if(item.value !== undefined){
                    s_list.push(item.value)
                }
                })
                // 设置下拉选中的值禁用
                data.forEach(item=>{
                if(s_list.includes(item.value)){
                    item.disabled = true; // 禁用
                }else{
                    item.disabled = false;// 启用

                }
                })

            },

            // 类目列表转换
            get_cate_list:(obj)=>{
                var obj_list = []
                for(let i of obj){
                    let cate_obj = {}
                    cate_obj.value = i.id;
                    cate_obj.label = i.name;
                    cate_obj.isLeaf = i.is_leaf;
                    obj_list.push(cate_obj)
                }
                return obj_list
            },
            // 选择下级分类加载方法
            loadData:selectedOptions =>{

                const targetOption = selectedOptions[selectedOptions.length - 1];

                var cid = targetOption.value;       // 分类id

                var isLeaf = targetOption.isLeaf;   // 是否叶子类目

                targetOption.loading = true; // load options
                
                axios.post(API.AppSrtoreAPI.dou_product.cate, {"cid":cid}).then(res=>{
                    targetOption.loading = false;
                    targetOption.children = CATE.get_cate_list(res.data.data)
                    CATE.options.value = [...CATE.options.value]
                })
            },

            // 请求属性:加载到列表
            loadFormat:async()=>{

                var cate_id = CATE.cate_value.value

                // 请求类目对应的属性值
                var res = await axios.post(API.AppSrtoreAPI.dou_product.format, {
                    "category_leaf_id":cate_id
                })

                var data_list = res.data.data.data; // 属性值列表

                Object.keys(CATE.format_formRef).forEach(key => delete CATE.format_formRef[key]); // 清空

                // 加载属性结构
                data_list.forEach((obj,index)=>{

                    // 添加品牌无品牌选项
                    var property_name = obj.property_name

                    if(property_name == '品牌'){
                        var No_brand_obj = {
                            "value_id": 596120136,
                            "sequence": 0,
                            "name": "无品牌",
                            "value": "596120136"
                        }
                        obj.options.push(No_brand_obj)
                    }
                    // 无品牌添加结束

                    var type = obj.type; // 属性标签

                    if(type == 'select'){// 单选

                        CATE.format_formRef[obj.property_id] = undefined;

                    }else if(type == 'multi_select'){ // 多选

                        CATE.format_formRef[obj.property_id] = undefined;

                    }else if(type == 'text'){ // 文本

                        CATE.format_formRef[obj.property_id] = undefined;
                    
                    }else if(type == 'multi_value_measure'){// 度量衡-多选-材质属性

                        CATE.format_formRef[obj.property_id] = [{}];

                    }else if(type =='measure'){// 度量衡-单选
                        
                        console.log(obj)

                        const measure_Data= {} // 绑定表单dui像

                        obj.measure_templates[0].value_modules.forEach(item=>{
                            var mo_obj = {}
                            mo_obj.module_id = item.module_id;
                            mo_obj.prefix = item.prefix;
                            mo_obj.suffix = item.suffix;
                            mo_obj.value = '';
                            if(item.units.length >0){
                                mo_obj.unit_id = item.units[0].unit_id;
                                mo_obj.op = item.units;
                            }
                            measure_Data[item.module_id] = mo_obj;

                        })

                        CATE.format_formRef[obj.property_id] = measure_Data;

                    }else if(type =='timestamp'){// - 时间戳timestamp

                        CATE.format_formRef[obj.property_id] = undefined;

                    }else if(type =='timerange'){// - 时间段timerange

                        CATE.format_formRef[obj.property_id] = undefined;

                    }

                })

                CATE.format.value = res.data.data.data;

            },

            // 多选-禁用超过限制选项
            dis_ops:(item, data)=>{

                if(data !== undefined){// 提交数据不为空时

                    var type = item.type; // 类别
                    var multi_select_max = item.multi_select_max;
                    var result_value = data; // 选中的值
                    var options = item.options; // 选项
                    var diy_type = item.diy_type; // 是否支撑自定义
                    
                    if(type == 'multi_select' || type == 'multi_value_measure'){ // 多选 'multi_select' & 'multi_value_measure'

                        // 选中值--超过限制
                        if(result_value.length >= multi_select_max){

                            // 非选中值添加禁用属性
                            options.forEach((obj,index)=>{

                                var value = obj.value_id;

                                // 过滤选中值
                                if(!result_value.includes(value)){
                                    obj.disabled = true
                                }
                            })

                        }else{// 选中值--没有超过限制

                            // 非选中值添加禁用属性
                            options.forEach((obj,index)=>{
                                obj.disabled = false
                            })

                        }
                    }
                }
            },

            // 获取多选属性值
            select_name:(v_id,op)=>{
                var r_name = ''
                op.forEach((obj,index)=>{
                    var name = obj.name;
                    if(v_id == obj.value_id){
                        r_name = name
                    }
                })
                return r_name

            },
            // 获取分类
            get_cate:()=>{
                var cate_values = toRaw(CATE.cate_value.value)
                if(cate_values > 0){// 分类不为空
                    return cate_values
                }else{ // 分类为空
                    tool.Fun_.message('error', '商品分类不能为空！');
                    activeKey.value = '1';
                    return false
                }
            },

            // 获取属性
            get_format: async()=>{

                // 验证是否必填全部填写
                var res = await CATE.form_ref.value?.validate().then(()=>{
                    
                    var selected_mat = toRaw(CATE.format_formRef)// 选中的属性
                    var show_mat= toRaw(CATE.format.value)      // 当前展示的属性
                    var f_res_obj = {}
                    show_mat.forEach(obj => {
                        let property_id = obj.property_id;
                        if(selected_mat[property_id] !== undefined){
                           var result_list = CATE.de_format_detail(obj, selected_mat[property_id])
                           f_res_obj[property_id] = result_list
                        }
                    });

                    return f_res_obj

                }).catch(error => {

                    tool.Fun_.message('error',error.errorFields[0].errors[0]);

                    activeKey.value = '1';

                    return false
                })
                
                console.log('属性', res) // 打印获取去的商品属性

                return res
            },

            // 获取属性时候-转义属性格式：：提交上传商品
            de_format_detail:(item, data)=>{

                let property_id = item.property_id;
                let type = item.type; // 类别
                let result_value = data; // 选中的值
                let multi_select_max = item.multi_select_max;
                let options = item.options; // 选项
                let diy_type = item.diy_type; // 是否支撑自定义


                // 文本 text
                if(type == 'text'){

                    var result = [{"value":0,"name":result_value,"diy_type":diy_type}]
                    return result

                }else if(type == 'select'){// 单选 select

                    // 单选 [{"value":data,"name":v_name,"diy_type":diy_type}]
                    var v_name = ''
                    options.forEach((obj,index)=>{
                        if(obj.value_id == data){v_name = obj.name}
                    })

                    var result = [{"value":data,"name":v_name,"diy_type":diy_type}]

                    return result

                }else if(type == 'multi_select'){ // 多选

                    var res_lisr = []

                    // 如果不是数组类型转换为数组
                    if(!Array.isArray(result_value)){result_value = [result_value]}
                    result_value.forEach((obj,index)=>{
                        var r_name = CATE.select_name(obj,options)
                        var r_obj = {"value":obj,"name":r_name,"diy_type":diy_type}
                        res_lisr.push(r_obj)
                    })

                    return res_lisr

                }else if(type == 'multi_value_measure'){// 度量衡-多选-材质属性

                    // item参数参考值 data：获取值；
                    // console.log('面料材质多选', item, data)
                    var result = CATE.de_m_v_m(item, data) // 转义数据格式-返回给-提交对象de_m_v_m方法
                    return result

                }else if(type =='measure'){// 度量衡-单选

                    let value_modules = item.measure_templates[0].value_modules;
                    if(value_modules.length == 1){// 单值 
                        var result = CATE.de_m_v_one(item, data) // 转义数据格式-返回给-提交对象de_m_v_m方法
                        return result
                    }else if(value_modules.length > 1){ // 多值-长宽高等
                        var result = CATE.de_m_v_more(item, data) // 转义数据格式-返回给-提交对象de_m_v_m方法
                        return result
                    }

                }else if(type =='timestamp'){// - 时间戳timestamp

                    console.log('时间戳',item, data)

                    // 时间戳：面条(24814) — 生产日期

                }else if(type =='timerange'){// - 时间段timerange

                    console.log('时间段',item, data)

                    // 时间段：阿胶块(28948) — 生产日期

                }

            },

            // 类目预测
            Check_Cate:async(formdata)=>{
                
                var name = formdata.name; // 标题
                var pic = Pic_Fun.get(); // 主图

                CATE.predict_status.value = true;

                // 判断标题是否为空
                if(name == undefined || name == ''){ 
                    tool.Fun_.message('error', '预测类目>标题不能为空！');
                    CATE.predict_status.value = false;
                    return false
                }

                // 判断主图是否为空
                if(!pic){
                    tool.Fun_.message('error', '预测分类>商品主图不能为空！');
                    CATE.predict_status.value = false;
                    return false
                }
                // 迭代图片数组格式
                var pic_list = pic.split('|');
                pic_list.forEach((obj,index)=>{
                    pic_list[index] = {"url":obj}
                })

                // 请求接口
                var res = await axios.post(API.AppSrtoreAPI.dou_product.cate_predict,{
                    "scene":"category_infer",
                    // "scene":"smart_publish",
                    "pic":pic_list,
                    "name":name
                })

                var categoryDetails = res.data.data.categoryDetails;

                if(categoryDetails.length >0){

                    var cate_list = []

                    categoryDetails.forEach((obj,index)=>{

                        var op = CATE.de_cate_detaile(obj) // 迭代预测类目选项obj

                        cate_list.push(op)

                    })

                    tool.Fun_.message('success', '预测分类成功！');

                    CATE.options.value = cate_list;
                    CATE.cate_value.value = cate_list[0].value; // 下拉选择赋值

                    CATE.loadFormat();// 加载对应商品属性
                    
                    CATE.Ceck_format()// 迭代预测的属性到页面

                    CATE.predict_status.value = false; // 按钮load状态停止
                    CATE.select_loading.value = false; // 下拉禁用状态停止

                }else{

                    tool.Fun_.message('error', '预测分类失败，请更换主图或标题！');
                    CATE.predict_status.value = false;
                    return false
                }
            },

            // 迭代预测类目选项obj
            de_cate_detaile:(obj)=>{

                var cate_obj = {}
                var qualification_status = obj.qualification_status; // 类目资质qualification_status: 0-有资质；1-资质过期；2-无资质// disabled: true,
                var category_detail = obj.category_detail;           // 类目信息


                let first_cname = category_detail.first_cname;
                let second_cname = category_detail.second_cname;
                let third_cname = category_detail.third_cname;
                let fourth_cname = category_detail.fourth_cname;

                let first_cid = category_detail.first_cid;
                let second_cid = category_detail.second_cid;
                let third_cid = category_detail.third_cid;
                let fourth_cid = category_detail.fourth_cid;
                // ids
                var value_id_list = [first_cid,second_cid,third_cid,fourth_cid];
                // 名称
                var value_label_list = [first_cname,second_cname,third_cname,fourth_cname];
                value_id_list.forEach((id,index)=>{
                    if(id == 0){
                        value_id_list = value_id_list.slice(0, index)
                        value_label_list = value_label_list.slice(0, index)
                    }
                })
                
                cate_obj.value = value_id_list.at(-1)
                cate_obj.label = value_label_list.join('>')
                // 判断资质是否过期
                if(qualification_status !== 0){
                    cate_obj.disabled = true
                }

                return cate_obj
            },

            // 预测属性：填充到页面
            Ceck_format:async()=>{

                var c_id = CATE.cate_value.value // id
                if(c_id == undefined || c_id == ''){
                    tool.Fun_.message('error', '需要分类才能预测');
                    return
                }
                var pic = Pic_Fun.get().split('|'); // 主图
                var title_name = formState.name; // 标题

                // 请求接口
                var res = await axios.post(API.AppSrtoreAPI.dou_product.format_recommend,{
                    "category_id":c_id,// 类目id-必填
                    "img_urls":pic,// 商品图片-非必填
                    "name":title_name// 商品标题-非必填
                })
                var checkformat_result_list = res.data.data.properties;
                checkformat_result_list.forEach(obj=>{
                    var property_id = obj.property_id;
                    var property_values_id = obj.property_values[0].value_id;
                    Object.keys(CATE.format_formRef).forEach(key=>{
                        if(key == property_id && property_values_id !== 0)(
                            CATE.format_formRef[key] = property_values_id
                        )
                    })
                })
            },

            // 清空商品属性
            Clear_format:()=>{
                Object.keys(CATE.format_formRef).forEach(key=>{
                    CATE.format_formRef[key] = undefined
                })
            },

            // 度量衡 多选-上传商品json-转义
            de_m_v_m:(item, data)=>{

                // item参数参考值 data：获取值；
                // 我们将data选中得值id+百分比转义为提交新建商品得json数据格式

                var resultList = []
                let template_id = item.measure_templates[0].template_id;// 模板id
                let value_modules_list = item.measure_templates[0].value_modules; // 输入值的模板
                // console.log(value_modules_list)

                data.forEach(obj=>{

                    var n_obj = {}
                    let value_id = obj.value;// 选中的材质id
                    let percentage = obj.percentage + '%'; // 百分比

                    // 从 options 中查找对应的 name
                    let selected = item.options.find(opt => opt.value_id === value_id)
                    let name_text = selected?.name || '';
                    let name = name_text + percentage; // 例如："name": "亚麻10%",
                    // 第一层级
                    n_obj.diy_type = 1;
                    n_obj.value = 0;
                    n_obj.name =  name;

                    // 第二层级measure_info      
                    n_obj.measure_info = {
                        "values": [
                        {
                            "module_id": value_modules_list[0].module_id,
                            "value": name_text,
                            "unit_id": 0
                        },
                        {
                            "module_id": value_modules_list[1].module_id,
                            "unit_name": value_modules_list[1].units[0].unit_name,
                            "unit_id": value_modules_list[1].units[0].unit_id,
                            "value": obj.percentage + ''
                        }
                        ],
                        "template_id": template_id,
                        "value_name": name
                    }

                    resultList.push(n_obj)
                })

                // console.log(resultList)
                return resultList

            },

            // 度量衡 单选 单值- 上传商品json-转义
            de_m_v_one:(item, data)=>{

                var resultList = []
                let value_modules = item.measure_templates[0].value_modules;
                let template_id = item.measure_templates[0].template_id;// 模板id
                let module_id = parseInt(Object.keys(data)[0]);
                let obj = data[module_id]
                // console.log('度量衡-单选-单值',obj)

                let selected = obj.op.find(opt => opt.unit_id === obj.unit_id)

                let unit_name = selected?.unit_name || '';

                // console.log('度量衡-单选-单值',unit_name)

                let name = obj.value + unit_name;  // 选中的材质id

                let n_obj = {
                            "measure_info": {
                                "template_id": template_id,
                                "values": [
                                    {
                                    "module_id": module_id,
                                    "prefix": obj.prefix,
                                    "suffix": obj.suffix,
                                    "value": String(obj.value),
                                    "unit_id": obj.unit_id,
                                    "unit_name": unit_name
                                    }
                                ]
                            },
                            "value": 0,
                            "diy_type": 1,
                            "name": name
                }

                resultList.push(n_obj)

                return resultList
            },

            // 度量衡 单选 多值-上传商品json-转义
            de_m_v_more:(item, data)=>{

                console.log('度量衡-单选-多值',item,data)

                var resultList = []
                let value_modules = item.measure_templates[0].value_modules;
                let demo = [
                        {
                            "measure_info": {
                            "template_id": 126,
                            "values": [
                                {
                                "module_id": 185,
                                "prefix": "",
                                "suffix": "-",
                                "value": "300",
                                "unit_id": 38,
                                "unit_name": "cm"
                                }
                            ]
                            },
                            "value": 0,
                            "diy_type": 1,
                            "name": "300cm-"
                        }
                    ]
                return resultList
            },
            // 水洗标-吊牌图片
            add_img:(data)=>{
                var img_byte_url = data[0].byte_url
                CATE.category_property_pics.value = img_byte_url
                console.log(CATE.category_property_pics.value)
            },
            // 清除水洗标-吊牌图片
            clear_img:()=>{
                CATE.category_property_pics.value = undefined;
            }

        }

        // 描述详情
        const editorRef = shallowRef()  // 编辑器实例，必须用 shallowRef
        const DES = {
            // 初始化
            valueHtml:ref(undefined),
            mode:ref('simple'),// 或 'simple' 'default'
            // 编辑器实例，必须用 shallowRef
            editorRef:shallowRef(),
            editorConfig:{placeholder: '请输入内容...' },// 默认值
            // 编辑器工具栏配置
            toolbarConfig:{
                excludeKeys: [
                    'bold',
                    "underline",
                    "italic",
                    "through",
                    "color",
                    "clearStyle",
                    "bgColor",
                    "codeBlock",
                    "blockquote",
                    "bulletedList",
                    "numberedList",
                    "insertTable",
                    "header1",
                    "header2",
                    "header3",
                    'headerSelect',
                    'italic',
                    'group-more-style', // 排除菜单组，写菜单组 key 的值即可
                    //"fullScreen",
                    "insertLink",
                    "editLink",
                    "insertVideo",
                    "uploadVideo",
                    "todo",
                    "redo",
                    "undo",
                    "group-image",
                    "uploadImage",
                    "insertImage",

                ]
            },
            // 创建编辑器
            handleCreated:(editor) => {
                editorRef.value = editor // 记录 editor 实例，重要！
                editor.clear() // 清空编辑器
            },
            // 加载图片到编辑器
            add_img:(img_list)=>{
                var image_text = '<p>'
                for(let i of img_list){
                    let url = i.byte_url;
                    image_text = image_text + '<img class="ant-image-img" src=" ' + url + '">';
                }
                DES.valueHtml.value = DES.valueHtml.value + image_text + '</p>'
            },
            // 获取描述图片
            get_img:()=>{
                var img_list_res = []
                // 描述为空
                if(editorRef.value == undefined){
                    tool.Fun_.message('error', '描述详情不能为空！');
                    activeKey.value = '5';
                    return false
                }else {

                    var img_list = editorRef.value.getElemsByType('image') // 获取图片地址

                    if(img_list.length == 0 || editorRef.value == undefined){
                        tool.Fun_.message('error', '描述详情不能为空！');
                        activeKey.value = '5';
                        return false
                    }else{
                        // 描述不为空
                        // console.log(img_list)
                        img_list.forEach((obj,index)=>{
                            img_list_res.push(obj.src)
                        })

                        return img_list_res.join('|')
                    }
                }
            },
            // 清空描述图
            clear_img:()=>{
                DES.valueHtml.value = '';
            }
        }

        // 选择运费模板==回调方法
        const selectfreight_callback= (data)=>{
            // 填充id
            var f_id = data.id
            var f_name = data.name
            // 填充名称
            formState.freight_id.value = f_id
            formState.freight_id.name = f_name
            // console.log(formState.freight_id)
        }

        // 选择尺码模板==回调方法
        const selectsizetemplate_callback= (data)=>{
            // 填充id
            var s_id = data.id;
            var s_name = data.name;
            // 填充名称
            formState.size_info_template_id.value = s_id
            formState.size_info_template_id.name = s_name
            // console.log(formState.size_info_template_id)
        }

        // 选择品牌回调方法
        const selectbrand_callback = (data) => {
             // 填充id
            formState.standard_brand_id.brand_id = data.brand_id;
            formState.standard_brand_id.brand_name = data.name_cn;
            console.log(data)
        }

        // 确认按钮===>>>获取产品信息+验证
        const handleOk = async() => {

            var product_data_obj = {} // 商品上传JSON

            // 主图
            if(Pic_Fun.get()){// 不为空
                product_data_obj.pic = Pic_Fun.get()
            }else{
                tool.Fun_.message('error','主图不能为空！')
                activeKey.value = '1'
                return
            }

            // 白底图
            if(whiteimg_Fun.get()){
                product_data_obj.white_back_ground_pic_url = whiteimg_Fun.get();// 白底图：url(仅素材中心url有效)，白底图比例要求1:1
                console.log('白底图', whiteimg_Fun.get())
            }

            // 长图
            if(Longimg_Fun.get()){
                product_data_obj.long_pic_url = Longimg_Fun.get();// 长图
                console.log('长图', Longimg_Fun.get())
            }

            // 视频信息
            if(video_Fun.get()){
                var video_obj = video_Fun.get()
                var material_video_id = video_obj[0].video_info.vid;
                product_data_obj.material_video_id = material_video_id;// 视频id
                // console.log('视频素材id', material_video_id)
            }

            // 基础信息
            var pro_info = await GetInfo();

            if(pro_info){
                // 正常获取
                product_data_obj.name = pro_info.name;                  // 标题-必填
                product_data_obj.product_type = pro_info.product_type;  // 商品类型-必填
                product_data_obj.recommend_remark = pro_info.recommend_remark;// 推荐语
                product_data_obj.remark = pro_info.remark;              // 商家备注
                product_data_obj.pay_type = pro_info.pay_type;          // 支付方式
                product_data_obj.reduce_type = pro_info.reduce_type;    // 减库存类型
                product_data_obj.mobile = pro_info.mobile;              // 电话
                product_data_obj.freight_id = pro_info.freight_id.value;// 运费模板
                product_data_obj.size_info_template_id = pro_info.size_info_template_id.value// 尺码模板
                product_data_obj.minimum_per_order = pro_info.minimum_per_order; // 最少下单购买件数
                product_data_obj.maximum_per_order = pro_info.maximum_per_order; // 最多下单购买件数
                product_data_obj.limit_per_buyer = pro_info.limit_per_buyer; // 累计购买件数
                product_data_obj.presell_type = pro_info.presell_type; // 发货模式
                product_data_obj.short_product_name = pro_info.short_product_name;// 导购短标题
            }else{
                return
            }
            
            // 分类
            var cate_obj = CATE.get_cate()
            if(cate_obj){
                // 正常获取分类
                product_data_obj.category_leaf_id = cate_obj;
            }else{
                return
            }

            // 属性
            var format_obj = await CATE.get_format();
            if(format_obj){
                product_data_obj.product_format_new = JSON.stringify(format_obj);
            }else{
                return
            }

            // 验证规格信息
            var specs_info = await SPECS.get_specs_obj()
            if(specs_info){

                // 规格图片
                if(specs_info.spec_pic !== undefined){
                    product_data_obj.spec_pic = specs_info.spec_pic;
                }

                // 正常获取
                delete specs_info.spec_pic
                product_data_obj.spec_info = specs_info;

            }else{
                return
            }

            // 库存信息
            var sku_list_obj = await get_sku_list();
            if(sku_list_obj){

                product_data_obj.spec_prices_v2 = sku_list_obj;
            
            }else{
                return
            }

            // 描述详情
            var description_obj = DES.get_img();
            if(description_obj){
                // 正常获取
                product_data_obj.description = description_obj
            }else{
                return
            }
            
            // console.log(product_data_obj)
            
            upload_product(product_data_obj)// 上传商品

        }

        // 关闭新建商品按钮
        const closed = () =>{

            props.data.AddDate = !props.data.AddDate;

        }

        // 商品上传请求接口方法
        const upload_product = async (product_data) =>{

            // 按钮状态
            // PAGEDATA.upload_product_loading = true;

            console.log(product_data)
            product_data.commit = 1; // 提交方式-立即发布
            
            // 发送数据到接口
            var res = await tool.Http_.post(API.AppSrtoreAPI.dou_product.add, product_data)

            console.log(res)

            var code = res.data.code;
            var sub_msg = res.data.sub_msg
            if(code === 10000 ){ // 接口返回成功
                
                // 提示上传成功，刷新列表;

                setTimeout(() => {

                    tool.Fun_.message('success','商品添加成功！')

                    PAGEDATA.upload_product_loading = false;

                    closed() // 关闭新建商品

                    ctx.emit('add_call_back')// 刷新列表

                }, 1000);

            }else{ // 接口返回失败

                // 提示失败，返回失败原因;
                tool.Fun_.message('error', sub_msg)

                // 重置提交按钮状态
                PAGEDATA.upload_product_loading = false;

            }

        }

        // 表单选择框---》搜索方法；
        const filterOption = (input, option) => {
            return option.name.toLowerCase().indexOf(input.toLowerCase()) >= 0;
        };

        return{
            PAGEDATA,
            Pic_Fun,whiteimg_Fun,Longimg_Fun,video_Fun,        // 主图,白底图,长图,视频
            props,
            activeKey,
            formState,
            formRef,
            sku_formRef,
            SPECS,
            // -------------分类属性
            CATE,
            // --------------库存
            sku_list,       // 库存操作方法
            skumodel,       // 库存表格数据
            refesh_stock_number,// 库存刷新事件
            skulistRef,     // 库存必填方法
            simpleImage,
            // -------------描述详情
            editorRef,DES,
            // 提交，关闭
            handleOk,closed,
            rules,
            selectfreight_callback,
            selectsizetemplate_callback,
            selectbrand_callback,
            filterOption
        }
    }
})

</script>
<style scoped>
.content{padding: 0;margin: 20px 0 0 0;background: '#fff';overflow-y: auto;overflow-x: hidden;height: 90vh;}
.img_pic{height: 100px;width: 100px;border: 1px silver solid; border-radius: 4px;margin: 0 10px 0 0;float: left;padding: 10px;}
.img_3_4_pic{height: 100px;width: 100px;border: 1px silver solid; border-radius: 4px;margin: 0 10px 0 0;float: left;padding: 10px;text-align: center;}
.Add_img{height: 100px;width: 100px;background-color: #fff;border: 1px silver dotted; border-radius: 4px;margin: 0 10px 0 0;float: left;text-align: center;}
.Add_img :hover{color: #2600ff;border:1px #2600ff dotted;border-radius: 4px;}
.Add_3_4_img{height: 100px;width: 100px;background-color: #fff;border: 1px silver dotted; border-radius: 4px;margin: 0 10px 0 0;float: left;text-align: center;}
.Add_3_4_img :hover{color: #2600ff;border:1px #2600ff dotted;border-radius: 4px;}
.add_btn_class{width: 40px; margin:0 0 0 20px;}
/* .ant-form-item{margin-bottom: 0px ! important} */
.Add_shui_img{height: 90px;width: 100%;background-color: #fff;border: 1px silver dotted; border-radius: 4px;margin: 0 10px 0 0;float: left;text-align: center;}
.Add_shui_img :hover{color: #2600ff;border:1px #2600ff dotted;border-radius: 4px;}
.call_shui_img{height: 90px;width: 100%;background-color: #fff;border: 1px silver dotted; border-radius: 4px;margin: 0 10px 0 0;float: left;text-align: center;padding: 4px 0 0 0;}
.clear_shui_img{margin: 0 0 0 6px;}

</style>