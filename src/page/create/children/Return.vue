<template>
  <div class="raise-wrapper">
    <div v-show="$route.path == '/create'">
      <div class="raise-inner">
        <div class="retuen" v-for="(item,indexParent) in returnInfo">
          <!-- 标题 -->
          <div class="raise-title" v-if="!indexParent">设置你的回报信息</div>
          <div class="return-title" v-if="indexParent">回报{{1+indexParent}}
            <a class="delete" @click="returnInfo.splice(indexParent, 1)"></a>
          </div>
          <!-- 回报信息 -->
          <div class="raise-box">
            <span class="box-title">回报类型：</span>
            <div class="radio-wrapper">
              <label>
                <input type="radio" :name="'returnType'+indexParent" value="product" v-model="item.returnType">
                <span class="outCircle"><span class="innerCircle"></span></span>
                <span class="text">商品回报 </span>
              </label>
              <label v-show="!lotteryIndex || lotteryIndex == indexParent + 1">
                <input type="radio" :name="'returnType'+indexParent" value="lottery" v-model="item.returnType">
                <span class="outCircle"><span class="innerCircle"></span></span>
                <span class="text">抽奖回报</span>
              </label>
            </div>
          </div>
          <div class="raise-box">
            <span class="box-input-title">支持金额：</span>
            <input class="box-input" type="number" placeholder="输入需要用户支持的金额" :name="'supportAmount'+indexParent" v-model="item.public.supportAmount.value" @input="validate('faMoney',item.public.supportAmount)" @blur="validate('faMoney',item.public.supportAmount)">
            <p class="errors" v-if="item.public.supportAmount.invalid">{{validateMsg.faMoney}}</p>
          </div>
          <div class="raise-box">
            <span class="box-input-title">总份额数：</span>
            <input class="box-input" type="number" placeholder="每个人最多支持份数（“0”为不限制）" :name="'lotNum'+indexParent" v-model="item.public.lotNum.value" @input="validate('nonegative',item.public.lotNum)" @blur="validate('nonegative',item.public.lotNum)">
            <p class="errors" v-if="item.public.lotNum.invalid">{{validateMsg.nonegative}}</p>
          </div>
          <div class="raise-box">
            <span class="box-input-title">支持标题：</span>
            <input class="box-input" type="text" placeholder="给你的项目回报设置一个标题" :name="'supportTitle'+indexParent" v-model="item.public.supportTitle.value" @input="validate('unempty',item.public.supportTitle)" @blur="validate('unempty',item.public.supportTitle)">
            <p class="errors" v-if="item.public.supportTitle.invalid">{{validateMsg.unempty}}</p>
          </div>
          <div class="raise-box">
            <span class="box-input-title">支持解释：</span>
            <textarea class="box-input" type="text" placeholder="请简单的说明一下内容" :name="'supportExplain'+indexParent" v-model="item.public.supportExplain.value" @input="validate('unempty',item.public.supportExplain)" @blur="validate('unempty',item.public.supportExplain)"></textarea>
            <p class="errors" v-if="item.public.supportExplain.invalid">{{validateMsg.unempty}}</p>
          </div>
          <div class="raise-box" v-if="item.returnType=='lottery'">
            <span class="box-input-title">抽奖概率：</span>
            <input class="box-input" type="number" placeholder="每多少人抽中1人" :name="'lotteryUnit'+indexParent" v-model="item.lottery.lotteryUnit.value" @input="validate('integer',item.lottery.lotteryUnit)" @blur="validate('integer',item.lottery.lotteryUnit)">
            <p class="errors" v-if="item.lottery.lotteryUnit.invalid">{{validateMsg.integer}}</p>
          </div>
          <div class="raise-box">
            <span class="box-input-title">支持上限：</span>
            <input class="box-input" type="number" placeholder="“0”为不限名额" :name="'lotLimit'+indexParent" v-model="item.public.lotLimit.value" @input="validate('faPeople',item.public.lotLimit)" @blur="validate('faPeople',item.public.lotLimit)">
            <p class="errors" v-if="item.public.lotLimit.invalid">{{validateMsg.faPeople}}</p>
          </div>
          <div class="raise-box">
            <span class="box-input-title">赠送积分：</span>
            <input class="box-input" type="number" placeholder="“0”为不赠送积分" :name="'presentExp'+indexParent" v-model="item.public.presentExp.value" @input="validate('faPeople',item.public.presentExp)" @blur="validate('faPeople',item.public.presentExp)">
            <p class="errors" v-if="item.public.presentExp.invalid">{{validateMsg.faPeople}}</p>
          </div>
          <div class="raise-box" v-if="item.returnType=='product'">
            <span class="box-input-title">运 &nbsp&nbsp&nbsp&nbsp&nbsp 费：</span>
            <input class="box-input" type="number" placeholder="“0”为包邮，默认单位元" :name="'freight'+indexParent" v-model="item.product.freight.value" @input="validate('freight',item.product.freight)" @blur="validate('freight',item.product.freight)">
            <p class="errors" v-if="item.product.freight.invalid">{{validateMsg.freight}}</p>
          </div>
          <div class="raise-box" v-if="item.returnType=='product'">
            <span class="box-title">发 &nbsp&nbsp&nbsp&nbsp&nbsp 票：</span>
            <div class="radio-wrapper">
              <label>
                <input type="radio" checked="checked" :name="'invoice'+indexParent" value="不开发票">
                <span class="outCircle"><span class="innerCircle"></span></span>
                <span class="text">不开发票</span>
              </label>
              <label>
                <input type="radio" :name="'invoice'+indexParent" value="普通发票">
                <span class="outCircle"><span class="innerCircle"></span></span>
                <span class="text">普通发票</span>
              </label>
              <label>
                <input type="radio" :name="'invoice'+indexParent" value="增值税发票">
                <span class="outCircle"><span class="innerCircle"></span></span>
                <span class="text">增值税发票</span>
              </label>
            </div>
          </div>
          <div class="raise-box">
            <span class="box-input-title">回报时间：</span>
            <input class="box-input" type="number" placeholder="“0”为项目结束后立即发送" :name="'returnTime'+indexParent" v-model="item.public.returnTime.value" @input="validate('retime',item.public.returnTime)" @blur="validate('retime',item.public.returnTime)">
            <p class="errors" v-if="item.public.returnTime.invalid">{{validateMsg.retime}}</p>
          </div>
          <div class="raise-box">
            <span class="box-title">商品来源：</span>
            <div class="radio-wrapper">
              <label>
                <input type="radio" :name="'productOrigin'+indexParent" value="online" v-model="item.productOrigin">
                <span class="outCircle"><span class="innerCircle"></span></span>
                <span class="text">在线选择 </span>
              </label>
              <label>
                <input type="radio" :name="'productOrigin'+indexParent" value="upload" v-model="item.productOrigin">
                <span class="outCircle"><span class="innerCircle"></span></span>
                <span class="text">自行上传 </span>
              </label>
            </div>
          </div>
          <div class="raise-box" v-if="item.productOrigin=='online'">
            <span class="box-input-title">回报商品：</span>
            <ul class="raise-product">
              <li class="raise-item" @click="choose(item,'returnProductA')">
                <span class="del-product" v-show="item.online.returnProductA.value" @click.stop="clear(item,'returnProductA')"></span>
                <img v-if="item.online.returnProductA.value" :src="item.online.returnProductA.value" alt="pic">
                <div v-else class="add-bg">
                  <p class="icon">+</p>
                  <p class="text">添加商品</p>
                </div>
                <span  v-if="item.online.returnProductA.num" class="num">x{{item.online.returnProductA.num}}</span>
                <input type="hidden" :name="'returnProductA'+indexParent" :value="item.online.returnProductA.id">
                <input type="hidden" :name="'returnProductAnum'+indexParent" :value="item.online.returnProductA.num">
              </li>
              <li class="raise-item" @click="choose(item,'returnProductB')">
                <span class="del-product" v-show="item.online.returnProductB.value" @click.stop="clear(item,'returnProductB')"></span>
                <img v-if="item.online.returnProductB.value" :src="item.online.returnProductB.value" alt="pic">
                <div v-else class="add-bg">
                  <p class="icon">+</p>
                  <p class="text">添加商品</p>
                </div>
                <span  v-if="item.online.returnProductB.num" class="num">x{{item.online.returnProductB.num}}</span>
                <input type="hidden" :name="'returnProductB'+indexParent" :value="item.online.returnProductB.id">
                <input type="hidden" :name="'returnProductBnum'+indexParent" :value="item.online.returnProductB.num">
              </li>
              <li class="raise-item" @click="choose(item,'returnProductC')">
                <span class="del-product" v-show="item.online.returnProductC.value" @click.stop="clear(item,'returnProductC')"></span>
                <img v-if="item.online.returnProductC.value" :src="item.online.returnProductC.value" alt="pic">
                <div v-else class="add-bg">
                  <p class="icon">+</p>
                  <p class="text">添加商品</p>
                </div>
                <span  v-if="item.online.returnProductC.num" class="num">x{{item.online.returnProductC.num}}</span>
                <input type="hidden" :name="'returnProductC'+indexParent" :value="item.online.returnProductC.id">
                <input type="hidden" :name="'returnProductCnum'+indexParent" :value="item.online.returnProductC.num">
              </li>
            </ul>
            <p class="errors" v-if="item.online.unempty">{{validateMsg.product}}</p>
          </div>
          <div v-if="item.productOrigin=='upload'">
            <div class="raise-box">
              <span class="box-input-title">商品分类：</span>
              <select class="box-input" :name="'productType'+indexParent" @change="shapeData($event.target.value, item)" >
                <option v-if="index !== 0" v-for="(item, index) in productTypeList" :key="item.classify" :value="item.classify">{{item.classify}}</option>
              </select>
            </div>
            <div class="raise-box" v-if="item.productFormOptions.length > 1">
              <span class="box-input-title">商品形态：</span>
              <select class="box-input" :name="'productForm'+indexParent">
                <option v-if="index !== 0" v-for="(item, index) in item.productFormOptions" :key="item" :value="item">{{item}}</option>
              </select>
            </div>
            <div class="raise-box">
              <span class="box-input-title">商品名称：</span>
              <input class="box-input" type="text" placeholder="请输入商品名称" :name="'productTitle'+indexParent" v-model="item.upload.productTitle.value" @input="validate('unempty',item.upload.productTitle)" @blur="validate('unempty',item.upload.productTitle)">
              <p class="errors" v-if="item.upload.productTitle.invalid">{{validateMsg.unempty}}</p>
            </div>
            <div class="raise-box">
              <span class="box-input-title">商品作者：</span>
              <input class="box-input" type="text" placeholder="请输入商品作者" :name="'productAuthor'+indexParent" v-model="item.upload.productAuthor.value" @input="validate('unempty',item.upload.productAuthor)" @blur="validate('unempty',item.upload.productAuthor)">
              <p class="errors" v-if="item.upload.productAuthor.invalid">{{validateMsg.unempty}}</p>
            </div>
            <div class="raise-box">
              <span class="box-input-title">商品编号：</span>
              <input class="box-input" type="number" placeholder="请输入商品编号" :name="'productCode'+indexParent" v-model="item.upload.productCode.value" @input="validate('unempty',item.upload.productCode)" @blur="validate('unempty',item.upload.productCode)">
              <p class="errors" v-if="item.upload.productCode.invalid">{{validateMsg.unempty}}</p>
            </div>
            <div class="raise-box">
              <span class="box-input-title">商品价格：</span>
              <input class="box-input" type="number" placeholder="请输入商品价格" :name="'productPirce'+indexParent" v-model="item.upload.productPirce.value" @input="validate('unempty',item.upload.productPirce)" @blur="validate('unempty',item.upload.productPirce)">
              <p class="errors" v-if="item.upload.productPirce.invalid">{{validateMsg.unempty}}</p>
            </div>
            <div class="raise-box">
              <span class="box-input-title">商品数量：</span>
              <input class="box-input" type="number" placeholder="一共有多少件商品" :name="'productNum'+indexParent" v-model="item.upload.productNum.value" @input="validate('integer',item.upload.productNum)" @blur="validate('integer',item.upload.productNum)">
              <p class="errors" v-if="item.upload.productNum.invalid">{{validateMsg.integer}}</p>
            </div>
            <div class="raise-box">
              <span class="box-input-title">商品介绍：</span>
              <textarea class="box-input" type="text" placeholder="请简单的介绍一下商品" :name="'productIntro'+indexParent" v-model="item.upload.productIntro.value" @input="validate('unempty',item.upload.productIntro)" @blur="validate('unempty',item.upload.productIntro)"></textarea>
              <p class="errors" v-if="item.upload.productIntro.invalid">{{validateMsg.unempty}}</p>
            </div>
            <div class="img-wrapper">
              <img v-for="(list,index) in item.picSrc" @click="item.picSrc.splice(index, 1)" :src="list" v-if="list" alt="pic">
              <input v-for="(list,index) in item.picSrc" type="hidden" :name="indexParent+'favorerPic'+index" :value="list">
            </div>
            <div class="raise-box" v-show="item.picSrc.length<3">
              <span class="box-input-title">上传图片：</span>
              <Upload class="filePic" :apiURL="apiURL" :id="id" :num="3" @pic="(url) => {picItem.picSrc.push(url)}" @click.native="picItem = item">
                <img class="bg" src="../../../../static/image/addPic.png">
                <span>支持jpg、jpeg、png、gif格式，大小不超过500KB</span>
              </Upload>
            </div>
          </div>
        </div>
        <div class="contine" @click="addDescription(returnInfo,newReturn,10)">+继续添加新的回报</div>
      </div>
      <div class="submit-wrapper">
        <input class="submit act w6 mr2" type="button" value="上一步" @click="state.name = 'describe'">
        <input class="submit act w6" type="button" value="提交审核" @click="submit">
      </div>
      <input type="hidden" name="count" :value="returnInfo.length">
    </div>
    <router-view :apiURL="apiURL" :id="id" :productType="productTypeList" @product="productReceive" :onlineIndex="onlineIndex"></router-view>
  </div>
</template>

<script>
import Upload from '@/components/Upload'
export default {
  props: {
    apiURL: {
      type: String
    },
    id: {
      type: String
    },
    state: {
      type: Object
    },
    productTypeList: {
      type: Array
    },
    validateMsg: {
      type: Object
    },
    validators: {
      type: Object
    },
    validate: {
      type: Function
    }
  },
  data () {
    return {
      productChoosed: {},
      onlineIndex: '',
      picItem: '',
      returnInfo: [
        {
          returnType: 'product',  // 抽奖回报：lottery，商品回报：product
          productOrigin: 'online',  // 在线选择：online；自行上传：upload
          productType: '',
          productFormOptions: ['全部'],
          picSrc: [],
          online: {
            returnProductA: {
              value: '',
              num: '',
              id: ''
            },
            returnProductB: {
              value: '',
              num: '',
              id: ''
            },
            returnProductC: {
              value: '',
              num: '',
              id: ''
            },
            unempty: false
          },
          upload: {
            productTitle: {invalid: '', value: ''},
            productAuthor: {invalid: '', value: ''},
            productCode: {invalid: '', value: ''},
            productPirce: {invalid: '', value: ''},
            productNum: {invalid: '', value: ''},
            productIntro: {invalid: '', value: ''}
          },
          public: {
            supportAmount: {invalid: '', value: ''},
            lotNum: {invalid: '', value: ''},
            supportTitle: {invalid: '', value: ''},
            supportExplain: {invalid: '', value: ''},
            lotLimit: {invalid: '', value: ''},
            presentExp: {invalid: '', value: ''},
            returnTime: {invalid: '', value: ''}
          },
          lottery: {
            lotteryUnit: {invalid: '', value: ''}
          },
          product: {
            freight: {invalid: '', value: ''}
          }
        }
      ],
      newReturn: {
        returnType: 'product',  // 抽奖回报：lottery，商品回报：product
        productOrigin: 'online',  // 在线选择：online；自行上传：upload
        productType: '',
        productFormOptions: [],
        picSrc: [],
        online: {
          returnProductA: {
            value: '',
            num: '',
            id: ''
          },
          returnProductB: {
            value: '',
            num: '',
            id: ''
          },
          returnProductC: {
            value: '',
            num: '',
            id: ''
          },
          unempty: false
        },
        upload: {
          productTitle: {invalid: '', value: ''},
          productAuthor: {invalid: '', value: ''},
          productCode: {invalid: '', value: ''},
          productPirce: {invalid: '', value: ''},
          productNum: {invalid: '', value: ''},
          productIntro: {invalid: '', value: ''}
        },
        public: {
          supportAmount: {invalid: '', value: ''},
          lotNum: {invalid: '', value: ''},
          supportTitle: {invalid: '', value: ''},
          supportExplain: {invalid: '', value: ''},
          lotLimit: {invalid: '', value: ''},
          presentExp: {invalid: '', value: ''},
          returnTime: {invalid: '', value: ''}
        },
        lottery: {
          lotteryUnit: {invalid: '', value: ''}
        },
        product: {
          freight: {invalid: '', value: ''}
        }
      }
    }
  },
  methods: {
    choose: function (item, value) {
      this.productChoosed = item
      this.onlineIndex = value
      this.$router.push('/create/search')
    },
    clear: function (item, value) {
      item.online[value].value = ''
      item.online[value].num = ''
      item.online[value].id = ''
      let unempty = Boolean(item.online.returnProductA.value || item.online.returnProductB.value || item.online.returnProductC.value)
      item.online.unempty = !unempty
    },
    productReceive: function (item) {
      this.productChoosed.online[this.onlineIndex].value = item.href
      this.productChoosed.online[this.onlineIndex].num = item.num
      this.productChoosed.online[this.onlineIndex].id = item.id
      this.productChoosed.online.unempty = false
    },
    shapeData: function (value, item) {
      for (var i = 0; i < this.productTypeList.length; i++) {
        if (this.productTypeList[i].classify === value) {
          item.productFormOptions = this.productTypeList[i].productForm
        }
      }
    },
    addDescription: function (parent, children, num) {
      if (num && (parent.length > num - 1)) {
        alert('最多只能上传' + num + '条')
      } else {
        parent.push(JSON.parse(JSON.stringify(children)))
      }
    },
    submit: function () {
      var returnInfo = this.returnInfo
      let bOff1, bOff2, bOff3
      for (var i = 0; i < returnInfo.length; i++) {
        bOff1 = _check(returnInfo[i].public)
        if (returnInfo[i].returnType === 'lottery') {
          bOff2 = _check(returnInfo[i].lottery)
        } else if (returnInfo[i].returnType === 'product') {
          bOff2 = _check(returnInfo[i].product)
        }
        if (returnInfo[i].productOrigin === 'online') {
          bOff3 = Boolean(returnInfo[i].online.returnProductA.value || returnInfo[i].online.returnProductB.value || returnInfo[i].online.returnProductC.value)
          returnInfo[i].online.unempty = !bOff3
        } else if (returnInfo[i].productOrigin === 'upload') {
          bOff3 = _check(returnInfo[i].upload)
        }
      }
      if (bOff1 && bOff2 && bOff3) {
        localStorage.removeItem('typeIndex')
        localStorage.removeItem('raiseInfo')
        localStorage.removeItem('describe')
        localStorage.removeItem('return')
        document.getElementById('create').submit()
      }
    }
  },
  components: {
    Upload
  },
  watch: {
    productTypeList: function () {
      this.returnInfo[0].productFormOptions = this.newReturn.productFormOptions = this.productTypeList[1].productForm
    },
    returnInfo: {
      handler: function (val, oldVal) {
        localStorage.setItem('return', JSON.stringify({returnInfo: this.returnInfo, timestamp: new Date().getTime()}))
      },
      deep: true
    }
  },
  created () {
    let returnInfo = JSON.parse(localStorage.getItem('return'))
    let timestamp = new Date().getTime()
    const THREE = 2 * 24 * 60 * 60 * 1000
    if (returnInfo && timestamp - returnInfo.timestamp < THREE) {
      this.returnInfo = returnInfo.returnInfo
    }
  },
  computed: {
    lotteryIndex: function () {
      let num
      this.returnInfo.forEach((item, index) => {
        if (item.returnType === 'lottery') {
          num = index + 1
        }
      })
      return num
    }
  }
}
var _check = function (obj) {
  var bOff = true
  for (var attr in obj) {
    if (obj[attr].invalid === '' || obj[attr].invalid === true) {
      obj[attr].invalid = true
      bOff = false
    }
  }
  return bOff
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style lang='less' scoped>
.return-title{
	margin-bottom: 1rem;
  border-bottom:1px solid #cccccc;
  line-height:2rem;
  font-size:0.8rem;
  padding:0 0.5rem;
  color:#cc0000;
  .delete{
    float:right;
    width:2rem;
    height:2rem;
    background:url("../../../../static/image/delete.png") no-repeat center center;
    background-size: 1rem;
  }
}
.ReturnType span,.invoice span{
  line-height:0.8rem;
}
.contine{
  color:#cc0000;
  text-align:center;
  font-size:0.9rem;
}
.radio-wrapper{
  width: 13rem;
}
.raise-product{
  width: 13rem;
  display: inline-block;
  padding-top: 0.4rem;
  .raise-item{
    position: relative;
    display: inline-block;
    width: 3rem;
    height: 3rem;
    background: #e6e6e6;
    margin: 0 1rem 0.4rem 0;
    color: #999;
    vertical-align: top;
    text-align: center;
    .del-product{
      width: 1rem;
      height: 1rem;
      position: absolute;
      left: -0.5rem;
      top: -0.5rem;
      background: url('../../../../static/image/delProduct.png') no-repeat;
      background-size: cover;
    }
    .add-bg{
      .icon{
        font-size: 2rem;
        padding-bottom: 0.2rem;
      }
      .text{
        font-size: 0.54rem
      }
    }
    img{
      width: 100%;
      height: 100%;
    }
    .num{
      position: absolute;
      left: 0;
      right: 0;
      bottom: -1.2rem;
      line-height: 1.2rem;
      text-align: center;
      font-size: 0.6rem;
      color: #cc0000;
    }
  }
}
.img-wrapper{
  padding-left: 0.45rem;
  img{
  	width:5.4rem;
  	margin-right:0.45rem;
  	margin-bottom:1.5rem;
    	vertical-align: middle;
  }
}
</style>
