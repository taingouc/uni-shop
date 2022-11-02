<template>
	<view class="login-container">
		<!-- 提示登录的图标 -->
		<uni-icons type="contact-filled" size="100" color="#AFAFAF"></uni-icons>
		<!-- 登录按钮 -->
		<button type="primary" class="btn-login" @click="getUserProfile">一键登录</button>
		<!-- 登录提示 -->
		<view class="tips-text">登录后尽享更多权益</view>
	</view>
</template>

<script>
	import { mapMutations, mapState } from 'vuex'
	export default {
		name: "my-login",
		data() {
			return {}
		},
		methods: {
			...mapMutations('m_user', ['updateUserInfo', 'updateToken', 'updateRedirectInfo']),
			// 获取微信用户的基本信息
			getUserProfile(e) {
				wx.getUserProfile({
					desc: '用于获取个人资料', // 这里的desc在微信开发文档中要求必须填写的
					// 成功时的回调
					success: (res) => {
						// 获取用户信息成功， res.userInfo 就是用户的基本信息,将用户的基本信息存储到 vuex 中
						this.updateUserInfo(res.userInfo)
						console.log(res.userInfo);
						// 获取登录成功后的 Token 字符串
						this.getToken(res)
					},
					// 失败时的回调
					fail: (err) => {
						// 用户取消授权
						if (err.errMsg === 'getUserProfile:fail auth deny') return uni.$showMsg('您取消了登录授权！')
					}
				})
			},
			// 调用登录接口，换取永久的 token
			async getToken(info) {
				// 调用微信登录接口
				const [err, res] = await uni.login().catch(err => err)
				// 判断是否 uni.login() 调用失败
				if (err || res.errMsg !== 'login:ok') return uni.$showError('登录失败！')
				// 更新 vuex 中的 token
				this.updateToken(res.code)
				uni.showToast({
					title: '登录成功！',
					icon: 'success',
					duration: 1000
				})
				setTimeout(() => {
					// redirectInfo 不为 null，并且导航方式为 switchTab
					if (this.redirectInfo && this.redirectInfo.openType === 'switchTab') {
						// 调用小程序提供的 uni.switchTab() API 进行页面的导航
						uni.switchTab({
							// 要导航到的页面地址
							url: this.redirectInfo.from,
							// 导航成功之后，把 vuex 中的 redirectInfo 对象重置为 null
							complete: () => {
								this.updateRedirectInfo(null)
							}
						})
					}
				}, 1000)

			}
		},
		computed: {
			...mapState('m_user', ['redirectInfo'])
		}
	}
</script>

<style lang="scss">
	.login-container {
		// 登录盒子的样式
		height: 750rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background-color: #f8f8f8;
		position: relative;
		overflow: hidden;

		// 绘制登录盒子底部的半椭圆造型
		&::after {
			content: ' ';
			display: block;
			position: absolute;
			width: 100%;
			height: 40px;
			left: 0;
			bottom: 0;
			background-color: white;
			border-radius: 100%;
			transform: translateY(50%);
		}

		// 登录按钮的样式
		.btn-login {
			width: 90%;
			border-radius: 100px;
			margin: 15px 0;
			background-color: #c00000;
		}

		// 按钮下方提示消息的样式
		.tips-text {
			font-size: 12px;
			color: gray;
		}
	}
</style>
