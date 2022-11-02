<template>
	<view>
		<!-- 顶部搜索栏 -->
		<search @click="gotoSearch"></search>
		<!-- 滚动导航商品分类区域 -->
		<view class="scroll-view-container">
			<!-- 左侧的滚动视图区域 -->
			<scroll-view class="left-scroll-view" scroll-y :style="{height: wh + 'px'}">
				<block v-for="(item, i) in cateList" :key="i">
					<view :class="['left-scroll-view-item',active==i?'active':'']" @click="changeActive(i)">
						{{item.cat_name}}
					</view>
				</block>
			</scroll-view>
			<!-- 右侧的滚动视图区域 -->
			<scroll-view class="right-scroll-view" scroll-y :style="{height: wh + 'px'}" @scroll="scroll"
				:scroll-top="scrolltop">
				<block v-for="(item,i) in cateLevel2" :key="i">
					<view class="right-scroll-view-nav">
						<!-- 需要吸顶的盒子 -->
						<view :class="['fixed-box',scrollTop>NavTopList[i]&&scrollTop<NavTopList[i+1]?'movefixed':'']">
							/ {{item.cat_name}} /
						</view>
						<!-- 占位的盒子 -->
						<view class="fill-box"></view>
					</view>

					<!-- 动态渲染三级分类的列表数据 -->
					<view class="cate-lv3-list">
						<!-- 三级分类 Item 项 -->
						<view class="cate-lv3-item" v-for="(item3, i3) in item.children" :key="i3"
							@click="gotoGoodsList(item3)">
							<!-- 图片 -->
							<image :src="item3.cat_icon.replace('api-ugo-dev','api-ugo-web')"></image>
							<!-- 文本 -->
							<text>{{item3.cat_name}}</text>
						</view>
					</view>
				</block>
			</scroll-view>
		</view>
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
				// 窗口的可用高度 = 屏幕高度 - navigationBar高度 - tabBar 高度
				wh: 0,
				// 分类数据列表
				cateList: [],
				// 当前选中项的索引，默认让第一项被选中
				active: 0,
				//  二级分类列表
				cateLevel2: [],
				// 滚动条距离顶部的距离(动态)
				scrollTop: 0,
				// 存放导航标题距离顶部的距离
				NavTopList: [],
				// 滚动条距离顶部的距离(点击左侧分类重置)
				scrolltop: 0,
				// 监听滚动事件节流阀
				scrollFlag: false
			};
		},
		methods: {
			// 获取分类列表数据的方法
			async getCateList() {
				// 发起请求
				const { data: res } = await uni.$http.get('/api/public/v1/categories')
				// 判断是否获取失败
				if (res.meta.status !== 200) return uni.$showMsg('获取分类列表数据失败！')
				// 转存数据
				this.cateList = res.message
				// 默认第一项显示，为二级分类赋值
				this.cateLevel2 = res.message[0].children
			},
			// 选中项改变的事件处理函数
			changeActive(i) {
				this.scrolltop = 1 - this.scrolltop
				this.active = i
				this.cateLevel2 = this.cateList[i].children
				this.getNavTop()
			},
			// 监听滚动容器卷去的高度
			scroll(e) {
				if (this.scrollFlag) return
				this.scrollFlag = true
				setTimeout(() => {
					this.scrollTop = e.detail.scrollTop
					this.scrollFlag = false
				}, 100)

			},
			// 获取导航标题距离顶部距离
			getNavTop() {
				setTimeout(() => {
					const query = uni.createSelectorQuery().in(this);
					query.selectAll('.fixed-box').boundingClientRect(data => {
						const arr = []
						data.forEach(item => {
							arr.push(item.top - 50)
						})
						this.NavTopList = arr
					}).exec();
				}, 600)
			},
			// 三级分类的 Item 项点击事件
			gotoGoodsList(item3) {
				uni.navigateTo({
					url: '/subpkg/goods_list/goods_list?cid=' + item3.cat_id
				})
			},
			// 点击搜索栏
			gotoSearch() {
				// 跳转到分包中的搜索页面
				uni.navigateTo({
					url: '/subpkg/goods_search/goods_search'
				})
			}
		},
		onLoad() {
			// 获取当前系统的信息
			const sysInfo = uni.getSystemInfoSync()
			// 为 wh 窗口可用高度动态赋值
			this.wh = sysInfo.windowHeight - 50
			// 调用获取分类列表数据的方法
			this.getCateList()
			// 调用获取导航标题距离顶部距离
			this.getNavTop()
		}
	}
</script>

<style lang="scss">
	.scroll-view-container {
		width: 100%;
		display: flex;

		.left-scroll-view {
			width: 30%;

			.left-scroll-view-item {
				line-height: 60px;
				background-color: #f7f7f7;
				text-align: center;
				font-size: 12px;

				// 激活项的样式
				&.active {
					background-color: #ffffff;
					position: relative;

					// 渲染激活项左侧的红色指示边线
					&::before {
						content: ' ';
						display: block;
						width: 3px;
						height: 30px;
						background-color: #c00000;
						position: absolute;
						left: 0;
						top: 50%;
						transform: translateY(-50%);
					}
				}
			}
		}

		.right-scroll-view {
			background-color: #ffffff;
			flex: 1;

			.right-scroll-view-nav {
				width: 100%;
				height: 50px;
				position: relative;

				.fixed-box {
					height: 50px;
					font-size: 12px;
					font-weight: bold;
					text-align: center;
					padding: 15px 0;
					box-sizing: border-box;
					background-color: #ffffff;
					color: #c00000;

					&.movefixed {
						width: 70%;
						position: fixed;
						top: 50px;
						z-index: 999;
					}
				}

				.fill-box {
					position: absolute;
					width: 100%;
					height: 100%;
					left: 0;
					top: 0;
				}

			}

			.cate-lv3-list {
				display: flex;
				flex-wrap: wrap;

				.cate-lv3-item {
					width: 33.33%;
					margin-bottom: 10px;
					display: flex;
					flex-direction: column;
					align-items: center;

					image {
						width: 60px;
						height: 60px;
					}

					text {
						font-size: 12px;
					}
				}
			}
		}
	}
</style>
