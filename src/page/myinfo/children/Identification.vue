<template>
  <div class="wrapper">
    <form :action="apiURL+'member/approve.jhtml'" method="post" ref="form">
      <div class="wrapper" v-show="state.name === ''">
        <div class="tab-menu">
          <a v-if="!(identification && tabIndex == 'company')" :class="{'act': tabIndex == 'person'}" @click="tabIndex = 'person'">个人认证</a>
          <a v-if="!(identification && tabIndex == 'person')" :class="{'act': tabIndex == 'company'}" @click="tabIndex = 'company'">企业认证</a>
        </div>
        <ul class="identification" v-if="tabIndex == 'person'">
          <li>
            <span class="title">中文姓名</span>：
            <input class="text" type="text" placeholder="输入中文姓名" name="perContact" v-bind="{'readonly':identification !== '未认证'}" v-model="userName">
          </li>
          <li>
            <span class="title">身份证号</span>：
            <input class="text" type="input" placeholder="输入证件号码" name="cardNo" v-bind="{'readonly':identification !== '未认证'}" v-model="IDcard">
          </li>
          <li>
            <span class="title">联系方式</span>：
            <input class="text" type="tel" placeholder="输入手机号码" name="perPhone" v-bind="{'readonly':identification !== '未认证'}" v-model="tel">
          </li>
          <li>
            <span class="title">联系地点</span>：
            <input class="text" type="text" placeholder="请选择个人地点" name="phone" readonly :value="place" @click="identification !== '未认证'?state.name='':state.name='province'">
            <input type="hidden" name="loProvince" :value="prov">
            <input type="hidden" name="loCity" :value="city">
          </li>
          <li v-if="identification === '未认证'">
            <span class="title">身份证正面</span>：
            <div class="imgpre"><img :src="positivePic" v-show="positivePic" alt="pic">
            </div>
            <Upload class="upload" :apiURL="apiURL" :id="id" @pic="(url) => {positivePic = url}">
              上传
            </Upload>
            <input type="hidden" name="positivePic" :value="positivePic">
          </li>
          <li v-if="identification === '未认证'">
            <span class="title">身份证反面</span>：
            <div class="imgpre"><img :src="inversePic" v-show="inversePic" alt="pic">
            </div>
            <Upload class="upload" :apiURL="apiURL" :id="id" @pic="(url) => {inversePic = url}">
              上传
            </Upload>
            <input type="hidden" name="inversePic" :value="inversePic">
          </li>
        </ul>
        <ul class="identification" v-if="tabIndex == 'company'">
          <li>
            <span class="title">企业名称</span>：
            <input class="text" type="text" placeholder="输入企业/机构名称" name="tradeName" v-bind="{'readonly':identification !== '未认证'}" v-model="tradeName">
          </li>
          <li>
            <span class="title">营业执照号</span>：
            <input class="text" type="number" placeholder="请填写营业执照号或组织机构代码" name="license" v-bind="{'readonly':identification !== '未认证'}" v-model="license">
          </li>
          <li>
            <span class="title">法人姓名</span>：
            <input class="text" type="text" placeholder="企业/机构法人代表姓名" name="lawPerson" v-bind="{'readonly':identification !== '未认证'}" v-model="lawPerson">
          </li>
          <li>
            <span class="title">公司地址</span>：
            <input class="text" type="text" placeholder="企业/机构注册地址" name="inRegister" v-bind="{'readonly':identification !== '未认证'}" v-model="inRegister">
          </li>
          <li>
            <span class="title">发起人</span>：
            <input class="text" type="text" placeholder="发起联系人姓名" name="busContact" v-bind="{'readonly':identification !== '未认证'}" v-model="userName">
          </li>
          <li>
            <span class="title">联系方式</span>：
            <input class="text" type="tel" placeholder="发起联系人手机号" name="busPhone" v-bind="{'readonly':identification !== '未认证'}" v-model="tel">
          </li>
          <li v-if="identification === '未认证'">
            <span class="title">营业执照图</span>：
            <div class="imgpre"><img :src="licensePic" v-show="licensePic" alt="pic">
            </div>
            <Upload class="upload" :apiURL="apiURL" :id="id" @pic="(url) => {licensePic = url}">
              上传
            </Upload>
            <input type="hidden" name="licensePic" :value="licensePic">
          </li>
        </ul>
        <input type="hidden" name="wxbdopenId" :value="id">
        <input type="hidden" name="cardType" :value="tabIndex">
        <input type="hidden" :value="redirectUrl" name="redirect">
        <div class="cause" v-if="cause">未通过原因：{{cause}}</div>
        <div v-if="identification === '已通过'" class="submit-btn"><a class="act" @click="logout()">注销</a></div>
        <div v-else-if="identification === '未通过'" class="submit-btn"><a class="act" @click="logout()">重新认证</a></div>
        <div v-else-if="identification === '待审核'" class="submit-btn"><a>审核中……</a></div>
        <div v-else class="submit-btn"><a class="act" @click="submit()">确认</a></div>
      </div>
    </form>

    <AddressList :info="state" @address="address"></AddressList>
    <Tip :info="tip"></Tip>
  </div>
</template>

<script>
import AddressList from '@/components/AddressList'
import Upload from '@/components/Upload'
import Tip from '@/components/Tip'

export default {
  props: ['apiURL', 'id'],
  data () {
    return {
      identification: false,
      check: false,
      tabIndex: 'person',
      userName: '',
      IDcard: '',
      tel: '',
      prov: '',
      city: '',
      tradeName: '',
      license: '',
      lawPerson: '',
      inRegister: '',
      positivePic: '',
      inversePic: '',
      licensePic: '',
      place: '',
      cause: '',
      tip: {
        text: ''
      },
      state: {
        name: ''
      }
    }
  },
  methods: {
    getCustomers: function () {
      document.title = '实名认证'
      if (this.id) {
        // 获取个人信息
        this.$http.get(this.apiURL + 'member/authentication.jhtml?wxbdopenId=' + this.id).then((response) => {
          this.identification = response.data.state
          alert(JSON.stringify(response.data))
          if (response.data.state !== '未认证') {
            this.tabIndex = response.data.cardType
            if (response.data.state === '未通过') {
              this.cause = response.data.cause
            }
            if (response.data.cardType === 'person') {
              this.userName = response.data.name
              this.IDcard = response.data.cardNo
              this.tel = response.data.phone
              this.prov = response.data.province
              this.city = response.data.city
              this.place = response.data.province + '/' + response.data.city
            } else if (response.data.cardType === 'company') {
              this.tradeName = response.data.tradeName
              this.license = response.data.license
              this.lawPerson = response.data.lawPerson
              this.inRegister = response.data.inRegister
              this.userName = response.data.busContact
              this.tel = response.data.busPhone
            }
          }
          this.$indicator.close()
        }, () => {
          this.$indicator.close()
          alert('请求失败')
        })
      }
    },
    logout: function (json) {
      this.$http.get(this.apiURL + 'member/outApprove.jhtml?wxbdopenId=' + this.id).then((response) => {
        this.identification = false
        this.check = false
        this.tabIndex = 'person'
        this.userName = ''
        this.IDcard = ''
        this.tel = ''
        this.prov = ''
        this.city = ''
        this.tradeName = ''
        this.license = ''
        this.lawPerson = ''
        this.inRegister = ''
        this.positivePic = ''
        this.inversePic = ''
        this.licensePic = ''
        this.place = ''
        this.identification = '未认证'
        alert('注销成功')
      }, () => {
        this.$indicator.close()
        alert('注销失败')
      })
    },
    submit: function () {
      if (this.tabIndex === 'person') {
        if (!/^[\u4e00-\u9fa5]{2,5}$/.test(this.userName)) {
          this.tip.text = '请输入正确的中文名字(2~5个汉字之间)'
        } else if (!/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X|x)$/.test(this.IDcard)) {
          this.tip.text = '请填写有效的18位身份证号码'
        } else if (!/^1[3|4|5|7|8][0-9]{9}$/.test(this.tel)) {
          this.tip.text = '请填写正确有效的11位手机号'
        } else if (!/\s{0,}[\S]{1,}[\s\S]{0,}/.test(this.place)) {
          this.tip.text = '项目地点不能为空'
        } else if (!/\s{0,}[\S]{1,}[\s\S]{0,}/.test(this.positivePic)) {
          this.tip.text = '请上传身份证正面图片'
        } else if (!/\s{0,}[\S]{1,}[\s\S]{0,}/.test(this.inversePic)) {
          this.tip.text = '请上传身份证反面图片'
        } else {
          this.$refs.form.submit()
          this.$router.push('/myinfo')
        }
      } else if (this.tabIndex === 'company') {
        if (!/\s{0,}[\S]{1,}[\s\S]{0,}/.test(this.tradeName)) {
          this.tip.text = '企业名称不能为空'
        } else if (!/\s{0,}[\S]{1,}[\s\S]{0,}/.test(this.license)) {
          this.tip.text = '营业执照号不能为空'
        } else if (!/^[\u4e00-\u9fa5]{2,5}$/.test(this.lawPerson)) {
          this.tip.text = '请输入正确的法人姓名'
        } else if (!/\s{0,}[\S]{1,}[\s\S]{0,}/.test(this.inRegister)) {
          this.tip.text = '公司地址不能为空'
        } else if (!/^[\u4e00-\u9fa5]{2,5}$/.test(this.userName)) {
          this.tip.text = '请输入正确的联系人姓名'
        } else if (!/^1[3|4|5|7|8][0-9]{9}$/.test(this.tel)) {
          this.tip.text = '请填写正确有效的11位手机号'
        } else if (!/\s{0,}[\S]{1,}[\s\S]{0,}/.test(this.licensePic)) {
          this.tip.text = '请上传营业执照图片'
        } else {
          this.$refs.form.submit()
          this.$router.push('/myinfo')
        }
      }
      return false
    },
    address: function (value) {
      this.place = value
      this.prov = value.split('/')[0]
      this.city = value.split('/')[1]
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
  components: {
    AddressList,
    Tip,
    Upload
  },
  computed: {
    redirectUrl: function () {
      return location.href.split('#')[0] + '#/myinfo'
    }
  },
  beforeRouteLeave (to, from, next) {
    if (to.fullPath === '/create') {
      this.$router.go(-1)
    } else {
      next()
    }
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style lang='less'>
.tab-menu{
  display: flex;
  height:2rem;
	background:#fff;
  a{
    flex: 1 1 auto;
  	text-align:center;
  	box-sizing:border-box;
    line-height:2rem;
    font-size:0.8rem;
    color: #333;
  	border-bottom:1px solid #cccccc;
    &.act{
      color:#cc0000;
    	border-bottom:0.1rem solid #cc0000;
    }
  }
}
.identification{
  li{
    min-height:2rem;
    padding:0 1rem;
    background:#ffffff;
    border-bottom:1px solid #cccccc;
    position:relative;
    .title{
      line-height:2rem;
      display: inline-block;
      width: 3.6rem;
      font-size:0.7rem;
      text-align: justify;
      text-align-last: justify;
      padding: 0;
    }
    .text{
      width: 11rem;
      font-size:0.7rem;
      color:#333333;
      text-overflow:ellipsis;
      overflow:hidden;
      white-space:nowrap;
    }
    .imgpre {
      display: inline-block;
      width: 4rem;
      height: 2.6rem;
      border: 1px solid #ccc;
      vertical-align: middle;
      margin: 0.7rem 2rem 0.7rem 1.4rem;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .upload {
      display: inline-block;
      width: 2.7rem;
      height: 1.4rem;
      line-height: 1.4rem;
      border-radius: 0.2rem;
      background: #cc0000;
      text-align: center;
      vertical-align: middle;
      position: relative;
      font-size: 0.7rem;
      color: #ffffff;
      input {
        width: 100%;
        height: 100%;
        opacity: 0;
        position: absolute;
        left: 0;
        top: 0;
      }
    }
  }
}
.cause{
  width:14rem;
  margin: 1rem auto;
  background: #fff;
  line-height: 1rem;
  padding: 0.5rem;
  border: 1px solid #ccc;
}
</style>
