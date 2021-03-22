<template>
  <div class="container">
    <div class="demandTotal commonBorder">
      <div class="businessOptions commonBorder">
        <div class="textBox">
          <p class="hintText">提需业务方分布</p>
        </div>
        <img class="blank-img" src="./image/blank-icon.png" alt />
      </div>
      <div class="demandStatus commonBorder">
        <div class="textBox">
          <p class="hintText">需求状态分布</p>
        </div>
        <img class="blank-img" src="./image/blank-icon.png" alt />
      </div>
    </div>
    <div class="demandDetail commonBorder">
      <p class="titleText">需求看板</p>
      <img class="blank-img" src="./image/blank-icon.png" alt />
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
};
</script>
<style lang="scss" scoped>
.container {
  width: 100%;
  // height: 500px;
  // background-color: orange;

  .commonBorder {
    border-radius: 8px;
    background-color: #fff;
  }
  .hintText,
  .titleText {
    width: 100%;
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
    // padding: 17px 0 0 36px;
    position: absolute;
    top: 20px;
    left: 36px;
  }
  .hintText {
    // border-bottom: 1px solid #eee;
  }
  .blank-img {
    width: 121px;
  }
  .demandTotal {
    background-color: #f8f9fa;
    // width: 100%;
    height: 300px;
    .businessOptions,
    .demandStatus {
      //   display: inline-block;
      background-color: #fff;
      height: 300px;
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      float: left;
      .textBox {
        width: 100%;
        height: 66px;
        position: absolute;
        top: 0;
        border-bottom: 0.5px solid rgba(0, 0, 0, 0.1);
      }
    }
    .businessOptions {
      width: 670px;
      margin-right: 30px;
    }
    .demandStatus {
      width: 540px;
      //   position: relative;
    }
  }
  .demandDetail {
    //   clear: both;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 388px;
    background-color: #fff;
    margin-top: 20px;
  }
}
</style>