<template>
  <div class="layout-bottom">
    <div class="bottom-inner">
      <p>Copyright © 2017好未来版权所有 北京世纪好未来教育科技有限公司</p>
      <p>咨讯电话：010-101088 地址：北京市海淀区中关村大厦32号和盛大厦6层</p>
      <div class="bottom-msg">
        <img src="~@a/bottom-icon.png" />
        <div>京公网安备 11010802022211号</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "index",
  data() {
    return {
      msg: "bottom"
    };
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.layout-bottom {
  min-width: 1240px;
  height: 235px;
  // 因top顶置 调整高度
  padding-bottom: 80px;
  background: linear-gradient(0deg, #191919, #191919), #ffffff;
  padding-top: 70px;

  .bottom-inner {
    text-align: center;
    font-size: 14px;
    line-height: 20px;
    color: rgba(255, 255, 255, 0.6);
    height: 165px;
    p {
      margin-bottom: 15px;
    }
    .bottom-msg {
      display: flex;
      align-items: center;
      justify-content: center;
      padding-top: 15px;
      img {
        margin-right: 5px;
      }
    }
  }
}
</style>
