import { request } from "../../request/index"
import regeneratorRuntime from '../../lib/runtime/runtime';

Page({

    data: {
        goodsObj:[],
        isCollect:false     // 商品是否收藏
    },

    GoodsInfo:[],   // 商品数据也另外存一份，方便加入购物车时存储本地验证修改

    onShow: function () {
      let pages = getCurrentPages();
      let currentPage = pages[pages.length - 1];
      let options = currentPage.options;

      // console.log(options);
      const {id} = options;
      this.getDetailData(id)
    },

    async getDetailData(id) {
        const res = await request({url:"/shop/goods/detail", data: {id}})
        // console.log(res);
        this.GoodsInfo = res;
        // 获取缓存中的商品收藏的数组
        let collect = wx.getStorageSync("collect") || [];
        let isCollect = collect.some(v => v.basicInfo.id === this.GoodsInfo.basicInfo.id);
        this.setData({
            goodsObj:{
                pics: res.pics,
                price: res.basicInfo.minPrice,
                name: res.basicInfo.name,
                infoContent: res.content
            },
            isCollect
        })
    },
    // 点击轮播图 放大预览
    handlePreviewImage(e) {
        const urls = this.GoodsInfo.pics.map(v => v.pic);
        const current = e.currentTarget.dataset.url;
        wx.previewImage({
            current,
            urls
        });         
    },
    // 加入购物车
    handleCartAdd() {
        let cart = wx.getStorageSync("cart") || [];
        let index = cart.findIndex(v => v.basicInfo.id === this.GoodsInfo.basicInfo.id);
        if(index === -1) {
            this.GoodsInfo.num = 1;
            this.GoodsInfo.checked = true;
            cart.push(this.GoodsInfo);
        }else {
            cart[index].num++;
        }
        wx.setStorageSync("cart", cart);
        wx.showToast({
            title: '加入成功',
            icon: 'success',
            mask: true,
        });        
    },  
    
  // 点击 商品收藏
  handleCollect(){
    let isCollect=false;
    let collect = wx.getStorageSync("collect") || [];
    let index = collect.findIndex(v=>v.basicInfo.id === this.GoodsInfo.basicInfo.id);
    if(index!==-1){
      collect.splice(index,1);
      isCollect=false;
      wx.showToast({
        title: '取消成功',
        icon: 'success',
        mask: true
      });       
    }else{
      collect.push(this.GoodsInfo);
      isCollect=true;
      wx.showToast({
        title: '收藏成功',
        icon: 'success',
        mask: true
      });
    }
    wx.setStorageSync("collect", collect);
    this.setData({
      isCollect
    })          
  }          
})