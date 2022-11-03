import Vue from 'vue'
import App from './App'
// 导入网络请求的包
import { $http } from '@escook/request-miniprogram'
// 导入 store 的实例对象
import store from './store/index.js'


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
$http.beforeRequest = function(options) {
	uni.showLoading({
		title: '数据加载中...'
	})
	// 判断请求的是否为有权限的 API 接口
	if (options.url.indexOf('/my/') !== -1) {
		// 为请求头添加身份认证字段
		options.header = {
			// 字段的值可以直接从 vuex 中进行获取
			Authorization: store.state.m_user.token
		}
	}
}
// 挂载响应拦截器
$http.afterRequest = function() {
	uni.hideLoading()
}
Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
	...App,
	// 将 store 挂载到 Vue 实例上
	store
})
app.$mount()
