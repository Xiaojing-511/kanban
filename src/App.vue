<template>
  <div id="app">
    <theTop class="appTop" />
    <div class="appMain">
      <router-view></router-view>
    </div>
    <theBottom class="appBottom" />
  </div>
</template>

<script lang="ts">
import theTop from "@/components/top.vue"
import theBottom from "@c/bottom.vue"
export default {
  name: "App",
  components: {
    theTop,
    theBottom
  },
  data() {
    return {};
  },
  created() {},
  methods: {}
};
</script>

<style lang="scss">
html,
body {
  width: 100%;
  height: 100%;
  position: relative;
}
.selter-body{
    /*height: 100%;*/
    /*overflow: hidden;*/
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-size: 14px;
  color: #000;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  display: flex;
  display: -webkit-flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

.appTop,
.appBottom {
  flex: initial;
}
.appMain {
  flex: 1;
  width: 100%;
  min-width: 1240px;
  background: #f8f9fa;
}
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}
::-webkit-scrollbar-button:vertical {
  display: none;
}
::-webkit-scrollbar-track,
::-webkit-scrollbar-corner {
  background-color: #e2e2e2;
}
::-webkit-scrollbar-thumb {
  border-radius: 1px;
  background-color: rgba(0, 0, 0, 0.2);
}
::-webkit-scrollbar-thumb:vertical :hover {
  background-color: rgba(0, 0, 0, 0.35);
}
::-webkit-scrollbar-thumb:vertical :active {
  background-color: rgba(0, 0, 0, 0.38);
}
* {
  margin: 0;
  padding: 0;
}
</style>
