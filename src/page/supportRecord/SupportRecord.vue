<template>
  <div v-if="show">
    <table class="supportRecord">
      <thead>
      <tr>
        <th>订单序号</th>
        <th>支持者</th>
        <th>支持项</th>
        <th>数量</th>
        <th>支持时间</th>
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
          <p>{{item.jin}}</p>
          <p>{{item.ti}}</p>
        </td>
      </tr>
      </tbody>
    </table>
    <Nodata :showSwitch="info.length" :type="'support'"></Nodata>
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
      contentId: ''
    }
  },
  methods: {
    getCustomers: function () {
      document.title = '支持记录'
      this.contentId = this.$route.params.contentId
      if (this.contentId && this.id) {
        this.$http.get(this.apiURL + 'supportRecord.jhtml?contentId=' + this.contentId + '&wxbdopenId=' + this.id).then((response) => {
          this.info = response.data
          this.show = true
          this.$indicator.close()
        }, () => {
          this.$indicator.close()
          alert('请求失败')
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
  th,td{
  	text-align:center;
  	font-weight:normal;
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
