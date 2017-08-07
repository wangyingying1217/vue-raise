<template>
  <div class="search-wrapper" :style="{'min-height': height}">
    <ul class="search-tit clearfix">
      <li v-on:click.stop="tabIndex = 1">
        <p class="search-choice">商品类别</p>
        <ul class="choice-list" v-show=" tabIndex === 1">
          <li v-for="item in productType" :class="{'act':classify == item.classify}" @click.stop="search('classify', item)">{{item.classify}}</li>
        </ul>
      </li>
      <li v-on:click.stop="tabIndex = 2">
        <p class="search-choice">商品形态</p>
        <ul class="choice-list" v-show=" tabIndex === 2">
          <li v-for="item in classifySelected.productForm" :class="{'act':shape == item}" @click.stop="search('shape', item)">{{item}}</li>
        </ul>
      </li>
      <li v-on:click.stop="tabIndex = 3">
        <p class="search-choice">价格区间</p>
        <div class="choice-list" v-show=" tabIndex === 3">
          <div class="range">
            <input class="range-input" type="number" placeholder="最低价" v-model="floorPrice">
            <span class="range-divide">—</span>
            <input class="range-input" type="number" placeholder="最高价" v-model="ceilingPrice">
          </div>
          <div class="btn-wrapper">
            <input class="btn" type="button" value="取消" @click.stop=" tabIndex = 999 ">
            <input class="btn" type="button" value="确定" @click.stop=" search() ">
          </div>
        </div>
      </li>
    </ul>
    <ul class="raise-pre">
      <li v-for="(item, index) in info" :key="index" @click="confirm(item)">
        <div class="con-img">
          <img :src="item.picsrc" alt="pic"/>
        </div>
        <div class="con-info">
          <div class="con-tit">
            <span class="info-tit" v-html="item.title"></span>
            <span class="raise-state">{{item.state}}</span>
          </div>
          <div class="con-author">
            <p class="author">作者：{{item.authors}}</p>
          </div>
          <div class="con-price">
            <div class="price-wrapper">
              <span class="price">￥{{item.unitPrice}}</span>
              <span class="num-wrapper">
                <span class="subtract" @click.stop="subtract(item)">-</span>
                <input class="price-input" type="number" v-model="item.num" @click.stop>
                <span class="add" @click.stop="add(item)">+</span>
              </span>
            </div>
          </div>
        </div>
      </li>
    </ul>
    <Tip :info.sync="tip"></Tip>
    <Nodata :showSwitch="info.length" :type="'content'"></Nodata>
    <LoadMore :load.sync="loadState" :Boff= "loadBoff"></LoadMore>
  </div>
</template>

<script>
import Nodata from '@/components/Nodata'
export default {
  props: ['apiURL', 'id', 'productType', 'onlineIndex'],
  data () {
    return {
      info: [],
      tabIndex: 999,
      page: 1,
      classify: '',
      classifySelected: {
        productForm: []
      },
      shape: '',
      floorPrice: '',
      ceilingPrice: '',
      loadState: false,
      loadBoff: true,
      tip: ''
    }
  },
  methods: {
    getCustomers: function () {
      this.$http.post(this.apiURL + 'proSearch.jhtml', this.searchInfo).then((response) => {
        this.info = response.data
        this.$indicator.close()
      }, () => {
        this.$indicator.close()
        this.tip = '请求失败'
      })
    },
    search: function (attr, item) {
      this.page = 1
      this.tabIndex = 999
      if (attr === 'classify') {
        this[attr] = item.classify
        this.classifySelected = item
      } else if (attr) {
        this[attr] = item
      }
      this.$http.post(this.apiURL + 'proSearch.jhtml', this.searchInfo).then((response) => {
        this.info = response.data
        this.loadBoff = true
      }, () => {
        this.tip = '请求失败'
      })
    },
    confirm: function (item) {
      this.$emit('product', {href: item.picsrc, num: item.num, id: item.concernId})
      this.$router.go(-1)
    },
    add: function (item) {
      item.num++
    },
    subtract: function (item) {
      if (item.num > 1) {
        item.num--
      }
    }
  },
  created () {
    // 组件创建完后获取数据，
    this.getCustomers()
    document.onclick = () => {
      this.tabIndex = 999
    }
  },
  watch: {
   // 如果路由有变化，会再次执行该方法
    $route () {
      this.getCustomers()
    },
    loadState: function (val, oldVal) {
      if (val) {
        this.page ++
        this.$http.post(this.apiURL + 'proSearch.jhtml', this.searchInfo).then((response) => {
          if (response.data.length) {
            this.info = this.info.concat(response.data)
            this.loadState = false
          } else {
            this.loadBoff = false
          }
        }, () => {
          this.tip = '请求失败'
        })
      }
    }
  },
  components: {
    Nodata
  },
  computed: {
    searchInfo: function () {
      return {
        page: this.page,
        classify: this.classify,
        shape: this.shape,
        floorPrice: this.floorPrice || 0,
        ceilingPrice: this.ceilingPrice || 99999999999
      }
    },
    height: function () {
      return document.documentElement.clientHeight + 'px'
    }
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style lang='less' scoped>
@import '../../../style/base.less';
.search-wrapper{
  background: #f5f5f5;
  position:relative;
  .search-tit{
    position:absolute;
    left:0;
    top:0;
    z-index: 10;
    width:100%;
  	height:2rem;
    display: flex;
    background:#fff;
  	border-bottom:1px solid #cccccc;
    box-sizing:border-box;
    >li{
      flex: 1;
      font-size:0.8rem;
    	padding:0.5rem 0;
    	box-sizing:border-box;
      .search-choice{
      	line-height:1rem;
      	padding:0 1rem;
      	color:#333333;
      	border-right:1px solid #cccccc;
        &:after{
        	content:"";
        	width:0.6rem;
        	height:1rem;
        	float:right;
        	background:url("../../../image/select.png") no-repeat center center;
          background-size: contain;
        }
      }
      &:last-of-type .searchChoice{
      	border-right:none;
      }
    }
  }
  .choice-list{
    position:absolute;
    left:0;
    top:2rem;
    width:100%;
    z-index: 10;
    background:#f5f5f5;
    > li{
      height:1.8rem;
      line-height:1.8rem;
      font-size:0.74rem;
      box-sizing:border-box;
      border-bottom:1px solid #cccccc;
      text-indent:1rem;
      color:#666666;
      &.act{
        color:#cc0000;
        &:after{
          content:"";
          width:0.5rem;
          height:1.5rem;
          float:right;
          margin-right:1rem;
          background:url("../../../image/rightRed.png") no-repeat center center;
          background-size: contain;
        }
      }
    }
  }
  .range{
    padding: 2rem 1rem;
    font-size: 0;
    text-align: center;
    .range-input{
      width:6rem;
      font-size:0.7rem;
      border:1px solid #666666;
      height:1.8rem;
      text-indent:0.7rem;
      text-align: left;
      box-sizing: border-box;
    }
    .range-divide{
      font-size: 0.7rem;
      line-height: 1.8rem;
      padding: 0 1rem;
    }
  }
  .btn-wrapper{
    text-align: center;
    font-size: 0;
    input.btn{
      width: 9rem;
      height: 2rem;
      line-height: 1rem;
      font-size: 0.7rem;
      background: #cc0000;
      border-radius: 0;
      color: #fff;
      text-align: center;
      box-sizing: border-box;
      border: 1px solid #ccc;
      &:first-of-type{
        border-right: none;
        background: #fff;
        color: #333;
      }
    }
  }
}
.raise-pre{
  padding-top: 2.5rem;
  z-index: 0;
  li{
    position: relative;
    width: 18rem;
    height: 5rem;
    font-size:0;
    padding: 0.5rem 0.5rem;
    background: #fff;
    border: 1px solid #fff;
    box-sizing: border-box;
    margin-bottom: 0.5rem;
    .con-img{
      .img-wrap(5.6rem,4rem);
      .border(1px,#ccc);
    	margin-right: 0.5rem;
      vertical-align:top;
      box-sizing: border-box;
    }
    .con-info{
    	display:inline-block;
    	width:10.8rem;
    }
    .con-tit{
      display: flex;
      line-height:0.9rem;
      height:1.5rem;
      .info-tit{
        flex: 1 1 auto;
        font-size:0.8rem;
        .text-overflow;
      }
      .raise-state{
        flex: 0 0 auto;
        font-size: 0.6rem;
        height: 0.9rem;
        padding: 0 0.6rem;
        background: #cc0000;
        color: #fff;
        &:empty{
          display: none;
        }
      }
    }
    .author{
      font-size:0.7rem;
      .text-overflow;
      color:#999999;
      padding-right:0.4rem;
      margin-right:0.4rem;
    }
    .con-price{
      margin: 0.5rem 0 0;
      display: flex;
      font-size: 0.6rem;
      line-height: 1.2rem;
      .price-wrapper{
        flex: 1 1 auto;
      }
      .price {
        display: inline-block;
        color: #cc0000;
        width: 4rem;
        margin-right: 0.5rem;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
      .num-wrapper{
        float: right;
        font-size: 0;
        height: 1.2rem;
        line-height: 1.2rem;
        border: 1px solid #ccc;
        span{
          display: inline-block;
          height: 100%;
          font-size: 0.6rem;
          text-align: center;
        }
      }
      .add,.subtract{
        width: 1rem;
      }
      .price-input{
        width: 1rem;
        height: 100%;
        padding: 0 0.1rem;
        font-size: 0.6rem;
        text-align: center;
        vertical-align: top;
        border-left: 1px solid #ccc;
        border-right: 1px solid #ccc;
        border-radius: 0;
      }
    }
  }
}
</style>
