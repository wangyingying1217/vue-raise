<template>
  <div class="my-raise">
    <Tabmenu :tabInfo = "tabInfo"></Tabmenu>
    <router-view :info="info" :type="'myRaise'" @deleteRaise="deleteRaise" @endRaise="endRaise" @abolishRaise="abolishRaise" @supplement="supplement"></router-view>
    <Confirm :info="confirmInfo" @confirm="confirm" v-show="confirmState"></Confirm>
    <Prompt :info="promptInfo" @confirm="prompt" v-show="promptState"></Prompt>
    <Nodata :showSwitch="info.length" type="index"></Nodata>
    <Tip :info.sync="tip"></Tip>
    <LoadMore :load.sync="loadState" :Boff= "loadBoff"></LoadMore>
  </div>
</template>

<script>
import Confirm from '@/components/Confirm'
import Prompt from '@/components/Prompt'
import Tabmenu from '@/components/Tabmenu'
import Nodata from '@/components/Nodata'
import Pay from '@/components/Pay'

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
      loadState: false,
      loadBoff: true,
      confirmInfo: {
        title: '提示',
        name: '您确定要删除此条回复？'
      },
      confirmState: false,
      promptInfo: {
        title: '提示',
        name: '您确定要删除此条回复？'
      },
      promptState: false,
      tip: '',
      type: '',
      contentId: '',
      cshId: ''
    }
  },
  components: {
    Tabmenu,
    Nodata,
    Prompt,
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
          this.tip = '请求失败'
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
          this.tip = '删除失败'
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
    prompt: function (val) {
      this.promptState = false
      if (val.state && this.type === 'endRaise') {
        this.$http.get(this.apiURL + 'member/stop_raise.jhtml?id=' + this.contentId + '&wxbdopenId=' + this.id + '&acceptOption=' + val.text).then((response) => {
          if (response.data.state) {
            this.info.forEach((item, index) => {
              if (item.contentId === this.contentId) {
                this.info[index].state = '终止中'
              }
            })
          }
        }, () => {
          this.$indicator.close()
          this.tip = '终止失败'
        })
      } else if (val.state && this.type === 'abolishRaise') {
        this.$http.get(this.apiURL + 'member/abolish.jhtml?id=' + this.contentId + '&wxbdopenId=' + this.id + '&acceptOption=' + val.text).then((response) => {
          if (response.data.state) {
            this.info.forEach((item, index) => {
              if (item.contentId === this.contentId) {
                this.info[index].state = '废止中'
              }
            })
          }
        }, () => {
          this.$indicator.close()
          this.tip = '废止失败'
        })
      }
    },
    deleteRaise: function (id) {
      this.confirmState = true
      this.type = 'deleteRaise'
      this.contentId = id
      this.confirmInfo.name = '您确定要删除此条众筹？'
    },
    endRaise: function (id) {
      this.promptState = true
      this.type = 'endRaise'
      this.contentId = id
      this.promptInfo.name = '终止后不可恢复，请填写原因：'
    },
    abolishRaise: function (id) {
      this.promptState = true
      this.type = 'abolishRaise'
      this.contentId = id
      this.promptInfo.name = '废止后不可恢复，请填写原因：'
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
    loadState: function (val, oldVal) {
      if (val) {
        this.page ++
        this.$http.post(this.url).then((response) => {
          if (response.data.length) {
            this.info.push(...response.data[this.state])
            this.loadState = false
          } else {
            this.loadBoff = false
          }
        })
      }
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
