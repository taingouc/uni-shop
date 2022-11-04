<template>
	<view>
		<!-- fill 控制右侧按钮的样式 -->
		<!-- options 左侧按钮的配置项 -->
		<!-- buttonGroup 右侧按钮的配置项 -->
		<!-- click 左侧按钮的点击事件处理函数 -->
		<!-- buttonClick 右侧按钮的点击事件处理函数 -->
		<uni-goods-nav :fill="true" :options="options" :buttonGroup="buttonGroup" @click="onClick"
			@buttonClick="buttonClick" />
	</view>
</template>

<script>
	// 从 vuex 中按需导出 mapState 辅助方法
	import { mapState, mapMutations, mapGetters } from 'vuex'
	export default {
		name: "my-goodsNav",
		data() {
			return {
				// 左侧按钮组的配置对象
				options: [{
					icon: 'star',
					text: '收藏',
				}, {
					icon: 'cart',
					text: '购物车',
					info: null
				}],
				// 右侧按钮组的配置对象
				buttonGroup: [{
						text: '加入购物车',
						backgroundColor: '#ff0000',
						color: '#fff'
					},
					{
						text: '立即购买',
						backgroundColor: '#ffa200',
						color: '#fff'
					}
				]
			}
		},
		props: {
			// 商品详情对象
			goods_info: {
				type: Object,
				default: {}
			},
			// 传递该商品对象的id（如果没传，则说明该组件是在商品详情页，传了说明是在商品收藏页）
			goods_id: {
				type: Number,
				default: null
			}
		},
		methods: {
			// 把 m_cart 模块中的 addToCart 方法映射到当前页面使用
			...mapMutations('m_cart', ['addToCart', 'saveGoodsInfo', 'saveOrderNumber', 'saveGoodsCollection',
				'removeGoodsCollection'
			]),
			// 左侧点击事件
			onClick(e) {
				// 保存当前商品信息
				const goodsTuck = {
					goods_id: this.goods_info.goods_id, // 商品的Id
					goods_name: this.goods_info.goods_name, // 商品的名称
					goods_price: this.goods_info.goods_price, // 商品的价格
					goods_small_logo: this.goods_info.goods_small_logo, // 商品的图片
				}
				// 点击购物车跳转到购物车页面
				if (e.content.text === '购物车') {
					uni.switchTab({
						url: "/pages/cart/cart"
					})
				}
				// 点击收藏
				if (e.content.text === '收藏') {
					this.options[0].icon = 'star-filled'
					this.options[0].text = '已收藏'
					this.saveGoodsCollection(goodsTuck)
					uni.$showMsg('已收藏！')
				}
				// 点击取消收藏
				if (e.content.text === '已收藏') {
					this.options[0].icon = 'star'
					this.options[0].text = '收藏'
					this.removeGoodsCollection(goodsTuck)
					uni.$showMsg('已取消收藏！')
				}
			},
			// 右侧按钮组点击事件
			buttonClick(e) {
				// 创建一个商品的信息对象
				const goods = {
					goods_id: this.goods_info.goods_id, // 商品的Id
					goods_name: this.goods_info.goods_name, // 商品的名称
					goods_price: this.goods_info.goods_price, // 商品的价格
					goods_count: 1, // 商品的数量
					goods_small_logo: this.goods_info.goods_small_logo, // 商品的图片
					goods_state: true // 商品的勾选状态
				}
				if (e.content.text === '加入购物车') {
					// 通过 this 调用映射过来的 addToCart 方法，把商品信息对象存储到购物车中
					this.addToCart(goods)
					uni.$showMsg('添加成功！')
				}
				if (e.content.text === '立即购买') {
					// 创建订单 组织订单的信息对象
					const orderNumber = this.generateOrderNumber()
					// 存储到vuex和本地storage中
					this.saveOrderNumber(orderNumber)
					// 跳转至订单详情页
					this.saveGoodsInfo(goods)
					uni.navigateTo({
						url: '/subpkg/goods_payment/goods_payment'
					})
				}
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
		created() {
			// 显示收藏或已收藏
			const result = this.goodsCollection.find(x => x.goods_id == this.goods_info.goods_id)
			if (result) {
				this.options[0].icon = 'star-filled'
				this.options[0].text = '已收藏'
			} else {
				this.options[0].icon = 'star'
				this.options[0].text = '收藏'
			}
		},
		computed: {
			// 调用 mapState 方法，把 m_cart 模块中的 cart 数组映射到当前页面中，作为计算属性来使用
			// ...mapState('模块的名称', ['要映射的数据名称1', '要映射的数据名称2'])
			...mapState('m_cart', ['cart', 'goodsCollection']),
			// 把 m_cart 模块中名称为 total 的 getter 映射到当前页面中使用
			...mapGetters('m_cart', ['total'])
		},
		watch: {
			// 通过 watch 侦听器，监听计算属性 total 值的变化，从而动态为购物车按钮的徽标赋值
			total: {
				handler(newVal) {
					if (this.goods_id) {
						const number = this.cart.find(goods => goods.goods_id == this.goods_id).goods_count
						this.options[1].info = number
					} else {
						this.options[1].info = newVal
					}

				},
				immediate: true
			}
		},
	}
</script>

<style lang="scss">

</style>
