import {debounce} from "./utils";
import BackTop from "components/content/backTop/BackTop";
// 混入
export const itemListenerMixin = {
  data() {
    return {
      itemImgListener:null
    }
  },
  mounted() {
    // 1.图片加载完成的事件监听
    //使用事件总线来激发‘itemImageLoad’事件，以调用scroll的refresh函数，同时使用debounce防止抖动（即防止激发'itemImageLoad'事件的次数太多）。
    const refresh = debounce(this.$refs.scroll.refresh,10)
    // 对我们监听的事件进行保存
    this.itemImgListener = () => {
      refresh()
    }
    this.$bus.$on('itemImageLoad', this.itemImgListener)
    // console.log('我是混入中的内容');
  }
}

export const backTopMixin = {
  components:{
    BackTop
  },
  data(){
    return {
      isShowBackTop: false
    }
  },
  methods:{
    backTop() {
      this.$refs.scroll.scrollTo(0,0,300)
    },
    listenShowBackTop(position) {
      this.isShowBackTop = -position.y > 1000
    }
  }
}
