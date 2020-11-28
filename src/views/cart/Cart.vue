<template>
  <div class="cart">
<!--    导航-->
    <nav-bar>
      <div slot="center" class="nav-bar">购物车({{cartLength}})</div>
    </nav-bar>
<!--    商品的列表-->
    <cart-list/>
<!--    底部汇总-->
    <cart-bottom-bar/>

  </div>
</template>

<script>
  import NavBar from "components/common/navbar/NavBar";
  import CartList from "./childComps/CartList";
  import CartBottomBar from "./childComps/CartBottomBar";

  import { mapGetters } from 'vuex'

  export default {
    name: "Cart",
    components: {
      NavBar,
      CartList,
      CartBottomBar
    },
    computed:{
      // mapGetters会将vuex对象store中的所有getter映射到这里局部的计算属性
      //这里有两种写法即...mapGetters([])和...mapGetters({key:,...})
      ...mapGetters(["cartLength"])
    }
  }
</script>

<style scoped>
  .cart {
    height: 100vh;
  }
  .nav-bar{
    background-color: var(--color-tint);
    color: #fff;
  }

</style>
