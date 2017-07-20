<template>
  <div v-if="show">
    <table class="return-progress">
      <thead>
      <tr>
        <th width="40%">订单编号</th>
        <th width="20%">支持者</th>
        <th width="20%" v-on:click.stop="typeState = true">
          <p class="type-box">回报状态</p>
          <ul class="type-list" v-show="typeState">
            <li v-for="(item,index) in typeList" v-bind:class="{act:type == item.value}" v-on:click.stop="search(item)">{{item.name}}</li>
          </ul>
        </th>
        <!-- <th width="20%">状态时间</th> -->
      </tr>
      </thead>
      <tbody>
      <tr v-for="item in info">
        <td>{{item.orderCode}}</td>
        <td class="clBlue">{{item.supporter}}</td>
        <td>{{item.state}}</td>
        <!-- <td>
          <p>{{item.date}}</p>
          <p>{{item.time}}</p>
        </td> -->
      </tr>
      </tbody>
    </table>
    <LoadMore :info="loadMore"></LoadMore>
    <Nodata :showSwitch="info.length" :type="'returnProgress'"></Nodata>
  </div>
</template>

<script>
import Nodata from '@/components/Nodata'
import LoadMore from '@/components/LoadMore'

export default {
  props: ['apiURL', 'id'],
  data () {
    return {
      show: false,
      info: {},
      page: 1,
      type: 'all',
      loadMore: {
        state: ''
      },
      typeState: false,
      typeList: [
        {
          value: 'all',
          name: '全部'
        }, {
          value: 'finished',
          name: '已完成'
        }, {
          value: 'dispatched',
          name: '已发货'
        }, {
          value: 'nodispatch',
          name: '未发货'
        }, {
          value: 'exchanging',
          name: '正在换货'
        }, {
          value: 'applyexchange',
          name: '申请换货'
        }
      ]
    }
  },
  methods: {
    getCustomers: function () {
      document.title = '回报进展'
      if (this.contentId && this.id) {
        this.$http.get(this.apiURL + 'member/returnEvolve.jhtml?contentId=' + this.contentId + '&wxbdopenId=' + this.id + '&page=' + this.page + '&type=' + this.type).then((response) => {
          this.info = response.data
          this.show = true
          this.$indicator.close()
        }, () => {
          this.$indicator.close()
          alert('请求失败')
        })
      }
    },
    search: function (item) {
      this.type = item.value
      this.page = 1
      this.typeState = false
      this.getCustomers()
    }
  },
  created () {
    // 组件创建完后获取数据，
    this.getCustomers()
    document.onclick = () => {
      this.typeState = false
    }
  },
  watch: {
   // 如果路由有变化，会再次执行该方法
    $route () {
      this.getCustomers()
    },
    id: function () {
      this.getCustomers()
    },
    loadMore: {
      handler: function (val, oldVal) {
        if (val.state === 'loading') {
          this.page ++
          this.$http.get(this.apiURL + 'member/returnEvolve.jhtml?contentId=' + this.contentId + '&wxbdopenId=' + this.id + '&page=' + this.page + '&type=' + this.type).then((response) => {
            if (response.data.length) {
              this.info.push(...response.data)
              this.loadMore.state = ''
            } else {
              this.loadMore.state = 'loaded'
            }
          }, () => {
            alert('请求失败')
          })
        }
      },
      deep: true
    }
  },
  components: {
    Nodata,
    LoadMore
  },
  computed: {
    contentId: function () {
      return this.$route.params.contentId
    }
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style lang='less' scoped>
.return-progress{
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
  .type-box{
    &:after{
      content: "";
      display: inline-block;
      height:0.3rem;
      width: 1rem;
      vertical-align: middle;
      background:url("../../image/select.png") no-repeat center center;
      background-size: contain;
    }
  }
  .type-list{
    position:absolute;
    left:0;
    top:2rem;
    width:100%;
    z-index: 10;
    background:#f5f5f5;
    text-align: left;
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
