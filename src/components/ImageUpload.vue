<template>
  <div class="imageupload-wrapper wrapper">
    <!-- 待剪裁的图片 -->
    <img class="img" :src="localPic" v-scale>
    <!-- 剪裁框（头像的剪裁框是原型、封面的剪裁框是矩形） -->
    <div class="clip" :class="{'circle': type === 'headPic','rectangle': type === 'cover'}"></div>
    <!-- 建材按钮 -->
    <div class="btn-wrapper">
      <a class="fl" @click="cancel">取消</a>
      <a class="fr" @click="ensure">确定</a>
    </div>
    <Tip :info.sync="tip"></Tip>
  </div>
</template>

<script>
/**
 * 参数
 * localPic：剪裁图片路径
 * type：剪裁类型（头像/封面）
 */
export default {
  props: ['apiURL', 'id', 'localPic', 'type'],
  data () {
    return {
      tip: '',
      xAxle: '', // 距离x轴距离
      yAxle: '', // 距离x轴距离
      width: '', // 剪裁的宽度
      height: '' // 剪裁的高度
    }
  },
  methods: {
    // 取消剪裁
    cancel: function () {
      window.history.go(-1)
    },
    // 确定剪裁
    ensure: function () {
      let formData = new FormData()
      let URL = this.type === 'headPic' ? 'member/modifyHead.jhtml' : 'tailor/picture.jhtml'
      formData.append('path', this.localPic) // 剪裁的图片路径
      formData.append('state', localStorage.getItem('state')) // 公众号的接口所属类别
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
        // 定义剪裁的宽度和高度（单位rem）
        const WIDTH = 14
        let HEIGHT = 0
        // 头像剪裁和封面剪裁的高度不一样
        if (vnode.context.type === 'headPic') {
          HEIGHT = 14
        } else if (vnode.context.type === 'cover') {
          HEIGHT = 10
        }
        // 计算rem的基础单位（1rem = ?px）
        const BASE_SIZE = document.documentElement.clientWidth / 18
        //  页面可视区的高度
        const CLIENT_HEIGHT = document.documentElement.clientHeight
        let imgLeft // 图片的left值
        let imgTop // 图片的top值
        let imgWidth // 图片宽度
        let fileWidth // 图片原始高度
        let originalHeight // 每次移动前图片高度
        let originalWidth // 每次移动前图片宽度
        let baseScale // 宽高比
        // 剪裁框距离左边的距离
        let clipLeft = (18 - WIDTH) / 2
        // 剪裁框距离上边的距离
        let clipTop = (CLIENT_HEIGHT / BASE_SIZE - HEIGHT) / 2
        // 图片加载完成默认居中铺满剪裁区域
        el.onload = () => {
          originalHeight = el.offsetHeight
          fileWidth = originalWidth = el.offsetWidth
          baseScale = parseFloat(originalWidth / originalHeight)
          // 宽高中  较小的一方为18rem  较大的一方等比例放大（避免初始加载时图片大小小于剪裁框）
          if (baseScale > 1) {
            el.style.width = 18 * baseScale + 'rem'
            el.style.height = 18 + 'rem'
          } else {
            el.style.width = 18 + 'rem'
            el.style.height = 18 / baseScale + 'rem'
          }
          // 动态计算图片的top值   使图片垂直居中
          if (CLIENT_HEIGHT > el.offsetHeight) {
            el.style.top = (CLIENT_HEIGHT - el.offsetHeight) / 2 + 'px'
          } else {
            el.style.top = 0
          }
          // 动态计算图片的left值   使图片水平居中
          if (parseInt(el.style.width) > 18) {
            el.style.left = -(parseInt(el.style.width) - 18) / 2 + 'rem'
          }
          // 更新剪裁数据
          siteData(el)
        }
        el.ontouchstart = (ev) => {
          let fingers = ev.touches.length   // 屏幕上手指数量
          // 两只手指放大/缩小
          if (fingers === 2) {
            let touch1 = ev.targetTouches[0]  // 第一根手指touch事件
            let touch2 = ev.targetTouches[1]  // 第二根手指touch事件
            // 通过勾股定理计算初始的两指间距离
            let startX = Math.sqrt(Math.pow((touch1.pageX - touch2.pageX), 2) + Math.pow((touch1.pageY - touch2.pageY), 2))
            document.ontouchmove = (ev) => {
              let touch1 = ev.targetTouches[0]  // 第一根手指touch事件
              let touch2 = ev.targetTouches[1]  // 第二根手指touch事件
              // 通过勾股定理计算移动的两指间距离
              let endX = Math.sqrt(Math.pow((touch1.pageX - touch2.pageX), 2) + Math.pow((touch1.pageY - touch2.pageY), 2))
              // 手指运动的距离
              let scale = endX - startX
              // 更新节点位置
              el.style.width = (originalWidth + scale) + 'px'
              el.style.height = (originalWidth + scale) / baseScale + 'px'
              el.style.left = imgLeft - scale / 2 + 'px'
              el.style.top = imgTop - scale / 2 + 'px'
            }
          // 一只手指拖动位置移动
          } else if (fingers === 1) {
            let touch1 = ev.targetTouches[0]
            let x1 = touch1.pageX
            let y1 = touch1.pageY
            document.ontouchmove = (ev) => {
              // 计算移动差  更新节点位置
              let touch1 = ev.targetTouches[0]
              let x2 = touch1.pageX
              let y2 = touch1.pageY
              el.style.left = imgLeft + (x2 - x1) + 'px'
              el.style.top = imgTop + (y2 - y1) + 'px'
            }
          }
          document.ontouchend = (ev) => {
            el.style.transition = '.2s'
            // 如果小于剪裁区域的尺寸图片自动放大到剪裁区域的大小
            if (baseScale > 1 && el.offsetHeight / BASE_SIZE < HEIGHT) {
              el.style.width = HEIGHT * baseScale + 'rem'
              el.style.height = HEIGHT + 'rem'
            } else if (baseScale < 1 && el.offsetWidth / BASE_SIZE < WIDTH) {
              el.style.width = WIDTH + 'rem'
              el.style.height = WIDTH / baseScale + 'rem'
            }
            // 如果偏离剪裁框,图片回到剪裁区域内
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
              // 将节点此时的宽高更新到节点每次移动之前的状态
              originalWidth = el.offsetWidth
              originalHeight = el.offsetHeight
              // 更新剪裁数据
              siteData(el)
              // 解绑事件
              document.ontouchmove = null
              document.ontouchend = null
            }, 200)
          }
        }
        // 更新剪裁数据
        function siteData(dom) {
          imgLeft = parseInt(dom.offsetLeft) // 节点的left值数值（px）
          imgTop = parseInt(dom.offsetTop) // 节点的top值数值（px）
          imgWidth = dom.offsetWidth // 节点的宽度数值（px）
          let size = fileWidth / imgWidth  // 图片缩放比例
          vnode.context.xAxle = parseInt((clipLeft * BASE_SIZE - imgLeft) * size) // 计算后的剪裁的left值
          vnode.context.yAxle = parseInt((clipTop * BASE_SIZE - imgTop) * size) // 计算后的top值
          vnode.context.width = parseInt(WIDTH * BASE_SIZE * size) // 计算后的剪裁的宽度
          vnode.context.height = parseInt(HEIGHT * BASE_SIZE * size) // 计算后的剪裁的高度
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
