<template>
    <div id="detail">
<!--      组件不区分大小写，因此这里对DetailNavBar要写成detai-nav-bar-->
      <detail-nav-bar class="detail-nav" ref="nav" @titleClick="titleClick" />
      <scroll class="content" ref="scroll" :probe-type="3" @scroll="contentScroll">
<!--        因为属性：topImages是不区分大小写的，因此这里为top-images-->
        <detail-swiper :top-images="topImages"/>
        <detail-base-info :goods="goods"/>
        <detail-shop-info :shop="shop"/>
        <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"/>
        <detail-param-info ref="params" :param-info="paramInfo"/>
        <detail-comment-info ref="comment" :comment-info="commentInfo"/>
        <goods-list ref="recommend" :goods="recommends"/>
      </scroll>
      <detail-bottom-bar @addCart="addToCart"/>
      <back-top @click.native="backTop" v-show="isShowBackTop"/>
<!--      <toast message="哈哈哈" :show=""/>-->
    </div>
</template>

<script>
  import DetailNavBar from "./childComps/DetailNavBar";
  import DetailSwiper from "./childComps/DetailSwiper";
  import DetailBaseInfo from "./childComps/DetailBaseInfo";
  import DetailShopInfo from "./childComps/DetailShopInfo";
  import DetailGoodsInfo from "./childComps/DetailGoodsInfo";
  import DetailParamInfo from "./childComps/DetailParamInfo";
  import DetailCommentInfo from "./childComps/DetailCommentInfo";
  import GoodsList from "components/content/goods/GoodsList";
  import DetailBottomBar from "./childComps/DetailBottomBar";

  import Scroll from "components/common/scroll/Scroll";

  import {getDetail, getRecommend,Goods, Shop, GoodsParam} from "network/details";
  import {itemListenerMixin,backTopMixin} from "common/mixin";
  import BackTop from "../../components/content/backTop/BackTop";
  import {mapActions} from "vuex"

  export default {
      name: "Detail.vue",
      components: {
        BackTop,
        DetailGoodsInfo,
        DetailNavBar,
        DetailSwiper,
        DetailBaseInfo,
        DetailShopInfo,
        DetailParamInfo,
        DetailCommentInfo,
        GoodsList,
        DetailBottomBar,
        Scroll
      },
      //VUE的混入，这里itemListenerMixin中定义的mounted函数会合并到当前组件的mounted函数中
      mixins: [backTopMixin, itemListenerMixin],
      data(){
        return {
          iid: null,
          topImages: [],
          goods: {},
          shop: {},
          detailInfo:{},
          paramInfo: {},
          commentInfo:{},
          recommends: [],
          themeTopsYs:[],
          currentIndex:0
        }
      },
      created() {
        // 1.保存传入的iid
        this.iid = this.$route.params.iid

        // 2.根据iid请求详情数据
        getDetail(this.iid).then(res=>{
          // console.log(res);
          const data = res.result;
          // 1.获取去顶部的图片轮播数据
          this.topImages = data.itemInfo.topImages
          // 2.获取商品信息
          this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)
          // 3.创建店铺信息的对象
          this.shop = new Shop(data.shopInfo)
          // 4.保存商品的详情数据
          this.detailInfo = data.detailInfo
          // 5.获取参数的信息
          this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)
          // 6.取出评论信息
          if(data.rate.cRate !=0){
            this.commentInfo = data.rate.list[0]
          }

          // 1.第一次获取，值不对。原因this.$refs.params.$el压根没有渲染
          // this.themeTopsYs = []
          // this.themeTopsYs.push(0)
          // this.themeTopsYs.push(this.$refs.params.$el.offsetTop)
          // this.themeTopsYs.push(this.$refs.comment.$el.offsetTop)
          // this.themeTopsYs.push(this.$refs.recommend.$el.offsetTop)


          // 2.第二次获取，值不对。原因是图片没有计算在内
          // 这里的this.$nextTick()  根据最新的数据，对应的DOM是已经被渲染出来，
          // 但是图片依然是没有加载完（目前获取到offsetTop不包含其中的图片）
          //offsetTop值不对的时候，都是因为图片的问题
          // this.$nextTick(()=>{
          //   this.themeTopsYs = []
          //
          //   this.themeTopsYs.push(0)
          //   this.themeTopsYs.push(this.$refs.params.$el.offsetTop)
          //   this.themeTopsYs.push(this.$refs.comment.$el.offsetTop)
          //   this.themeTopsYs.push(this.$refs.recommend.$el.offsetTop)
          // })

        })
        // 3.请求推荐数据
        getRecommend().then(res => {
          this.recommends = res.data.list
        })


      },
      mounted() {
      },
      destroyed() {
        this.$bus.$off('itemImageLoad', this.itemImgListener)
      },
    methods: {
      ...mapActions(['addCart']),
      imageLoad(){
          this.$refs.scroll.refresh()
          // 3.第三次获取，很不错
          //这里只有DetailGoodsInfo加载完image才会触发该响应函数。也可以使用在Home中我们使用的防抖函数来解决该问题。
          this.themeTopsYs = []
          this.themeTopsYs.push(0)
          this.themeTopsYs.push(this.$refs.params.$el.offsetTop)
          this.themeTopsYs.push(this.$refs.comment.$el.offsetTop)
          this.themeTopsYs.push(this.$refs.recommend.$el.offsetTop)
          this.themeTopsYs.push(Number.MAX_VALUE)
        },
      titleClick(index){
        // console.log(index);
        this.$refs.scroll.scrollTo(0,-this.themeTopsYs[index],100)
      },
      contentScroll(position){
          // 1.获取y值
        const positionY = -position.y
        // 2.positionY和主题中值进行对比
        let length = this.themeTopsYs.length
        for (let i=0; i< length-1;i++){
          // if(
          //     (this.currentIndex !=i)
          //     &&((i<length-1 && positionY>= this.themeTopsYs[i] && positionY< this.themeTopsYs[i+1])
          //       ||(i===length-1 && positionY>= this.themeTopsYs[i])
          //       )
          //  )
          // 原先的if中的判断条件太复杂，这里在imageLoad()时多给this.themeTopsYs赋一个Number.MAX_VALUE的值来用空间换时间，以提高性能
          if((this.currentIndex !=i)&&( positionY>= this.themeTopsYs[i] && positionY< this.themeTopsYs[i+1])){
              this.currentIndex = i;
              this.$refs.nav.currentIndex = this.currentIndex
              // console.log(this.currentIndex)
           }
        }
        // 3.是否显示回到顶部,此函数定义在minxin.js中的backTopMixin中.minxin.js中定义了VUE的各种混入
        this.listenShowBackTop(position)
      },
      addToCart() {
        // 1.获取购物车需要展示的信息
        // console.log("...");
        const product = {}
        product.image = this.topImages[0];
        product.title = this.goods.title;
        product.desc = this.goods.desc;
        product.price = this.goods.realPrice;
        product.iid = this.iid;

        // 2.将商品添加到购物车
        // this.$store.dispatch('addCart',product).then(res =>{
        //   console.log(res);
        // })
        this.addCart(product).then(res => {
          this.$toast.show(res,1500)
        })

      }
      }

    }
</script>

<!--/*由于这里的<style>中的scoped属性，因此在该style中写的所有样式只对当前组件起作用*/-->
<style scoped>
 #detail {
   position: relative;
   z-index: 9;
   background-color: #fff;
   height: 100vh;
 }
 .detail-nav {
   position: relative;
   z-index: 9;
   background-color: #fff;
 }
 .content {
   height: calc(100% - 44px - 49px);
   background-color: #fff;
   overflow: hidden;
   /*margin-top: 44px;*/
 }
</style>
