<template>

	<view class="goods-item">
		<!-- 商品左侧图片区域 -->
		<view class="goods-item-left">
			<radio :checked="goodsInfo.goods_state" color="#C00000" v-if="showRadio" @click="radioClickHandler"></radio>
			<image :src="goodsInfo.goods_small_logo || defaultPic" class="goods-pic" @click="gotoGoodsinfo(goodsInfo)">
			</image>
		</view>
		<!-- 商品右侧信息区域 -->
		<view class="goods-item-right">
			<!-- 商品标题 -->
			<view class="goods-name" @click="gotoGoodsinfo(goodsInfo)">{{goodsInfo.goods_name}}</view>
			<view class="goods-info-box">
				<!-- 商品价格 -->
				<view class="goods-price">￥{{goodsInfo.goods_price | tofixed}}</view>
				<!-- 商品数量 -->
				<uni-number-box :min="1" v-if="showNumber" :value="goodsInfo.goods_count" @change="numChangeHandler">
				</uni-number-box>
				<view class="goods_info" v-if="!showNumber&&goodsInfo.goods_count">
					<view class="goods_price">
						<text>￥</text>
						<text>{{goodsInfo.goods_price*goodsInfo.goods_count |tofixed}}</text>
					</view>
					<view class="goods_number">
						<text>x{{goodsInfo.goods_count}}</text>
					</view>
				</view>
			</view>
		</view>
	</view>

</template>

<script>
	export default {
		name: "goods",
		data() {
			return {
				// 默认的空图片
				defaultPic: 'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png'
			}
		},
		props: {
			// 商品的信息对象
			goodsInfo: {
				type: Object,
				defaul: {},
			},
			// 是否展示图片左侧的 radio选择 
			showRadio: {
				type: Boolean,
				default: false,
			},
			// 是否展示图片右侧商品数量增减
			showNumber: {
				type: Boolean,
				default: false,
			}
		},
		methods: {
			// radio 组件的点击事件处理函数
			radioClickHandler() {
				// 通过 this.$emit() 触发外界通过 @ 绑定的 radio-change 事件，
				// 同时把商品的 Id 和 勾选状态 作为参数传递给 radio-change 事件处理函数
				this.$emit('radio-change', {
					// 商品的 Id
					goods_id: this.goodsInfo.goods_id,
					// 商品最新的勾选状态
					goods_state: !this.goodsInfo.goods_state
				})
			},
			// NumberBox 组件的 change 事件，商品数量发生变化,val为最新值
			numChangeHandler(val) {
				// 通过 this.$emit() 触发外界通过 @ 绑定的 num-change 事件
				this.$emit('num-change', {
					// 商品的 Id
					goods_id: this.goodsInfo.goods_id,
					// 商品的最新数量
					goods_count: val
				})
			},
			// 点击图片或文字跳转至商品详情页
			gotoGoodsinfo(goodsInfo) {
				uni.navigateTo({
					url: '/subpkg/goods_detail/goods_detail?goods_id=' + goodsInfo.goods_id
				})
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
	.goods-item {
		// 让 goods-item 项占满整个屏幕的宽度
		width: 750rpx;
		// 设置盒模型为 border-box
		box-sizing: border-box;
		display: flex;
		padding: 10px 5px;
		border-bottom: 1px solid #f0f0f0;

		.goods-item-left {
			margin-right: 5px;
			display: flex;
			justify-content: center;
			align-items: center;

			.goods-pic {
				width: 100px;
				height: 100px;
				display: block;
			}
		}

		.goods-item-right {
			display: flex;
			flex: 1;
			flex-direction: column;
			justify-content: space-between;

			.goods-name {
				font-size: 13px;
			}

			.goods-info-box {
				display: flex;
				align-items: center;
				justify-content: space-between;
			}

			.goods-price {
				font-size: 16px;
				color: #c00000;
			}
		}
	}

	.goods_info {
		width: 100px;
		height: 50px;
		color: black;
		position: absolute;
		left: 270px;
		top: 60px;
		text-align: center;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: flex-end;

		view {
			&:nth-child(1) {
				color: #242424;

				text {
					&:nth-child(1) {
						font-size: 12px;
					}
				}
			}

			&:nth-child(2) {
				color: #ccc;
				font-size: 16px;
			}
		}
	}
</style>
