<template>
  <div class="raise-wrapper">
    <dl v-show="$route.path == '/create'" class="raise-inner">
      <dt class="raise-title">创建你的项目信息</dt>
      <dd class="raise-box">
        <span class="box-input-title">设置封面：</span>
        <Upload class="filePic" :apiURL="apiURL" :id="id" @pic="localPic">
          <div v-show="!valid.cover.value">
            <img class="bg" src="../../../image/addPic.png">
            <span v-show="!valid.cover.value">建议尺寸640*480，图片大小不要超过5M</span>
          </div>
          <img class="coverPic" :src="valid.cover.value" v-show="valid.cover.value" alt="pic">
          <input type="hidden" name="coverPic" :value="valid.cover.value">
        </Upload>
        <p class="errors" v-show="valid.cover.invalid">{{validateMsg.pic}}</p>
      </dd>
      <dd class="raise-box">
        <span class="box-input-title">项目标题：</span>
        <input class="box-input" type="text" placeholder="请输入项目名称（必填）" name="cfName" v-model="valid.cfName.value" @input="validate('length',valid.cfName)" @blur="validate('length',valid.cfName)">
        <p class="errors" v-show="valid.cfName.invalid">{{validateMsg.length}}</p>
      </dd>
      <dd class="raise-box">
        <span class="box-input-title">筹款目的：</span>
        <textarea class="box-input" type="text" placeholder="请简单介绍一下项目（必填）" name="purpose" v-model="valid.purpose.value" @input="validate('unempty',valid.purpose)" @blur="validate('unempty',valid.purpose)"></textarea>
        <p class="errors" v-show="valid.purpose.invalid">{{validateMsg.unempty}}</p>
      </dd>
      <dd class="raise-box">
        <span class="box-input-title">项目地点：</span>
        <select class="location mr1" name="itemProvince" v-model="province" @change="townData()">
          <option v-for="item in positionData" :value="item.p">{{item.p}}</option>
        </select>
        <select class="location" name="itemCity" v-model="city">
          <option v-for="item in cityDate" :value="item.n">{{item.n}}</option>
        </select>
      </dd>
      <dd class="raise-box">
        <span class="box-input-title">筹资金额：</span>
        <input class="box-input" type="number" placeholder="输入你需要筹资的金额" name="totaltarget" v-model="valid.totaltarget.value" @input="validate('totaltarget',valid.totaltarget)" @blur="validate('totaltarget',valid.totaltarget)">
        <p class="errors" v-show="valid.totaltarget.invalid">{{validateMsg.totaltarget}}</p>
      </dd>
      <dd class="raise-box">
        <span class="box-input-title">筹资天数：</span>
        <input class="box-input" type="number" placeholder="输入你需要筹资的时间周期" name="timelimit" v-model="valid.timelimit.value" @input="validate('timelimit',valid.timelimit)" @blur="validate('timelimit',valid.timelimit)">
        <p class="errors" v-show="valid.timelimit.invalid">{{validateMsg.timelimit}}</p>
      </dd>
      <dd class="raise-box">
        <span class="box-input-title">设置标签：</span>
        <input class="box-input" type="text" placeholder="个性标签，标签之间用空格隔开" name="selfdom" v-model="selfdomValid.value" @input="selfdomValidate">
        <p class="errors" v-show=" selfdomValid.selfdomlength.invalid && !selfdomValid.selfdomnum.invalid">{{validateMsg.selfdomlength}}</p>
        <p class="errors" v-show="selfdomValid.selfdomnum.invalid">{{validateMsg.selfdomnum}}</p>
      </dd>
    </dl>
    <div v-show="$route.path == '/create'" class="submit-wrapper">
      <input class="submit act w6 mr2" type="button" value="上一步" @click=" state.name = 'presonInfo'">
      <input class="submit act w6" type="button" value="下一步" @click="submit">
    </div>
    <transition name="slide-fade">
      <router-view :apiURL="apiURL" :id="id" :localPic="pic" @pic="setCover" type="cover"></router-view>
    </transition>
  </div>
</template>

<script>
import Upload from '@/components/Upload'
import cityData from '@/service/city.js'

export default {
  props: {
    state: {
      type: Object
    },
    apiURL: {
      type: String
    },
    id: {
      type: String
    },
    info: {
      type: Object
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
      valid: {
        cover: {invalid: '', value: ''},
        cfName: {invalid: '', value: ''},
        purpose: {invalid: '', value: ''},
        totaltarget: {invalid: '', value: ''},
        timelimit: {invalid: '', value: ''}
      },
      selfdomValid: {
        value: '',
        selfdomlength: {'invalid': false},
        selfdomnum: {'invalid': false}
      },
      positionData: [],
      cityDate: [],
      province: '',
      city: '',
      pic: ''
    }
  },
  components: {
    Upload
  },
  methods: {
    getCustomers: function () {
      let raiseInfo = JSON.parse(localStorage.getItem('raiseInfo'))
      let timestamp = new Date().getTime()
      let province = ''
      let city = ''
      const THREE = 2 * 24 * 60 * 60 * 1000
      if (raiseInfo && timestamp - raiseInfo.timestamp < THREE) {
        this.valid = raiseInfo.valid
        this.selfdomValid = raiseInfo.selfdomValid
        province = raiseInfo.province
        city = raiseInfo.city
      } else {
        province = this.info.province
        city = this.info.city
      }
      this.positionData = cityData
      this.positionData.forEach((item) => {
        if (item.p === province) {
          this.cityDate = item.c
          this.province = province
          this.city = city
        }
      })
      this.$indicator.close()
    },
    townData: function () {
      if (this.positionData) {
        this.positionData.forEach((item) => {
          if (item.p === this.province) {
            this.cityDate = item.c
            this.city = item.c[0].n
          }
        })
      }
    },
    selfdomValidate: function () {
      this.selfdomValid.selfdomlength.invalid = !this.validators.selfdomlength(this.selfdomValid.value)
      this.selfdomValid.selfdomnum.invalid = !this.validators.selfdomnum(this.selfdomValid.value)
    },
    submit: function (e) {
      var bOff = true
      for (var attr in this.valid) {
        if (this.valid[attr].invalid === '' || this.valid[attr].invalid === true) {
          this.valid[attr].invalid = true
          bOff = false
        }
      }
      if (this.selfdomValid.selfdomlength.invalid || this.selfdomValid.selfdomnum.invalid) {
        bOff = false
      }
      if (bOff) {
        this.state.name = 'describe'
      }
    },
    localPic: function (url) {
      this.pic = url
      this.$router.push({ path: 'ImageClip' })
    },
    setCover: function (url) {
      this.valid.cover.value = url
      this.validate('unempty', this.valid.cover)
    }
  },
  watch: {
    info: {
      handler: function () {
        this.getCustomers()
      },
      deep: true
    },
    valid: {
      handler: function (val, oldVal) {
        localStorage.setItem('raiseInfo', JSON.stringify({valid: this.valid, selfdomValid: this.selfdomValid, province: this.province, city: this.city, timestamp: new Date().getTime()}))
      },
      deep: true
    },
    selfdomValid: {
      handler: function (val, oldVal) {
        localStorage.setItem('raiseInfo', JSON.stringify({valid: this.valid, selfdomValid: this.selfdomValid, province: this.province, city: this.city, timestamp: new Date().getTime()}))
      },
      deep: true
    },
    cityDate: {
      handler: function (val, oldVal) {
        localStorage.setItem('raiseInfo', JSON.stringify({valid: this.valid, selfdomValid: this.selfdomValid, province: this.province, city: this.city, timestamp: new Date().getTime()}))
      },
      deep: true
    }
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style lang='less' scoped>

</style>
