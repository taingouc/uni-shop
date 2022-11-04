<template>
	<!-- 空白展示区域 -->
	<view class="empty-cart">
		<image src="/static/cart_empty@2x.png" class="empty-img"></image>
		<text class="tip-text">空空如也~</text>
	</view>
</template>

<script>
	export default {
		name: "empty",
		data() {
			return {

			};
		}
	}
</script>

<style lang="scss">
	.empty-cart {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-top: 100px;

		.empty-img {
			width: 90px;
			height: 90px;
		}

		.tip-text {
			font-size: 12px;
			color: gray;
			margin-top: 15px;
		}
	}
</style>
