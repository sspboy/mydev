# Vue 3 前端开发规范

## 概述

本规范基于当前项目实际技术栈制定，适用于 `mydev` 项目的日常开发与维护。

**当前项目技术栈：**
- Vue 3.5 + Vite 7
- Vue Router 4（路由文件为 TypeScript，其余均为 JavaScript）
- Vuex 4（JavaScript）
- Ant Design Vue 4（全局注册）
- Axios + LESS
- dayjs（项目中已实际使用，替代 moment）
- vue3-lazyload（图片懒加载）
- @wangeditor/editor-for-vue（富文本编辑器）
- cropperjs v2（图片裁剪，Web Components 方式）

> **重要**：当前项目以 **JavaScript** 为主，仅路由配置使用 TypeScript。本规范以 JS 示例为默认标准，TS 内容作为可选参考置于末尾章节。

---

## 项目结构规范

当前项目实际结构：

```
src/
├── assets/              # 静态资源、全局样式、业务工具类
│   └── douyinshop/      # 业务相关工具（如 ImageProcessor.js）
├── components/          # 公共组件
│   ├── common/          # 通用基础组件
│   ├── admin/           # 后台管理组件
│   └── AppMarket/       # 应用市场业务组件
├── views/               # 页面级组件（路由页面）
│   ├── admin/
│   ├── AppMarket/
│   ├── BasicSetting/
│   ├── video/
│   └── otherRes/        # 错误页面等
├── rute/                # 路由配置（实际目录名）
│   └── index.ts
├── staore/              # 状态管理（实际目录名）
│   ├── index.js
│   └── modules/
├── App.vue              # 根组件
└── main.js              # 入口文件
```

### 目录命名建议

当前 `rute/`（应为 `router/`）、`staore/`（应为 `store/`）存在拼写问题。

- **新项目/重构时**：统一使用标准拼写 `router/`、`store/`
- **存量项目**：保持现有目录名，但 skill 示例使用标准命名

---

## 命名规范

### 当前项目存在的问题

| 现状 | 问题 | 建议 |
|------|------|------|
| `nav_pagination.vue` | 下划线命名 | 统一为 `NavPagination.vue` |
| `white_background_image.vue` | 下划线命名 | 统一为 `WhiteBackgroundImage.vue` |
| `list.vue` | 过于简单 | 统一为 `MaterialList.vue` |
| `HomeView.vue` / `LoginView.vue` | View 后缀 | ✅ 允许保留，但需统一 |
| `CreatTask.vue` | 疑似拼写（Create?）| 命名需准确表意 |

### 文件命名标准

| 类型 | 命名方式 | 示例 |
|------|---------|------|
| 组件 | PascalCase | `UserProfile.vue` |
| 页面 | PascalCase，可加 `View`/`Page` 后缀 | `ProductListView.vue` |
| 工具函数 | camelCase | `formatDate.js` |
| 组合式函数 | `use` + camelCase | `useUserAuth.js` |
| 常量/配置 | 全大写 + 下划线 | `API_CONFIG.js` |
| 样式文件 | kebab-case | `user-profile.less` |

### 组件名规范

- 语义化：使用完整单词，避免缩写
- 多单词：避免单单词，防止与 HTML 元素冲突
- 父子关系清晰：父 `ProductList`，子 `ProductListItem`

---

## 组件开发规范

### 单文件组件结构

统一按以下顺序组织：

```vue
<script setup>
// 1. 导入（外部库 → 内部组件 → 工具函数）
// 2. Props / Emits 定义
// 3. 响应式数据
// 4. 计算属性
// 5. 方法
// 6. 生命周期 & Watchers
</script>

<template>
  <!-- 模板内容 -->
</template>

<style scoped lang="less">
/* 样式内容 */
</style>
```

### 默认写法：JavaScript + script setup（推荐）

```vue
<script setup>
import { ref, computed, onMounted } from 'vue'
import UserCard from './UserCard.vue'

// Props 定义
const props = defineProps({
  userId: {
    type: String,
    required: true
  },
  showAvatar: {
    type: Boolean,
    default: true
  }
})

// Emits 定义
const emit = defineEmits(['update', 'delete'])

// 响应式数据
const userInfo = ref(null)
const loading = ref(false)

// 计算属性
const displayName = computed(() => {
  return userInfo.value?.name || '匿名用户'
})

// 方法
const handleUpdate = () => {
  emit('update', userInfo.value)
}

// 生命周期
onMounted(() => {
  fetchUserData()
})
</script>
```

### 存量兼容：Options API

当前项目中 `App.vue` 等文件使用 Options API，允许继续维护，但**新组件推荐 `script setup`**。

```vue
<script>
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
dayjs.locale('zh-cn')

export default {
  data() {
    return {
      zhCN,
    }
  },
}
</script>
```

### Props 定义规范

```js
const props = defineProps({
  // 基础类型，必填
  title: {
    type: String,
    required: true
  },
  // 有默认值
  pageSize: {
    type: Number,
    default: 10
  },
  // 对象类型，工厂函数
  config: {
    type: Object,
    default: () => ({
      showHeader: true,
      showFooter: false
    })
  },
  // 枚举验证
  status: {
    type: String,
    validator: (value) => ['active', 'inactive', 'pending'].includes(value)
  }
})
```

### 事件命名

- 使用 `kebab-case`
- 语义化动词开头：`update`、`delete`、`confirm`、`submit`
- 配合 `v-model` 使用 `update:xxx` 命名

```vue
<!-- 子组件 -->
const emit = defineEmits(['update:modelValue', 'confirm'])

<!-- 父组件 -->
<SearchInput v-model:keyword="searchKey" @confirm="handleSearch" />
```

---

## 组合式函数（Composables）

- 必须以 `use` 开头
- 返回对象或数组，便于解构
- 内部处理好副作用清理
- 当前项目使用 JavaScript

```js
// hooks/useUserAuth.js
import { ref, onMounted, onUnmounted } from 'vue'
import { getUserInfo } from '@/api/user'

export function useUserAuth() {
  const user = ref(null)
  const isLogin = ref(false)
  const loading = ref(false)
  let timer = null

  const fetchUser = async () => {
    loading.value = true
    try {
      const res = await getUserInfo()
      user.value = res.data
      isLogin.value = true
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    fetchUser()
    timer = setInterval(fetchUser, 5 * 60 * 1000)
  })

  onUnmounted(() => {
    clearInterval(timer)
  })

  return {
    user,
    isLogin,
    loading,
    fetchUser
  }
}
```

---

## 状态管理规范

### Vuex Store 结构

当前项目使用 JavaScript + Vuex 4：

```js
// store/index.js
import { createStore, createLogger } from 'vuex'
import menu_state from './modules/menu_state'
import usermessage_state from './modules/usermessage_state'

const debug = process.env.NODE_ENV !== 'production'

export default createStore({
  modules: {
    menu: menu_state,
    member: usermessage_state
  },
  namespaced: true,
  strict: debug,
  plugins: debug ? [createLogger()] : []
})
```

### Module 规范

```js
// store/modules/user.js
const state = () => ({
  token: '',
  userInfo: null
})

const getters = {
  isLogin: (state) => !!state.token
}

const mutations = {
  SET_TOKEN(state, token) {
    state.token = token
  },
  SET_USER_INFO(state, info) {
    state.userInfo = info
  }
}

const actions = {
  async login({ commit }, credentials) {
    const { data } = await apiLogin(credentials)
    commit('SET_TOKEN', data.token)
    commit('SET_USER_INFO', data.userInfo)
    return data
  },
  logout({ commit }) {
    commit('SET_TOKEN', '')
    commit('SET_USER_INFO', null)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
```

### 使用规范

```vue
<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

// 使用 computed 保持响应式
const userInfo = computed(() => store.state.member.usermessage_state)
const isCollapsed = computed(() => store.state.menu.menu_state)

const handleLogin = (form) => {
  store.dispatch('user/login', form)
}
</script>
```

---

## 路由规范

### 当前现状

- 路由文件为 TypeScript（`rute/index.ts`）
- 其余代码均为 JavaScript
- 使用 `createWebHistory`
- 页面组件懒加载

### 规范

由于路由文件已是 TS，保持现状。如后续统一为 JS，可参考以下格式：

```js
// router/index.js
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Layout',
    component: () => import('@/views/layout/MainLayout.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/DashboardView.vue'),
        meta: {
          title: '首页',
          keepAlive: true
        }
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/LoginView.vue'),
    meta: { public: true, title: '登录' }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/otherRes/NotFoundComponent.vue'),
    meta: { title: '页面不存在' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

// 路由守卫：鉴权 + 标题设置
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  
  const token = store.state.user.token
  if (!to.meta.public && !token) {
    next('/pleaselogin')
  } else {
    next()
  }
})

export default router
```

### 路由懒加载

- 所有页面级组件必须使用 `() => import()` 懒加载
- 错误页面（404/403/500）允许同步引入或懒加载

---

## API 请求规范

### Axios 封装

```js
// utils/request.js
import axios from 'axios'
import { message } from 'ant-design-vue'
import store from '@/store'

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000
})

// 请求拦截
request.interceptors.request.use(
  (config) => {
    const token = store.state.user.token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// 响应拦截
request.interceptors.response.use(
  (response) => {
    const { data } = response
    if (data.code !== 200) {
      message.error(data.message || '请求失败')
      return Promise.reject(data)
    }
    return data
  },
  (error) => {
    const { response } = error
    if (response?.status === 401) {
      store.dispatch('user/logout')
      window.location.href = '/login'
    } else {
      message.error(error.message || '网络错误')
    }
    return Promise.reject(error)
  }
)

export default request
```

### API 模块拆分

按业务域拆分：

```
api/
├── user.js          # 用户相关
├── product.js       # 商品相关
├── order.js         # 订单相关
└── material.js      # 素材相关
```

```js
// api/user.js
import request from '@/utils/request'

export const getUserInfo = () => request.get('/user/info')
export const updateUser = (data) => request.put('/user', data)
export const deleteUser = (id) => request.delete(`/user/${id}`)
```

---

## UI 库使用规范（Ant Design Vue）

### 当前现状

- 全局注册：`app.use(Antd)`
- 使用 dayjs（不是 moment）
- 大量全局样式覆盖（字体大小 12px）

### 全局注册规范

当前采用全局注册方式，允许继续使用。如需优化包体积，可后续考虑按需引入。

```js
// main.js
import { createApp } from 'vue'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'

const app = createApp(App)
app.use(Antd)
```

### 全局样式覆盖规范

当前 `App.vue` 中有大量 `!important` 全局覆盖，**建议逐步收敛**：

```less
/* App.vue - 当前做法（允许维护，但不推荐新增） */
.ant-btn { font-size: 12px !important; }

/* 推荐做法：使用 ConfigProvider */
<a-config-provider
  :theme="{
    token: {
      fontSize: 12,
      borderRadius: 6,
    }
  }"
>
```

### dayjs 使用规范

项目中已使用 dayjs，**不要再引入 moment**（package.json 中虽有 moment，但建议逐步移除）。

```js
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.locale('zh-cn')
dayjs.extend(relativeTime)

// 使用
const formatDate = (date) => dayjs(date).format('YYYY-MM-DD HH:mm')
const fromNow = (date) => dayjs(date).fromNow()
```

---

## 业务组件规范

### 1. 图片懒加载（vue3-lazyload）

当前已在 `main.js` 全局注册：

```js
app.use(VueLazyLoad, {
  attempt: 3,
  lazyComponent: true,
})
```

**使用规范：**

```vue
<template>
  <!-- 基础用法 -->
  <img v-lazy="imageUrl" :alt="productName" />
  
  <!-- 配合 Ant Design 图片组件 -->
  <a-image v-lazy="imageUrl" :src="imageUrl" />
</template>
```

**注意事项：**
- 懒加载图片必须设置占位尺寸，避免布局抖动
- 关键首屏图片不要加 `v-lazy`

### 2. 富文本编辑器（WangEditor）

当前在 `AppMarket/copyProduct/editdes.vue` 等页面使用。

**封装为业务组件：**

```vue
<!-- components/common/WangEditor.vue -->
<script setup>
import { onBeforeUnmount, shallowRef } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import '@wangeditor/editor/dist/css/style.css'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: '请输入内容...'
  },
  height: {
    type: Number,
    default: 300
  }
})

const emit = defineEmits(['update:modelValue'])

// 使用 shallowRef 避免深度响应式带来的性能问题
const editorRef = shallowRef()

const toolbarConfig = {
  excludeKeys: ['uploadVideo', 'insertVideo'] // 根据业务禁用部分功能
}

const editorConfig = {
  placeholder: props.placeholder,
  MENU_CONF: {
    uploadImage: {
      server: '/api/upload',
      fieldName: 'file',
      maxFileSize: 5 * 1024 * 1024, // 5MB
      maxNumberOfFiles: 10,
      allowedFileTypes: ['image/*'],
      customInsert(res, insertFn) {
        insertFn(res.data.url, res.data.alt || '', res.data.href || '')
      }
    }
  }
}

const handleCreated = (editor) => {
  editorRef.value = editor
}

const handleChange = (editor) => {
  emit('update:modelValue', editor.getHtml())
}

onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor) {
    editor.destroy()
  }
})
</script>

<template>
  <div class="wang-editor-wrapper">
    <Toolbar
      :editor="editorRef"
      :defaultConfig="toolbarConfig"
      style="border-bottom: 1px solid #ccc"
    />
    <Editor
      :defaultConfig="editorConfig"
      :modelValue="modelValue"
      @onCreated="handleCreated"
      @onChange="handleChange"
      :style="{ height: height + 'px', overflowY: 'hidden' }"
    />
  </div>
</template>
```

**使用：**

```vue
<template>
  <WangEditor v-model="productDescription" :height="400" />
</template>
```

**关键规范：**
- 必须使用 `shallowRef` 存储 editor 实例
- 必须在 `onBeforeUnmount` 中调用 `editor.destroy()`
- 上传图片配置统一走封装后的 request

### 3. 图片裁剪（cropperjs v2）

当前项目使用 cropperjs v2（Web Components 方式），在 `ImageProcessor.js` 和 `Size_optimization.vue` 中使用。

**v2 与 v1 的区别：**
- v2 使用自定义元素（Custom Elements）：`<cropper-canvas>`、`<cropper-image>` 等
- 通过 Shadow DOM 隔离样式
- 无法通过 `:deep()` 穿透修改内部样式

**封装规范：**

```vue
<!-- components/common/ImageCropper.vue -->
<script setup>
import { ref, onMounted } from 'vue'
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'

const props = defineProps({
  src: {
    type: String,
    required: true
  },
  aspectRatio: {
    type: Number,
    default: 1
  },
  initialCoverage: {
    type: String,
    default: '0.8'
  }
})

const canvasRef = ref(null)
let cropperInstance = null

onMounted(() => {
  if (!canvasRef.value) return
  
  // v2 方式：使用 Web Components
  canvasRef.value.innerHTML = `
    <cropper-canvas background style="width:100%;height:100%;display:block;">
      <cropper-image 
        src="${props.src}" 
        style="width:100%;height:100%;object-fit:contain;" 
        rotatable scalable skewable translatable
      ></cropper-image>
      <cropper-shade hidden></cropper-shade>
      <cropper-handle action="select" plain></cropper-handle>
      <cropper-selection 
        initial-coverage="${props.initialCoverage}" 
        aspect-ratio="${props.aspectRatio}" 
        movable resizable zoomable keyboard
      >
        <cropper-grid role="grid" bordered covered></cropper-grid>
        <cropper-crosshair centered></cropper-crosshair>
        <cropper-handle action="move" theme-color="rgba(255,255,255,0.35)"></cropper-handle>
      </cropper-selection>
    </cropper-canvas>
  `
})

const getCroppedImage = () => {
  return new Promise((resolve, reject) => {
    const canvas = canvasRef.value?.querySelector('cropper-canvas')
    if (!canvas) {
      reject(new Error('Cropper not initialized'))
      return
    }
    // 调用 cropperjs v2 API 获取裁剪结果
    // 具体 API 根据业务实现
  })
}

defineExpose({ getCroppedImage })
</script>

<template>
  <div ref="canvasRef" class="image-cropper"></div>
</template>

<style scoped lang="less">
.image-cropper {
  width: 100%;
  height: 400px;
}
</style>
```

**关键规范：**
- Shadow DOM 内部样式无法通过 `:deep()` 穿透，需通过组件属性或 CSS 变量控制
- 必须在组件卸载时清理事件监听
- 图片地址使用 HTTPS，避免跨域问题

### 4. 视频播放（video.js / vue3-video-play）

当前 `vue3-video-play` 在 `main.js` 中被注释，`video.js` 未搜到实际使用。

**如需启用，推荐封装：**

```vue
<!-- components/common/VideoPlayer.vue -->
<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'

const props = defineProps({
  src: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'video/mp4'
  },
  poster: {
    type: String,
    default: ''
  }
})

const videoRef = ref(null)
let player = null

onMounted(() => {
  if (!videoRef.value) return
  player = videojs(videoRef.value, {
    controls: true,
    preload: 'auto',
    fluid: true,
    poster: props.poster
  })
})

onBeforeUnmount(() => {
  if (player) {
    player.dispose()
    player = null
  }
})
</script>

<template>
  <video
    ref="videoRef"
    class="video-js vjs-default-skin vjs-big-play-centered"
  >
    <source :src="src" :type="type" />
  </video>
</template>
```

---

## 样式规范

### 使用 Less 预处理器

- 组件级样式使用 `scoped`
- 全局样式收敛到 `assets/styles/`

```vue
<style scoped lang="less">
.product-card {
  padding: 16px;
  background: #fff;
  border-radius: 8px;

  &__header {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
  }

  &__title {
    font-size: 14px;
    font-weight: 500;
  }

  // 状态修饰符
  &--disabled {
    opacity: 0.5;
    pointer-events: none;
  }
}
</style>
```

### 当前全局样式优化建议

当前 `App.vue` 中有大量 Ant Design 组件的 `!important` 覆盖，建议：

1. **短期**：允许维护现有覆盖，但新增覆盖需注释说明原因
2. **中期**：通过 `ConfigProvider` 的 `theme` 配置替代硬覆盖
3. **长期**：移除 `App.vue` 中的全局样式，迁移到 `assets/styles/` 并按模块拆分

```less
// assets/styles/antd-override.less
// 统一覆盖 Ant Design 默认样式

// 表单字体
.ant-form-item-label > label,
.ant-form-item-control {
  font-size: 12px;
}

// 滚动条样式
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-thumb {
  background-color: #9b9b9b;
  border-radius: 5px;
}
```

---

## 性能优化规范

### 组件优化

- 使用 `v-once` 渲染静态内容
- 使用 `shallowRef` / `shallowReactive` 处理大型对象（如编辑器实例、地图数据）
- 大数据列表考虑虚拟滚动

```vue
<template>
  <div v-once>
    <AppFooter />
  </div>
</template>
```

### 资源优化

- 图片使用 `vue3-lazyload` 懒加载
- 路由页面懒加载
- 第三方库（WangEditor、video.js）仅在需要时动态导入

```js
// 动态导入大型库
const loadEditor = () => import('@wangeditor/editor')
```

### 状态优化

- 避免在 `computed` 中执行副作用
- 及时清理 `setInterval`、`EventListener`、Editor 实例、Video.js 实例

---

## 代码审查清单

- [ ] 组件名使用 PascalCase，避免下划线命名
- [ ] 新组件优先使用 `<script setup>`
- [ ] Props 定义完整，有类型和默认值
- [ ] 事件名使用 kebab-case，语义清晰
- [ ] 组合式函数以 use 开头，处理好副作用清理
- [ ] API 请求统一走封装后的 request
- [ ] 样式使用 scoped，避免新增全局 `!important`
- [ ] 路由页面使用懒加载
- [ ] WangEditor / cropperjs / video.js 实例在卸载时正确销毁
- [ ] 使用 dayjs 而非 moment 处理日期
- [ ] 无 console.log 等调试代码残留
- [ ] 敏感操作（删除、批量操作）需二次确认


---

## 工具推荐

- **ESLint**：`eslint-plugin-vue` 检查 Vue 规范
- **Vite DevTools**：`vite-plugin-vue-devtools` 调试
- **图标**：优先使用 `@ant-design/icons-vue`
- **日期处理**：使用 `dayjs`（已内置），逐步移除 `moment`

---

*本规范随项目迭代持续更新。新增业务组件时，请在此补充相关规范。*
