import axios from "axios";// 网络请求方法
import * as utils from '@/assets/JS_Model/public_model'; // API地址
import { message } from 'ant-design-vue';

    // 全局配置
    axios.defaults.timeout = 30000  // 10秒

    // 添加响应拦截器
    axios.interceptors.response.use(function (response) {

        // 对响应数据做点什么
        var res_info = {
                "NOT_Login_Power":"未登录或登录过期.",
                "isv.invalid_ip":"IP被限制.",
                "isv.access-token-expired":"Token请过期重新授权.",
                "dop.authorization-closed":"授权已被关闭，请重新打开授权开关.",
            }

        Object.keys(res_info).forEach(key=>{
            var key_text = key;
            var message_text = res_info[key];
            if(response.data.sub_code == key_text){
                // console.log(key, res_info[key])
                message.error(message_text)
            }
        })

        if(response.data.sub_code == 'NOT_Login_Power'){
            // 当前窗口打开
            window.open('/', '_self');
        }

        // console.log(response)
        return response;

    }, function (error) {

        // 对响应错误做点什么
        return Promise.reject(error);

    });

const API = new utils.A_Patch()// 请求接口

  export class TOOL{

    Fun_ = {
    
        // 笛卡尔积算法
        cartesianProduct:(sets)=> {
            return sets.reduce((acc, currentSet) =>
                acc.flatMap(accItem => currentSet.map(currentItem => [...accItem, currentItem])),
                [[]]
            );
        },
        // 验证值是否为空
        isEmpty:(value) =>{
            return (
                value == null ||
                (typeof value === "string" && value.trim() === "") ||
                (Array.isArray(value) && value.length === 0) ||
                (typeof value === "object" && Object.keys(value).length === 0)
            );
        },
        // 提示信息
        message:(type,msg)=>{
            message.config({
                duration: 2,
                maxCount: 3,
            })
            console.log(message)
            message[type](msg)
        },
        // 加载js文件
        loadScript:(src, opts = {})=>{
            return new Promise((resolve, reject) => {
                const script = document.createElement('script')
                script.src = src
                script.async = true
                if (opts.crossOrigin) script.crossOrigin = opts.crossOrigin
                script.onload  = () => resolve(script)
                script.onerror = () => reject(new Error(`Failed to load ${src}`))
                document.head.appendChild(script)
            })
        },
        // 复制内容到剪贴板
        copyToClipboard:async(text)=> {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            try {
                document.execCommand('copy');
                // console.log('已复制（降级方案）');
                message.success('复制成功')

            } catch (err) {
                console.error('复制失败:', err);
            }
            document.body.removeChild(textarea);
        },

    }




    // 抖音前端token请求
    mc_token = {

        // 刷新前端token-shop-id：：本地存储、删除、验证过期、重新获取
        resh_mc_token:async(shop_id)=>{

            var Key = 'MCtoken'
            var res = localStorage.getItem(Key)// 请求本地key

            // remove_mc_token(Key)
            if(res === null || res === 'undefined'){ // 本地无token:请求新得token缓存到本地数据库

                await this.mc_token.http_get_mc_token(shop_id)// 获取新得token，并缓存到本地；

            }else{ // 本地有token：
                
                var token_obj = JSON.parse(res)
                // console.log(token_obj)
                if(token_obj[shop_id] === undefined || token_obj[shop_id] === null){ // 店铺对应token 不存在
                    this.mc_token.remove_mc_token(Key)      // 清除本地token
                    await this.mc_token.http_get_mc_token(shop_id) // 获取新得token，并缓存到本地；

                }else{ // 店铺对应token不存在
                    var expired_time = token_obj[shop_id].expire_time
                    var time_verify_res= this.mc_token.verify_mc_token_expires(expired_time) // 验证时间是否过期
                    if(time_verify_res){// 没有过期
                    }else{// 已经过期
                        console.log('组件tonken过期')
                        this.mc_token.remove_mc_token(Key)      // 清除本地token
                        await this.mc_token.http_get_mc_token(shop_id) // 获取新得token，并缓存到本地；
                    }

                    
                }


            }
        },
        // 获取新得token，并缓存到本地；
        http_get_mc_token:(shop_id)=>{

            return new Promise((resolve,reject)=>{
                axios.get(API.AppSrtoreAPI.shoptool.Mctoken).then((res)=>{
                    
                    var o = {}

                    var mc_token = res.data.data
                    
                    o[shop_id] = mc_token // 店铺id到

                    localStorage.setItem('MCtoken',JSON.stringify(o))

                    resolve(res)
                }).catch((err)=>{
                    reject(err)
                })
            })
        },
        // 验证时间是否过期
        verify_mc_token_expires:(timestamp)=>{

            var now = Math.floor(new Date().getTime() / 1000); // 现在时间
            // const expire = new Date(timestamp * 1000); // 到期时间
            // const now_time = new Date(now * 1000); // 到期时间
            // console.log('过期时间',expire.toLocaleString());
            // console.log('现在时间',now_time.toLocaleString());
            // console.log('过期时间',timestamp);
            // console.log('现在时间',now);
            if(timestamp > now){ // 过期时间大于现在时间：：有效
                return true
            }else{ // 过期时间小于现在时间：：无效
                return false
            }
        },
        // 删除本地缓存
        remove_mc_token:(Key)=>{
            localStorage.removeItem(Key)
        },

    }

    Http_= {

        get:(url,data)=>{
            return new Promise((resolve,reject)=>{
                axios.get(url,data).then((res)=>{
                    resolve(res)
                }).catch((err)=>{
                    reject(err)
                })
            }) 
        },

        post:(url,data)=>{
            return new Promise((resolve,reject)=>{
                axios.post(url,data).then((res)=>{
                    resolve(res)
                }).catch((err)=>{
                    reject(err)
                })
            })
        },
        
        delete:(url,data)=>{
            return new Promise((resolve,reject)=>{
                axios.delete(url,data).then((res)=>{
                    resolve(res)
                }).catch((err)=>{
                    reject(err)
                })
            })
        },
        
        update:(url,data)=>{
            return new Promise((resolve,reject)=>{
                axios.put(url,data).then((res)=>{
                    resolve(res)
                }).catch((err)=>{
                    reject(err)
                })
            })
        }
    }

}