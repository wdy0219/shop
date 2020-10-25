import { request } from "../../request/index"
import regeneratorRuntime from '../../lib/runtime/runtime';

Page({

    data: {
        leftMenuList:[],
        rightCurrentContent:[],
        currentIndex:0,     // 标记当前选择 为样式服务
        currentId:174505    // 为右侧内容服务 接受左侧id赋值
    },

    db:[],  // 为缓存单独建一个仓库，把左右数据放一个数组里，为localStorage赋值服务

    onLoad: function (options) {

        
        // 缓存 1.主要业务逻辑
        const Cates = wx.getStorageSync("cates");
        if(!Cates) {
            this.getLeft();
            this.getRight();
        }else {
            if (Date.now() - Cates.time > 1000 * 10) { 
                // console.log('超过10秒，重新请求');
                this.getLeft();
                this.getRight();
            }else {
                // console.log('十秒之内，从缓存中取数据重新赋值');
                this.db = Cates.data
                this.setData({
                    leftMenuList:this.db[0],
                    rightCurrentContent:this.db[1]
                })
            }
        }
    },

    async getLeft() {
        // request({url: "/shop/goods/category/all"})
        // .then(res => {
        //     this.db.push(res.data.data)
        //     this.setData({
        //         leftMenuList:res.data.data
        //     })
        // })
        const res = await request({url: "/shop/goods/category/all"});
        this.db.push(res);
        this.setData({
            leftMenuList:res
        })
    },

    async getRight() {
        let res = await request({url: "/shop/goods/list"});
        res = res.filter(v => v.categoryId == this.data.currentId)      // 右侧内容显示的筛选条件
        // console.log(res);
        this.db.push(res);
        this.setData({
            rightCurrentContent:res           
        });
        wx.setStorageSync("cates", {time:Date.now(),data:this.db});
    },
    // 左边数据 item.id == 右边数据 item.categoryId  2.业务逻辑补充
    handleItemTap(e) {
        // console.log(e);
        const {id,index} = e.currentTarget.dataset;
        this.setData({
            currentIndex:index,
            currentId:id
        })
        this.getRight()
    },


})