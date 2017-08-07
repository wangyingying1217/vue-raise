<template>
  <div class="imageupload-wrapper wrapper">
    <img class="img" :src="localPic" v-scale>
    <div class="clip" :class="{'circle': type === 'headPic','rectangle': type === 'cover'}"></div>
    <div class="btn-bg"></div>
    <div class="btn-wrapper">
      <a class="fl" @click="cancel">取消</a>
      <a class="fr" @click="ensure">确定</a>
    </div>
    <Tip :info.sync="tip"></Tip>
  </div>
</template>

<script>
export default {
  props: ['apiURL', 'id', 'localPic', 'type'],
  data () {
    return {
      tip: '',
      xAxle: '',
      yAxle: '',
      width: '',
      height: ''
    }
  },
  methods: {
    cancel: function () {
      window.history.go(-1)
    },
    ensure: function () {
      let formData = new FormData()
      let URL = this.type === 'headPic' ? 'member/modifyHead.jhtml' : 'tailor/picture.jhtml'
      formData.append('path', this.localPic)
      formData.append('state', localStorage.getItem('state'))
      formData.append('wxbdopenId', this.id)
      formData.append('xAxle', this.xAxle)
      formData.append('yAxle', this.yAxle)
      formData.append('width', this.width)
      formData.append('height', this.height)
      this.$http.post(this.apiURL + URL, formData).then((response) => {
        this.$emit('pic', response.data.srcPic)
        window.history.go(-1)
      }, (response) => {
        this.tip = '上传失败'
      })
    }
  },
  directives: {
    'scale': {
      inserted: function (el, binding, vnode) {
        const WIDTH = 14
        let HEIGHT = 0
        if (vnode.context.type === 'headPic') {
          HEIGHT = 14
        } else if (vnode.context.type === 'cover') {
          HEIGHT = 10
        }
        const BASE_SIZE = document.documentElement.clientWidth / 18
        const CLIENT_HEIGHT = document.documentElement.clientHeight
        let imgLeft
        let imgTop
        let imgWidth
        let fileWidth
        let originalHeight
        let originalWidth
        let baseScale
        let clipLeft = (18 - WIDTH) / 2
        let clipTop = (CLIENT_HEIGHT / BASE_SIZE - HEIGHT) / 2
        el.onload = () => {
          originalHeight = el.offsetHeight
          fileWidth = originalWidth = el.offsetWidth
          baseScale = parseFloat(originalWidth / originalHeight)
          if (baseScale > 1) {
            el.style.width = 18 * baseScale + 'rem'
            el.style.height = 18 + 'rem'
          } else {
            el.style.width = 18 + 'rem'
            el.style.height = 18 / baseScale + 'rem'
          }
          if (CLIENT_HEIGHT > originalHeight) {
            el.style.top = (CLIENT_HEIGHT - originalHeight) / 2 + 'px'
          } else {
            el.style.top = 0
          }
          siteData(el)
        }
        el.ontouchstart = (ev) => {
          let fingers = ev.touches.length   // 屏幕上手指数量
          if (fingers === 2) {
            let touch1 = ev.targetTouches[0]  // 第一根手指touch事件
            let touch2 = ev.targetTouches[1]  // 第二根手指touch事件
            let startX = Math.sqrt(Math.pow((touch1.pageX - touch2.pageX), 2) + Math.pow((touch1.pageY - touch2.pageY), 2))
            document.ontouchmove = (ev) => {
              let touch1 = ev.targetTouches[0]  // 第一根手指touch事件
              let touch2 = ev.targetTouches[1]  // 第二根手指touch事件
              let endX = Math.sqrt(Math.pow((touch1.pageX - touch2.pageX), 2) + Math.pow((touch1.pageY - touch2.pageY), 2))
              let scale = endX - startX
              el.style.width = (originalWidth + scale) + 'px'
              el.style.height = (originalWidth + scale) / baseScale + 'px'
              el.style.left = imgLeft - scale / 2 + 'px'
              el.style.top = imgTop - scale / 2 + 'px'
            }
          } else if (fingers === 1) {
            let touch1 = ev.targetTouches[0]
            let x1 = touch1.pageX
            let y1 = touch1.pageY
            document.ontouchmove = (ev) => {
              let touch1 = ev.targetTouches[0]
              let x2 = touch1.pageX
              let y2 = touch1.pageY
              el.style.left = imgLeft + (x2 - x1) + 'px'
              el.style.top = imgTop + (y2 - y1) + 'px'
            }
          }
          document.ontouchend = (ev) => {
            el.style.transition = '.2s'
            if (baseScale > 1 && el.offsetHeight / BASE_SIZE < HEIGHT) {
              el.style.width = HEIGHT * baseScale + 'rem'
              el.style.height = HEIGHT + 'rem'
            } else if (baseScale < 1 && el.offsetWidth / BASE_SIZE < WIDTH) {
              el.style.width = WIDTH + 'rem'
              el.style.height = WIDTH / baseScale + 'rem'
            }
            if (el.offsetLeft / BASE_SIZE > clipLeft) {
              el.style.left = clipLeft + 'rem'
            } else if (el.offsetLeft / BASE_SIZE < clipLeft + WIDTH - el.offsetWidth / BASE_SIZE) {
              el.style.left = clipLeft + WIDTH - el.offsetWidth / BASE_SIZE + 'rem'
            }
            if (el.offsetTop / BASE_SIZE > clipTop) {
              el.style.top = clipTop + 'rem'
            } else if (el.offsetTop / BASE_SIZE < clipTop + HEIGHT - el.offsetHeight / BASE_SIZE) {
              el.style.top = clipTop + HEIGHT - el.offsetHeight / BASE_SIZE + 'rem'
            }
            setTimeout(() => {
              el.style.transition = ''
              originalWidth = el.offsetWidth
              originalHeight = el.offsetHeight
              siteData(el)
              document.ontouchmove = null
              document.ontouchend = null
            }, 200)
          }
        }
        function siteData(name) {
          imgLeft = parseInt(name.offsetLeft)
          imgTop = parseInt(name.offsetTop)
          imgWidth = name.offsetWidth
          let size = fileWidth / imgWidth
          vnode.context.xAxle = parseInt((clipLeft * BASE_SIZE - imgLeft) * size)
          vnode.context.yAxle = parseInt((clipTop * BASE_SIZE - imgTop) * size)
          vnode.context.width = parseInt(WIDTH * BASE_SIZE * size)
          vnode.context.height = parseInt(HEIGHT * BASE_SIZE * size)
        }
      }
    }
  }
}
</script>

<style lang='less'>
.imageupload-wrapper{
  background: #000!important;
  color: #fff;
  overflow: auto;
  .img{
    position: fixed;
    top: 0;
    z-index: 2;
    -webkit-transform:translate3d(0,0,0);
  }
  .clip{
    position: fixed;
    top: 50%;
    left: 50%;
    z-index: 3;
    border: 1px solid #fff;
    pointer-events:none;
    transform:translate(-50%, -50%);
    box-shadow: 0 0 100rem 100rem rgba(0,0,0,0.5);
  }
  .circle{
    width: 14rem;
    height: 14rem;
    border-radius: 50%;
  }
  .rectangle{
    width: 14rem;
    height: 10rem;
  }
  .btn-bg{
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    height: 2rem;
  }
  .btn-wrapper{
    .btn-bg;
    line-height: 2rem;
    background:rgba(100,100,100,0.5);
    font-size: 0.8rem;
    z-index: 4;
    a{
      width: 4rem;
      text-align: center;
      color: #fff
    }
  }
}
</style>
