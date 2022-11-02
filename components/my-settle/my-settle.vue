<template>
	<!-- 最外层的容器 -->
	<view class="my-settle-container">
		<!-- 全选区域 -->
		<label class="radio" @click="changeCheck">
			<radio color="#C00000" :checked="isFullCheck" /><text>全选</text>
		</label>
		<!-- 合计区域 -->
		<view class="amount-box">
			合计:<text class="amount">￥{{goodsPrice | tofixed}}</text>
		</view>
		<!-- 结算按钮 -->
		<view class="btn-settle" @click="settlement">结算 ( {{total}} )</view>
	</view>
</template>

<script>
	import { mapGetters, mapMutations, mapState } from 'vuex'
	export default {
		name: "my-settle",
		data() {
			return {
				seconds: 3, // 自动跳转的时间
				timer: null // 定时器的 Id
			}
		},
		methods: {
			...mapMutations('m_cart', ['changeGoodsState', 'saveOrderNumber']),
			...mapMutations('m_user', ['updateRedirectInfo']),
			// 点击修改全选状态
			changeCheck() {
				this.changeGoodsState(!this.isFullCheck)
			},
			// 点击了结算按钮
			settlement() {
				// 1. 先判断是否勾选了要结算的商品
				if (this.total == 0) return uni.$showMsg('请选择要结算的商品！')

				// 2. 再判断用户是否选择了收货地址
				if (!this.addstr) return uni.$showMsg('请选择收货地址！')

				// 3. 最后判断用户是否登录了
				if (!this.token) return this.delayNavigate()

				// 4.用户已经登录，实现微信支付功能
				this.payOrder()
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
									openType: "switchTab",
									from: "/pages/cart/cart"
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
					title: '请登录后再结算！' + n + ' 秒后自动跳转到登录页',
					// 为页面添加透明遮罩，防止点击穿透
					mask: true,
					// 1.5 秒后自动消失
					duration: 1500
				})
			},
			// 微信支付
			async payOrder() {
				// 创建订单 组织订单的信息对象
				const orderNumber = this.generateOrderNumber()
				// 存储到vuex和本地storage中
				this.saveOrderNumber(orderNumber)
				// 跳转至订单详情页
				uni.navigateTo({
					url: '/subpkg/goods_payment/goods_payment'
				})
			},
			// 随机生成18位不重复的订单编号，length 随机后缀字符长度，默认为4
			generateOrderNumber(length = 4) {
				const now = new Date();
				let year = now.getFullYear().toString();
				let month = (now.getMonth() + 1).toString();
				let day = now.getDate().toString();
				let hour = now.getHours().toString();
				let minutes = now.getMinutes().toString();
				let seconds = now.getSeconds().toString();
				// 存放订单号
				let num = '';
				// N位随机数(加在时间戳后面)
				for (var i = 0; i < length; i++) {
					num += Math.floor(Math.random() * 10);
				}
				return year + month + day + hour + minutes + seconds + num;
			}
		},
		computed: {
			...mapGetters('m_cart', ['total', 'isFullCheck', 'goodsPrice']),
			...mapGetters('m_user', ['addstr']),
			...mapState('m_user', ['token']),
			...mapState('m_cart', ['cart'])
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
	.my-settle-container {
		/* 底部固定定位 */
		position: fixed;
		bottom: 0;
		left: 0;
		/* 设置宽高和背景色 */
		width: 100%;
		height: 50px;
		background-color: white;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-left: 5px;
		font-size: 14px;

		.radio {
			display: flex;
			align-items: center;
		}

		.amount {
			color: #c00000;
		}

		.btn-settle {
			height: 50px;
			min-width: 100px;
			background-color: #c00000;
			color: white;
			line-height: 50px;
			text-align: center;
			padding: 0 10px;
		}
	}
</style>
