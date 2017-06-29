<template>
  <div v-if="show">
    <div v-show="$route.path == '/myinfo'">
      <div class="wrapper">
        <dl class="personalInfo mt1">
          <dt>
            <Upload :apiURL="apiURL" :id="id" @pic="getLocalPic">
              <div class="box clearfix">头像
                <div class="head-pic">
                  <img ref="img" :src="avater" alt="pic">
                </div>
              </div>
            </Upload>
          </dt>
          <router-link :to="'/myinfo/userName'" tag="dd">
            <div class="box">昵称
              <div class="text">{{nickname}}</div>
            </div>
          </router-link>
          <dd>
            <div class="box">性别
              <div class="text">{{gender | sex}}</div>
            </div>
            <select class="hidden" v-model="gender" name="gender">
              <option :checked="gender=='male'" value="male">男</option>
              <option :checked="gender=='female'" value="female">女</option>
            </select>
          </dd>
          <router-link :to="'/myinfo/email'" tag="dd">
            <div class="box">邮箱
              <div class="text">
                <span class="email">{{email}}</span><!--
                --><span v-if="email && isEmail" class="approved">已认证</span><!--
                --><span v-if="email && !isEmail" class="disapprove">未认证</span>
              </div>
            </div>
          </router-link>
          <router-link :to="'/myinfo/tel'" tag="dd">
            <div class="box">手机号
              <div class="text">{{tel}}</div>
            </div>
          </router-link>
        </dl>
        <dl class="personalInfo">
          <router-link :to="'/myinfo/signature'" tag="dd">
            <div class="box">个性签名
              <div class="text" v-html="">
                <span v-if="signature">{{signature}}</span>
                <span class="placheholder" v-else>您还没有设置个人签名</span>
              </div>
              <input type="hidden" name="idiograph" v-model="signature">
            </div>
          </router-link>
          <router-link :to="'/myinfo/address'" tag="dd">
            <div class="box">收货地址</div>
          </router-link>
        </dl>
        <dl class="personalInfo">
          <router-link to="/myinfo/identification" tag="dd">
            <div class="box">实名认证</div>
          </router-link>
          <router-link to="/findPassword" tag="dd">
            <div class="box">修改密码</div>
          </router-link>
        </dl>
      </div>
    </div>
    <transition name="slide-fade">
      <router-view :apiURL="apiURL" :id="id" :signature="signature" :emailPre="email" :isEmail="isEmail"
      :username="nickname" :localPic="localPic" type="headPic"></router-view>
    </transition>
  </div>
</template>

<script>
import Upload from '@/components/Upload'

export default {
  props: ['apiURL', 'id'],
  data () {
    return {
      show: '',
      avater: '',
      nickname: '',
      tel: '',
      email: '',
      isEmail: '',
      signature: '',
      gender: '',
      localPic: ''
    }
  },
  components: {
    Upload
  },
  methods: {
    getCustomers: function () {
      document.title = '个人资料'
      if (this.id) {
        // 获取个人信息
        this.$http.get(this.apiURL + 'member/perInfo.jhtml?wxbdopenId=' + this.id).then((response) => {
          this.avater = response.data.headPic
          this.nickname = response.data.userName
          this.tel = response.data.mobile
          this.email = response.data.email
          this.isEmail = response.data.isEmail
          this.signature = response.data.idiograph
          this.gender = response.data.gender
          this.show = true
          this.$indicator.close()
        }, () => {
          this.$indicator.close()
          alert('请求失败')
        })
      }
    },
    getLocalPic: function (url) {
      this.localPic = url
      this.$router.push({ path: 'ImageUpload' })
    },
    changSex: function () {
      this.$http.post(this.apiURL + 'member/modify/gender.jhtml', {'wxbdopenId': this.id, 'gender': this.gender}).then((response) => {
        if (!response.data.state) {
          alert('性别修改失败')
        }
      }, () => {
        alert('性别修改失败')
      })
    }
  },
  watch: {
    gender: function () {
      this.changSex()
    },
    id: function () {
      this.getCustomers()
    },
    $route: function () {
      this.getCustomers()
    }
  },
  created () {
    // 组件创建完后获取数据，
    this.getCustomers()
  },
  filters: {
    sex: function (value) {
      if (value === 'female') {
        return '女'
      } else if (value === 'male') {
        return '男'
      }
    }
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style lang='less'>
.placheholder{color: #ccc;}
.personalInfo{
  margin-bottom:1rem;
  dt, dd{
    min-height:2rem;
    line-height:2rem;
    padding:0 1rem;
    background:#ffffff;
    border-top:1px solid #cccccc;
    position:relative;
    &:last-of-type{
      border-bottom:1px solid #cccccc;
    }
  }
  dt{
    line-height:3rem;
    border-bottom:none;
    &:last-of-type{
      border-bottom:none;
    }
  }
  .box{
    display:block;
    font-size:0.7rem;
    color:#999999;
    padding-right:1.5rem;
    background:url("../../../static/image/orderRight.png") no-repeat right center;
    background-size: 0.4rem;
  }
  .text{
    float:right;
    height:2rem;
    width:11rem;
    text-align:right;
    font-size:0.7rem;
    color:#333333;
    text-overflow:ellipsis;
    overflow:hidden;
    white-space:nowrap;
  }
  .hidden{
    width:100%;
    height:100%;
    position:absolute;
    left:0;
    top:0;
    opacity:0;
    -webkit-appearance:none;
  }
  .head-pic{
    width:2.5rem;
    height:2.5rem;
    border-radius:50%;
    overflow:hidden;
    float:right;
    margin:0.25rem 0;
    img{
      width:100%;
      min-height:100%;
    }
  }
  .email{
    display: inline-block;
    width: 7rem;
    text-overflow:ellipsis;
    overflow:hidden;
    white-space:nowrap;
    vertical-align: middle;
  }
  .disapprove{
    background: #ccc;
    color: #fff;
    padding: 0.1rem 0.2rem;
    border-radius: 0.1rem;
    font-size: 0.56rem;
    margin-left: 0.3rem;
  }
  .approved{
    .disapprove;
    background: #cc0000;
  }
}
</style>
