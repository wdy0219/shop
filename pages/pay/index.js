import {getSetting,chooseAddress,openSetting,showModel,showToast,requestPayment} from "../../utils/asyncWx"
import regeneratorRuntime from '../../lib/runtime/runtime'
import { request } from "../../request/index"

Page({

    data: {
        address:{},
        cart:[],
        totalPrice:0,
        totalNum:0
    },

    onShow: function () {
        const address = wx.getStorageSync("address");
        let cart = wx.getStorageSync("cart") || [];
        // 过滤后的购物车数组
        cart = cart.filter(v => v.checked);
        this.setData({address});

        // 总价格 总数量
        let totalPrice = 0;
        let totalNum = 0;
        cart.forEach(v => {
            totalPrice += v.num * v.basicInfo.minPrice;
            totalNum += v.num;
        });
        this.setData({
            cart,
            totalPrice,
            totalNum,address
        })
    },
    // 点击 支付 
    async handleOrderPay() {
      try {
        const token = wx.getStorageSync("token");
        if (!token) {
          wx.navigateTo({
            url: '/pages/auth/index'
          });
          return;
        }
        const order_price = this.data.totalPrice;
        const consignee_addr = this.data.address.all;
        const cart = this.data.cart;
        let goods = [];
        cart.forEach(v => goods.push({
          goods_id: v.basicInfo.id,
          goods_number: v.num,
          goods_price: v.basicInfo.minPrice
        }))
        const orderParams = { order_price, consignee_addr, goods };
        const { order_number } = await request({ url: "/my/orders/create", method: "POST", data: orderParams });
        const { pay } = await request({ url: "/my/orders/req_unifiedorder", method: "POST", data: { order_number } });
        await requestPayment(pay);
        const res = await request({ url: "/my/orders/chkOrder", method: "POST", data: { order_number } });
        await showToast({ title: "支付成功" });
        let newCart=wx.getStorageSync("cart");
        newCart=newCart.filter(v=>!v.checked);
        wx.setStorageSync("cart", newCart);         
        wx.navigateTo({
          url: '/pages/order/index'
        });         
      } catch (error) {
        await showToast({ title: "支付失败" })
        console.log(error);
      }
    }
})