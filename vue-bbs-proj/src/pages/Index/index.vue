<template>
  <div class="main">
		<div class="nav pcNav">
			<router-link class="link" active-class="active" to="/index/author">版主</router-link>
			<router-link class="link" active-class="active" to="/index/suggest">推荐</router-link>
			<router-link class="link" active-class="active" to="/index/subscribe">关注</router-link>
			<router-link class="link" active-class="active" to="/search">搜索</router-link>
		</div>
		<div class="signal"></div>
		<router-view ></router-view>
		<JuBao></JuBao>
	</div>
</template>

<script>
import JuBao from '@/components/Jubao'
export default {
    name:'Index',
	components:{
		JuBao
	}
}
</script>

<style>
	.main{
		height: 680px;
		margin: 0 auto;
		position: relative;
		width: 365px;
		box-sizing: border-box;
		background: white;
		border-bottom-left-radius: 20px;
		border-bottom-right-radius: 20px;
	}
    .main .nav {
		width: 365px;
		height: 40px;
		display: flex;
		position: fixed;
		box-sizing: border-box;
		margin: 0 auto;
		background: white;
		z-index: 6;
		border-radius: 20px;
	}
	.main .link{
		text-align: center;
		flex:1;
		text-decoration: none;
		color:black;
	}
	.main .active{
		color: #c0256d;
	}
	
</style>
