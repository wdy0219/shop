// promise 形式 getSetting
export const getSetting = () => {
    return new Promise((resolve,reject) => {
        wx.getSetting({
            success: (result) => {
                resolve(result);
            },
            fail: (err) => {
                reject(err)
            }
        });         
    })
}
// 封装内置api 选择收货地址
export const chooseAddress = () => {
    return new Promise((resolve,reject) => {
        wx.chooseAddress({
            success: (result) => {
                resolve(result);
            },
            fail: (err) => {
                reject(err)
            }
        });         
    })
}
// 调起客户端小程序设置界面
export const openSetting = () => {
    return new Promise((resolve,reject) => {
        wx.openSetting({
            success: (result) => {
                resolve(result);
            },
            fail: (err) => {
                reject(err)
            }
        });         
    })
}
// 显示模态对话框
export const showModel = (content) => {
    return new Promise((resolve,reject) => {
        wx.showModal({
            title: '提示',
            content: content,
            success: (result) => {
                resolve(result)
            },
            fail: (err) => {
                reject(err)
            }
        }); 
    })
}
// 显示消息提示框
export const showToast = (title) => {
    return new Promise((resolve,reject) => {
        wx.showToast({
            title: title,
            icon: 'none',
            success: (result) => {
                resolve(result)
            },
            fail: (err) => {
                reject(err)
            }
        }); 
    })
}
// 调用接口获取登录凭证
export const login = () => {
    return new Promise((resolve,reject) => {
        wx.login({
            timeout:10000,
            success: (result) => {
                resolve(result)
            },
            fail: (err) => {
                reject(err)
            }
        });
          
    })
}
// 发起微信支付
export const requestPayment = (pay) => {
    return new Promise((resolve,reject) => {
          wx.requestPayment({
            ...pay,
              success: (result) => {
                  resolve(result)
              },
              fail: (err) => {
                  reject(err)
              }
          });
            
    })
}
