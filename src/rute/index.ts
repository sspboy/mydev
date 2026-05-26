import { createRouter, createWebHistory } from 'vue-router'
import NotFoundComponent from '../views/otherRes/NotFoundComponent.vue'
import server_err from '../views/otherRes/server_err.vue'
import NotPermissions from '../views/otherRes/NotPermissions.vue'
import NotLoginPermissions from '../views/otherRes/NotLoginPermissions.vue'

const routes = [
    {
        path: '/home',
        name: 'HomeView',
        component: () => import('../views/HomeView.vue'),   // 视图文件
        meta:{
            title:'主页',
        }
    },
    {
        path: '/',
        name: 'Login',
        component: () => import('../views/LoginView.vue'),   // 视图文件
        meta:{
            title:'项目管理',
        }
    },
    {
        path: '/user',
        name: 'User',
        // 路由守卫,用做前端鉴权访问路由
        beforeEnter: () => {
            return true
        },
        component: () => import('../views/admin/UserView.vue'),   // 视图文件
        meta:{
            title:'用户管理',
        }
    },
    {
        path: '/video',
        name: 'video',
        component: () => import('../views/video/FFMEPEG.vue'),    // 视图文件
        meta:{
            title:'视频处理',

        }

    },
    {
        path: '/menu',
        name: 'menu',
        component: () => import('../views/admin/MenuView.vue'),    // 视图文件
        meta:{
            title:'菜单管理',

        }

    },
    {
        path: '/fun',
        name: 'fun',
        component: () => import('../views/admin/FunView.vue'),    // 视图文件
        meta:{
            title:'功能列表',
        }

    },
    {
        path: '/version',
        name: 'version',
        component: () => import('../views/admin/VersionView.vue'),    // 视图文件
        meta:{
            title:'版本管理',
        }

    },
    {
        path: '/douyinorder',
        name: 'douyinorder',
        component: () => import('../views/admin/DouyinOrderView.vue'),    // 视图文件
        meta:{
            title:'服务订单',
        }
    },
    {
        path: '/shopinfo',
        name: 'shopinfo',
        component: () => import('../views/admin/DouyinShopView.vue'),    // 视图文件
        meta:{
            title:'店铺信息',
        }
    },
    {
        path: '/department',
        name: 'department',
        component: () => import('../views/BasicSetting/Department.vue'),    // 视图文件
        meta:{
            title:'组织架构',
        }

    },
    {
        path: '/team',
        name: 'team',
        component: () => import('../views/BasicSetting/Team.vue'),    // 视图文件
        meta:{
            title:'团队管理',
        }
    },
    {
        path: '/role',
        name: 'role',
        component: () => import('../views/BasicSetting/Role.vue'),    // 视图文件
        meta:{
            title:'角色管理',
        }
    },
    {
        path: '/brandinfo',
        name: 'brandinfo',
        component: () => import('../views/BasicSetting/BrandInf.vue'),    // 视图文件
        meta:{
            title:'品牌资料',
        }
    },
    {
        path: '/login',
        name: 'douyinlogin',
        component: () => import('../views/AppMarket/DouyinShop/DouyinLogin.vue'),   // 视图文件
        meta:{
            title:'抖店授权',
        }
    }, 
    {
        path: '/douyinproductlist',
        name: 'douyinproductlist',
        component: () => import('../views/AppMarket/DouyinShop/ProductList.vue'),    // 视图文件
        meta:{
            title:'商品列表',
        }
    },
    {
        path: '/quality',
        name: 'quality',
        component: () => import('../views/AppMarket/Refine/Quality.vue'),    // 视图文件
        meta:{
            title:'诊断中心',
        }
    },
    {
        path: '/copyrecords',
        name: 'copyrecords',
        component: () => import('../views/AppMarket/DouyinShop/CopyRecords.vue'),    // 视图文件
        meta:{
            title:'复制记录',
        }
    },
    {
        path: '/uploadrecords',
        name: 'uploadrecords',
        component: () => import('../views/AppMarket/DouyinShop/UploadRecords.vue'),    // 视图文件
        meta:{
            title:'上传记录',
        }
    },
    {
        path: '/sizetemplate',
        name: 'sizetemplate',
        component: () => import('../views/AppMarket/DouyinShop/Sizetemplate.vue'),    // 尺码模板
        meta:{
            title:'尺码模板',
        }
    },
    // 运费模板
    {
        path: '/feighttemplate',
        name: 'feighttemplate',
        component: () => import('../views/AppMarket/DouyinShop/FeightTemplate.vue'),    // 视图文件
        meta:{
            title:'运费模板',
        }
    },
    // 新建批量任务
    {
        path: '/creatTask',
        name: 'creatTask',
        component: () => import('../views/AppMarket/BatchEditTask/CreatTask.vue'),    // 视图文件
        meta:{
            title:'新建任务',
        }
    },
    // 任务记录
    {
        path: '/operationlog',
        name: 'operationlog',
        component: () => import('../views/AppMarket/BatchEditTask/Operationlog.vue'),    // 视图文件
        meta:{
            title:'任务记录',
        }
    },
    {
        path: '/editlog',
        name: 'editlog',
        component: () => import('../views/AppMarket/BatchEditTask/Editlog.vue'),    // 视图文件
        meta:{
            title:'任务明细',
        }
    },
    {
        path: '/listinganddelisting',
        name: 'listinganddelisting',
        component: () => import('../views/AppMarket/TimeTask/Listinganddelisting.vue'),    // 视图文件
        meta:{
            title:'定时上下架',
        }
    },
    {
        path: '/clearNullSales',
        name: 'clearNullSales',
        component: () => import('../views/AppMarket/TimeTask/ClearNullSales.vue'),    // 视图文件
        meta:{
            title:'清空无销量商品',
        }
    },
    {
        path: '/clearNullTraffic',
        name: 'clearNullTraffic',
        component: () => import('../views/AppMarket/TimeTask/ClearNullTraffic.vue'),    // 视图文件
        meta:{
            title:'清空无流量商品',
        }
    },
    {
        path: '/lowcostdetection',
        name: 'lowcostdetection',
        component: () => import('../views/AppMarket/Refine/Lowcostdetection.vue'),    // 视图文件
        meta:{
            title:'低价检测',
        }
    },
    {
        path: '/bugworddetection',
        name: 'bugworddetection',
        component: () => import('../views/AppMarket/Refine/Bugworddetection.vue'),    // 视图文件
        meta:{
            title:'违禁词检测',
        }
    },
    {
        path: '/cateerror',
        name: 'cateerror',
        component: () => import('../views/AppMarket/Refine/Cateerror.vue'),    // 视图文件
        meta:{
            title:'类目错放',
        }
    },
    {
        path: '/moreShopManagement',
        name: 'moreShopManagement',
        component: () => import('../views/AppMarket/FunctionSettings/MoreShopManagement.vue'),    // 视图文件
        meta:{
            title:'多店管理',
        }
    },
    {
        path: '/materiallist',
        name: 'materiallist',
        component: () => import('../views/AppMarket/Material/list.vue'),    // 视图文件
        meta:{
            title:'素材列表',
        }
    },
        {
        path: '/recyclebin',
        name: 'recyclebin',
        component: () => import('../views/AppMarket/Material/RecycleBin.vue'),    // 视图文件
        meta:{
            title:'回收站',
        }
    },
    {
        path: '/introduction',
        name: 'introduction',
        component: () => import('../views/AppMarket/Product/IntroductionView.vue'),    // 视图文件
        meta:{
            title:'产品介绍',
        }
    },
    {
        path: '/inefficient',
        name: 'inefficient',
        component: () => import('../views/AppMarket/DouyinShop/inefficient.vue'),    // 视图文件
        meta:{
            title:'低效商品',
        }
    },
    {
        path: '/Whitebackgroundimage',
        name: 'Whitebackgroundimage',
        component: () => import('../views/AppMarket/ImageEdit/white_background_image.vue'),    // 视图文件
        meta:{
            title:'白底图',
        }
    },
    {
        path: '/Sizeoptimization',
        name: 'Sizeoptimization',
        component: () => import('../views/AppMarket/ImageEdit/Size_optimization.vue'),    // 视图文件
        meta:{
            title:'尺寸优化',
        }
    },
    {   // 404 报错页面
        path: '/:catchAll(.*)', // 使用捕获所有路由的模式
        name:"Error404",
        component: NotFoundComponent,
        meta:{
            title:'没有请求的资源',
        }
    },
    {   // 500 报错页面
        path: '/500',
        name: 'Error500',
        component: server_err, // 500错误页面组件
        meta:{
            title:'服务器出错啦',
        }
    },
    {   // 没有权限
        path: '/403',
        name: 'NotPermissions',
        component: NotPermissions, // 403错误页面组件
        meta:{
            title:'没有访问权限',
        }
    },
    {   // 没有登录权限
        path: '/pleaselogin',
        name: 'NotLoginPermissions',
        component: NotLoginPermissions, // 提示登录
        meta:{
            title:'没有登录',
        }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
