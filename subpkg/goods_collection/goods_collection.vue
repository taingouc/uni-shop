<template>
	<view>
		<block v-for="goods in goodsCollection" :key="goods.goods_id">
			<view class="goods_collection">
				<goods :goodsInfo="goods"></goods>
				<view class="goods_nav">
					<my-goodsNav :goods_info="goods" :goods_id="goods.goods_id"></my-goodsNav>
				</view>
			</view>
		</block>
		<empty v-if="goodsCollection.length==0"></empty>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	export default {
		data() {
			return {

			}
		},
		computed: {
			...mapState('m_cart', ['goodsCollection'])
		}
	}
</script>

<style lang="scss">
	.goods_collection {
		width: 95%;
		background-color: #fff;
		margin: 15px auto;
		border: 1px solid #C00000;
		border-radius: 10px;
		box-shadow: 2px 2px 2px 2px #C00000;

		.goods-item {
			transform: scale(0.9);
		}
	}
</style>
