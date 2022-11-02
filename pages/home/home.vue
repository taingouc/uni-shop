<template>
	<view>
		<!-- 顶部搜索栏 -->
		<view class="search-box">
			<search @click="gotoSearch"></search>
		</view>
		<!-- 轮播图区域 -->
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
			<!-- 循环渲染轮播图的 item 项 -->
			<swiper-item v-for="(item, i) in swiperList" :key="i">
				<navigator class="swiper-item" :url="'/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id">
					<!-- 动态绑定图片的 src 属性 -->
					<image :src="item.image_src"></image>
				</navigator>
			</swiper-item>
		</swiper>
		<!-- 分类导航区域 -->
		<view class="nav-list">
			<view class="nav-item" v-for="(item, i) in navList" :key="i" @click="navClickHandler(item)">
				<image :src="item.image_src" class="nav-img"></image>
			</view>
		</view>
		<!-- 楼层区域 -->
		<floor v-for="(item,index) in floorList" :key="index" :floorData="item"></floor>
	</view>
</template>

<script>
	// 导入自己封装的 mixin 模块
	import badgeMix from '@/mixins/tabbar-badge.js'
	export default {
		// 将 badgeMix 混入到当前的页面中进行使用
		mixins: [badgeMix],
		data() {
			return {
				// 轮播图数据
				swiperList: [],
				//  分类导航的数据列表
				navList: [],
				// 楼层数据列表
				floorList: []
			};
		},
		methods: {
			// 获取轮播图数据的方法
			async getSwiperList() {
				//  发起请求
				const { data: res } = await uni.$http.get('/api/public/v1/home/swiperdata')
				// 请求失败
				if (res.meta.status !== 200) {
					return uni.$showMsg('轮播图数据获取失败！')
				}
				this.swiperList = res.message
			},
			//  获取分类导航数据的方法
			async getNavList() {
				const { data: res } = await uni.$http.get('/api/public/v1/home/catitems')
				if (res.meta.status !== 200) return uni.$showMsg('分类导航数据获取失败！')
				this.navList = res.message
			},
			// 获取楼层列表数据的方法
			async getFloorList() {
				const { data: res } = await uni.$http.get('/api/public/v1/home/floordata')
				if (res.meta.status !== 200) return uni.$showMsg('楼层数据获取失败！')
				// 通过双层 forEach 循环，处理 URL 地址
				res.message.forEach(floor => {
					floor.product_list.forEach(prod => {
						prod.url = '/subpkg/goods_list/goods_list?' + prod.navigator_url.split('?')[1]
					})
				})
				this.floorList = res.message
			},
			// 分类导航点击事件
			navClickHandler(item) {
				// 点击的是分类导航，跳转至tabBar分类页面
				if (item.name === '分类') {
					uni.switchTab({
						url: '/pages/cate/cate'
					})
				}
			},
			// 点击搜索栏跳转
			gotoSearch() {
				uni.navigateTo({
					url: "/subpkg/goods_search/goods_search"
				})
			}
		},
		onLoad() {
			this.getSwiperList()
			this.getNavList()
			this.getFloorList()
		}
	}
</script>

<style lang="scss">
	swiper {
		height: 330rpx;

		.swiper-item,
		image {
			width: 100%;
			height: 100%;
		}
	}

	.nav-list {
		display: flex;
		justify-content: space-around;
		margin: 15px 0;

		.nav-img {
			width: 128rpx;
			height: 140rpx;
		}
	}

	.search-box {
		position: sticky;
		top: 0;
		z-index: 999;
	}
</style>
