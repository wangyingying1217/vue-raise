<template>
  <div class="wrapper">
    <div class="wrapper">
      <!-- 未认证是两个都显示（认证之后只显示认证的） -->
        <div class="tab-menu">
          <a v-if="!(identification !== '未认证' && tabIndex == 'company')" :class="{'act': tabIndex == 'person'}" @click="tabIndex = 'person'">个人认证</a>
          <a v-if="!(identification !== '未认证' && tabIndex == 'person')" :class="{'act': tabIndex == 'company'}" @click="tabIndex = 'company'">企业认证</a>
        </div>
        <!-- 个人认证 -->
        <ul class="identification" v-if="tabIndex == 'person'">
          <li>
            <span class="title">中文姓名</span>：
            <input class="text" type="text" placeholder="输入您的真实姓名" name="perContact" v-bind="{'readonly':identification !== '未认证'}" v-model="userName">
          </li>
          <li>
            <span class="title">身份证号</span>：
            <input class="text" type="input" placeholder="输入证件号码" name="cardNo" v-bind="{'readonly':identification !== '未认证'}" v-model="IDcard">
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
        <!-- 企业认证 -->
        <ul class="identification" v-if="tabIndex == 'company'">
          <li>
            <span class="title">企业名称</span>：
            <input class="text" type="text" placeholder="输入企业/机构名称" name="tradeName" v-bind="{'readonly':identification !== '未认证'}" v-model="tradeName">
          </li>
          <li>
            <span class="title">营业执照号</span>：
            <input class="text" type="text" placeholder="请填写营业执照号或组织机构代码" name="license" v-bind="{'readonly':identification !== '未认证'}" v-model="license">
          </li>
          <li>
            <span class="title">法人姓名</span>：
            <input class="text" type="text" placeholder="企业/机构法人代表姓名" name="lawPerson" v-bind="{'readonly':identification !== '未认证'}" v-model="lawPerson">
          </li>
          <li>
            <span class="title">公司地址</span>：
            <input class="text" type="text" placeholder="企业/机构注册地址" name="inRegister" v-bind="{'readonly':identification !== '未认证'}" v-model="inRegister">
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
        <!-- 只有审核未通过时显示 -->
        <div class="cause" v-if="cause">未通过原因：{{cause}}</div>
        <!-- 审核通过时显示 -->
        <div v-if="identification === '已通过'" class="submit-btn"><a class="act" @click="confirmState = true">注销</a></div>
        <!-- 审核未通过时显示 -->
        <div v-else-if="identification === '未通过'" class="submit-btn"><a class="act" @click="logout()">重新认证</a></div>
        <!-- 审核中时显示 -->
        <div v-else-if="identification === '待审核'" class="submit-btn"><a>审核中……</a></div>
        <!-- 未认证是显示 -->
        <div v-else class="submit-btn"><a class="act" @click="submit()">确认</a></div>
      </div>
    <Confirm :info="confirmInfo" @confirm="confirm" v-show="confirmState"></Confirm>
    <Tip :info.sync="tip"></Tip>
  </div>
</template>

<script>
import Upload from '@/components/Upload'
import Confirm from '@/components/Confirm'

export default {
  props: ['apiURL', 'id'],
  data () {
    return {
      identification: false, // 是否认证
      tabIndex: 'person', // 选择认证类型
      userName: '', // 用户名
      IDcard: '', // 证件号码
      tradeName: '', // 企业名称
      license: '', // 营业执照号
      lawPerson: '', // 法人姓名
      inRegister: '', // 公司地址
      positivePic: '', // 身份证正面
      inversePic: '', // 身份证反面
      licensePic: '', // 营业执照图
      cause: '', // 用户名
      tip: '',
      confirmInfo: {
        title: '提示',
        name: '您确定要注销？'
      },
      confirmState: false
    }
  },
  methods: {
    getCustomers: function () {
      document.title = '实名认证'
      if (this.id) {
        // 获取个人信息
        this.$http.get(this.apiURL + 'member/authentication.jhtml?wxbdopenId=' + this.id).then((response) => {
          this.identification = response.data.state
          // 判断是否认证
          if (response.data.state !== '未认证') {
            this.tabIndex = response.data.cardType
            // 未通过显示原因
            if (response.data.state === '未通过') {
              this.cause = response.data.cause
            }
            // 判断认证类别
            if (response.data.cardType === 'person') {
              this.userName = response.data.name
              this.IDcard = response.data.cardNo
            } else if (response.data.cardType === 'company') {
              this.tradeName = response.data.tradeName
              this.license = response.data.license
              this.lawPerson = response.data.lawPerson
              this.inRegister = response.data.inRegister
            }
          }
          this.$indicator.close()
        }, () => {
          this.$indicator.close()
          this.tip = '请求失败'
        })
      }
    },
    // 注销
    logout: function (json) {
      this.$http.get(this.apiURL + 'member/outApprove.jhtml?wxbdopenId=' + this.id).then((response) => {
        this.identification = false
        this.tabIndex = 'person'
        this.userName = ''
        this.IDcard = ''
        this.tradeName = ''
        this.license = ''
        this.lawPerson = ''
        this.inRegister = ''
        this.positivePic = ''
        this.inversePic = ''
        this.licensePic = ''
        this.cause = ''
        this.identification = '未认证'
      }, () => {
        this.$indicator.close()
        this.tip = '操作失败'
      })
    },
    // 认证
    submit: function () {
      if (this.tabIndex === 'person') {
        if (!/^[\u4e00-\u9fa5]{2,5}$/.test(this.userName)) {
          this.tip = '请输入正确的中文名字(2~5个汉字之间)'
        } else if (!/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X|x)$/.test(this.IDcard)) {
          this.tip = '请填写有效的18位身份证号码'
        } else if (!/\s{0,}[\S]{1,}[\s\S]{0,}/.test(this.positivePic)) {
          this.tip = '请上传身份证正面图片'
        } else if (!/\s{0,}[\S]{1,}[\s\S]{0,}/.test(this.inversePic)) {
          this.tip = '请上传身份证反面图片'
        } else {
          this.$http.post(this.apiURL + 'member/approve.jhtml', this.formData).then((response) => {
            if (response.data.state) {
              this.tip = '正在审核  请稍后'
              this.$router.go(-1)
            } else {
              this.tip = response.data.msg
            }
          }, () => {
            this.tip = '信息修改失败'
          })
        }
      } else if (this.tabIndex === 'company') {
        if (!/\s{0,}[\S]{1,}[\s\S]{0,}/.test(this.tradeName)) {
          this.tip = '企业名称不能为空'
        } else if (!/^[a-zA-Z0-9]{15,18}$/.test(this.license)) {
          this.tip = '请填写正确的营业执照号'
        } else if (!/^[\u4e00-\u9fa5]{2,5}$/.test(this.lawPerson)) {
          this.tip = '请输入正确的法人姓名'
        } else if (!/\s{0,}[\S]{1,}[\s\S]{0,}/.test(this.inRegister)) {
          this.tip = '公司地址不能为空'
        } else if (!/\s{0,}[\S]{1,}[\s\S]{0,}/.test(this.licensePic)) {
          this.tip = '请上传营业执照图片'
        } else {
          this.$http.post(this.apiURL + 'member/approve.jhtml', this.formData).then((response) => {
            if (response.data.state) {
              this.tip = '正在审核  请稍后'
              this.$router.go(-1)
            } else {
              this.tip = response.data.msg
            }
          }, () => {
            this.tip = '信息修改失败'
          })
        }
      }
      return false
    },
    // 确定注销
    confirm: function (val) {
      this.confirmState = false
      if (val) {
        this.logout()
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
  components: {
    Confirm,
    Upload
  },
  computed: {
    // 提交的数据
    formData: function () {
      let formData = {}
      formData.wxbdopenId = this.id
      formData.cardType = this.tabIndex
      if (this.tabIndex === 'person') {
        formData.perContact = this.userName
        formData.cardNo = this.IDcard
        formData.positivePic = this.positivePic
        formData.inversePic = this.inversePic
      } else if (this.tabIndex === 'company') {
        formData.tradeName = this.tradeName
        formData.license = this.license
        formData.lawPerson = this.lawPerson
        formData.inRegister = this.inRegister
        formData.licensePic = this.licensePic
      }
      return formData
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
