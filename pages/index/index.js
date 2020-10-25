import { request } from "../../request/index"
import regeneratorRuntime from '../../lib/runtime/runtime';

Page({
    data: {
        swiperList:[],
        catesList:[],
        floorList:[]
    },
    
    onLoad: function (options) {
        // wx.request({
        //   url: 'https://api.zbztb.cn/api/public/v1/home/swiperdata',
        //   success: (result) => {
        //     this.setData({
        //       swiperList: result.data.message
        //     })
        //   }
        // });
        this.getSwiperList();
        this.getCateList();
        this.getFloorList();
    },
    // 获取轮播图数据
    getSwiperList(){
        request({ url: "/banner/list" })
        .then(result => {
        this.setData({
            swiperList: result
        })
        })
    },   
    // 获取 分类导航数据
    getCateList(){
        request({ url: "/shop/goods/category/all" })
        .then(result => {
        this.setData({
            catesList: result
        })
        })
    },
    // 获取 楼层数据
    getFloorList(){
        request({ url: "/shop/goods/list" })
        .then(result => {
        this.setData({
            floorList: result
        })
        })
    }
})