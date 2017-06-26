<template>
  <ul class="list-wrapper" :class="type">
    <router-link :to="{path:item.href}" v-for="item in info" tag="li" :key="item.name">
      <p>{{item.name}}</p>
    </router-link>
  </ul>
</template>

<script>
export default {
  data () {
    return {}
  },
  props: ['info', 'type']
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.list-wrapper{
  &.margin{
    li{
      margin-bottom:0.5rem;
      border-top:1px solid #ccc;
    }
  }
  li{
  	padding:0 1rem;
  	font-size:0.7rem;
  	line-height:2rem;
  	height:2rem;
    background:#fff;
    border-bottom:1px solid #ccc;
    &:first-of-type{
  	   border-top:1px solid #ccc;
    }
    p{
    	background:url("../../static/image/rightBlack.png") no-repeat right center;
      background-size: 0.4rem;
    }
  }
}
</style>
