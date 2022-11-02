export default {
	// 为当前模块开启命名空间
	namespaced: true,

	// 模块的 state 数据
	state: () => ({
		// 购物车的数组，用来存储购物车中每个商品的信息对象
		// 每个商品的信息对象，都包含如下 6 个属性：
		// { goods_id, goods_name, goods_price, goods_count, goods_small_logo, goods_state }
		cart: JSON.parse(uni.getStorageSync('cart') || '[]'),
		// 订单编号
		orderNumber: uni.getStorageSync('orderNumer') || ''
	}),

	// 模块的 mutations 方法
	mutations: {
		addToCart(state, goods) {
			// 根据提交的商品的Id，查询购物车中是否存在这件商品
			// 如果不存在，则 findResult 为 undefined；否则，返回查找到的元素
			const findResult = state.cart.find((x) => x.goods_id === goods.goods_id)

			if (!findResult) {
				// 如果购物车中没有这件商品，则直接 push
				state.cart.push(goods)
			} else {
				// 如果购物车中有这件商品，则只更新数量即可
				findResult.goods_count++
			}
			// 通过 commit 方法，调用 m_cart 命名空间下的 saveToStorage 方法
			this.commit('m_cart/saveToStorage')
		},
		// 将购物车中的数据持久化存储到本地
		saveToStorage(state) {
			uni.setStorageSync('cart', JSON.stringify(state.cart))
		},
		// 修改购物车中商品的勾选状态
		updateGoodsState(state, goods) {
			// 根据 goods_id 查询购物车中对应商品的信息对象
			const findResult = state.cart.find(x => x.goods_id === goods.goods_id)
			// 有对应的商品信息对象
			if (findResult) {
				// 更新对应商品的勾选状态
				findResult.goods_state = goods.goods_state
				// 持久化存储到本地
				this.commit('m_cart/saveToStorage')
			}
		},
		// 修改购物车商品数量
		updateGoodsCount(state, goods) {
			// 根据 goods_id 查询购物车中对应商品的信息对象
			const findResult = state.cart.find(x => x.goods_id === goods.goods_id)
			if (findResult) {
				// 更新对应商品的数量
				findResult.goods_count = goods.goods_count
				// 持久化存储到本地
				this.commit('m_cart/saveToStorage')
			}
		},
		// 根据 Id 从购物车中删除对应的商品信息
		removeGoodsById(state, goods_id) {
			// 调用数组的 filter 方法进行过滤
			state.cart = state.cart.filter(x => x.goods_id !== goods_id)
			// 持久化存储到本地
			this.commit('m_cart/saveToStorage')
		},
		// 根据传来的全选状态修改商品state状态
		changeGoodsState(state, check) {
			state.cart = state.cart.map(function(item) {
				item.goods_state = check
				return item
			})
			// 持久化存储到本地
			this.commit('m_cart/saveToStorage')
		},
		// 根据传来的商品订单信息存储到state中
		saveOrderNumber(state, goodsNumer) {
			state.orderNumber = goodsNumer
			// 持久化存储到本地
			this.commit('m_cart/saveToStorageByGoodsNumber')
		},
		// 将购物车中的数据持久化存储到本地
		saveToStorageByGoodsNumber(state) {
			uni.setStorageSync('orderNumer', state.orderNumber)
		}
	},

	// 模块的 getters 属性
	getters: {
		// 统计购物车中商品的总数量
		total(state) {
			let c = 0
			// 循环统计商品的数量，累加到变量 c 中
			state.cart.filter(goods => goods.goods_state).forEach(goods => c += goods.goods_count)
			return c
		},
		// 统计商品是否全选
		isFullCheck(state) {
			let result = state.cart.find(goods => !goods.goods_state)
			if (result) return false
			return true
		},
		// 统计被勾选的总价格
		goodsPrice(state) {
			let p = 0
			state.cart.filter(goods => goods.goods_state).forEach(goods => p += (goods.goods_count * goods.goods_price))
			return p
		}
	}
}
