<template>
  <div class="warp" v-html="activeHtml"></div>
</template>

<script>
export default {
  data() {
    return {
      activeHtml: localStorage.getItem("activeHtml")
    }
  }
}
</script>
<style scoped lang="scss">
.warp {
  width: 1200px;
  margin: 24px auto 60px auto;
  min-height: calc(100% - 124px);
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  img {
    max-width: 1000px;
    height: auto;
  }
}
</style>
