<template>
  <div class="">
    <!-- 因为这个页面太长  我就单独分为四个组件去写的 通过state.name进行控制显示的组件-->
    <form id="create" :action="apiURL+'fundingSub.jhtml'" enctype="multipart/form-data" method="post" v-show="show">
      <PresonInfo v-show="state.name=='presonInfo'" :state="state" :info="user" :type="itemtype"></PresonInfo>
      <RaiseInfo v-show="state.name=='raiseInfo'" :apiURL="apiURL" :info="user" :id="id" :state="state" :validateMsg="validateMsg" :validators="validators" :validate="validate"></RaiseInfo>
      <Describe v-show="state.name=='describe'" :apiURL="apiURL" :id="id" :state="state"></Describe>
      <Return v-show="state.name=='return'" :apiURL="apiURL" :id="id" :state="state" :validateMsg="validateMsg" :validators="validators" :validate="validate" :productTypeList="productType"></Return>
      <input type="hidden" :value="user.userName" name="userName">
      <input type="hidden" :value="user.wxbdopenId" name="userId">
      <input type="hidden" :value="codeState" name="state">
      <input type="hidden" :value="redirectUrl" name="redirect">
    </form>
    <Tip :info.sync="tip"></Tip>
  </div>
</template>

<script>
import PresonInfo from './children/PresonInfo'
import RaiseInfo from './children/RaiseInfo'
import Describe from './children/Describe'
import Return from './children/Return'

export default {
  props: ['apiURL', 'id'],
  data () {
    return {
      tip: '',
      user: {},
      // 个人认证类型（个人/公司）
      itemtype: [],
      // 商品类型
      productType: [
        {
          productForm: []
        }
      ],
      show: false,
      // 页面所处状态（个人信息/众筹信息/项目描述/回报）
      state: {
        name: 'presonInfo'
      },
      // 校验显示信息
      validateMsg: {
        unempty: '*此项不能为空',
        usename: '*请输入正确的中文名字(2~5个汉字之间)',
        IDnum: '*请填写有效的18位身份证号码',
        telnum: '*请填写正确有效的11位手机号',
        location: '*请选择地点',
        pic: '*请上传图片',
        totaltarget: '*筹资金额不低于500 , 最高1亿',
        timelimit: '*筹资时间周期须在1～31天之内',
        chuziShare: '*出资份额须在1~100之间',
        selfdomlength: '*每个标签不超过5个字符',
        selfdomnum: '*最多输入三个自定义标签',
        faMoney: '*支持金额 (只能为整数,最高为99999元)',
        lotNum: '*支持份数为整数,(0-99999)',
        title: '*请添加标题',
        faPeople: '*支持上限为小于总份额数的整数',
        freight: '*运费只能为整数,最多为99元',
        retime: '*回报时间只能为整数,最长为999天',
        integer: '*请输入大于1的整数',
        nonegative: '*请输入大于、等于0的整数',
        length: '*标题的长度不能超过13个字符',
        product: '*请选择回报的商品'
      },
      // 校验规则(具体校验内容请看validateMsg内相关的提示或分析正则)
      validators: { // `numeric` and `url` custom validator is local registration
        unempty: function (val) {
          return /\s{0,}[\S]{1,}[\s\S]{0,}/.test(val)
        },
        username: function (val) {
          return /^[\u4e00-\u9fa5]{2,5}$/.test(val)
        },
        IDnum: function (val) {
          return /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X|x)$/.test(val)
        },
        telnum: function (val) {
          return /^1[3|4|5|7|8][0-9]{9}$/.test(val)
        },
        totaltarget: function (val) {
          return /^([5-9][0-9]{2}|[1-9]\d{3,7}|100000000)$/.test(val)
        },
        timelimit: function (val) {
          return /^([12][0-9]|31|30|[1-9])$/.test(val)
        },
        chuziShare: function (val) {
          return /^([1-9]\d?|100)$/.test(val)
        },
        selfdomlength: function (val) {
          return !/\S{6,}/.test(val)
        },
        selfdomnum: function (val) {
          return !/\S+\s+\S+\s+\S+\s+\S/.test(val)
        },
        faMoney: function (val) {
          return /^[1-9]\d{0,4}$/.test(val)
        },
        faPeople: function (val) {
          return /^(?:\d{1,3})$/.test(val)
        },
        freight: function (val) {
          return /^[0-9]{1,2}$/.test(val)
        },
        retime: function (val) {
          return /^(?:\d{1,3})$/.test(val)
        },
        integer: function (val) {
          return /^[1-9]\d*$/.test(val)
        },
        nonegative: function (val) {
          return /^[1-9]\d*|0$/.test(val)
        },
        length: function (val) {
          return val.length > 0 && val.length < 14
        }
      }
    }
  },
  components: {
    PresonInfo,
    RaiseInfo,
    Describe,
    Return
  },
  methods: {
    getCustomers: function () {
      document.title = '发起众筹'
      if (this.id) {
        this.$http.get(this.apiURL + 'launch.jhtml?wxbdopenId=' + this.id).then((response) => {
          // 判断是否认证（如果没有认证跳转到认证页面）
          if (response.data.info.state) {
            this.user = response.data.info
            this.itemtype = response.data.itemtype
            this.productType = response.data.productType
            this.show = true
          } else {
            this.tip = response.data.info.msg
            setTimeout(() => {
              this.$router.push('/myinfo/check')
            }, 1000)
          }
          this.$indicator.close()
        }, () => {
          this.tip = '请求失败'
        })
      }
    },
    // 校验方法
    validate: function (reg, item) {
      item.invalid = !this.validators[reg](item.value)
    }
  },
  created() {
    this.getCustomers()
  },
  watch: {
    id: function () {
      this.getCustomers()
    },
    $route: function () {
      this.getCustomers()
    }
  },
  computed: {
    codeState: function () {
      return localStorage.getItem('state')
    },
    // 页面提交之后跳转的地址
    redirectUrl: function () {
      return location.href.split('#')[0] + '#/myraise/effective'
    }
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style lang='less'>
input[readonly]{
	color:#999;
	background-color:#ffffff;
}
.mr1{
  margin-right: 1rem;
}
.mr2 {
  margin-right: 2rem;
}
.w11{
  width: 11rem
}
.w6 {
    width: 6rem;
}
.errors{
  position:absolute;
	line-height:1.2rem;
	font-size:0.7rem;
  color:#cc0000;
  right:1rem;
	bottom:0;
}
.errorscenter{
  position:relative;
	line-height:1.5rem;
	font-size:0.7rem;
  color:#cc0000;
	text-align:center;
	bottom:-0.8rem;
}
.raise-title{
	height:2rem;
	line-height:2rem;
	font-size:0.8rem;
	padding:0 0.5rem;
	border-bottom:1px solid #cccccc;
	margin-bottom:1rem;
}
.raise-wrapper{
  background: #fff;
  padding-bottom: 2rem;
  .raise-inner{
    box-sizing: border-box;
  }
  .submit-wrapper{
    text-align: center;
    margin-top: 1.6rem;
    font-size: 0;
    .submit{
      color: #ffffff;
      height: 1.8rem;
      font-size: 0.8rem;
      line-height: 1.8rem;
      border-radius: 0.2rem;
      background: #999999;
      &.act {
        background: #cc0000;
      }
    }
  }
}

.raise-box{
  position:relative;
  font-size: 0;
  padding:0 0.5rem 1.2rem;
  .box-title{
    font-size:0.7rem;
    vertical-align:top;
    margin-right:0.3rem;
  }
  .box-input-title{
    .box-title;
    line-height:1.8rem;
  }
  .box-input{
    width:13rem;
    font-size:0.7rem;
    border:1px solid #666666;
    box-sizing: border-box;
  }
  input.box-input{
    height:1.8rem;
    text-indent:0.7rem;
  }
  textarea.box-input{
    height:3.6rem;
    line-height:1rem;
    padding:0.3rem 0.5rem;
    box-sizing:border-box;
  }
  select.box-input{
    height:1.8rem;
    text-indent:0.7rem;
    background: url("../../image/select.png") no-repeat 90% center;
    background-size: 0.6rem;
  }
}

.location{
  width: 6rem;
  height: 1.8rem;
  font-size: 0.7rem;
  line-height: 1.8rem;
  text-indent: 0.4rem;
  border: 1px solid #666666;
  background-color: #ffffff;
  background:url("../../image/select.png") no-repeat 90% center;
  background-size: 0.6rem;
}

.filePic{
  position:relative;
  display:inline-block;
  min-height:2rem;
  width:13rem;
  box-sizing:border-box;
  font-size: 0;
  .bg{
    vertical-align: top;
    height: 2rem;
    margin-right: 0.5rem;
  }
  .coverPic{
    width:100%;
  }
  span{
    display: inline-block;
    width: 10rem;
    font-size:0.6rem;
    line-height:1rem;
  }
  input[type="file"]{
    position:absolute;
    left:0;
    top:0;
    width:100%;
    height:100%;
    z-index:2;
    opacity:0;
  }
}

</style>
