<template>
  <div class="file-wrapper">
    <slot></slot>
    <input class="file" v-if="isAndroid && isImage" type="file" :accept="imageAccept" capture="camera" @change="upload" ref="file">
    <input class="file" v-if="isIphone && isImage" type="file" :accept="imageAccept" @change="upload" ref="file">
    <input class="file" v-if="isAndroid && !isImage" type="file" :accept="videoAccept" capture="camcorder" @change="upload" ref="file">
    <input class="file" v-if="isIphone && !isImage" type="file" :accept="videoAccept" @change="upload" ref="file">
  </div>
</template>

<script>
export default {
  props: {
    apiURL: [String, Number],
    id: [String, Number],
    type: {
      type: String,
      default: 'image'
    }
  },
  data () {
    return {
      imageAccept: 'image/*',
      videoAccept: 'video/*',
      file: '',
      isAndroid: false,
      isIphone: false
    }
  },
  methods: {
    upload: function () {
      let formData = new FormData()
      let file = this.$refs.file.files[0]
      let size = file.size / 1024 / 1024
      if (size > 100) {
        alert('请上传大小在100M以内的文件')
        return
      }
      formData.append('file', file)
      this.$http.post(this.apiURL + 'upload_file.jhtml', formData).then((res) => {
        this.$emit('pic', res.data.filePath)
        this.$refs.file.value = ''
      }, (res) => {
        alert('上传失败')
      })
    }
  },
  created() {
    let u = navigator.userAgent
    if (u.indexOf('Android') > -1 || u.indexOf('Adr') > -1) {
      this.isAndroid = true
    } else if (u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
      this.isIphone = true
    }
  },
  computed: {
    isImage: function () {
      let data = true
      if (this.type === 'video') {
        data = false
      }
      return data
    }
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style lang='less'>
.file-wrapper{
  position: relative;
  .file{
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    z-index: 99;
  }
}
</style>
