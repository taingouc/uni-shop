<template>
	<view>
		<view class="receipt_item" v-for="(goods,i) in goodsPayment" :key="i">
			<view class="receipt_title">
				<text>订单详情</text>
				<text>订单编号 : {{goods.orderNumber}}</text>
			</view>
			<uni-collapse>
				<uni-collapse-item>
					<template v-slot:title>
						<goods :goodsInfo="goods.orderGoods[0]"></goods>
					</template>
					<block v-for="item in goods.orderGoods.slice(1)" :key="item.goods_id">
						<goods :goodsInfo="item"></goods>
					</block>
				</uni-collapse-item>
			</uni-collapse>
			<view class="receipt_footer">
				<view><text>温馨提示：您的订单预计{{mouth}}月{{day}}日09:00-15:00送达</text></view>
				<view>实付款：<text>￥{{goods.orderPrice |tofixed}}</text></view>
			</view>
		</view>
		<empty v-if="goodsPayment.length==0"></empty>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	export default {
		data() {
			return {
				mouth: null,
				day: null
			};
		},
		onLoad(options) {
			if (options.url == 'all') {
				uni.setNavigationBarTitle({
					title: "全部订单"
				})
			}
			const date = new Date()
			this.mouth = date.getMonth() + 1
			this.day = date.getDate() + 1
		},
		computed: {
			...mapState('m_cart', ['goodsPayment'])
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
	.receipt_item {
		width: 100%;
		padding: 10px 5px;
		box-sizing: border-box;

		.receipt_title {
			width: 100%;
			height: 60px;
			font-size: 12px;
			padding: 0 10px 0 25px;
			box-sizing: border-box;
			display: flex;
			justify-content: space-between;
			align-items: center;
			background-color: #fff;
			border-bottom: 1px solid #ccc;
			position: relative;

			&::before {
				content: '';
				display: block;
				position: absolute;
				width: 4px;
				height: 15px;
				background-color: #C00000;
				left: 12px;
			}

			text {
				&:nth-child(1) {
					color: #C00000;
					font-weight: bold;
				}

				&:nth-child(2) {
					color: #CCC;
				}
			}
		}

		.receipt_footer {
			width: 100%;
			height: 50px;
			background-color: #fff;
			padding: 5px 10px 5px 15px;
			font-size: 12px;
			box-sizing: border-box;
			display: flex;
			justify-content: space-between;
			align-items: center;
			border-radius: 0 0 10px 10px;
			color: #2e2e2e;

			view {
				&:nth-child(2) {
					text {
						font-size: 12px;
						color: #C00000;
					}
				}
			}
		}
	}

	.goods-item {
		width: unset !important;
		transform: scale(0.9);
	}
</style>
