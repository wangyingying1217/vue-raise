<template>
  <div class="my-raise">
    <Tabmenu :tabInfo = "tabInfo"></Tabmenu>
    <router-view :info="info" :type="'myRaise'" @deleteRaise="deleteRaise" @endRaise="endRaise" @abolishRaise="abolishRaise" @supplement="supplement"></router-view>
    <Confirm :info="confirmInfo" @confirm="confirm" v-show="confirmState"></Confirm>
    <Nodata :showSwitch="info.length" type="index"></Nodata>
    <LoadMore :info="loadMore"></LoadMore>
  </div>
</template>

<script>
import Confirm from '@/components/Confirm'
import Tabmenu from '@/components/Tabmenu'
import Nodata from '@/components/Nodata'
import Pay from '@/components/Pay'
import LoadMore from '@/components/LoadMore'

export default {
  props: ['apiURL', 'id'],
  mixins: [Pay],
  data () {
    return {
      tabInfo: [{
        href: '/myraise/effective',
        name: '有效众筹'
      }, {
        href: '/myraise/history',
        name: '历史众筹'
      }],
      info: [],
      page: 1,
      money: 0,
      loadMore: {
        state: ''
      },
      confirmInfo: {
        title: '提示',
        name: '您确定要删除此条回复？'
      },
      confirmState: false,
      type: '',
      contentId: '',
      cshId: ''
    }
  },
  components: {
    Tabmenu,
    Nodata,
    LoadMore,
    Confirm
  },
  methods: {
    getCustomers: function () {
      document.title = '我的众筹'
      if (this.id) {
        this.page = 1
        this.$http.get(this.url).then((response) => {
          this.info = response.data[this.state]
          this.$indicator.close()
        }, () => {
          this.$indicator.close()
          alert('请求失败')
        })
      }
    },
    confirm: function (val) {
      this.confirmState = false
      if (val && this.type === 'deleteRaise') {
        this.$http.get(this.apiURL + 'member/del_meRaise.jhtml?id=' + this.contentId + '&wxbdopenId=' + this.id).then((response) => {
          if (response.data.state) {
            this.info = this.info.filter((item) => {
              return item.contentId !== this.contentId
            })
          }
        }, () => {
          alert('删除失败')
        })
      } else if (val && this.type === 'endRaise') {
        this.$http.get(this.apiURL + 'member/stop_raise.jhtml?id=' + this.contentId + '&wxbdopenId=' + this.id).then((response) => {
          if (response.data.state) {
            this.info.forEach((item, index) => {
              if (item.contentId === this.contentId) {
                this.info[index].state = '终止中'
              }
            })
          }
        }, () => {
          this.$indicator.close()
          alert('终止失败')
        })
      } else if (val && this.type === 'abolishRaise') {
        this.$http.get(this.apiURL + 'member/abolish.jhtml?id=' + this.contentId + '&wxbdopenId=' + this.id).then((response) => {
          if (response.data.state) {
            this.info.forEach((item, index) => {
              if (item.contentId === this.contentId) {
                this.info[index].state = '废止中'
              }
            })
          }
        }, () => {
          this.$indicator.close()
          alert('废止失败')
        })
      } else if (val && this.type === 'supplement') {
        let data = {
          wxbdopenId: this.id,
          money: this.money,
          cshId: this.cshId,
          contentId: this.contentId,
          state: localStorage.getItem('state')
        }
        this.pay(data)
      }
    },
    deleteRaise: function (id) {
      this.confirmState = true
      this.type = 'deleteRaise'
      this.contentId = id
      this.confirmInfo.name = '您确定要删除此条众筹？'
    },
    endRaise: function (id) {
      this.confirmState = true
      this.type = 'endRaise'
      this.contentId = id
      this.confirmInfo.name = '终止后不可恢复，您确定要终止此条众筹？'
    },
    abolishRaise: function (id) {
      this.confirmState = true
      this.type = 'abolishRaise'
      this.contentId = id
      this.confirmInfo.name = '废止后不可恢复，您确定要废止此条众筹？'
    },
    supplement: function (json) {
      this.confirmState = true
      this.type = 'supplement'
      this.cshId = json.cshId
      this.money = json.money
      this.contentId = json.contentId
      this.confirmInfo.name = '确认补齐余下的' + this.money + '元？'
    }
  },
  watch: {
    loadMore: {
      handler: function (val, oldVal) {
        if (val.state === 'loading') {
          this.page ++
          this.$http.post(this.url).then((response) => {
            if (response.data.length) {
              this.info.push(...response.data[this.state])
              this.loadMore.state = ''
            } else {
              this.loadMore.state = 'loaded'
            }
          })
        }
      },
      deep: true
    },
    id: function () {
      this.getCustomers()
    },
    $route: function () {
      this.getCustomers()
    }
  },
  computed: {
    state: function () {
      return this.$route.path.split('/')[2]
    },
    url: function () {
      if (this.state === 'effective') {
        return this.apiURL + 'member/validRaise.jhtml?wxbdopenId=' + this.id + '&page=' + this.page
      } else if (this.state === 'history') {
        return this.apiURL + 'member/hisRaise.jhtml?wxbdopenId=' + this.id + '&page=' + this.page
      }
    }
  },
  created () {
    // 组件创建完后获取数据，
    this.getCustomers()
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style lang='less' scoped>
.my-raise{
  padding-top: 2.5rem;
}
</style>
