import {getSetting,chooseAddress,openSetting,showModel,showToast} from "../../utils/asyncWx"
import regeneratorRuntime from '../../lib/runtime/runtime'

Page({

    data: {
        address:{},
        cart:[],
        allChecked:false,
        totalPrice:0,
        totalNum:0
    },

    onShow: function () {
        // 获取缓存中的收货地址信息
        const address = wx.getStorageSync("address");
        // 获取缓存中的购物车信息
        const cart = wx.getStorageSync("cart") || [];
        this.setData({address});
        this.setCart(cart)
    },
    // 点击 收货地址
    async handleChooseAddress() {
        try {
            // 获取权限状态
            const res1 = await getSetting();
            const scopeAddress = res1.authSetting["scope.address"];
            // 判断权限状态
            if (scopeAddress === false) {
                await openSetting();
            }
            let address = await chooseAddress();
            address.all = address.provinceName+address.cityName+address.countyName+address.detailInfo
            wx.setStorageSync("address", address);            
        } catch (error) {
            console.log(error);
        }
    },
    // 单选功能
    handleItemChange(e) {
        const id = e.currentTarget.dataset.id;
        let {cart} = this.data;
        let index = cart.findIndex(v => v.basicInfo.id === id);
        cart[index].checked = !cart[index].checked;
        this.setCart(cart)
    },
    // 购物车状态改变 重新计算底部工具栏数据 封装   1.主逻辑 利用本地中的cart存入data中的cart进行业务逻辑
    setCart(cart) {
        // 计算全选
        // const allChecked = cart.length ? cart.every(v => v.checked) : false;
        let allChecked = true;
        // 总价格 总数量
        let totalPrice = 0;
        let totalNum = 0;
        cart.forEach(v => {
            if (v.checked) {
                totalPrice += v.num * v.basicInfo.minPrice;
                totalNum += v.num;
            }else {
                allChecked = false
            }
        });
        allChecked = cart.length ? allChecked : false;
        this.setData({
            cart,
            allChecked,
            totalPrice,
            totalNum
        })
    },
    // 商品全选功能
    handleItemAllCheck() {
        let {cart, allChecked} = this.data;
        allChecked = !allChecked;
        cart.forEach(v => v.checked = allChecked);
        this.setCart(cart)
    },
    // 商品数量编辑功能
    async handleItemNumEdit(e) {
        const {operation,id} = e.currentTarget.dataset;     // operation为wxml中加减按钮的身份判断
        let {cart} = this.data;
        const index = cart.findIndex(v => v.id === id);
        if (cart[index].num === 1 && operation === -1) {
            const res = await showModel({content:"您是否要删除"});
            if (result.confirm) {
                cart.splice(index, 1);
                this.setCart(cart);
            }            
        }else {
            cart[index].num += operation;
            this.setCart(cart)
        }

    },
    // 点击结算
    async handlePay() {
        const {address, totalNum} = this.data;
        if (!address.userName) {
            await showToast({title: "您还没有选择收货地址"});
            return
        }
        if (totalNum === 0) {
            await showToast({title: "您还没有选购商品"});
            return
        }
        wx.navigateTo({
            url: '/pages/pay/index',
        });        
    }
})