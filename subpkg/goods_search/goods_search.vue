<template>
	<view>
		<view class="search-box">
			<!-- 使用 uni-ui 提供的搜索组件 -->
			<uni-search-bar @confirm="search" @input="input" bgColor="#EEEEEE" :radius="100" :cancelButton="none"
				:focus="true">
			</uni-search-bar>
		</view>
		<!-- 搜索建议列表 -->
		<view class="sugg-list" v-if="searchResults.length !== 0">
			<view class="sugg-item" v-for="(item, i) in searchResults" :key="i" @click="gotoDetail(item.goods_id)">
				<view class="goods-name">{{item.goods_name}}</view>
				<uni-icons type="arrowright" size="16"></uni-icons>
			</view>
		</view>
		<!-- 搜索历史 -->
		<view class="history-box" v-else>
			<!-- 标题区域 -->
			<view class="history-title">
				<text>搜索历史</text>
				<view class="delet-btn" @click="cleanHistory">
					<text>全部</text>
					<uni-icons type="trash" size="17"></uni-icons>
				</view>
			</view>
			<!-- 列表区域 -->
			<view class="history-list">
				<uni-tag class="uni-tag" :text="item" v-for="(item, i) in historys" :key="i"
					@click="gotoGoodsList(item)"></uni-tag>
			</view>
		</view>
	</view>

</template>

<script>
	export default {
		data() {
			return {
				// 搜索联想关键词列表
				searchResults: [],
				// 防抖定时器
				timer: null,
				// 搜索关键词的历史记录
				historyList: []
			}
		},
		methods: {
			// 搜索框输入事件
			input(e) {
				// e是最新的搜索内容,使用防抖减少请求次数
				if (this.timer) {
					clearTimeout(this.timer)
				}
				this.timer = setTimeout(() => {
					this.getSearchInfo(e)
					this.timer = null
				}, 500)
			},
			// 根据用户搜索内容获取搜索联想关键词
			async getSearchInfo(e) {
				console.log(e);
				// 判断关键词是否为空
				if (e === '') {
					this.searchResults = []
					return
				}
				// 发起请求，获取搜索建议列表
				const { data: res } = await uni.$http.get('/api/public/v1/goods/qsearch?query=' + e)
				if (res.meta.status !== 200) return uni.$showMsg('获取搜索关键词失败！')
				if (res.message == '') return uni.$showMsg('没有对应的商品！')
				this.searchResults = res.message
				this.historyList.push(e)
				// 调用 uni.setStorageSync(key, value) 将搜索历史记录持久化存储到本地
				uni.setStorageSync('info', JSON.stringify(this.historyList))
			},
			// 点击搜索建议的 Item 项，跳转到商品详情页面
			gotoDetail(goods_id) {
				uni.navigateTo({
					// 指定详情页面的 URL 地址，并传递 goods_id 参数
					url: '/subpkg/goods_detail/goods_detail?goods_id=' + goods_id
				})
			},
			// 点击删除搜索历史
			cleanHistory() {
				// 清空 data 中保存的搜索历史
				this.historyList = []
				// 清空本地存储中记录的搜索历史
				uni.setStorageSync('info', '[]')
				uni.$showMsg('已全部删除！')
			},
			// 搜索历史的 Item 项点击事件跳转到商品列表页面
			gotoGoodsList(item) {
				uni.navigateTo({
					url: '/subpkg/goods_list/goods_list?query=' + item
				})
			}
		},
		computed: {
			historys() {
				// 通过计算属性让搜索历史列表去重，倒序展示
				// 注意：由于数组是引用类型，所以不要直接基于原数组调用 reverse 方法，以免修改原数组中元素的顺序
				return [...new Set([...this.historyList].reverse())]
			}
		},
		// 在 onLoad 生命周期函数中，加载本地存储的搜索历史记录
		onLoad() {
			this.historyList = JSON.parse(uni.getStorageSync('info') || '[]')
		}
	}
</script>

<style lang="scss">
	.search-box {
		position: sticky;
		top: 0;
		z-index: 999;
	}

	.uni-searchbar {
		background-color: #C00000;
	}

	.sugg-list {
		padding: 0 5px;

		.sugg-item {
			font-size: 12px;
			padding: 13px 0;
			border-bottom: 1px solid #efefef;
			display: flex;
			align-items: center;
			justify-content: space-between;

			.goods-name {
				// 文字不允许换行（单行文本）
				white-space: nowrap;
				// 溢出部分隐藏
				overflow: hidden;
				// 文本溢出后，使用 ... 代替
				text-overflow: ellipsis;
				margin-right: 3px;
			}
		}
	}

	.history-box {
		padding: 0 5px;

		.history-title {
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 40px;
			font-size: 13px;
			border-bottom: 1px solid #efefef;

			.delet-btn {
				display: flex;
				justify-content: center;
				align-items: center;
			}
		}

		.history-list {
			display: flex;
			flex-wrap: wrap;

			.uni-tag {
				margin-top: 10px;
				margin-right: 5px;
			}
		}
	}
</style>
