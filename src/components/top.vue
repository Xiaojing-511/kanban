<template>
  <div>
    <div class="nav-top">
      <div class="nav-inner">
        <img class="nav-logo" src="~@a/logo.png" />
        <div class="nav">
          <div :class="[currentRouter && currentRouter.indexOf('index') > -1 ? 'nav-li current' : 'nav-li']" @click="routerGoto('index')">
            常用工具
            <div class="nav-line"></div>
          </div>
          <div :class="[currentRouter && currentRouter.indexOf('star') > -1 ? 'nav-li current' : 'nav-li']" @click="routerGoto('star')">
            星级项目
            <div class="nav-line"></div>
          </div>
          <div :class="[currentRouter && currentRouter.indexOf('knowledge') > -1 ? 'nav-li current' : 'nav-li']" @click="routerGoto('knowledge')">
            知识中心
            <div class="nav-line"></div>
          </div>
          <div :class="[currentRouter && currentRouter.indexOf('demand') > -1 ? 'nav-li current' : 'nav-li']" @click="routerGoto('demand')">
            需求全景
            <div class="nav-line"></div>
          </div>
        </div>

        <div class="avatar">
          <span class="avatar-name">{{user.name}}</span>
          <a-avatar style="width: 40px; height: 40px; line-height: 40px; background-color: #3159F6" :alt="user.name" :src="user.avatar">{{user.name}}</a-avatar>
        </div>

      </div>
    </div>
    <div style="width:100%;height:80px"></div>
  </div>

</template>

<script>
import {mapActions, mapState} from "vuex" // 注册 action 和 state
export default {
  name: "index",
  data() {
    return {
        user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : ''
    }
  },
  computed: {
    //在这里映射 store.state.currentRouter computed 里的其他属性一样
    ...mapState([
      "currentRouter",
    ])
  },
  mounted() {},
  methods: {
    //在这里引入 action 里的方法，使用方法和 methods 里的其他方法一样
    ...mapActions([
      "setCurrentRouter"
    ]),
    routerGoto(name) {
      this.$router.push("/"+name)
      this.setCurrentRouter(name)
    }
  },
  
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .nav-top {
    width: 100%;
    height: 80px;
    background: #fff;

    z-index: 90;
    position: fixed;
    top: 0;
    background-color: #fff;


    .nav-inner {
      position: relative;
      width: 1240px;
      margin: 0 auto;
      height: 80px;
      display: flex;
      justify-content: flex-start;
      align-items: center;

      .nav-logo {
        display: block;
        width: 204px;
        height: auto;
      }

      .nav {
        margin-left:40px;
        overflow: hidden;
      }

      .nav-li {
        float: left;
        position: relative;
        height: 80px;
        margin-left: 80px;
        font-size: 16px;
        line-height: 80px;
        font-weight: bold;
        color: rgba(0, 0, 0, 0.4);
        cursor: pointer;

        .nav-line {
          display: none;
          position: absolute;
          bottom: 0;
          width: 32px;
          height: 3px;
          left: 50%;
          margin-left: -16px;
          background: #272727;
        }
      }

      .nav-li.current {
        color:#000;
      }

      .nav-li.current .nav-line {
        display: block;
      }

      .nav-li:hover {
        color: #000;
      }

      .avatar {
        position: absolute;
        right: 0;
        height: 40px;
        line-height: 40px;
        display: flex;

        .avatar-name {
          display: inline-block;
          height: 40px;
          background-color: transparent !important;
          margin-right: 10px;
        }
      }
    }
  }
</style>
