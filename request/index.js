// 同时发送异步代码的次数
let ajaxTime = 0;
export const request = (params) => {
    // 判断 url中是否带有 /my/ 请求的是私有的路径 带上header token
    let header={...params.header};
    if(params.url.includes("/my/")){
        // 拼接header 带上token
        header["Authorization"]=wx.getStorageSync("token");
    }
    ajaxTime++;
    // 显示加载中效果
    wx.showLoading({
        title: "加载中",
        mask: true,
    });
      
    // 公共地址
    const baseUrl = "https://api.it120.cc/wudaoyi97"
    return new Promise((resolve, reject) => {
        wx.request({
            ...params,
            header:header,
            url:baseUrl+params.url,
            success:(result) => {
                resolve(result.data.data);
            },
            fail:(err) => {
                reject(err)
            },
            complete: () => {
                ajaxTime--;
                if(ajaxTime === 0) {
                    wx.hideLoading();
                }               
            }
        })
    })
}