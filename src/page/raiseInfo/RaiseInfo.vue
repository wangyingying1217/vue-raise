<template>
  <div class='wrap_preview' v-if="show" :style="{'min-height': height}">
    <div class='per_info clearfix'>
      <router-link :to="'/question/'+ contentId" tag="div" class="imgWrap">
        <img class='fl' v-bind:src='info.headerPic' alt='pic'>
      </router-link>
      <div class='text_info'>
        <p v-html='info.title'></p>
        <div>
          <span class='fl'>发起人：
            <router-link :to="'/question/'+ contentId" tag="strong">{{info.userName}}</router-link>
          </span>
          <span class='fr concern' v-bind:class='{"active":info.concern}' v-on:click='concern'>关注</span>
        </div>
      </div>
    </div>
    <div class='show_pic'>
      <span class='raise-state'>{{info.state}}</span>
      <router-link :to="'/imagePreview/'+contentId+'/coverPic/0'">
        <img v-bind:src='info.coverPic' alt='pic'>
      </router-link>
    </div>
    <div class='prograss'>
      <p><span><strong>{{info.supportNum}}</strong></span>支持数</p>
      <p><span>￥<strong>{{info.raisedNum}}</strong></span>已筹款</p>
      <div class='percent_box clearfix'>
        <p><span class='fr'><strong>{{info.percent}}</strong></span></p>
        <div class='percent'>
          <p v-bind:style='"width:"+info.percent'></p>
        </div>
        <p>
          <span class='fl'>剩余<strong>{{info.remainDay}}</strong></span>
          <span class='fr'>目标筹资<strong>￥{{info.target}}</strong></span>
        </p>
      </div>
      <div class='supportBtn' :class="{'act':info.isSupport}" @click="support">查看支持项</div>
      <ul class='tip clearfix'>
        <li>
          <span class='tip_ico1 tip_ico'></span>
          <router-link class='tip_info' :to="'/searchType/itemType/'+info.type">{{info.type}}</router-link>
        </li>
        <li>
          <span class='tip_ico2 tip_ico'></span>
          <router-link class='tip_info' :to="'/searchType/province/'+info.province">{{info.province}}</router-link>
          <router-link class='tip_info' :to="'/searchType/city/'+info.province+' '+info.city">{{info.city}}</router-link>
        </li>
        <li>
          <span class='tip_ico3 tip_ico'></span>
          <router-link class='tip_info' :to="'/searchType/selfdom/'+item" v-for="item in info.selfdom" :key="item">{{item}}</router-link>
        </li>
      </ul>
    </div>
    <List :info='detialInfo'></List>
  </div>
</template>

<script>
import List from '@/components/List'

export default {
  props: ['apiURL', 'id'],
  data () {
    return {
      info: {},
      contentId: '',
      show: false
    }
  },
  methods: {
    getCustomers: function () {
      document.title = ''
      this.contentId = this.$route.params.contentId
      if (this.contentId && this.id) {
        this.$http.get(this.apiURL + 'content.jhtml?contentId=' + this.contentId + '&wxbdopenId=' + this.id).then((response) => {
          this.info = response.data
          document.title = this.info.title
          this.show = true
          this.$indicator.close()
        }, () => {
          this.$indicator.close()
          alert('请求失败')
        })
      }
    },
    concern: function () {
      this.$http.get(this.apiURL + 'concern.jhtml?contentId=' + this.contentId + '&wxbdopenId=' + this.id + '&concern=' + !this.info.concern).then((response) => {
        this.info.concern = !this.info.concern
      }, () => {
        this.$indicator.close()
        alert('请求失败')
      })
    },
    support: function () {
      if (this.info.isSupport) {
        this.$router.push('/supportType/' + this.info.contentId)
      }
    }
  },
  created () {
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
    List
  },
  computed: {
    detialInfo: function () {
      return [
        {
          name: '项目详情',
          href: '/details/' + this.contentId
        },
        {
          name: '项目评论',
          href: '/comment/' + this.contentId
        },
        {
          name: '支持记录',
          href: '/supportRecord/' + this.contentId
        },
        {
          name: '项目动态',
          href: '/evolve/' + this.contentId
        }
      ]
    },
    height: function () {
      return document.documentElement.clientHeight + 'px'
    }
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style lang='less' scoped>
.wrap_preview{
  background: #fff;
}
.per_info{
	padding:1rem 1rem 0.7rem;
  .imgWrap{
    float:left;
    width:3.4rem;
    height:3.4rem;
    border-radius:50%;
    overflow:hidden;
    background:#ccc;
    margin-right:0.8rem;
    img{
      width:100%;
      height:100%;
    }
  }
  .text_info{
    float:left;
    width:11.8rem;
    p{
      font-size:0.84rem;
      line-height:1.6rem;
      overflow:hidden;
      text-overflow:ellipsis;
      white-space:nowrap;
    }
    span{
      font-size:0.74rem;
      line-height:2rem;
    }
    strong{
      color:#cc0000;
    }
    .concern{
      padding:0 0.2rem 0 1rem;
      background:url('../../../static/image/concern.png') no-repeat 0 center;
      background-size: 0.8rem;
      &.active{
        background:url('../../../static/image/concerning.png') no-repeat 0 center;
        background-size: 0.8rem;
      }
    }
  }
}
.show_pic{
	position:relative;
	margin:0 1rem 0.4rem;
  overflow: hidden;
  .raise-state{
    position:absolute;
    left:-1rem;
    top:3.3rem;
    width:6rem;
    height:1rem;
    color: #fff;
    font-size: 0.6rem;
    line-height: 1rem;
    background: #cc0001;
    text-align: center;
    transform: rotate(-45deg);
    transform-origin:0 0;
  }
  img{
    width:100%;
    min-height:5rem;
  }
}
.prograss{
	padding:0 1.7rem;
  > p{
    font-size:0.7rem;
    line-height:2rem;
  }
  > p span{
    font-size:1.2rem;
    margin-right:0.3rem;
  }
  > p strong{
    color:#cc0000;
  }
}
.percent_box{
	font-size:0.7rem;
	line-height:1.4rem;
	margin-bottom:1rem;
	margin-top:-0.4rem;
  span{
    color:#999999;
  }
  strong{
    color:#333333;
  }
  .percent{
    width:100%;
    height:0.5rem;
    border-radius:0.25rem;
    background:#cccccc;
    overflow:hidden;
    p{
      height:100%;
      background:#cc0000;
    }
  }
}
.supportBtn{
	height:2rem;
	line-height:2rem;
	font-size:0.84rem;
	border-radius:0.2rem;
	color:#ffffff;
	text-align:center;
  background:#999;;
  &.act{
    background:#cc0000;
  }
}
.tip{
	line-height:1.5rem;
	font-size:0.7rem;
	padding:0.3rem 0;
  > li{
    float:left;
    padding: 0 0.5rem 0 0.1rem;
    min-width: 3rem;
    &:last-of-type{
      padding: 0 0 0 0.1rem;
    }
  }
  .tip_ico{
    float:left;
    width:1rem;
    height:1.5rem;
    margin-right:0.2rem;
  }
  .tip_ico1{
    background:url('../../../static/image/tip1.png') no-repeat center center;
    background-size: contain;
  }
  .tip_ico2{
    background:url('../../../static/image/tip2.png') no-repeat center center;
    background-size: contain;
  }
  .tip_ico3{
    background:url('../../../static/image/tip3.png') no-repeat center center;
    background-size: contain;
  }
  .tip_info{
    margin-right:0.2rem;
  	color:#999999;
  }
}
</style>
