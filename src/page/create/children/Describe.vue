<template>
  <div class="raise-wrapper">
    <div class="raise-inner">
      <!--项目描述  S-->
      <dl>
        <dt class="raise-title">描述你的项目</dt>
        <dd class="media raise-box" v-show="video">
          <video width="100%" height="100%" controls="controls" :src="video" :poster="poster"></video>
        </dd>
        <dd class="raise-box">
          <span class="box-input-title">宣传视频：</span>
          <Upload class="video" :apiURL="apiURL" :id="id" @pic="(url) => {video = url}" @poster="(url) => {poster = url}" type="video">
            请选择本地要上传的路径
            <span class="video_del" v-show="video" @click="video = ''">删除</span>
            <input type="hidden" name="video" :value="video"/>
          </Upload>
        </dd>
        <dd class="raise-box">
          <span class="box-input-title">可能风险：</span>
          <textarea class="box-input" type="text" v-model="risk" placeholder="请简单的说明一下可能会出现的风险" name="risk"></textarea>
        </dd>
      </dl>
      <!--项目描述  E-->

      <!--项目详情  S-->
      <dl class="details-wrapper">
        <dt class="raise-title">编辑你的项目详情
          <span class="fr" @click="addDescription(details,newPic)">添加图片</span>
          <span class="fr" @click="addDescription(details,newText)">添加文本</span>
        </dt>
        <dd v-for="(item, index) in details">
          <!--文本结构  S-->
          <div v-if="!item.type" :class="{act:item.edit }">
            <div class="details-title clearfix">
              <p class="title-text" v-show="!item.edit ">{{item.title}}</p>
              <input class="title-text" type="text" :placeholder="titlePlaceholder" maxlength="12" v-show="item.edit " v-model="item.titleEdit">
              <div class="fr">
                <span v-show="!item.edit " @click="item.edit =1">编辑</span>
                <span v-show="item.edit " @click="saveEdit(item)">保存</span>
                <span v-show="!item.edit " @click="details.splice(index, 1)">删除</span>
              </div>
            </div>
            <p class="count-num" v-show="item.edit "><span>{{item.title.length}}</span>/12</p>
            <div class="details-con" v-show="!item.edit " v-html="item.content"></div>
            <textarea class="details-con" :placeholder="contentPlaceholder" v-show="item.edit " v-model="item.contentEdit"></textarea>
          </div>
          <!--文本结构  E-->

          <!--图片结构  S-->
          <div v-if="item.type">
            <div class="details-title clearfix">上传照片
              <span class="fr" @click="details.splice(index, 1)">删除</span>
            </div>
            <Upload class="details-pic" :apiURL="apiURL" :id="id" @pic="(url) => {picItem.picSrc = url}" @click.native="picItem = item">
              <div class="bg" v-show="!item.picSrc"></div>
              <p v-show="!item.picSrc">支持JPG、GIF、PNG格式的图片，不超过1M大小</p>
              <img v-show="item.picSrc" :src="item.picSrc" alt="pic">
            </Upload>
          </div>
          <!--图片结构  E-->
        </dd>
        <input type="hidden" name="intros" :value="describeText">
      </dl>
    </div>
    <div class="submit-wrapper">
      <input class="submit act w6 mr2" type="button" value="上一步" @click="state.name = 'raiseInfo'">
      <input class="submit act w6" type="button" value="下一步" @click="submit">
    </div>
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
    }
  },
  data () {
    return {
      picItem: {},
      video: '',
      poster: '',
      risk: '',
      titlePlaceholder: '为什么我需要你的资金支持',
      contentPlaceholder: '请在这里说明你的项目特色，以及详细的资 金用途，这会增加项目的可信度并由此提高筹资的成功率。',
      details: [
        {
          type: 0, // 添加类型（文本）
          edit: 0,
          title: '为什么我需要你的资金支持',
          titleEdit: '',
          content: '<p>请在这里说明你的项目特色，以及详细的资 金用途，这会增加项目的可信度并由此提高筹资的成功率。</p>',
          contentEdit: ''
        },
        {
          type: 1, // 添加类型（图片）
          picSrc: ''
        }
      ],
      // 添加文本
      newText: {
        type: 0, // 添加类型（文本）
        edit: 0,
        title: '为什么我需要你的资金支持',
        titleEdit: '',
        content: '<p>请在这里说明你的项目特色，以及详细的资 金用途，这会增加项目的可信度并由此提高筹资的成功率。</p>',
        contentEdit: ''
      },
      // 添加图片
      newPic: {
        type: 1, // 添加类型（图片）
        picSrc: ''
      }
    }
  },
  methods: {
    addDescription: function (parent, children, num) {
      if (num && (parent.length > num - 1)) {
        alert('最多只能上传' + num + '条')
      } else {
        parent.push(JSON.parse(JSON.stringify(children)))
        setTimeout(() => {
          window.scrollTo(0, document.body.scrollHeight)
        }, 10)
      }
    },
    saveEdit: function (item) {
      var arr = item.contentEdit.split('\n')
      var str = ''
      if (item.contentEdit.replace(/(^\s*)|(\s*$)/g, '')) {
        for (var i = 0; i < arr.length; i++) {
          str += '<p>' + arr[i] + '</p>'
        }
        item.content = str
      } else {
        item.content = '<p>' + this.contentPlaceholder + '</p>'
      }
      if (item.titleEdit.replace(/(^\s*)|(\s*$)/g, '')) {
        item.title = item.titleEdit
      } else {
        item.title = this.titlePlaceholder
      }
      item.edit = 0
    },
    submit: function (e) {
      var bOff = true
      var details = this.details
      for (var i = 0; i < details.length; i++) {
        if (details[i].edit) {
          bOff = false
        }
      }
      if (!bOff) {
        alert('您还有未保存的编辑项')
      } else if (!this.describeEmpty) {
        alert('请添加项目描述')
      } else {
        this.state.name = 'return'
      }
    }
  },
  computed: {
    describeText: function () {
      let outer = {}
      this.details.forEach((item, index) => {
        outer[index] = item
      })
      return JSON.stringify(outer)
    },
    describeEmpty: function () {
      return this.details.some((item, index) => {
        return (item.titleEdit && item.titleEdit.replace(/\s*/g, '')) || (item.contentEdit && item.contentEdit.replace(/\s*/g, '')) || (item.picSrc && item.picSrc.replace(/\s*/g, ''))
      })
    }
  },
  created () {
    let describe = JSON.parse(localStorage.getItem('describe'))
    let timestamp = new Date().getTime()
    const THREE = 2 * 24 * 60 * 60 * 1000
    if (describe && timestamp - describe.timestamp < THREE) {
      this.risk = describe.risk
      this.video = describe.video
      this.details = describe.details
    }
  },
  components: {
    Upload
  },
  watch: {
    risk: {
      handler: function (val, oldVal) {
        localStorage.setItem('describe', JSON.stringify({risk: this.risk, video: this.video, details: this.details, timestamp: new Date().getTime()}))
      },
      deep: true
    },
    video: {
      handler: function (val, oldVal) {
        localStorage.setItem('describe', JSON.stringify({risk: this.risk, video: this.video, details: this.details, timestamp: new Date().getTime()}))
      },
      deep: true
    },
    details: {
      handler: function (val, oldVal) {
        localStorage.setItem('describe', JSON.stringify({risk: this.risk, video: this.video, details: this.details, timestamp: new Date().getTime()}))
      },
      deep: true
    }
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style lang='less' scoped>
.media{
	width:16rem;
  height: 6rem;
	padding:0;
	margin:0 auto 1rem;
}
.video{
  display: inline-block;
	line-height:1.8rem;
	border:1px solid #666666;
	text-indent:0.7rem;
	color:#999999;
	width:13rem;
	background:#ffffff;
	border-radius:0.1rem;
  .video_del{
    font-size:0.7rem;
    color:#cc0000;
    margin-right:0.5rem;
    line-height:1.8rem;
    float:right;
    position:relative;
    z-index:999;
  }
  input{
    width:100%;
    height:100%;
    opacity:0;
    position:absolute;
    left:0;
    top:0;
  }
}
.raise-title span{
	font-size:0.7rem;
	padding:0 0.3rem 0 1rem;
	background:url("../../../../static/image/add.png") no-repeat 0 center;
  background-size: 0.8rem;
	line-height:2rem;
}
.details-wrapper{
  dd{
  	border:1px solid #cccccc;
  	width:86%;
  	margin:0 auto 1.5rem;
  	box-sizing:border-box;
  }
  .details-title{
    position:relative;
    height:1.8rem;
    line-height:1.8rem;
    font-size:0.7rem;
    padding-left: 0.5rem;
    box-sizing: border-box;
    overflow:hidden;
    span{
      display: inline-block;
      font-size:0.7rem;
      color:#cc0000;
      margin-right:0.5rem;
    }
    .title-text{
      display: inline-block;
      font-size:0.7rem;
      color:#666666;
      width:10rem;
      height:1.8rem;
      box-sizing:border-box;
    }
  }
  .count-num{
    padding:0.2rem 0.5rem;
    text-align:right;
    color:#999999;
    font-size:0.7rem;
  }
  .details-con{
    width:100%;
    line-height:1rem;
    font-size:0.7rem;
    color:#999999;
    padding:0.3rem 0.5rem;
    margin-top:-0.5rem;
    box-sizing:border-box;
    word-break:break-all;
    overflow:auto;
  }
  .act{
    padding:0.3rem;
    .details-title{
      background:#ffffff;
      border:1px solid #666666;
    }
    .details-con{
      height:4.5rem;
      display:block;
      border:1px solid #666666;
      margin-top:0;
      font-size:0.7rem;
    }
  }
  .details-pic{
	position:relative;
	width:100%;
  .bg{
    width:100%;
    height:2.5rem;
    background:url("../../../../static/image/addPic.png") no-repeat center 0.5rem;
    background-size:2.5rem;
  }
  p{
    font-size:0.6rem;
    text-align:center;
    line-height:1.5rem;
  }
  img{
    width:100%;
    display:block;
  }
  input[type="file"]{
    position:absolute;
    left:0;
    top:0;
    width:100%;
    height:100%;
    z-index:999;
    opacity:0;
  }
}
}
</style>
