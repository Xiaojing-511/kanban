<template>
	<div class="warp">
		<div
      class="knowList"
      v-for="item in knowledge"
      :key="item.name"
      @click="goto(item.url)"
    >
			{{ item.title }}
		</div>
	</div>
</template>

<script>
import { getInfo } from "@/api/communication"
export default {
  data() {
    return {
      knowledge: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      getInfo()
        .then((res) => {
          if (res.errcode === 0) {
            this.knowledge = res.res.knowledge
          } else {
            this.$message.warning(res.errmsg)
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    goto(url) {
      let el = document.createElement("a");
      document.body.appendChild(el);
      el.href = url; //url 是你得到的连接
      el.target = "_blank"; //指定在新窗口打开
      el.click();
      document.body.removeChild(el);
    }
  }
};
</script>

<style scoped lang="scss">
.warp {
  width: 1240px;
  margin: 24px auto 60px auto;
  min-height: calc(100% - 84px);
  background: #fff;
  border-radius: 8px;

  .knowList {
    margin: 0 24px;
    height: 60px;
    line-height: 60px;
    border-bottom: 1px dashed rgba($color: #000000, $alpha: 0.06);
    font-size: 14px;
    font-weight: bold;
    color: rgba(0, 0, 0, 0.8);
    cursor: pointer;
  }
  .knowList:hover {
    color: #3159f6;
  }
}
</style>
