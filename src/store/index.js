import Vue from 'vue'
import Vuex from 'vuex'

import mutations from "./mutations";
import actions from "./actions";
import getters from "./getters";

// 1.安装插件
Vue.use(Vuex)

const state ={
  cartList:[]
}
// 2.创建Store对象
//  设计的原则是state中放数据，
//  逻辑判断放在action中(调用mutations中的方法,当然对state的异步操作只能放在action中而不能放在mutations中)，
//  mutations中放对state的单一操作,它的操作都是可以使用浏览器的vue-dev插件跟踪的,方便调试。
//  getters一般用于获取state中的值
const store = new Vuex.Store({
  state,
  mutations,
  actions,
  getters
})

// 3.挂载Vue实例上
export default  store
