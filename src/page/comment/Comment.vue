<template>
<div v-if="show">
  <!-- 评论列表 -->
  <ul class="comment" v-if="info.length" @click="commentReset">
    <li class="clearfix" v-for="(item,index) in info">
      <!-- 头像 -->
      <img class="headerPic" :src="item.headPic" alt="pic"/>
      <!-- 看法信息 -->
      <div class="infobox">
        <!-- 发表看法人姓名、删除看法操作（只有本人发布的评论可以删除） -->
        <p class="title">{{item.commentName}}
          <span class="del" @click.stop="delComment(item,index)" v-if="( userName == item.commentName )"></span>
        </p>
        <!-- 看法的文字可能包含表情 要转码 -->
        <p class="info" v-html="decodeURI(item.comment)"></p>
        <!-- 操作 -->
        <div class="Interaction">
          <span class="time">{{item.time}}</span>
          <!-- 对上面的看法进行评论 -->
          <span class="commentBtn" @click.stop="comment(item,index)">评论</span>
          <!-- 对此条看法进行点赞或者取消点赞 -->
          <span class="zan" :class="{'act':item.zan}" @click="zan(item)">赞({{item.zanNum | zanNum}})</span>
        </div>
        <!-- 评论列表 -->
        <ul class="commentList">
          <li class="clearfix" v-for="(list,indexDiscuss) in item.discuss" @click.stop="repaly(item,index,list,indexDiscuss)">
            <!-- 发起人(发起评论或者回复的人)的昵称 -->
            <span class="clBlue">{{list.proactive}}</span>
            <!-- 被回复人的信息（只有在回复状态显示） -->
            <span v-if="list.passive">回复</span>
            <span class="clBlue" v-if="list.passive">{{list.passive}}</span>：
            <!-- 评论或者回复的信息（有表情  需转码） -->
            <span class="ml2" v-html="decodeURI(list.content)"></span>
            <!-- 回复操作 （只有发起人不是自己的时候显示） -->
            <span class="clRed fr" v-if="list.proactive !=userName">回复</span>
            <!-- 删除操作 （只有发起人是自己的时候显示） -->
            <span class="clRed fr" v-if="list.proactive == userName">删除</span>
          </li>
        </ul>
      </div>
    </li>
  </ul>
  <!-- 评论输入框 -->
  <div class="commentText">
    <input class="text" ref="text" type="text" :placeholder="commentInfo[commentType].placeholder" v-model="commentText">
    <input class="sure" type="button" :value="commentInfo[commentType].buttonText" @click="submit">
  </div>
  <!-- 组件 -->
  <Confirm :info="confirmInfo" @confirm="confirm" v-show="confirmState"></Confirm>
  <Nodata :showSwitch="info.length" type="comment"></Nodata>
  <Tip :info.sync="tip"></Tip>
</div>
</template>

<script>
import Nodata from '@/components/Nodata'
import Confirm from '@/components/Confirm'

const PUBLISH_STATE = 0 // 发表看法的常量值为 0
const COMMEENT_STATE = 1 // 评论的常量值为 1
const REPLAY_STATE = 2 // 回复的常量值为 2

export default {
  props: ['apiURL', 'id'],
  data () {
    return {
      info: [],
      show: false,
      contentId: '',
      userName: '', // 用户的用户名
      commentType: PUBLISH_STATE, // 评论框类型
      commentText: '', // 评论框内容
      commentItem: {}, // 选中的看法
      commentIndex: '', // 选中看法的索引
      discussItem: {}, // 选中的评论
      discussIndex: '', // 选中评论的索引
      confirmInfo: {
        title: '提示',
        name: '您确定要删除此条回复？'
      },
      confirmState: false,
      tip: ''
    }
  },
  methods: {
    // 一进页面请求数据
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
    // 点赞操作
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
    // 信息清零
    commentReset: function () {
      this.commentType = PUBLISH_STATE
      this.commentText = ''
      this.commentItem = {}
      this.commentIndex = ''
      this.discussItem = {}
      this.discussIndex = ''
    },
    // 评论操作
    comment: function (item, index) {
      this.commentReset()
      this.commentType = COMMEENT_STATE
      this.commentItem = item
      this.commentIndex = index
      this.$refs.text.focus()
    },
    // 回复操作
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
    // 删除评论
    delComment: function (item, index) {
      this.commentReset()
      this.confirmState = true
      this.commentType = COMMEENT_STATE
      this.commentItem = item
      this.commentIndex = index
    },
    // 确认回复或评论
    submit: function () {
      // 如果评论内容为空 提示不能提交
      if (!this.commentText) {
        this.tip = this.commentInfo[this.commentType].tip
        return false
      }
      // 评论框状态为发表看法
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
        // 评论框状态为评论或回复
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
    // 确定删除操作
    confirm: function (val) {
      this.confirmState = false
      // 删除整条看法
      if (val && this.commentType === COMMEENT_STATE) {
        this.$http.get(this.apiURL + 'delComment.jhtml?contentId=' + this.contentId + '&wxbdopenId=' + this.id + '&commentId=' + this.commentItem.commentId).then(function (response) {
          this.info.splice(this.commentIndex, 1)
          this.commentReset()
        }, () => {
          this.tip = '请求失败'
        })
        // 删除单条评论
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
    // 看法、评论、回复状态的预显示信息、按钮信息、提示信息
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
    // 支持数超过99时显示99+
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
