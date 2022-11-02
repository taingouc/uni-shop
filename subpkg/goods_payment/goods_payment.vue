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
				<button type="warn">支付￥{{goodsPrice | tofixed}}</button>
			</view>
		</view>
	</view>
</template>

<script>
	import { mapState, mapMutations, mapGetters } from 'vuex'
	export default {
		data() {
			return {

			}
		},
		methods: {
			...mapMutations('m_cart', ['updateGoodsCount']),
			// 商品增减
			numberChangeHandler(e) {
				this.updateGoodsCount(e)
			}
		},
		computed: {
			...mapState('m_cart', ['orderNumber', 'cart']),
			...mapGetters('m_cart', ['total', 'goodsPrice']),
			orderGoods() {
				return this.cart.filter(goods => goods.goods_state)
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
		padding: 10px 10px 50px 10px;
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
				bottom: 0;
				left: 0;
			}
		}
	}
</style>
