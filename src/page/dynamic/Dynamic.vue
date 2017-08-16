<template>
  <div>
    <form class="edit" :action="apiURL+'member/updateDynamic.jhtml'" method="post" ref="dynamic">
      <textarea class="text" maxlength="200" name="context" v-model="textarea"></textarea>
      <p class="count">{{textarea.length}}/200</p>
      <div class="img-box">
        <div class="img" v-for="(item, index) in imgArr" :key="index" @click="imgArr.splice(index,1)" :style="{'background': 'url('+item+') no-repeat 0 0/cover'}">
          <input type="hidden" :name="'evPic'+index" :value="imgArr[index]">
        </div>
        <Upload :apiURL="apiURL" :id="id" @pic="(url) => {imgArr.push(url)}" v-show="imgArr.length < 4" class="img-add">照片</Upload>
      </div>
      <div class="submit-btn">
        <a :class="{'act': textarea || imgArr}" @click="confirm">发表</a>
      </div>
      <input type="hidden" :value="contentId" name="contentId">
      <input type="hidden" :value="id" name="wxbdopenId">
      <input type="hidden" :value="codeState" name="state">
      <input type="hidden" :value="redirectUrl" name="redirect">
    </form>
    <Tip :info.sync="tip"></Tip>
  </div>
</template>

<script>
import Upload from '@/components/Upload'

export default {
  props: ['apiURL', 'id'],
  data () {
    return {
      tip: '',
      textarea: '',
      imgArr: []
    }
  },
  methods: {
    getCustomers: function () {
      document.title = '发表动态'
      this.$indicator.close()
    },
    // 发表动态
    confirm: function () {
      if (this.textarea || this.imgArr) {
        this.$refs.dynamic.submit()
      } else {
        this.tip = '没有可以发表的内容'
      }
    }
  },
  created () {
    // 组件创建完后获取数据，
    this.getCustomers()
  },
  watch: {
   // 如果路由有变化，会再次执行该方法
    $route () {
      this.getCustomers()
    },
    id: function () {
      this.getCustomers()
    }
  },
  components: {
    Upload
  },
  computed: {
    contentId: function () {
      return this.$route.params.contentId
    },
    codeState: function () {
      return localStorage.getItem('state')
    },
    redirectUrl: function () {
      return location.href.split('#')[0] + '#/myraise/effective'
    }
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style lang='less' scoped>
.edit{
  padding: 0.5rem;
  background: #fff;
  font-size: 0;
  margin-bottom: 3.2rem;
  .text{
    font-size: 0.7rem;
    height:7rem;
    width: 100%;
    overflow: auto;
  }
  .count{
    line-height: 1.6rem;
    font-size: 0.6rem;
    text-align: right;
    color: #999;
  }
  .img{
    display: inline-block;
    width: 4rem;
    height: 4rem;
    margin-right: 0.3rem;
    margin-bottom: 0.3rem;
    vertical-align: top;
    &:nth-of-type(4n){
      margin-right:0;
    }
  }
  .img-add{
    .img;
    font-size: 0.7rem;
    text-align: center;
    background: url("../../image/camera.png") no-repeat center 0.8rem;
    background-size: 1.6rem;
    margin-right: 0;
    color: #cdcdcd;
    background-color: #f5f5f5;
    line-height: 5.6rem;
  }
  .img-add{}
}
</style>
