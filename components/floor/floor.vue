<template>
	<!-- 楼层区域 -->
	<view class="floor-list">
		<!-- 楼层标题盒子 -->
		<view class="floor-title">
			<image :src="floorData.floor_title.image_src" class="floor-title"></image>
		</view>
		<!-- 楼层图片区域盒子 -->
		<view class="floor-img-box">
			<!-- 左侧大图片的盒子 -->
			<view class="left-img-box">
				<navigator :url="floorData.product_list[0].url">
					<image :src="floorData.product_list[0].image_src"
						:style="{width: floorData.product_list[0].image_width + 'rpx'}" mode="widthFix"></image>
				</navigator>
			</view>
			<!-- 右侧 4 个小图片的盒子 -->
			<view class="right-img-box">
				<view class="right-img-item" v-for="(item,i) in rightImgInfo" :key="i">
					<navigator :url="item.url">
						<image :src="item.image_src" mode="widthFix" :style="{width: item.image_width + 'rpx'}"></image>
					</navigator>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		props: {
			floorData: {
				type: Object,
				default: {}
			}
		},
		computed: {
			rightImgInfo() {
				return this.floorData.product_list.filter((item, index) => index !== 0)
			}
		}
	}
</script>

<style lang="scss">
	.floor-list {
		width: 100%;
		display: flex;
		flex-direction: column;
	}

	.floor-title {
		height: 60rpx;
		width: 100%;
	}

	.floor-img-box {
		width: 100%;
		display: flex;
		padding: 0 10rpx;
		box-sizing: border-box;
	}

	.right-img-box {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-around;
	}
</style>
