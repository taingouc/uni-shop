import Vue from 'vue'
import App from './App'
// 导入网络请求的包
import { $http } from '@escook/request-miniprogram'
// 挂载到全局uni上
uni.$http = $http
// 封装的展示消息提示的方法
uni.$showMsg = function(title = '数据加载失败！', duration = 1500) {
	uni.showToast({
		title,
		duration,
		icon: 'none',
	})
}
// 配置请求根路径
$http.baseUrl = 'https://www.uinav.com'
// 挂载请求拦截器
$http.beforeRequest = function() {
	uni.showLoading({
		title: '数据加载中...',
	})
}
// 挂载响应拦截器
$http.afterRequest = function() {
	uni.hideLoading()
}
Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
	...App
})
app.$mount()
