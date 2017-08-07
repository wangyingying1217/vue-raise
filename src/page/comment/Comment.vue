<template>
<div v-if="show">
  <ul class="comment" v-if="info.length" @click="commentReset">
    <li class="clearfix" v-for="(item,index) in info">
      <img class="headerPic" :src="item.headPic" alt="pic"/>
      <div class="infobox">
        <p class="title">{{item.commentName}}
          <span class="del" @click.stop="delComment(item,index)" v-if="( userName == item.commentName )"></span>
        </p>
        <p class="info" v-html="item.comment"></p>
        <div class="Interaction">
          <span class="time">{{decodeURI(item.time)}}</span>
          <span class="commentBtn" @click.stop="comment(item,index)">评论</span>
          <span class="zan" :class="{'act':item.zan}" @click="zan(item)">赞({{item.zanNum | zanNum}})</span>
        </div>
        <ul class="commentList">
          <li class="clearfix" v-for="(list,indexDiscuss) in item.discuss" @click.stop="repaly(item,index,list,indexDiscuss)">
            <span class="clBlue">{{decodeURI(list.proactive)}}</span>
            <span v-if="list.passive">回复</span>
            <span class="clBlue" v-if="list.passive">{{list.passive}}</span>：
            <span class="ml2" v-html="list.content"></span>
            <span class="clRed fr" v-if="list.proactive !=userName">回复</span>
            <span class="clRed fr" v-if="list.proactive == userName">删除</span>
          </li>
        </ul>
      </div>
    </li>
  </ul>
  <div class="commentText">
    <input class="text" ref="text" type="text" :placeholder="commentInfo[commentType].placeholder" v-model="commentText">
    <input class="sure" type="button" :value="commentInfo[commentType].buttonText" @click="submit">
  </div>
  <Confirm :info="confirmInfo" @confirm="confirm" v-show="confirmState"></Confirm>
  <Nodata :showSwitch="info.length" :type="'comment'"></Nodata>
  <Tip :info.sync="tip"></Tip>
</div>
</template>

<script>
import Nodata from '@/components/Nodata'
import Confirm from '@/components/Confirm'

const PUBLISH_STATE = 0
const COMMEENT_STATE = 1
const REPLAY_STATE = 2

export default {
  props: ['apiURL', 'id'],
  data () {
    return {
      info: [],
      show: false,
      contentId: '',
      userName: '',
      confirmInfo: {
        title: '提示',
        name: '您确定要删除此条回复？'
      },
      confirmState: false,
      commentType: PUBLISH_STATE,
      commentText: '',
      commentItem: {},
      commentIndex: '',
      discussItem: {},
      discussIndex: '',
      tip: ''
    }
  },
  methods: {
    getCustomers: function () {
      document.title = '评论'
      this.contentId = this.$route.params.contentId
      if (this.contentId && this.id) {
        this.$http.get(this.apiURL + 'comment.jhtml?contentId=' + this.contentId + '&wxbdopenId=' + this.id).then((response) => {
          this.info = response.data.commentList
          this.userName = response.data.userName
          this.show = true
          this.$indicator.close()
        }, () => {
          this.$indicator.close()
          this.tip = '请求失败'
        })
      }
    },
    zan: function (item) {
      this.$http.get(this.apiURL + 'likes.jhtml?contentId=' + this.contentId + '&wxbdopenId=' + this.id + '&commentId=' + item.commentId + '&zan=' + !item.zan).then((response) => {
        item.zan = !item.zan
        if (item.zan) {
          item.zanNum++
        } else {
          item.zanNum--
        }
      }, () => {
        this.tip = '请求失败'
      })
    },
    commentReset: function () {
      this.commentType = PUBLISH_STATE
      this.commentText = ''
      this.commentItem = {}
      this.commentIndex = ''
      this.discussItem = {}
      this.discussIndex = ''
    },
    comment: function (item, index) {
      this.commentReset()
      this.commentType = COMMEENT_STATE
      this.commentItem = item
      this.commentIndex = index
      this.$refs.text.focus()
    },
    repaly: function (item, index, list, indexDiscuss) {
      this.commentReset()
      this.commentType = REPLAY_STATE
      this.commentItem = item
      this.commentIndex = index
      this.discussItem = list
      this.discussIndex = indexDiscuss
      if (list.proactive === this.userName) {
        this.confirmState = true
      }
      this.$refs.text.focus()
    },
    delComment: function (item, index) {
      this.commentReset()
      this.confirmState = true
      this.commentType = COMMEENT_STATE
      this.commentItem = item
      this.commentIndex = index
    },
    submit: function () {
      if (!this.commentText) {
        this.tip = this.commentInfo[this.commentType].tip
        return false
      }
      if (this.commentType === PUBLISH_STATE) {
        this.$http.get(this.apiURL + 'pinglun.jhtml?contentId=' + this.contentId + '&wxbdopenId=' + this.id + '&context=' + encodeURI(this.commentText)).then((response) => {
          if (!response.data.permission) {
            this.tip = '请先支持一下吧~~'
          } else {
            this.info.unshift(response.data)
          }
          this.commentReset()
        }, () => {
          this.tip = '请求失败'
        })
      } else {
        var url = ''
        if (this.commentType === COMMEENT_STATE) {
          url = this.apiURL + 'replyComment.jhtml?contentId=' + this.contentId + '&wxbdopenId=' + this.id + '&replyContext=' + encodeURI(this.commentText) + '&commentId=' + this.commentItem.commentId
        } else if (this.commentType === REPLAY_STATE) {
          url = this.apiURL + 'replyComment.jhtml?contentId=' + this.contentId + '&wxbdopenId=' + this.id + '&replyContext=' + encodeURI(this.commentText) + '&commentId=' + this.commentItem.commentId + '&replyName=' + this.commentObject
        }
        this.$http.get(url).then((response) => {
          if (!response.data.permission) {
            this.tip = '请先支持一下吧~~'
          } else {
            this.commentItem.discuss.push(response.data)
          }
          this.commentReset()
        }, () => {
          this.tip = '请求失败'
        })
      }
    },
    confirm: function (val) {
      this.confirmState = false
      if (val && this.commentType === COMMEENT_STATE) {
        this.$http.get(this.apiURL + 'delComment.jhtml?contentId=' + this.contentId + '&wxbdopenId=' + this.id + '&commentId=' + this.commentItem.commentId).then(function (response) {
          this.info.splice(this.commentIndex, 1)
          this.commentReset()
        }, () => {
          this.tip = '请求失败'
        })
      } else if (val && this.commentType === REPLAY_STATE) {
        this.$http.get(this.apiURL + 'delReplyComment.jhtml?contentId=' + this.contentId + '&wxbdopenId=' + this.id + '&commentId=' + this.commentItem.commentId + '&discussId=' + this.discussItem.discussId).then(function (response) {
          if (response.data.success) {
            this.commentItem.discuss.splice(this.discussIndex, 1)
          } else {
            this.tip = '操作失败'
          }
          this.commentReset()
        }, () => {
          this.tip = '请求失败'
        })
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
    Nodata,
    Confirm
  },
  computed: {
    commentInfo: function () {
      return [
        {
          placeholder: '请您发表一下你的看法吧~~',
          buttonText: '发表',
          tip: '请输入将要发表的内容'
        },
        {
          placeholder: '评论',
          buttonText: '评论',
          tip: '请输入将要发表的内容'
        },
        {
          placeholder: '@' + this.commentObject,
          buttonText: '回复',
          tip: '请输入将要发表的内容'
        }
      ]
    }
  },
  filters: {
    zanNum: function (value) {
      if (value > 99) {
        return '99+'
      } else {
        return value
      }
    }
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style lang='less' scoped>
.ml2{
	margin-left:-0.2rem;
}
.comment{
	padding-bottom:2rem;
  > li{
  	padding:1rem 0.7rem 1rem;
  	position:relative;
  	border-bottom:1px solid #cccccc;
  }
  .headerPic{
  	float:left;
  	width:3rem;
  	height:3rem;
  	border-radius:50%;
  }
  .infobox{
  	float:right;
  	width:12.6rem;
  }
  .title{
  	color:#336699;
  }
  .info, .title{
  	font-size:0.7rem;
  	line-height:1.4rem;
  	color:#666666;
  	overflow:hidden;
  	text-overflow:ellipsis;
  	white-space:nowrap;
  }
  .Interaction{
  	color:#999999;
  	height:0.7rem;
  	line-height:0.7rem;
  	padding:0.4rem 0 0;
  }
  .zan, .commentBtn{
  	float:right;
  	padding-left:1rem;
  	height:0.7rem;
  	line-height:0.7rem;
  }
  .zan{
  	background:url("../../image/zan.png") no-repeat 0 0;
  	background-size:0.7rem;
  	width:3rem;
  }
  .zan.act{
  	background:url("../../image/zan_hover.png") no-repeat 0 0;
  	background-size:0.7rem;
  }
  .commentBtn{
    background:url("../../image/commentBtn.png") no-repeat 0 0;
    background-size:0.7rem;
  }
}
.commentText{
  width:100%;
  padding:0.4rem 0.6rem;
  position:fixed;
  left:0;
  bottom:0;
  border-top:1px solid #cccccc;
  background:#f5f5f5;
  input{
    height:1.8rem;
    float:left;
    box-sizing:border-box;
    font-size:0.7rem;
    background: #fff;
  }
  .text{
    width:13.8rem;
    border:1px solid #cccccc;
    text-indent:0.4rem;
    border-radius:0.2rem 0 0 0.2rem;
  }
  .sure{
    width:3rem;
    background:#cc0000;
    color:#ffffff;
    border-radius:0 0.2rem 0.2rem 0;
  }
}
.commentList{
  background:#f5f5f5;
  font-size:0.7rem;
  line-height:0.7rem;
  margin-top:0.6rem;
  padding:0.1rem 0.2rem;
  span{
    line-height:1rem;
  }
  &:empty{
    display:none;
  }
}
.del{
  float:right;
  width:1rem;
  height:1.16rem;
  background:url("../../image/delred.png") no-repeat center center;
  background-size:contain;
}
</style>
