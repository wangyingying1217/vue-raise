<template>
  <div v-if="show">
    <table class="supportRecord">
      <thead>
      <tr>
        <th width="20%">订单序号</th>
        <th width="22%">支持者</th>
        <th width="22%">支持项</th>
        <th width="14%">数量</th>
        <th width="22%">支持时间</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="item in info">
        <td>{{item.ornum}}</td>
        <td class="clBlue">{{item.supporter}}</td>
        <td>
          <p class="clRed">￥{{item.amount}}</p>
          <p class="clGray">{{item.reportNape}}</p>
        </td>
        <td>{{item.anti}}</td>
        <td>
          <p>{{item.date}}</p>
          <p>{{item.time}}</p>
        </td>
      </tr>
      </tbody>
    </table>
    <LoadMore :load.sync="loadState" :Boff= "loadBoff"></LoadMore>
    <Nodata :showSwitch="info.length" type="support"></Nodata>
    <Tip :info.sync="tip"></Tip>
  </div>
</template>

<script>
import Nodata from '@/components/Nodata'
export default {
  props: ['apiURL', 'id'],
  data () {
    return {
      show: false,
      info: {},
      contentId: '',
      page: 1,
      tip: '',
      loadState: false,
      loadBoff: true
    }
  },
  methods: {
    getCustomers: function () {
      document.title = '支持记录'
      this.contentId = this.$route.params.contentId
      if (this.contentId && this.id) {
        this.$http.get(this.apiURL + 'supportRecord.jhtml?contentId=' + this.contentId + '&wxbdopenId=' + this.id + '&page=' + this.page).then((response) => {
          this.info = response.data
          this.show = true
          this.$indicator.close()
        }, () => {
          this.$indicator.close()
          this.tip = '请求失败'
        })
      }
    }
  },
  created () {
    // 组件创建完后获取数据，
    this.getCustomers()
  },
  watch: {
   // 如果路由有变化，会再次执行该方法
    $route () {
      this.getCustomers()
    },
    id: function () {
      this.getCustomers()
    },
    loadState: function (val, oldVal) {
      if (val) {
        this.page ++
        this.$http.get(this.apiURL + 'supportRecord.jhtml?contentId=' + this.contentId + '&wxbdopenId=' + this.id + '&page=' + this.page).then((response) => {
          if (response.data.length) {
            this.info.push(...response.data)
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
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style lang='less' scoped>
.supportRecord{
	color:#333333;
	width:100%;
	font-size:0.7rem;
  table-layout: fixed;
  th,td{
  	text-align:center;
  	font-weight:normal;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  thead tr{
  	height:2rem;
  	background:#e6e6e6;
  }
  tbody tr{
  	height:2.5rem;
  	border-bottom:1px solid #cccccc;
  }
  tbody tr p{
  	height:0.9rem;
  	line-height:0.9rem;
  }
}
</style>
