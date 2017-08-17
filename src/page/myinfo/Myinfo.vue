<template>
  <div v-if="show">
    <div v-show="$route.path == '/myinfo/check' || $route.path == '/myinfo/nocheck' ">
      <div class="wrapper">
        <dl class="personalInfo mt1">
          <!-- 头像 -->
          <dt>
            <Upload :apiURL="apiURL" :id="id" @pic="getLocalPic">
              <div class="box clearfix">头像
                <div class="head-pic">
                  <img ref="img" :src="avater" alt="pic">
                </div>
              </div>
            </Upload>
          </dt>
          <!-- 用户名 -->
          <dd>
            <div class="box">用户名
              <div class="text">{{userName}}</div>
            </div>
          </dd>
          <!-- 昵称 -->
          <router-link :to="'/myinfo/userName'" tag="dd">
            <div class="box">昵称
              <div class="text">{{nickName}}</div>
            </div>
          </router-link>
          <!-- 性别 -->
          <dd>
            <div class="box">性别
              <div class="text">{{gender | sex}}</div>
            </div>
            <select class="hidden" v-model="gender" name="gender" @change="changSex">
              <option :checked="gender=='secrecy'" value="secrecy">保密</option>
              <option :checked="gender=='male'" value="male">男</option>
              <option :checked="gender=='female'" value="female">女</option>
            </select>
          </dd>
          <!-- 邮箱 -->
          <router-link :to="'/myinfo/email'" tag="dd">
            <span v-show="check && !isEmail" class="check-icon">*</span>
            <div class="box">邮箱
              <div class="text">
                <span class="email">{{email}}</span><!--
                --><span v-if="email && isEmail" class="approved">已认证</span><!--
                --><span v-if="email && !isEmail" class="disapprove">未认证</span>
              </div>
            </div>
          </router-link>
          <!-- 手机 -->
          <router-link :to="'/myinfo/tel'" tag="dd">
            <span v-show="check && !/^1[3|4|5|7|8][0-9]/.test(this.tel)" class="check-icon">*</span>
            <div class="box">手机
              <div class="text">{{tel}}</div>
            </div>
          </router-link>
        </dl>
        <!-- 工作信息 -->
        <dl class="personalInfo">
          <dd>
            <span v-show="check && !unitType" class="check-icon">*</span>
            <div class="box">单位类别
              <div class="text">{{unitType | placeholder('请选择')}}</div>
            </div>
            <select class="hidden" v-model="unitType" @change="changType">
              <option v-for="(item, index) in unitData" :key="index" :checked="item.unitCategory == unitType" :value="item.unitCategory">{{item.unitCategory}}</option>
            </select>
          </dd>
          <dd v-show="unitType !== '其它类'">
            <span v-show="check && !unitLevel" class="check-icon">*</span>
            <div class="box">单位层级
              <div class="text">{{unitLevel | placeholder('请选择')}}</div>
            </div>
            <select class="hidden" v-model="unitLevel" @change="changLevel">
              <option v-for="(item, index) in levelData" :key="index" :checked="item.unitHierarchy == unitLevel" :value="item.unitHierarchy">{{item.unitHierarchy}}</option>
            </select>
          </dd>
          <dd>
            <span v-show="check && !work" class="check-icon">*</span>
            <div class="box">从事工作
              <div class="text">{{work | placeholder('请选择')}}</div>
            </div>
            <select class="hidden" v-model="work" @change="changWork">
              <option v-for="(item, index) in workData" :key="index" :checked="item == work" :value="item">{{item}}</option>
            </select>
          </dd>
        </dl>
        <dl class="personalInfo">
          <!-- 个性签名 -->
          <router-link :to="'/myinfo/signature'" tag="dd">
            <div class="box">个性签名
              <div class="text" v-html="">
                <span v-if="signature">{{signature}}</span>
                <span class="placheholder" v-else>您还没有设置个性签名</span>
              </div>
              <input type="hidden" name="idiograph" v-model="signature">
            </div>
          </router-link>
          <!-- 收货地址 -->
          <router-link :to="'/myinfo/address'" tag="dd">
            <div class="box">收货地址</div>
          </router-link>
        </dl>
        <dl class="personalInfo">
          <!-- 实名认证 -->
          <dd @click="identification">
            <span v-show="check && !isAuthentication" class="check-icon">*</span>
            <div class="box">实名认证</div>
          </dd>
          <!-- 修改密码 -->
          <router-link to="/findPassword" tag="dd">
            <div class="box">修改密码</div>
          </router-link>
        </dl>
      </div>
    </div>
    <transition name="slide-fade">
      <router-view :apiURL="apiURL" :id="id" :signature="signature" :emailPre="email" :isEmail="isEmail"
      :username="nickName" :localPic="localPic" type="headPic" :tel="tel"></router-view>
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
      avater: '', // 头像地址
      userName: '', // 用户名
      nickName: '', // 昵称
      tel: '', // 电话
      email: '', // 邮箱
      isEmail: '', // 邮箱是否认证
      signature: '', // 个性签名
      gender: '', // 性别
      localPic: '', // 未剪裁的头像地址
      isAuthentication: false, // 是否已经实名认证
      unitData: [], // 单位信息列表
      unitType: '', // 单位类别
      unitLevel: '', // 单位层级
      work: '' // 从事工作
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
          this.userName = response.data.userName
          this.nickName = response.data.nickName
          this.tel = response.data.mobile
          this.email = response.data.email
          this.isEmail = response.data.isEmail
          this.signature = response.data.idiograph
          this.gender = response.data.gender
          this.isAuthentication = response.data.isAuthentication
          this.unitData = response.data.causeUnit
          this.unitType = response.data.unitCategory
          this.unitLevel = response.data.unitHierarchy
          this.work = response.data.performWork
          this.show = true
          this.$indicator.close()
        }, () => {
          this.$indicator.close()
          alert('请求失败')
        })
      }
    },
    // 跳转到图片剪裁
    getLocalPic: function (url) {
      this.localPic = url
      this.$router.push('/ImageUpload')
    },
    // 更改性别
    changSex: function () {
      this.$http.post(this.apiURL + 'member/modify/gender.jhtml', {'wxbdopenId': this.id, 'gender': this.gender}).then((response) => {
        if (!response.data.state) {
          alert('性别修改失败')
        }
      }, () => {
        alert('性别修改失败')
      })
    },
    // 更改工作信息
    changWorkInfo: function () {
      this.$http.post(this.apiURL + 'member/cause/unit.jhtml', {'wxbdopenId': this.id, 'unitCategory': this.unitType, 'unitHierarchy': this.unitLevel, 'performWork': this.work}).then((response) => {
        if (!response.data.state) {
          alert('信息修改失败')
        }
      }, () => {
        alert('信息修改失败')
      })
    },
    // 更改单位类别
    changType: function () {
      if (this.unitType === '其它类') {
        this.unitLevel = '其它单位'
      } else {
        this.unitLevel = ''
      }
      this.work = ''
      this.changWorkInfo()
    },
    // 更改单位层级
    changLevel: function () {
      if (this.unitLevel) {
        this.work = ''
        this.changWorkInfo()
      }
    },
    // 更改从事工作
    changWork: function () {
      if (this.work) {
        this.changWorkInfo()
      }
    },
    // 进行实名认证前检验是否邮箱、电话、工作信息已完善
    identification: function () {
      if (this.work && /^1[3|4|5|7|8][0-9]/.test(this.tel) && this.isEmail) {
        this.$router.push('/myinfo/identification/' + this.$route.params.type)
      } else {
        alert('请先认证邮箱、电话以及工作信息')
      }
    }
  },
  watch: {
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
  computed: {
    // 判断是否需要对必填项进行提示（从发起认证页面跳转过来时需要提示）
    check: function () {
      let check = false
      if (this.$route.params.type === 'check') {
        check = true
      }
      return check
    },
    // 单位层级数据列表
    levelData: function () {
      if (this.unitType) {
        let data = []
        this.unitData.forEach((item) => {
          if (item.unitCategory === this.unitType) {
            data = item.hierarchy
          }
        })
        return data
      }
    },
    // 从事工作数据列表
    workData: function () {
      if (this.unitLevel) {
        let data = []
        this.levelData.forEach((item) => {
          if (item.unitHierarchy === this.unitLevel) {
            data = item.performWork
          }
        })
        return data
      }
    }
  },
  filters: {
    // 将性别显示方式进行转换
    sex: function (value) {
      if (value === 'female') {
        return '女'
      } else if (value === 'male') {
        return '男'
      } else {
        return '保密'
      }
    },
    // 对工作信息没有选择时进行提示
    placeholder: function (value, text) {
      if (value) {
        return value
      } else {
        return text
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
  .check-icon{
    position: absolute;
    left: 0.5rem;
    color: #cc0000;
  }
  .box{
    display:block;
    font-size:0.7rem;
    color:#999999;
    padding-right:1.5rem;
    background:url("../../image/orderRight.png") no-repeat right center;
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
