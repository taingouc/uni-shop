<template>
	<view>
		<view class="goods-list">
			<view v-for="(item, i) in goodsList" :key="i" @click="gotoDetail(item)">
				<goods :goodsInfo="item"></goods>
			</view>
		</view>
		<view v-if="total==0" class="goods-null">
			<image src="../../static/cart_empty@2x.png" mode="widthFix"></image>
			<text>空空如也~</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 请求参数对象
				queryObj: {
					// 查询关键词
					query: '',
					// 商品分类Id
					cid: '',
					// 页码值
					pagenum: 1,
					// 每页显示多少条数据
					pagesize: 10
				},
				// 商品列表的数据
				goodsList: [],
				// 总数量，用来实现分页
				total: 1,
				// 下拉上拉节流阀
				debounce: false
			};
		},
		methods: {
			// 获取商品列表数据的方法
			async getGoodsList() {
				// 发起请求
				const { data: res } = await uni.$http.get('/api/public/v1/goods/search', this.queryObj)
				if (res.meta.status !== 200) return uni.$showMsg('获取商品列表数据失败！')
				// 为数据赋值
				this.goodsList = [...this.goodsList, ...res.message.goods]
				this.total = res.message.total
			},
			// 点击跳转到商品详情页面
			gotoDetail(item) {
				uni.navigateTo({
					url: '/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id
				})
			}
		},
		onLoad(options) {
			// 将页面参数转存到 this.queryObj 对象中
			this.queryObj.query = options.query || ''
			this.queryObj.cid = options.cid || ''
			// 调用获取商品列表数据的方法
			this.getGoodsList()
		},
		// 上拉触底的事件
		onReachBottom() {
			if (this.debounce) return
			this.debounce = true
			setTimeout(() => {
				this.debounce = false
			}, 500)
			if (this.total == this.goodsList.length) return uni.$showMsg('没有更多数据了！')
			// 让页码值自增 +1
			if (this.queryObj.pagenum == Math.ceil(this.total / this.queryObj.pagesize)) {
				this.queryObj.pagenum = 1
			} else {
				this.queryObj.pagenum += 1
			}
			// 重新获取列表数据
			this.getGoodsList()
		},
		// 下拉刷新事件
		onPullDownRefresh() {
			if (this.debounce) return
			this.debounce = true
			setTimeout(() => {
				this.debounce = false
			}, 1000)
			if (this.total == this.goodsList.length) {
				wx.stopPullDownRefresh()
				return uni.$showMsg('没有更多数据了！')
			}
			if (this.queryObj.pagenum == Math.ceil(this.total / this.queryObj.pagesize)) {
				this.queryObj.pagenum = 1
			} else {
				this.queryObj.pagenum++
			}
			this.goodsList = []
			// 重新获取列表数据
			this.getGoodsList()
			wx.stopPullDownRefresh()
			uni.$showMsg('刷新成功！')
		}
	}
</script>

<style lang="scss">
	.goods-null {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin: 200px 0;

		image {
			width: 100px;
			height: 100px;
		}
	}
</style>
