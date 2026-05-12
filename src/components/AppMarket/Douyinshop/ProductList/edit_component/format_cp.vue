<!--
商品属性模板 
###1\传入类目ID:渲染属性组件 
###2\传输预加载的属性对象：渲染到已经加载好的属性表单上
###3\获取属性上传数据：请求验证=>true：返回数据；验证不通过返回false，显示提示语；
PS：支持新建、编辑====》场景使用
-->
<template>
<div>

    <a-divider orientation="left" orientation-margin="0px">商品属性</a-divider>
              
    <!--属性为空-->
    <div class="load_center" v-if="formdata.CateProperty == undefined" style="height: 400px;">
        
        <div style="clear: both;display: block;"><a-spin /></div>

    </div>
    
    <!--属性不为空-->
    <a-form 
        ref="format_form_ref" 
        :model="formdata.format_form_data" 
        v-else-if="formdata.CateProperty !== undefined"
    >

        
        <!--多选度量衡 开始-->
        <a-row :gutter="[16,10]" style="padding: 0 0 20px 0;">
            
            <!--迭代出面料属性-->
            <template v-for="(item, index) in formdata.CateProperty">

                <!--多选度量衡 multi_value_measure-->
                <template v-if="item.type == 'multi_value_measure'">

                <!--洗水标上传 开始
                    available    是否可用	true-可用，false-不可用
                    required     是否必填	true-必填，false-选填
                -->

                <template v-if="item.property_pic_rule.available == true">

                    <a-col :span="24">

                        <p>水洗标/吊牌图</p>

                        <!--为空-->
                        <div class="cursor Add_img" v-if="formdata.category_property_pics == undefined" 
                            @click="console.log('点击上传水洗标')">
                            <a-flex justify="center" align="center" style="height: 100%;font-size: 12px;">
                            +
                            </a-flex>
                        </div>

                        <!--不为空-->

                    </a-col>
                </template>
                <!--洗水标上传 结束-->

                <!--属性名称-->
                <a-col :span="24" style="margin: 10px 0 0 0;">
                    {{ item.property_name }} 
                    <span v-show="item.required ==1" style="color: red;">*必填</span>
                </a-col>

                <!--迭代循环属性值-->
                <a-col :span="6" v-for="(olist, dIndex) in formdata.format_form_data[item.property_id]">
                    
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
                            @focus="insetpagedata.format.material_change(formdata.format_form_data[item.property_id],item.options)"
                        >

                            <template #dropdownRender="{ menuNode: menu }">
                                <v-nodes :vnodes="menu" />
                                <a-divider style="margin: 4px 0" />
                                <a-space style="padding: 4px 8px">
                                <a-input ref="inputRef" 
                                    v-model:value="insetpagedata.format.diy_name.value" 
                                    placeholder="自定义面料"
                                    autoComplete="off"
                                />
                                <a-button type="text" @click="insetpagedata.format.addItem(item.options)">
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
                        <!-- 判断水洗 标上传 -->
                        <!-- 判断水洗 标结束 -->
                         
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
                            v-show="formdata.format_form_data[item.property_id].length > 1"
                            type="dashed"
                            style="margin-top: 10px;"
                            @click="insetpagedata.format.material_del(dIndex,formdata.format_form_data[item.property_id])"
                        >删除</a-button>


                    </a-form-item>
                </a-col>

                <a-col :span="24">
                    <a-button 
                    type="dashed"
                    @click="insetpagedata.format.add_limit(formdata.format_form_data[item.property_id],item.multi_select_max)"
                    >添加材质</a-button>
                </a-col>
                </template>

            
            </template>
        
        </a-row>
        
        <!--多选度量衡 结束-->

        <!--单选度量衡 开始-->

        <!--单选度量衡 结束-->

        <!--基础属性列表 开始-->
        <a-row :gutter="[16,0]" >

            <template v-for="(item, index) in formdata.CateProperty" :key="item.property_id">
            
            <!--文本-->
            <a-col v-if="item.type == 'text'" :span="6">
                <p>
                {{ item.property_name }} 
                <span v-show="item.required ==1" style="color: red;">*必填</span>
                </p>
                <p v-if="item.required == 1">
                <a-form-item 
                    :name="item.property_id"
                    :rules="[{ required: true, message: item.property_name + '不能为空！',trigger: 'change',}]"
                >
                    <a-input 
                    autoComplete="off"
                    :placeholder="'请输入-' + item.property_name"
                    v-model:value="formdata.format_form_data[item.property_id]" 
                    allow-clear
                    >
                </a-input>
                </a-form-item>
                </p>

                <p v-else>
                <a-form-item 
                    :name="item.property_id"
                >
                    <a-input 
                    autoComplete="off"
                    :placeholder="'请输入-' + item.property_name"
                    v-model:value="formdata.format_form_data[item.property_id]" 
                    allow-clear>
                </a-input>
                </a-form-item>
                </p>

            </a-col>

            <!--单选-->
            <a-col :span="6" v-if="item.type == 'select'">
                <p>
                    {{ item.property_name }} 
                    <span v-show="item.required ==1" style="color: red;">*必填</span>
                </p>

                <p v-if="item.required == 1">
                    <a-form-item
                        :name="item.property_id"
                        :rules="[{ required: true, message: item.property_name + '不能为空！',trigger: 'change',}]"
                    >
                    <a-select
                        :placeholder="'请选择-' + item.property_name"
                        allow-clear
                        :options="item.options"
                        v-model:value="formdata.format_form_data[item.property_id]" 
                        style="width: 100%;"
                        :field-names="{
                            label: 'name',
                            value: 'value_id',
                        }"
                    >
                        <template #dropdownRender="{ menuNode: menu }" v-if="item.diy_type==1">
                            <v-nodes :vnodes="menu" />
                            <a-divider style="margin: 4px 0" />
                            <a-space style="padding: 4px 8px">
                            <a-input ref="inputRef" 
                                v-model:value="insetpagedata.format.diy_name.value" 
                                placeholder="自定义面料"
                                autoComplete="off"
                            />
                            <a-button type="text" @click="insetpagedata.format.addItem(item.options)">
                                <template #icon><PlusOutlined /></template>添加
                            </a-button>
                            </a-space>
                        </template>
                
                    </a-select>
                    </a-form-item>
                </p>

                <p v-else>
                    <a-form-item
                        :name="item.property_id"
                    >
                    <a-select
                        :placeholder="'请选择-' + item.property_name"
                        allow-clear
                        :options="item.options"
                        v-model:value="formdata.format_form_data[item.property_id]" 
                        style="width: 100%;"
                        :field-names="{
                            label: 'name',
                            value: 'value_id',
                        }"
                    >
                        <template #dropdownRender="{ menuNode: menu }" v-if="item.diy_type==1">
                            <v-nodes :vnodes="menu" />
                            <a-divider style="margin: 4px 0" />
                            <a-space style="padding: 4px 8px">
                            <a-input ref="inputRef" 
                                v-model:value="insetpagedata.format.diy_name.value" 
                                placeholder="自定义面料"
                                autoComplete="off"
                            />
                            <a-button type="text" @click="insetpagedata.format.addItem(item.options)">
                                <template #icon><PlusOutlined /></template>添加
                            </a-button>
                            </a-space>
                        </template>
                
                    </a-select>
                    </a-form-item>
                </p>
                
            </a-col>

            <!--多选-->
            <a-col v-if="item.type == 'multi_select'" :span="6">

                <p>
                {{ item.property_name }} 
                <span v-show="item.required ==1" style="color: red;">*必填</span>
                </p>

                <p v-if="item.required == 1">
                <a-form-item
                    :name="item.property_id"
                    :rules="[{ required: true, message: item.property_name + '不能为空！',trigger: 'change',}]"
                >
                    <a-select
                        :placeholder="'请选择-' + item.property_name"
                        allow-clear
                        mode="multiple"
                        :max-tag-count="1"
                        :options="item.options"
                        v-model:value="formdata.format_form_data[item.property_id]"
                        @change="insetpagedata.format.dis_ops(item,formdata.format_form_data[item.property_id])" 
                        style="width: 100%;"
                        :field-names="{
                            label: 'name',
                            value: 'value_id',
                        }"
                    >
                
                        <template #dropdownRender="{ menuNode: menu }" v-if="item.diy_type==1">
                            <v-nodes :vnodes="menu" />
                            <a-divider style="margin: 4px 0" />
                            <a-space style="padding: 4px 8px">
                            <a-input ref="inputRef" 
                                v-model:value="insetpagedata.format.diy_name.value" 
                                placeholder="自定义面料"
                                autoComplete="off"
                            />
                            <a-button type="text" @click="insetpagedata.format.addItem(item.options)">
                                <template #icon><PlusOutlined /></template>添加
                            </a-button>
                            </a-space>
                        </template>
                    </a-select>
                </a-form-item>
                </p>

                <p v-else>
                <a-form-item
                    :name="item.property_id"
                >
                    <a-select
                        :placeholder="'请选择-' + item.property_name"
                        allow-clear
                        mode="multiple"
                        :max-tag-count="1"
                        :options="item.options"
                        v-model:value="formdata.format_form_data[item.property_id]"
                        @change="insetpagedata.format.dis_ops(item, formdata.format_form_data[item.property_id])" 
                        style="width: 100%;"
                        :field-names="{
                            label: 'name',
                            value: 'value_id',
                        }"
                    >
                        <template #dropdownRender="{ menuNode: menu }" v-if="item.diy_type==1">
                            <v-nodes :vnodes="menu" />
                            <a-divider style="margin: 4px 0" />
                            <a-space style="padding: 4px 8px">
                            <a-input ref="inputRef" 
                                v-model:value="insetpagedata.format.diy_name.value" 
                                placeholder="自定义面料"
                                autoComplete="off"
                            />
                            <a-button type="text" @click="insetpagedata.format.addItem(item.options)">
                                <template #icon><PlusOutlined /></template>添加
                            </a-button>
                            </a-space>
                        </template>
                    </a-select>
                </a-form-item>
                </p>
            </a-col>

            <!--度量衡 measure 多个值输入-->
            <a-col v-else-if="item.type == 'measure' && item.measure_templates[0].value_modules.length>1" :span="12">

                <p>
                    {{ item.property_name }} 
                    <span v-show="item.required ==1" style="color: red;">*必填</span>
                </p>

                <p v-if="item.required == 1">
                    <a-space >

                    <template v-for="(items, key) in formdata.format_form_data[item.property_id]">
                        <a-form-item 
                            :name="[item.property_id, items.module_id, 'unit_name']"
                            :rules="[{ required: true, message: item.property_name + '不能为空！',trigger: 'change',}]"
                            style="padding: 0;margin: 0;width: 100%"
                        >
                            <a-input-number
                                v-model:value="items.unit_name"
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
                    <template v-for="(items, key) in formdata.format_form_data[item.property_id]">
                        <a-form-item 
                            :name="[item.property_id, items.module_id, 'unit_name']"
                            style="padding: 0;margin: 0;width: 100%"
                        >
                            <a-input-number
                                v-model:value="items.unit_name"
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

            <!--单值 度量衡 measure 单个值输入-->
            <a-col v-else-if="item.type == 'measure' && item.measure_templates[0].value_modules.length == 1" :span="6">
                <p>
                    {{ item.property_name }} 
                    <span v-show="item.required ==1" style="color: red;">*必填</span>
                </p>

                <p v-if="item.required == 1"><!--迭代 多度量衡 输入值 必填-->

                    <template v-for="(items,key) in formdata.format_form_data[item.property_id]">

                        <a-form-item 
                            :name="[item.property_id, items.module_id, 'unit_name']"
                            :rules="[{ required: true, message: item.property_name + '不能为空！',trigger: 'change',}]"
                        >

                            <a-input-number
                                v-model:value="items.unit_name" 
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

                    <template v-for="(items,key) in formdata.format_form_data[item.property_id]">

                        <a-form-item 
                            :name="[item.property_id, items.module_id, 'unit_name']"
                        >
                            <a-input-number
                                v-model:value="items.unit_name" 
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

            </a-col>

            <!--时间戳-->
            <!-- <a-col v-if="item.type == 'timestamp'" :span="6">

                <p>
                    {{ item.property_name }} 
                    <span v-show="item.required ==1" style="color: red;">*必填</span>
                </p>

                {{ item.type }}

            </a-col> -->

            <!--时间段-->
            <!-- <a-col v-if="item.type == 'timerange'" :span="6">
                <p>
                {{ item.property_name }} 
                <span v-show="item.required ==1" style="color: red;">*必填</span>
                </p>
                {{ item.type }}
            </a-col> -->

            </template>
        </a-row> 
        <!--基础属性列表 结束-->

    </a-form>

</div>
</template>
<script>
import ProductList from '@/views/AppMarket/DouyinShop/ProductList.vue';
import { defineComponent,ref,reactive,onMounted,h } from 'vue';
import { PlusOutlined} from '@ant-design/icons-vue';
import * as ProductEdit from '@/assets/douyinshop/productmanagement/edit';// 商品管理->编辑操作方法

// 组件引用=====开始
export default {

    name:'name',

    components:{

        PlusOutlined,

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

setup(props,ctx) {
    
    const formdata = props.data; // 表单绑定

    const format_form_ref = ref()// 属性表单验证对象

    formdata.format_form_ref = format_form_ref;// 验证对象传值到方法中，方法验证调用；

    const insetpagedata = new ProductEdit.Insetpagedata() // 数据操作方法加载

    // 表单选择框---》搜索方法；
    const filterOption = (input, option) => {
        return option.name.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    };

    return{
        formdata,
        format_form_ref,
        insetpagedata,
        filterOption
    }
   }
}
</script>
<style scoped>
.Add_img{height: 100px;width: 100px;background-color: #fff;border: 1px silver dotted; border-radius: 4px;margin: 0 10px 0 0;float: left;text-align: center;}
.Add_img :hover{color: #2600ff;border:1px #2600ff dotted;border-radius: 4px;}
.load_center{height: 100%;width: 100%;display: flex;justify-content: center;align-items: center;}
.site-input-group-wrapper .site-input-split {
  background-color: #fff;
}

.site-input-group-wrapper .site-input-right {
  border-left-width: 0;
}

.site-input-group-wrapper .site-input-right:hover,
.site-input-group-wrapper .site-input-right:focus {
  border-left-width: 1px;
}

.site-input-group-wrapper .ant-input-rtl.site-input-right {
  border-right-width: 0;
}

.site-input-group-wrapper .ant-input-rtl.site-input-right:hover,
.site-input-group-wrapper .ant-input-rtl.site-input-right:focus {
  border-right-width: 1px;
}
[data-theme='dark'] .site-input-group-wrapper .site-input-split {
  background-color: transparent;
}
</style>