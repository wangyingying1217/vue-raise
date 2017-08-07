<template>
</template>

<script>
import wx from 'weixin-js-sdk'

export default {
  data () {
    return {
      localPic: [],
      serverId: []
    }
  },
  methods: {
    getConfig: function () {
      if (this.id) {
        let url = encodeURIComponent(document.URL.split('#')[0])
        // 获取微信配置信息
        this.$http.get(this.apiURL + 'imageSign.jhtml?url=' + url + '&wxbdopenId=' + this.id).then((response) => {
          wx.config({
            // debug: true,
            appId: response.data.appId,
            timestamp: response.data.timestamp,
            nonceStr: response.data.nonceStr,
            signature: response.data.signature,
            jsApiList: [
              'chooseWXPay'
            ]
          })
        }, (res) => {
          this.tip = '获取配置失败'
        })
      }
    },
    pay: function (data) {
      this.$http.post(this.apiURL + 'zhifu.jhtml', data).then((response) => {
        wx.chooseWXPay({
          appId: response.data.appId,
          timestamp: response.data.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
          nonceStr: response.data.nonceStr, // 支付签名随机串，不长于 32 位
          package: 'prepay_id=' + response.data.prepay_id, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
          signType: 'MD5', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
          paySign: response.data.paysign, // 支付签名
          success: (res) => {
            this.$router.push('/success/pay')
          },
          err: (res) => {
            this.tip = '支付失败'
          }
        })
      })
    }
  },
  watch: {
    $route: function () {
      this.getConfig()
    }
  },
  created () {
    // 组件创建完后获取数据，
    this.getConfig()
  }
}
</script>
