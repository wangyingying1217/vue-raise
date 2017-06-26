<template>
  <div>
    <ul class="time-evolve">
      <li class="time-li" :class="{'act':index == 0}" v-for="(item, index) in info">
        <div class="icon"></div>
        <p class="info">{{item.content}}</p>
        <p class="time">{{item.time}}</p>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: ['info']
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style lang='less' scoped>
.time-evolve{
	padding-left: 2.6rem;
  background: #fff;
  overflow: hidden;
  position:relative;
  &:before{
    content:"";
    height:100%;
    width:2px;
    background:#cccccc;
    position:absolute;
    left: 1.4rem;
    top:1rem;
  }
  .time-li{
    position: relative;
    padding: 0.5rem 0.5rem 0.4rem 0;
    border-bottom: 1px solid #ccc;
    &:last-of-type{
      border-bottom: none;
    }
    .icon{
      position: absolute;
      left: -1.45rem;
      top: 0.8rem;
      width:0.5rem;
      height:0.5rem;
      background:#ccc;
      border-radius: 50%;
    }
    p{
      line-height:1.1rem;
      color:#333333;
    }
    .info{
      font-size:0.7rem;
    }
    .time{
      font-size:0.6rem;
    }
    &.act{
      .icon{
        background: #cc0000;
        border: 0.1rem solid rgba(255,255,255,0.7);
        left: -1.5rem;
      }
      p{
        color: #cc0000;
      }
    }
  }
}
</style>
