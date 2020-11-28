<template>
  <div id="home">
    <nav-bar class="home-nav" ><div slot="center">购物街</div></nav-bar>
    <tab-control  :titles="['流行', '新款', '精选']"
                  @tabClick="tabClick" ref="tabControl1"
                  class="tab-control" v-show="isTabFixed"/>
    <scroll class="content"
            ref="scroll"
            :probe-type="3" :pull-up-load="true"
            @scroll="contentscroll"  @pullingUp="loadMore">
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"></home-swiper>
      <recommend-view :recommends="recommends"></recommend-view>
      <feature-view></feature-view>
      <tab-control  :titles="['流行', '新款', '精选']"
                   @tabClick="tabClick" ref="tabControl2"
                   :class="{fixed: isTabFixed}"/>
      <goods-list :goods="showGoods"/>
    </scroll>
    <back-top @click.native="backClick" v-show="isShowBackTop"/>

  </div>
</template>
<!--d-->
<script>
  import HomeSwiper from "./childComps/HomeSwiper";
  import RecommendView from "./childComps/RecommendView";
  import FeatureView from "./childComps/FeatureView";


  import NavBar from "components/common/navbar/NavBar";
  import TabControl from "components/content/tabControl/TabControl";
  import GoodsList from "components/content/goods/GoodsList";
  import Scroll from "components/common/scroll/Scroll";

  import {getHomeMultidata, getHomeGoods} from "network/home";
  import {itemListenerMixin,backTopMixin} from "common/mixin";


  export default {
    name: "Home",
    components: {
      HomeSwiper,
      RecommendView,
      FeatureView,
      NavBar,
      TabControl,
      GoodsList,
      Scroll
    },
    //VUE的混入，这里itemListenerMixin中定义的mounted函数会合并到当前组件的mounted函数中
    mixins: [itemListenerMixin,backTopMixin],
    data() {
      return {
        banners:[],
        recommends:[],
        goods: {
          'pop': {page:0, list:[]},
          'new': {page:0, list:[]},
          'sell': {page:0,list:[]},
        },
        currentType: 'pop',
        tabOffsetTop: 0,
        isTabFixed: false,
        saveY:0
      }
    },
    created() {
      //1.请求多个数据,此操作是一个异步操作
       this.getHomeMultidata()

      //2.请求商品数据
      this.getHomeGoods('pop')
      this.getHomeGoods('new')
      this.getHomeGoods('sell')
    },
    mounted() {
    },
    destroyed() {
      // console.log("Destroyed");
    },
    activated() {
      this.$refs.scroll.scrollTo(0, this.saveY,1)
      this.$refs.scroll.refresh()
      // console.log('Home_activated');
    },
    deactivated() {
      // 1.保留Y值
      this.saveY = this.$refs.scroll.getScrollY()

      // 2.取消全局事件的监听
      this.$bus.$off('itemImageLoad', this.itemImgListener)
      // console.log('Home_deactivated');
    },
    computed: {
      showGoods() {
        return this.goods[this.currentType].list
      }
    },
    methods: {
      // 事件监听相关的方法

      tabClick(index) {
        // console.log(index)
        switch (index) {
          case 0:
            this.currentType = 'pop';break;
          case 1:
            this.currentType = 'new';break;
          case 2:
            this.currentType = 'sell';break;
        }
        this.$refs.tabControl1.currentIndex = index;
        this.$refs.tabControl2.currentIndex = index;
      },
      backClick() {
        this.$refs.scroll.scrollTo(0,0);
      },
      contentscroll(position) {
        // 1.判断BackTop是否显示
        // console.log(position);
        this.isShowBackTop = (-position.y) > 1000
        // 2.决定tabControl是否吸顶
        this.isTabFixed = (-position.y) > this.tabOffsetTop
        // 3.是否显示回到顶部,此函数定义在minxin.js中的backTopMixin中.minxin.js中定义了VUE的各种混入
        this.listenShowBackTop(position)
      },
      loadMore(){
        this.getHomeGoods(this.currentType)
      },
      swiperImageLoad() {

        // 2.获取tabControl的offsetTop
        // 所有的组件都有一个属性$el:,用于获取组件中的元素
        // console.log(this.$refs.tabControl2.$el.offsetTop);
        this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop
      },


      // 网络请求相关的方法
      getHomeMultidata() {
        getHomeMultidata().then(res => {
          // console.log(res);
          this.banners = res.data.banner.list;
          this.recommends = res.data.recommend.list;
          // console.log(this.banners)
        })
      },
      getHomeGoods(type){
        const page = this.goods[type].page+1
        getHomeGoods(type,page).then(res => {
          // console.log(res)
          this.goods[type].list.push(...res.data.list)
          this.goods[type].page+=1

          this.$refs.scroll.finishPullUp()
        })
      }
    }
  }
</script>

<!--/*由于这里的<style>中的scoped属性，因此在该style中写的所有样式只对当前组件起作用*/-->
<style scoped>
  #home {
    /*padding-top: 44px;*/
    height: 100vh;
  }
  .home-nav {
    background-color: var(--color-tint);
    color: #fff;

    /*在使用浏览器原生滚动时，为了让导航不跟随一起滚动*/
    /*position: fixed;*/
    /*left: 0;*/
    /*right: 0;*/
    /*top: 0;*/
    /*z-index: 9;*/
  }

  .content {
    overflow: hidden;

    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }
  .tab-control {
    position: relative;
    z-index: 9;
  }

  .fixed {
    position: fixed;
    left: 0;
    right: 0;
    top: 44px;
  }
  /*.content {*/
  /*  height: calc(100% - 93px);*/
  /*  overflow: hidden;*/
  /*  margin-top: 44px;*/
  /*}*/
</style>
