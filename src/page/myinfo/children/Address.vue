<template>
  <div class="wrapper">
    <div v-show="$route.path == '/myinfo/address'">
      <ul class="address-list">
        <li v-for="(item,index) in info" @click="send(item)">
          <div class="info-wrap">
            <p class="info clearfix">
              <span class="fl">{{item.consignee}}</span>
              <span class="fr">{{item.phone}}</span>
            </p>
            <p class="address">{{item.areaName}}{{item.address}}</p>
          </div>
          <div class="control clearfix">
            <div class="default fl" :class="{'act': item.defAddress}" @click="changeDefault(item)">默认地址</div>
            <div class="delete fr" @click="remove(item,index)">删除</div>
            <router-link :to="'/newaddress/edit'" tag="div">
              <div class="edit fr" @click="editItem = item">编辑</div>
            </router-link>
          </div>
        </li>
      </ul>
      <div class="submit-btn" @click="addAddress"><a :class="{'act': info.length < 8}">添加新地址</a></div>
    </div>
    <Confirm :info="confirmInfo" @confirm="confirm" v-show="confirmState"></Confirm>
    <Nodata :showSwitch="info.length" :type="'address'"></Nodata>
    <Tip :info.sync="tip"></Tip>
    <transition name="slide-fade">
      <router-view :apiURL="apiURL" :id="id" :info="editItem" @addState="getCustomers"></router-view>
    </transition>
  </div>
</template>

<script>
import Nodata from '@/components/Nodata'
import Confirm from '@/components/Confirm'

export default {
  props: ['apiURL', 'id', 'type'],
  data () {
    return {
      info: [],
      deleteId: '',
      deleteIndex: '',
      editItem: {
        address: '',
        areaName: '',
        consignee: '',
        defAddress: false,
        id: '',
        phone: ''
      },
      tip: '',
      confirmInfo: {
        title: '删除确认',
        name: '您确定要删除此条地址？'
      },
      confirmState: false
    }
  },
  methods: {
    getCustomers: function () {
      document.title = '收货地址'
      if (this.id) {
        this.$http.get(this.apiURL + 'member/receiver/list.jhtml?wxbdopenId=' + this.id).then((response) => {
          this.info = response.data
          this.$indicator.close()
        }, () => {
          this.$indicator.close()
          this.tip = '请求失败'
        })
      }
    },
    send: function (item) {
      if (this.type === 'order') {
        this.$emit('info', item)
        this.$router.go(-1)
      }
    },
    changeDefault: function (item) {
      this.$http.get(this.apiURL + 'member/receiver/defAddress.jhtml?wxbdopenId=' + this.id + '&id=' + item.id).then((response) => {
        if (response.data.state) {
          this.info.forEach((item) => {
            item.defAddress = false
          })
          item.defAddress = true
        }
      }, () => {
        this.tip = '修改失败失败'
      })
    },
    remove: function (item, index) {
      this.confirmState = true
      this.deleteId = item.id
      this.deleteIndex = index
    },
    addAddress: function () {
      if (this.info.length > 7) {
        this.tip = '最多只能添加8条'
      } else {
        this.$router.push('/newaddress/add')
      }
    },
    confirm: function (val) {
      this.confirmState = false
      if (val) {
        this.$http.get(this.apiURL + 'member/receiver/delete.jhtml?wxbdopenId=' + this.id + '&id=' + this.deleteId).then((response) => {
          if (response.data.state) {
            var _item = this.info.splice(this.deleteIndex, 1)
            if (_item[0].defAddress) {
              this.changeDefault(this.info[0])
            }
          }
        }, () => {
          this.$indicator.close()
          this.tip = '删除失败'
        })
      }
    }
  },
  watch: {
   // 如果路由有变化，会再次执行该方法
    id: function () {
      this.getCustomers()
    },
    $route: function () {
      this.getCustomers()
    }
  },
  components: {
    Nodata,
    Confirm
  },
  created () {
    // 组件创建完后获取数据，
    this.getCustomers()
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style lang='less'>
.default{
  &:before{
    content:"";
    display:inline-block;
    width:0.8rem;
    height:0.8rem;
    box-sizing:border-box;
    border:1px solid #333333;
    border-radius:50%;
    vertical-align:sub;
    margin-right:0.25rem;
  }
  &.act{
    color:#cc0000;
    &:before{
      border:none;
      background:url("../../../image/correct.png") no-repeat 0 0;
      background-size: cover;
    }
  }
}
.address-list{
  padding-bottom:4rem;
  background: #f5f5f5;
  li{
    margin-bottom:0.5rem;
    color:#333333;
    font-size:0.67rem;
    background:#ffffff;
  }
  .info-wrap{
    //border-top:1px solid #cccccc;
    border-bottom:1px solid #cccccc;
    padding:0 0.6rem 0.6rem;
  }
  .info{
    line-height:1.85rem;
  }
  .address{
    line-height:0.8rem;
  }
  .control{
    padding:0 0.6rem;
    line-height:2rem;
  }
  .delete, .edit{
    &:before{
      content:"";
      display:inline-block;
      width:0.87rem;
      height:0.9rem;
      vertical-align:sub;
      margin-right:0.25rem;
    }
    margin-right:0.4rem;
  }
  .delete{
    &:before{
      background:url("../../../image/deleteBlack.png") no-repeat 0 0;
      background-size: cover;
    }
  }
  .edit{
    &:before{
      background:url("../../../image/editBlack.png") no-repeat 0 0;
      background-size: cover;
    }
    a, a:hover{
      color:#333333
    }
  }
}
</style>
