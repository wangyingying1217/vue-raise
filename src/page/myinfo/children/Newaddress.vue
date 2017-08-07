<template>
  <div class="wrapper">
    <ul class="address-add" v-show="state === ''">
      <li>
        <span class="title">收件人</span><input type="text" v-model="name">
      </li>
      <li>
        <span class="title">联系电话</span><input type="tel" v-model="tel">
      </li>
      <li>
        <span class="title">所在地区</span><input type="text" class="local" readonly placeholder="请选择" v-model="place" @click="state='province'">
      </li>
      <li class="textarea-wrap">
        <textarea placeholder="请写详细地址，不少于5个字" v-model="detial"></textarea>
      </li>
      <li class="default-wrap" v-if="$route.params.type=='add'">
        <span class="title">设为默认</span>
        <div class="default fr" :class="{'act':defaultState}" @click="defaultState=!defaultState"></div>
      </li>
    </ul>
    <AddressList :state.sync="state" :apiURL="apiURL" @address="address"></AddressList>
    <Tip :info.sync="tip"></Tip>
    <div class="submit-btn" @click="submit">
      <a :class="{'act': name && tel && place && detial.length}">保存地址</a>
    </div>
  </div>
</template>

<script>
import AddressList from '@/components/AddressList'

export default {
  props: ['apiURL', 'id', 'info'],
  data () {
    return {
      state: '',
      editId: '',
      name: '',
      tel: '',
      place: '',
      detial: '',
      defaultState: false,
      tip: ''
    }
  },
  methods: {
    getCustomers: function () {
      if (this.$route.params.type === 'edit') {
        document.title = '修改地址'
      } else {
        document.title = '新增地址'
      }
      if (this.$route.params.type === 'edit' && this.info.id === '') {
        window.history.go(-1)
      }
      this.editId = this.info.id
      this.name = this.info.consignee
      this.tel = this.info.phone
      this.place = this.info.areaName
      this.detial = this.info.address
      this.defaultState = this.info.defAddress
      this.$indicator.close()
    },
    submit: function (item) {
      if (!/\s{0,}[\S]{1,}[\s\S]{0,}/.test(this.name)) {
        this.tip = '收件人不能为空'
      } else if (!/^1[3|4|5|7|8][0-9]{9}$/.test(this.tel)) {
        this.tip = '手机号输入错误'
      } else if (!/\s{0,}[\S]{1,}[\s\S]{0,}/.test(this.place)) {
        this.tip = '所在地区不能为空'
      } else if (this.detial.length < 5) {
        this.tip = '详细地址至少5个字'
      } else {
        var parameter = '?wxbdopenId=' + this.id + '&consignee=' + this.name + '&phone=' + this.tel + '&areaName=' + this.place + '&address=' + this.detial + '&isDefault=' + this.defaultState
        var url = ''
        if (this.editId) {
          url = this.apiURL + 'member/receiver/update.jhtml' + parameter + '&id=' + this.editId
        } else {
          url = this.apiURL + 'member/receiver/save.jhtml' + parameter
        }
        this.$http.get(url).then((response) => {
          if (response.data.state) {
            this.$emit('addState', true)
            window.history.go(-1)
          } else {
            this.tip = '最多只能添加8条'
          }
        }, (response) => {
          this.tip = '操作失败'
        })
      }
    },
    address: function (value) {
      this.place = value
    }
  },
  watch: {
    info: {
      handler: function () {
        this.getCustomers()
      },
      deep: true
    },
    $route: function () {
      this.getCustomers()
      document.title = '个人中心'
    }
  },
  components: {
    AddressList
  },
  created () {
    this.getCustomers()
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style lang='less' scoped>
.address-add{
  li{
    line-height:2.26rem;
    box-sizing:border-box;
    border-top:1px solid #cccccc;
    background:#ffffff;
    font-size:0.67rem;
    padding:0 0.6rem;
    input{
      height:2rem;
      width:13.2rem;
      font-size:0.67rem;
      vertical-align:middle;
    }
    textarea{
      display:block;
      width:16.8rem;
      height:4rem;
      font-size:0.67rem;
      line-height:1rem;
    }
  }
  .textarea-wrap{
    padding:0.4rem 0.6rem;
  }
  .default-wrap{
    margin-top:0.5rem;
    border:none;
  }
  .title{
    display:inline-block;
    width:3.6rem;
    padding: 0;
    vertical-align:middle;
  }
  .local{
    text-align:right;
    padding-right:1.3rem;
    background:url("../../../image/orderRight.png") no-repeat right center;
    background-size: 0.4rem;
    box-sizing:border-box;
  }
}
</style>
