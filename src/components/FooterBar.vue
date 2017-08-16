<template>
  <div class="footer">
    <!-- 跳转到首页众筹列表页面 -->
    <router-link :to="{path:'/'}" :class="{'action':type=='raise'}" tag="div">
      <div class="bg-raise"></div>众筹
    </router-link>
    <!-- 跳转到发起众筹页面 -->
    <router-link :to="{path:'/create'}" :class="{'action':type=='create'}" tag="div">
      <div class="create"></div>
    </router-link>
    <!-- 跳转到个人中心页面 -->
    <router-link :to="{path:'/person'}" :class="{'action':type=='person'}" tag="div">
      <div class="bg-user"></div>我
    </router-link>
  </div>
</template>

<script>
export default {
  props: ['type'],
  data () {
    return {}
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.footer{
  display: flex;
  height:2.5rem;
	position:fixed;
	left:0;
	bottom:0;
	width:100%;
	z-index:10;
	background:#f9f9f9;
  border-top: 2px solid #ccc;
  >div{
    flex: 1 1 auto;
  	text-align:center;
  	box-sizing:border-box;
    font-size:0.6rem;
    color: #333;
  	border-bottom:1px solid #cccccc;
    .create{
      width: 1.8rem;
      height:1.8rem;
      line-height: 1.8rem;
      margin: 0.3rem auto;
      font-size: 1.6rem;
      color: #fff;
      background: url("../image/addWhite.png") no-repeat center center;
      background-color: #cc0000;
      background-size: 0.9rem;
      border-radius: 50%;
    }
    .bg{
      width:1rem;
      height:1rem;
      margin: 0.3rem auto;
    }
    .bg-raise{
      .bg;
      background: url("../image/raiseGrey.png") no-repeat;
      background-size: contain;
    }
    .bg-user{
      .bg;
      background: url("../image/personGrey.png") no-repeat;
      background-size: contain;
    }
    &.action{
      .bg-raise{
        background: url("../image/raiseRed.png") no-repeat;
        background-size: contain;
      }
      .bg-user{
        background: url("../image/personRed.png") no-repeat;
        background-size: contain;
      }
      color:#cc0000;
    }
  }
}
</style>
