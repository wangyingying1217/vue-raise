<template>
  <div class="book">
    <div class="book-info">
      <div class="img-wrapper">
        <span class='raise-state'>电子书</span>
        <ul class="img-list">
          <li></li>
        </ul>
      </div>
      <p class="title">萨达萨达萨达萨达萨达萨达萨</p>
      <p class="info">萨达萨达萨达萨达萨达萨达萨达萨达萨达萨达萨达萨达萨达萨达萨达萨达萨达萨达</p>
      <div class="price-wrapper">
        <span class="price">￥<strong class="num">12456.89</strong></span>
        <span class="integral">（赠 0.00 积分）</span>
        <span class="ebook">电子书：￥6.99</span>
      </div>
    </div>
    <ul class="list">
      <li>
        <p class="bg">增值服务</p>
      </li>
    </ul>
    <ul class="list">
      <li>
        <span class="title">作者：</span>乐小米
      </li>
      <li>
        <span class="title">出版：</span>中国海关出版社
      </li>
      <li>
        <span class="title">时间：</span>2016-05-09
      </li>
    </ul>
    <div class="group">
      <div class="title">
        <p class="bg">优惠套装</p>
      </div>
      <ul class="con">
        <li>
          <div class="group-pro">
            <p class="price">123</p>
          </div>
          <div class="add">+</div>
        </li>
        <li>
          <div class="group-pro">
            <p class="price">456</p>
          </div>
          <div class="add">+</div>
        </li>
        <li>
          <div class="group-pro">
            <p class="price">789</p>
          </div>
          <div class="add">+</div>
        </li>
      </ul>
    </div>
    <div class="details">

    </div>
  </div>
</template>

<script>
export default {
  props: ['info', 'type'],
  data () {
    return {
      SUCCEED: '交易成功'
    }
  },
  methods: {
    remove: function (id) {
      this.$emit('remove', {type: 'product', id: id})
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less' scoped>
.bg{
  background: url("../../../static/image/rightBlack.png") no-repeat right center;
  background-size: 0.4rem;
}
.book-info{
  padding: 0.5rem 0.5rem;
  margin-bottom: 0.5rem;
  background: #fff;
  border-bottom: 1px solid #ccc;
  .img-wrapper{
    height: 12rem;
    background: #cccccc;
    position:relative;
    overflow: hidden;
    .raise-state{
      position:absolute;
      left:-1rem;
      top:3.3rem;
      width:6rem;
      height:1rem;
      color: #fff;
      font-size: 0.6rem;
      line-height: 1rem;
      background: #cc0001;
      text-align: center;
      transform: rotate(-45deg);
      transform-origin:0 0;
    }
  }
  .title{
    padding: 0.2rem 0 0;
    line-height: 1.6rem;
    font-size: 0.8rem;
  }
  .info{
    line-height: 0.9rem;
    font-size: 0.7rem;
    color: #666;
    &:empty{
      display: none;
    }
  }
  .price-wrapper{
    padding: 0.2rem 0;
    line-height: 1.6rem;
    height: 1.2rem;
    font-size: 0.7rem;
    .price{
      color: #cc0000;
      .num{
        font-size: 0.8rem;
      }
    }
    .integral{
      color: #666;
    }
    .ebook{
      padding: 0 0.4rem;
      margin-top: 0.3rem;
      line-height: 1rem;
      border: 1px solid #cc0000;
      color: #cc0000;
      border-radius: 0.6rem;
      float: right;
    }
  }
}
.list{
  margin-bottom: 0.5rem;
  border-top: 1px solid #ccc;
  li{
    font-size: 0.7rem;
    padding: 0 0.5rem;
    line-height: 2rem;
    background: #fff;
    border-bottom: 1px solid #ccc;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    .title{
      display: inline-block;
      width: 2.4rem;
      color: #666;
    }
  }
}
.group{
  background:#fff;
  border-top: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  padding: 0 0.5rem;
  margin-bottom: 0.5rem;
  .title{
    font-size: 0.7rem;
    line-height: 2rem;
    background: #fff;
  }
  .con{
    font-size: 0;
    padding-bottom: 0.5rem;
    li{
      display: inline-block;
      .group-pro{
        display: inline-block;
        width: 4.4rem;
        height: 4.4rem;
        background: #ccc;
        font-size: 0.8rem;
        vertical-align: top;
        position: relative;
      }
      .price{
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 0 0.5rem;
        font-size: 0.6rem;
        line-height: 1rem;
        background: rgba(255,255,255,0.5);
      }
      .add{
        display: inline-block;
        width: 1.9rem;
        text-align: center;
        line-height: 4.35rem;
        font-size: 1rem;
        vertical-align: top;
        color: #666;
      }
      &:last-of-type{
        .add{
          display: none;
        }
      }
    }
  }
}
.details{
  min-height: 12rem;
  background:#fff;
  border-top: 1px solid #ccc;
  padding: 0 0.5rem;
}
</style>
