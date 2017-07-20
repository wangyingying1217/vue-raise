<template>
  <div>
    <ul class="evolve">
      <li class="clearfix" v-for="item in info">
        <div class="icon"></div>
        <div class="infobox">
          <p class="title">
            {{item.userName}}
            <span class="date fr">{{item.dayNum}}</span>
          </p>
          <p class="info" v-html="item.context"></p>
          <div class="clearfix">
            <router-link :to="'/imagePreview/'+contentId+'/dynamic/'+index+'/' + item.dicId" tag="div"  class="img" v-for="(src, index) in item.pic" key="index" v-bind:style="'background: url('+src+') no-repeat;background-size: cover;'"></router-link>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: ['info', 'contentId']
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style lang='less' scoped>
.evolve{
	padding:0 0.6rem 0 0.9rem;
  background: #fff;
  li{
  	padding:0.5rem 0 1.5rem;
  	position:relative;
    &:before{
    	content:"";
    	height:100%;
    	width:1px;
    	background:#cccccc;
    	position:absolute;
    	left:0.6rem;
    	top:1rem;
    }
    &:last-of-type:before{
      display:none;
    }
  }
  .icon{
  	float:left;
  	width:1.2rem;
  	height:1.2rem;
  	background:url("../image/Pointer.png") no-repeat;
  	background-size:contain;
    position: relative;
    z-index: 9
  }
  .infobox{
  	float:right;
  	width:14.6rem;
  }
  .title{
  	font-size:0.7rem;
  	line-height:1.2rem;
  	color:#333333;
  }
  .info,.date{
  	font-size:0.7rem;
  	line-height:1rem;
  	color:#999999;
  }
  .info{
  	margin:0.4rem 0 0;
  }
  .img{
  	width:3.15rem;
  	height:3.15rem;
  	margin-right:0.5rem;
  	margin-top:0.5rem;
  	float:left;
  }
}
</style>
