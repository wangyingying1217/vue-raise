<template>
  <div class="raise-wrapper">
    <div class="raise-inner">
      <div class="raise-title">请核对你的身份信息</div>

      <dl v-if="info.cardType=='person'">
        <dd class="raise-box">
          <span class="box-input-title">中文姓名：</span>
          <input type="text" class="box-input" :value="info.name" readonly>
        </dd>
        <dd class="raise-box">
          <span class="box-input-title">身份证号：</span>
          <input type="text" class="box-input" :value="info.cardNo" readonly>
        </dd>
        <dd class="raise-box">
          <span class="box-input-title">联系方式：</span>
          <input type="text" class="box-input" :value="info.phone" readonly>
        </dd>
      </dl>

      <dl v-if="info.cardType=='company'">
        <dd class="raise-box">
          <span class="box-input-title">企业名称：</span>
          <input type="text" class="box-input" :value="info.tradeName" readonly>
        </dd>
        <dd class="raise-box">
          <span class="box-input-title">营业执照：</span>
          <input type="text" class="box-input" :value="info.license" readonly>
        </dd>
        <dd class="raise-box">
          <span class="box-input-title">法人姓名：</span>
          <input type="text" class="box-input" :value="info.lawPerson" readonly>
        </dd>
        <dd class="raise-box">
          <span class="box-input-title">公司地址：</span>
          <input type="text" class="box-input" :value="info.inRegister" readonly>
        </dd>
        <dd class="raise-box">
          <span class="box-input-title">联系方式：</span>
          <input type="text" class="box-input" :value="info.phone" readonly>
        </dd>
      </dl>

      <!--项目类型  S-->
      <p class="raise-title">选择你要创建的项目类型</p>
      <ol class="type clearfix">
        <li v-for="(val, index) in type" @click="typeVal=val" :class="{'act':typeVal == val }">{{val}}</li>
      </ol>
      <input type="hidden" name="standing" :value="typeVal">
      <!--项目类型  E-->
    </div>
    <div class="submit-wrapper">
      <input class="submit act w11" type="button" value="下一步" @click="state.name = 'raiseInfo'"/>
    </div>
  </div>
</template>

<script>

export default {
  props: ['info', 'type', 'state', 'presonInfo'],
  data () {
    return {
      typeVal: ''
    }
  },
  created() {
    this.typeVal = this.presonInfo.itemType
  },
  watch: {
    presonInfo: function () {
      this.typeVal = this.presonInfo.itemType
    }
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style lang='less' scoped>
.type{
	padding-left:1.2rem;
  font-size: 0;
  li{
    display: inline-block;
    width:4.7rem;
    height: 1.5rem;
    font-size:0.7rem;
    line-height:1.5rem;
    text-align:center;
    margin: 0 0.8rem 1rem 0;
    border:3px solid #cccccc;
    box-sizing:border-box;
    &.act{
      border-color: #cc0000;
      background:url("../../../image/right_top.png") no-repeat right top;
      background-size: 0.8rem;
    }
  }
}
</style>
