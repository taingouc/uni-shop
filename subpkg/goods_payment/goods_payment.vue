<template>
	<view class="order-contianer">
		<view class="order-box">
			<my-address></my-address>
			<view class="order-title">
				<text class="order-info">订单信息</text>
				<text>订单编号:{{orderNumber}}</text>
			</view>
			<!-- uni-swipe-action 是最外层包裹性质的容器 -->
			<view class="order-goods">
				<block v-for="(goods, i) in orderGoods" :key="i">
					<goods class="order-item" :goodsInfo="goods" :show-number="true" @num-change="numberChangeHandler">
					</goods>
				</block>
			</view>
			<view class="order-btn">
				<button type="warn" @click="open">支付￥{{goodsPrices | tofixed}}</button>
			</view>
			<uni-popup ref="popup">
				<view class="payment_keyboard">
					<view class="payment_header">
						<uni-icons type="closeempty" size="30" @click="closeKeyboard"></uni-icons>
						<view class="payment_title">请输入支付密码</view>
					</view>
					<view class="payment_price">
						<view> 微信支付 </view>
						<view class="price"> ￥{{goodsPrices | tofixed}} </view>
					</view>
					<view class="payment_pwd">
						<view v-for="(k, i) in 6" :key="i">{{passwordArr[i]}}</view>
					</view>
					<view class="payment_number">
						<view v-for="(number,i) in numberArr" :key="i" @click="inputPassword(number)">{{number}}</view>
					</view>
					<uni-icons class="payment_delete" type="clear" size="30" @click="deletePwd"></uni-icons>
				</view>
			</uni-popup>
		</view>
	</view>
</template>

<script>
	import { mapState, mapMutations, mapGetters } from 'vuex'
	export default {
		data() {
			return {
				// 商品支付价格
				goodsPrices: 0,
				// 数字键盘
				numberArr: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
				// 输入密码
				passwordArr: [],
				// 跳转时间
				seconds: 3,
				// 跳转页面传来的参数，判断展示购物车商品还是立即购买商品
				redirectUrl: {}
			}
		},
		methods: {
			...mapMutations('m_cart', ['updateGoodsCount', 'removeGoodsById', 'deleteGoodsInfo']),
			...mapMutations('m_user', ['updateRedirectInfo']),
			// 商品增减
			numberChangeHandler(e) {
				e.redirectUrl = this.redirectUrl
				this.updateGoodsCount(e)
			},
			// 通过组件定义的ref调用uni-popup方法 
			open() {
				// 1.判断用户是否选择了收货地址
				if (!this.addstr) return uni.$showMsg('请选择收货地址！')
				// 2. 判断用户是否登录了
				if (!this.token) return this.delayNavigate()
				this.$refs.popup.open('bottom')
			},
			// 延迟导航到 my 页面
			delayNavigate() {
				//  展示提示消息，此时 seconds 的值等于 3
				this.showTips(this.seconds)
				// 创建定时器，每隔 1 秒执行一次
				this.timer = setInterval(() => {
					// 先让秒数自减 1
					this.seconds--
					// 判断秒数是否 <= 0
					if (this.seconds <= 0) {
						// 重置seconds,退出登录后保持有效
						this.seconds = 3
						//  清除定时器
						clearInterval(this.timer)
						// 跳转到 my 页面
						uni.switchTab({
							url: '/pages/my/my',
							success: () => {
								this.updateRedirectInfo({
									openType: "navigateTo",
									from: "/subpkg/goods_payment/goods_payment"
								})
							}
						})
						//终止后续代码的运行（当秒数为 0 时，不再展示 toast 提示消息）
						return
					}
					// 再根据最新的秒数，进行消息提示
					this.showTips(this.seconds)
				}, 1000)
			},
			// 展示倒计时的提示消息
			showTips(n) {
				// 调用 uni.showToast() 方法，展示提示消息
				uni.showToast({
					// 不展示任何图标
					icon: 'none',
					// 提示的消息
					title: '请登录后再支付！' + n + ' 秒后自动跳转到登录页',
					// 为页面添加透明遮罩，防止点击穿透
					mask: true,
					// 1.5 秒后自动消失
					duration: 1500
				})
			},
			// 点击键盘关闭事件
			closeKeyboard() {
				this.$refs.popup.close()
			},
			// 点击键盘数字事件
			inputPassword(number) {
				this.passwordArr.push('*')
				if (this.passwordArr.length == 6) {
					uni.showLoading({
						title: '正在支付...'
					})
					setTimeout(() => {
						uni.hideLoading()
						this.$refs.popup.close()
						uni.showToast({
							title: '支付成功！',
							icon: 'success',
							duration: 1500
						})
						this.passwordArr = []
						// 删除购物车结算商品信息
						this.orderGoods.forEach(goods => {
							this.removeGoodsById(goods.goods_id)
						})
						// 删除立即购买商品信息
						this.deleteGoodsInfo()
					}, 500)
				}
			},
			// 点击删除密码事件
			deletePwd() {
				this.passwordArr.pop()
			}
		},
		onLoad(options) {
			this.redirectUrl = options
		},
		computed: {
			...mapState('m_cart', ['orderNumber', 'cart', 'goodsInfo']),
			...mapState('m_user', ['token', 'redirectInfo']),
			...mapGetters('m_cart', ['total', 'goodsPrice']),
			...mapGetters('m_user', ['addstr']),
			orderGoods() {
				if (this.redirectUrl.url !== 'cart') {
					return this.goodsInfo
				} else {
					return this.cart.filter(goods => goods.goods_state)
				}
			}
		},
		watch: {
			orderGoods: {
				handler(newVal) {
					this.goodsPrices = 0
					newVal.forEach(goods => {
						this.goodsPrices += goods.goods_price * goods.goods_count
					})
				},
				deep: true,
				immediate: true
			}
		},
		filters: {
			// 把数字处理为带两位小数点的数字
			tofixed(num) {
				return Number(num).toFixed(2)
			}
		}
	}
</script>

<style lang="scss">
	.order-contianer {
		width: 100%;
		background-color: #f4f5f7;
		padding: 10px 10px 60px 10px;
		box-sizing: border-box;

		.order-box {
			width: 100%;
			display: flex;
			flex-direction: column;
			background-color: #ffffff;
			border-radius: 10px;
			color: #c6c6c6;

			.order-title {
				height: 50px;
				line-height: 50px;
				padding: 0 5px 0 20px;
				border-bottom: 2px solid #f7f7f7;
				position: relative;
				font-size: 12px;
				display: flex;
				justify-content: space-between;

				.order-info {
					font-weight: bold;
					color: #C00000;
				}

				&::before {
					content: '';
					display: block;
					position: absolute;
					width: 3px;
					height: 15px;
					background-color: red;
					top: 50%;
					left: 10px;
					transform: translate(0, -50%);
				}
			}

			.order-goods {
				display: flex;
				flex-direction: column;
				align-items: center;

				.order-item {
					transform: scale(0.9);
				}
			}

			.order-btn {
				position: fixed;
				padding: 5px 10px;
				box-sizing: border-box;
				width: 100%;
				bottom: 10px;
				left: 0;
			}
		}
	}

	.payment_keyboard {
		position: absolute;
		top: -400px;
		width: 100%;
		height: 500px;
		background-color: #ffffff;
		border-radius: 10px 10px 0 0;
		padding-top: 20px;

		.payment_header {
			width: 100%;
			height: 40px;
			padding: 0 10px;
			box-sizing: border-box;
			display: flex;
			align-items: center;

			.payment_title {
				padding-right: 20px;
				flex: 1;
				text-align: center;
				line-height: 40px;
				color: black;
			}
		}

		.payment_price {
			height: 80px;
			margin: 0 15px;
			padding-bottom: 20px;
			box-sizing: border-box;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			color: black;
			border-bottom: 1px solid #f6f6f6;

			.price {
				font-size: 24px;
				font-weight: bold;
			}
		}

		.payment_pwd {
			width: 100%;
			height: 80px;
			padding: 20px 50px;
			box-sizing: border-box;
			display: flex;
			justify-content: space-around;
			align-items: center;

			view {
				width: 40px;
				height: 40px;
				background-color: #f2f2f2;
				text-align: center;
				line-height: 50px;
				color: black;
				font-size: 24px;
			}
		}

		.payment_number {
			width: 100%;
			height: 180px;
			display: flex;
			flex-wrap: wrap;
			justify-content: center;

			view {
				width: 33%;
				height: 45px;
				text-align: center;
				line-height: 40px;
				color: black;
				border-top: 1px solid #f6f6f6;
				font-size: 12px;

				&:nth-child(10) {
					border-right: 1px solid #f6f6f6cc;
				}

				&:nth-child(2),
				&:nth-child(3),
				&:nth-child(5),
				&:nth-child(6),
				&:nth-child(8),
				&:nth-child(9),
				&:nth-child(10) {
					border-left: 1px solid #f6f6f6;
				}

				&:nth-child(7),
				&:nth-child(9),
				&:nth-child(10) {
					border-bottom: 1px solid #f6f6f6
				}


				&:active {
					background-color: #f2f2f2;
				}
			}
		}

		.payment_delete {
			position: absolute;
			width: 33%;
			height: 45px;
			right: 0;
			top: 360px;
			display: flex;
			justify-content: center;
			align-items: center;

			&:active {
				background-color: #f2f2f2;
			}
		}
	}
</style>
