import { request } from "../../request/index"
import regeneratorRuntime from '../../lib/runtime/runtime';
import {login} from "../../utils/asyncWx"

Page({
    // 获取用户信息 获取用户登录成功后的token
    async handleGetUserInfo(e) {
        try {
            const { encryptedData, rawData, iv, signature } = e.detail;
            const {code} = await login();
            const loginParams = { encryptedData, rawData, iv, signature, code };
            const token = await request({url:"/user/wxlogin", data:loginParams, method:"post"})
            console.log(token);   // 没有企业账号，得不到token
            wx.setStorageSync("token", token);
            wx.navigateBack({
                delta: 1
            });
        } catch (error) {
            console.log(error);
        }        
    }
})