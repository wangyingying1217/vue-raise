<template>
  <div class="search-wrapper" v-if="show">
    <ul class="search-tit clearfix">
      <li v-for="(item,index) in searchType" v-on:click.stop="tabIndex = index">
        <p class="search-choice">{{item.title}}</p>
        <ul class="choice-list" v-show=" tabIndex === index">
          <li v-for="(list,index) in item.list" v-bind:class="{act:item.title == list}" v-on:click.stop="search(item,list)">{{list}}</li>
        </ul>
      </li>
    </ul>
    <RaiseList :info="info" :apiURL="apiURL" :id="id"></RaiseList>
    <Nodata :showSwitch="info.length" type="content"></Nodata>
    <LoadMore :load.sync="loadState" :Boff= "loadBoff"></LoadMore>
    <Tip :info.sync="tip"></Tip>
  </div>
</template>

<script>
import Nodata from '@/components/Nodata'
import RaiseList from '@/components/RaiseList'

export default {
  props: ['apiURL', 'id'],
  data () {
    return {
      info: [],
      type: '',
      show: false,
      searchType: [],
      tabIndex: 999,
      page: 1,
      tip: '',
      loadState: false,
      loadBoff: true
    }
  },
  methods: {
    getCustomers: function () {
      document.title = '高级检索'
      this.type = this.$route.params.type
      if (this.type) {
        this.$http.get(this.apiURL + 'retrieval.jhtml?type=' + this.type).then((response) => {
          this.info = response.data.item
          this.show = true
          this.searchType = [
            {'title': response.data.itemType[0], 'list': response.data.itemType},
            {'title': response.data.dataType[0], 'list': response.data.dataType},
            {'title': response.data.raiseType[0], 'list': response.data.raiseType}
          ]
          this.$indicator.close()
        }, () => {
          this.$indicator.close()
          this.tip = '请求失败'
        })
      }
    },
    search: function (item, list) {
      item.title = list
      this.page = 1
      this.tabIndex = 999
      this.$http.post(this.apiURL + 'advancedLucene.jhtml', this.searchInfo).then((response) => {
        this.info = response.data
        this.loadBoff = true
      }, () => {
        this.$indicator.close()
        this.tip = '请求失败'
      })
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
        this.$http.post(this.apiURL + 'advancedLucene.jhtml', this.searchInfo).then((response) => {
          if (response.data.length) {
            this.info = this.info.concat(response.data)
            this.loadState = false
          } else {
            this.loadBoff = false
          }
        }, () => {
          this.$indicator.close()
          this.tip = '请求失败'
        })
      }
    }
  },
  components: {
    Nodata,
    RaiseList
  },
  computed: {
    searchInfo: function () {
      return {
        page: this.page,
        itemType: this.searchType[0].title,
        dataType: this.searchType[1].title,
        raiseType: this.searchType[2].title
      }
    }
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style lang='less' scoped>
.search-wrapper{
  padding-top: 2.5rem;
  .search-tit{
    position:fixed;
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
        	background:url("../../image/select.png") no-repeat center center;
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
          background:url("../../image/rightRed.png") no-repeat center center;
          background-size: contain;
        }
      }
    }
  }
}
</style>
