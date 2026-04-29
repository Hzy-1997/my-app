import {
  envConfig
} from "../config/env.js"

const getKeyString = () => {
  return envConfig.BASE_URL;
}

export const request = (parameter) => {
  let {
    url,
    method = 'GET',
    data = {},
  } = parameter
  return new Promise((resolve, reject) => {



    // 设置默认请求头
    const defaultHeader = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + wx.getStorageSync('token') || '', // 如果有token存储在本地
    };
    // URL处理
    const fullUrl = url.startsWith('http') ? url : `${getKeyString()}${url}`;
    wx.request({
      url: fullUrl,
      data,
      header: defaultHeader,
      method: method.toUpperCase(),
      timeout: 10000,
      success(res) {
        if (res.data.code == 200) {
          resolve(res.data)
        } else {
          wx.navigateTo({
            url: '/pages/login/login',
          })
        }
      },
      fail(err) {
        reject(err)
      }
    })
  })
}