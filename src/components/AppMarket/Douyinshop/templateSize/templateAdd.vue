<!-- 新建尺码模板 -->
<template>
<a-drawer
    v-model:open="props.data.add_open"
    class="custom-class"
    root-class-name="root-class-name"
    title="新建"
    placement="right"
    width="800"
  >
    <div>
        <a-form>
            <a-form-item label="模板名称" v-bind="validateInfos.template_name">
                <a-input placeholder="模板名称" 
                style="font-size:12px;padding: 2px;" 
                name="template_name" 
                v-model:value="moderef.template_name" 
                size="small"
                autoComplete="off"
                ></a-input>
            </a-form-item>
            <a-form-item label="尺码标题" v-bind="validateInfos.title">
                <a-input 
                placeholder="尺码标题" 
                style="font-size:12px;padding: 2px;" 
                name="title" 
                v-model:value="moderef.title" 
                size="small"
                autoComplete="off"
                ></a-input>
            </a-form-item>
            <a-form-item label="标题注释" v-bind="validateInfos.desc">
                <a-input 
                    placeholder="标题注释" 
                    style="font-size:12px;padding: 2px;" 
                    name="desc" 
                    v-model:value="moderef.desc" 
                    size="small" 
                    autoComplete="off"
                ></a-input>
            </a-form-item>
        </a-form>
        <a-radio-group 
            v-model:value="size_add.template_sub_type" 
            size="middle"
            @change="size_add.change"
            style="margin: 10px 0 0 0;"
        >
            <a-radio-button value="clothing" class="font_size_12">服装</a-radio-button>
            <a-radio-button value="undies" class="font_size_12">内衣</a-radio-button>
            <a-radio-button value="shoes" class="font_size_12">鞋靴类</a-radio-button>
            <a-radio-button value="children_clothing" class="font_size_12">童装</a-radio-button>
            <a-radio-button value="rings" class="font_size_12">戒指</a-radio-button>
            <a-radio-button value="bracelets" class="font_size_12">手镯</a-radio-button>
        </a-radio-group>
    </div>
    <div style="height: 34px;margin: 20px 0 0 0;">
        <a-checkbox-group 
            v-model:value="size_add.op_value" 
            name="checkboxgroup" 
            :options="size_add[size_add.op_name].columns_list" 
            @change="size_add.checked_columns"
        />
    </div>
    <p>
        <a-table :columns="size_add.columns" :data-source="size_add.data" :pagination="false" size="small" class="font_size_12" bordered>
            <template #bodyCell="{ column, record, text }">
                <template v-if="column.dataIndex === 'op'">
                    <a-space>
                    <a class="font_size_12" href="#" @click="size_add.up_colums(record)">上移</a>
                    <a class="font_size_12" href="#" @click="size_add.next_colums(record)">下移</a>
                    <a class="font_size_12" href="#" @click="size_add.remove_colum(record.key)">删除</a>
                    </a-space>
                </template>
                <template v-else>
                    <a-input v-model:value="record[column.dataIndex]"></a-input>
                </template>
            </template>
            <template #footer>
                <a-button type="link" @click="size_add.add_colums">添加一行</a-button>
            </template>
        </a-table>
    </p>
    <div>
        <a-space>
            <a-button type="primary" size="small" @click="size_add.submit">保存</a-button>
            <a-button size="small">取消</a-button>
        </a-space>
    </div>
</a-drawer>
</template>
<script>
import { defineComponent,ref,reactive,toRaw,h } from 'vue';
import { Form } from 'ant-design-vue';
import * as TOOL from '@/assets/JS_Model/tool';
import * as utils from '@/assets/JS_Model/public_model';

// 组件引用=====开始
export default defineComponent({
    name:'templateAdd',
    components:{
    },
    props: {

        data:{typr:Object}
  
    },
setup(props,ctx) {

    const tool = new TOOL.TOOL();// 工具方法
    const API = new utils.A_Patch()         // 请求接口地址合集

    const useForm = Form.useForm;
    const moderef = reactive({
        title:undefined,// 标题
        desc:undefined,// 描述
        template_name:undefined,//子模板名称
    })

    // 输入表单规则
    const rulesRef = reactive({
        template_name: [{required: true,message: '请输入模板名称',},],
        title: [{required: true,message: '请输入标题',},],
        desc: [{required: true,message: '请输入模板描述',},],
    });

    // 表单验证赋值
    const { resetFields, validate, validateInfos } = useForm(moderef, rulesRef, {
        onValidate: (...args) => console.log(...args),
    });



    // 新建尺码详情
    const size_add = reactive({

        open:ref(false),// 是否弹出状态
        data:ref(undefined),// 数据列表

        template_type:ref('size_info'),// 模板类型：尺码模板
        template_name:ref(undefined),// 模板名称
        shareable:ref(true),// 是否设置为公有模板

        // 新建模板类型选择
        template_sub_type:ref('clothing'), // 模板子类型

        op_value:ref(['身高(cm)', '体重(cm)', '胸围(cm)', '肩宽(cm)', '腰围(cm)', '臀围(cm)', '袖长(cm)']),// 选中的尺码值

        op_name:ref('clothing'),

        clothing:{
            columns_list:['身高(cm)', '体重(cm)', '胸围(cm)', '肩宽(cm)', '腰围(cm)', '臀围(cm)', '袖长(cm)'],
            index_list:['Height', 'Weight', 'Chest_circumference', 'Shoulder_width', 'Waist_circumference', 'Hip_circumference', 'Sleeve_length'],
        },

        undies:{
            columns_list:['下胸围(cm)', '胸围差(cm)', '杯罩'],
            index_list:['Lower_chest_circumference','Chest_circumference_difference','cup_cover']
        },

        shoes:{
            columns_list:['脚长(cm)', '脚宽(cm)', '靴筒高(cm)', '靴筒围(cm)', '鞋跟高(cm)'],
            index_list:['length','width','height','circumference','Heel_height']
        },

        children_clothing:{
            columns_list:['身高(cm)', '体重(斤)', '胸围(cm)'],
            index_list:['Height','Weight','Age_Month']
        },
        
        rings:{
           columns_list:['戒指内周长(mm)', '戒指内直径(mm)'],
           index_list:['inner_circumference','inner_diameter']
        },

        bracelets:{
            columns_list:['手掌最宽长度(mm)', '手掌最宽周长(mm)'],
            index_list:['width_length','circumference_palm']
        },

        // 切换表头方法
        check_colums:(type_name)=>{
            
            var r = size_add.op_value
            var d = size_add[type_name].index_list

            var list = [
                {
                    title: '尺码',
                    dataIndex: 'size',
                    align: 'center',
                    width:80,
                },
            ] // 表头

            for(let i=0;i<r.length;i++){
                var o = {}
                o.title = r[i]
                o.dataIndex = d[i]
                list.push(o)
            }

            list.push({
                title: '操作',
                dataIndex: 'op',
                align: 'center',
                width:120,
            })
            
            console.log(type_name)
            console.log(list)

            // 服装
            let clothingData = [
                    {
                        key: '1',
                        size: 'S',// 尺码
                        Height: '160', // 身高(cm)
                        Weight: '50',//体重(cm)
                        Chest_circumference: '34',// 胸围(cm)
                        Shoulder_width:'22',// '肩宽(cm)'
                        Waist_circumference:'22',// '腰围(cm)'
                        Hip_circumference:'50', // '臀围(cm)'
                        Sleeve_length:'22'// '袖长(cm)'
                    },
                    {
                        key: '2',
                        size: 'M',// 尺码
                        Height: '162', // 身高(cm)
                        Weight: '52',//体重(cm)
                        Chest_circumference: '36',// 胸围(cm)
                        Shoulder_width:'22',// '肩宽(cm)'
                        Waist_circumference:'22',// '腰围(cm)'
                        Hip_circumference:'52', // '臀围(cm)'
                        Sleeve_length:'22'// '袖长(cm)'
                    },
                    {
                        key: '3',
                        size: 'L',// 尺码
                        Height: '164', // 身高(cm)
                        Weight: '54',//体重(cm)
                        Chest_circumference: '38',// 胸围(cm)
                        Shoulder_width:'22',// '肩宽(cm)'
                        Waist_circumference:'22',// '腰围(cm)'
                        Hip_circumference:'54', // '臀围(cm)'
                        Sleeve_length:'22'// '袖长(cm)'
                    },
                    {
                        key: '4',
                        size: 'XL',// 尺码
                        Height: '166', // 身高(cm)
                        Weight: '56',//体重(cm)
                        Chest_circumference: '40',// 胸围(cm)
                        Shoulder_width:'22',// '肩宽(cm)'
                        Waist_circumference:'22',// '腰围(cm)'
                        Hip_circumference:'56', // '臀围(cm)'
                        Sleeve_length:'22'// '袖长(cm)'
                    },
            ]

            // 内衣
            let undiesData = [
                {
                    key: '1',
                    size: 'S',// 尺码
                    Lower_chest_circumference: '160', // 下胸围(cm)
                    Chest_circumference_difference: '50',//胸围差(cm)
                    cup_cover: '34',// 罩杯
                },
                {
                    key: '2',
                    size: 'M',// 尺码
                    Lower_chest_circumference: '160', // 下胸围(cm)
                    Chest_circumference_difference: '50',//胸围差(cm)
                    cup_cover: '34',// 罩杯
                },
                {
                    key: '3',
                    size: 'X',// 尺码
                    Lower_chest_circumference: '160', // 下胸围(cm)
                    Chest_circumference_difference: '50',//胸围差(cm)
                    cup_cover: '34',// 罩杯
                },
            ]
            
            // 鞋靴
            let shoesData = [
                {                    
                    key: '1',
                    size: 'S',// 尺码
                    length:'33',// 脚长(cm) 
                    width:'33',// 脚宽(cm)
                    height:'33', // 靴筒高(cm)
                    circumference:'33', // 靴筒围(cm)
                    Heel_height:'33'// 鞋根高(cm)
                },
                {                    
                    key: '2',
                    size: 'M',// 尺码
                    length:'33',// 脚长(cm) 
                    width:'33',// 脚宽(cm)
                    height:'33', // 靴筒高(cm)
                    circumference:'33', // 靴筒围(cm)
                    Heel_height:'33'// 鞋根高(cm)

                },
                {                    
                    key: '3',
                    size: 'L',// 尺码
                    length:'33',// 脚长(cm) 
                    width:'33',// 脚宽(cm)
                    height:'33', // 靴筒高(cm)
                    circumference:'33', // 靴筒围(cm)
                    Heel_height:'33'// 鞋根高(cm)

                },
            ]
            
            // 童装
            let children_clothingData=[
                {                    
                    key: '1',
                    size: 'S',// 尺码
                    Height:'',// 身高(cm) 
                    Weight:'',// 体重(cm)
                    Age_Month:'', // 年龄/月龄
                },
                {                    
                    key: '2',
                    size: 'M',// 尺码
                    Height:'',// 身高(cm) 
                    Weight:'',// 体重(cm)
                    Age_Month:'', // 年龄/月龄
                },
                {                    
                    key: '3',
                    size: 'L',// 尺码
                    Height:'',// 身高(cm) 
                    Weight:'',// 体重(cm)
                    Age_Month:'', // 年龄/月龄
                },
            ]
            
            // 戒指
            let ringsData = [
                {
                    key: '1',
                    size: '1号',// 尺码
                    inner_circumference:'',// 内周长(mm) 
                    inner_diameter:'',// 内直径(cm)
                },
                {
                    key: '2',
                    size: '2号',// 尺码
                    inner_circumference:'',// 内周长(mm) 
                    inner_diameter:'',// 内直径(cm)
                },
                {
                    key: '3',
                    size: '3号',// 尺码
                    inner_circumference:'',// 内周长(mm) 
                    inner_diameter:'',// 内直径(cm)
                },
            ]
            
            // 手镯
            let bracelets = [
                {
                    key: '1',
                    size: '3号',// 尺码
                    width_length:'',// 手掌最宽长度(mm) 
                    circumference_palm:'',// 手掌最宽周长(mm)
                },
                {
                    key: '2',
                    size: '3号',// 尺码
                    width_length:'',// 手掌最宽长度(mm) 
                    circumference_palm:'',// 手掌最宽周长(mm)
                },
                {
                    key: '3',
                    size: '3号',// 尺码
                    width_length:'',// 手掌最宽长度(mm) 
                    circumference_palm:'',// 手掌最宽周长(mm)
                },
            ]
            
            // 初始化模板数据开始
            size_add.columns = list
            if(type_name == 'clothing'){
                size_add.data = clothingData
            }else if(type_name == 'undies'){
                size_add.data = undiesData
            }else if(type_name == 'shoes'){
                size_add.data = shoesData
            }else if(type_name == 'children_clothing'){
                size_add.data = children_clothingData
            }else if(type_name == 'rings'){
                size_add.data = ringsData
            }else if(type_name == 'bracelets'){
                size_add.data = bracelets
            }

        },
        // 表头数据
        columns:ref([
            {
                "title": "尺码",
                "dataIndex": "size",
                "align": "center",
                "width": 80,
            },
            {
                "title": "身高(cm)",
                "dataIndex": "Height"
            },
            {
                "title": "体重(cm)",
                "dataIndex": "Weight"
            },
            {
                "title": "胸围(cm)",
                "dataIndex": "Chest_circumference"
            },
            {
                "title": "肩宽(cm)",
                "dataIndex": "Shoulder_width"
            },
            {
                "title": "腰围(cm)",
                "dataIndex": "Waist_circumference"
            },
            {
                "title": "臀围(cm)",
                "dataIndex": "Hip_circumference"
            },
            {
                "title": "袖长(cm)",
                "dataIndex": "Sleeve_length"
            },
            {
                "title": "操作",
                "dataIndex": "op",
                "align": "center",
                "width": 120
            }
        ]),

        // 模板数据
        data:ref([
                    {
                        key: '1',
                        size: 'S',// 尺码
                        Height: '160', // 身高(cm)
                        Weight: '50',//体重(cm)
                        Chest_circumference: '34',// 胸围(cm)
                        Shoulder_width:'34',// '肩宽(cm)'
                        Waist_circumference:'34',// '腰围(cm)'
                        Hip_circumference:'34', // '臀围(cm)'
                        Sleeve_length:'34'// '袖长(cm)'
                    },
                    {
                        key: '2',
                        size: 'M',// 尺码
                        Height: '160', // 身高(cm)
                        Weight: '50',//体重(cm)
                        Chest_circumference: '34',// 胸围(cm)
                        Shoulder_width:'34',// '肩宽(cm)'
                        Waist_circumference:'34',// '腰围(cm)'
                        Hip_circumference:'34', // '臀围(cm)'
                        Sleeve_length:'34'// '袖长(cm)'
                    },
                    {
                        key: '3',
                        size: 'L',// 尺码
                        Height: '160', // 身高(cm)
                        Weight: '50',//体重(cm)
                        Chest_circumference: '34',// 胸围(cm)
                        Shoulder_width:'34',// '肩宽(cm)'
                        Waist_circumference:'34',// '腰围(cm)'
                        Hip_circumference:'34', // '臀围(cm)'
                        Sleeve_length:'34'// '袖长(cm)'
                    },
                    {
                        key: '4',
                        size: 'XL',// 尺码
                        Height: '160', // 身高(cm)
                        Weight: '50',//体重(cm)
                        Chest_circumference: '34',// 胸围(cm)
                        Shoulder_width:'34',// '肩宽(cm)'
                        Waist_circumference:'34',// '腰围(cm)'
                        Hip_circumference:'34', // '臀围(cm)'
                        Sleeve_length:'34'// '袖长(cm)'
                    },
            ]),

        play:()=>{
            size_add.open = true
        },
        add:()=>{
            var url ="https://fxg.jinritemai.com/ffa/g/size-chart/manage"
            window.open(url)
        },

        change:()=>{
            
            size_add.op_name = size_add.template_sub_type;      // 表头多选项目切换
            size_add.op_value = size_add[size_add.template_sub_type].columns_list
            size_add.check_colums(size_add.template_sub_type)   // 表格切换

        },

        // 点击选择字段：
        checked_columns:(e)=>{
            size_add.check_colums(size_add.template_sub_type)
        },

        // 添加行
        add_colums:()=>{

            // 超过10行提示模板内容过多
            if(size_add.data.length>10){
                tool.Fun_.message('info','模板内容过多！')
            }else{
                const key_number = size_add.data.length;
                var index_list = size_add[size_add.op_name].index_list
                var new_data = {}
                for(let i of index_list){
                    new_data[i] = undefined
                }
                new_data.key = String(key_number + 1 + '')
                new_data.size = undefined
                size_add.data.push(new_data)
            }

        },
        // 删除行
        remove_colum:(key)=>{
            const result = size_add.data.filter(o => o.key !== key);
            size_add.data = result
        },
        // 上移行
        up_colums:(o)=>{
            console.log(o.key)
            var up_c = o.key - 2; // 上游数据
            console.log(up_c)
            if(size_add.data[up_c] !== undefined && up_c > -1){
                console.log(size_add.data)
                size_add.data[up_c].key = o.key + '';
                o.key = o.key- 1 + ''
                size_add.data.sort((a, b) => a.key - b.key);
            }
        },
        // 下移行
        next_colums:(o)=>{
            var up_c = Number(o.key) + 1; // 下游数据
            if(up_c <= size_add.data.length){
                o.key = up_c + '';
                size_add.data[up_c-1].key = o.key-1+'';
                size_add.data.sort((a, b) => a.key - b.key);
            }
        },
        // 保存
        submit:()=>{

            // 表格结果验证
            var v_res = size_add.verifyData();

            // 提示表格不能有空数据
            if(v_res !== true){
                tool.Fun_.message('info','模板表格不能有空数据')
                return ''
            }

            validate().then(() => { // 验证成功后执行

                // 模板基础信息验证成功
                console.log(toRaw(moderef));
                var c_o = toRaw(moderef)

                var n_o = {
                    template_type:"size_info",
                    template_name:c_o.template_name,
                    template_sub_type:size_add.template_sub_type,
                    component_front_data:{
                        title:c_o.title,
                        desc:c_o.desc,
                        tempName:"tempName",
                        configTable:[],
                        selectedSpecs:size_add.op_value,// 选中参数
                        specOptions:size_add.op_value, // 选中参数
                        selectedSize:[], // 尺码列表
                    },
                    shareable:false, // 是否公用or私有
                }

                // n_o.template_name = c_o.template_name


                Object.keys(size_add.data).forEach(k => {
                    console.log(size_add.data[k])
                    var i_obj = size_add.data[k]
                    var x_obj= {}
                    
                    // 拼接specMap
                    var value_list = []
                    Object.keys(i_obj).forEach(y => {
                        if(y !== 'key' & y !== 'size'){value_list.push(i_obj[y])}    
                    })

                    x_obj.size = i_obj.size;
                    n_o.component_front_data.selectedSize.push(i_obj.size)

                    // 合并key value
                    const specMap = Object.fromEntries(
                        size_add.op_value.map((key, index) => [key, value_list[index]])
                    );
                    x_obj.specMap = specMap;
                    n_o.component_front_data.configTable.push(x_obj)
                })


                console.log(n_o);

                // 上传数据
                tool.Http_.post(API.AppSrtoreAPI.size.add,n_o).then((res)=>{
                    console.log(res.data)
                    var code = res.data.code; // 返回码
                    var sub_msg = res.data.sub_msg; // 
                    if(code == 10000){ // 成功

                        tool.Fun_.message('success', '创建成功！')

                        props.data.add_open = false;// 关闭弹窗

                        ctx.emit('add_callback')   // 回调刷新表格

                    }else{ // 失败
                        tool.Fun_.message('error','创建失败！' + sub_msg)
                    }


                })

            }).catch(err => {// 表单验证
                console.log('error', err);
            });
        },
        // 验证数据不能为空数据
        verifyData:()=>{
            if(size_add.data.length==0){
                return false
            }else{
                var res_text = true
                for(let i of size_add.data){
                    Object.keys(i).forEach(k => {
                        var res = tool.Fun_.isEmpty(i[k])
                        if(res){res_text = false}
                    }); 
                }
                return res_text
            }
        },
        // 上传成功-处理
        up_success:(res)=>{

        },
        // 上传失败-处理
        up_failure:(res)=>{

        }
    })

    return{
        props,
        size_add,
        moderef,
        validateInfos
    }
}
})
</script>
<style scoped>
</style>