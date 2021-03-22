import Vue from "vue"
import Vuex from "vuex"
import getters from '@/store/getters'

Vue.use(Vuex);

export default new Vuex.Store({
  // 初始化状态
  state: {
    // 当前路由
    currentRouter: "",
    // 需求看板列表更新flag
    updateDemandListFlag: true,
    //用户信息
    user: "",
  },
  // 处理状态
  mutations: {
    set_currentRouter(state, value) {
      state.currentRouter = value
    },
    set_user(state, value) {
      state.user = value
    },
    set_updateDemandListFlag(state, value) {
      state.updateDemandListFlag = value
    },
  },
  // 提交改变后的状态
  actions: {
    setCurrentRouter({ commit }, value) {
      commit("set_currentRouter", value)
    },
    setUpdateDemandListFlag({ commit }, value) {
      commit("set_updateDemandListFlag", value)
    },
    setUser({ commit }, value) {
      commit("set_user", value)
    },
  },
  modules: {},
  getters,
})
