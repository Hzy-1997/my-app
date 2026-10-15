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
      'Authorization': 'Bearer ' + wx.getStorageSync('token') || '',
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

/**
 * 上传文件封装（wx.uploadFile）
 * @param {Object} parameter
 * @param {String} parameter.url      接口路径（自动拼接 BASE_URL）
 * @param {String} parameter.filePath 本地临时文件路径
 * @param {String} parameter.name     文件字段名，需与后端 upload.single('file') 保持一致，默认 'file'
 * @param {Object} parameter.formData 随文件一起提交的附加表单参数
 */
export const uploadFile = (parameter) => {
  let {
    url,
    filePath,
    name = 'file',
    formData = {},
  } = parameter
  return new Promise((resolve, reject) => {

    let token = wx.getStorageSync('token')
    wx.uploadFile({
      url: url.startsWith('http') ? url : `${getKeyString()}${url}`,
      filePath,
      name,
      header: token ? {
        Authorization: 'Bearer ' + token
      } : {},
      formData,
      timeout: 10000,
      success(res) {
        // wx.uploadFile 返回的是字符串，需手动解析
        let data = res.data
        try {
          data = typeof res.data === 'string' ? JSON.parse(res.data) : res.data
        } catch (e) {
          return reject(res)
        }
        if (data.code == 200) {
          resolve(data)
        } else {
          wx.showToast({
            title: data.message || '上传失败',
            icon: 'none'
          })
          reject(data)
        }
      },
      fail(err) {
        reject(err)
      }
    })
  })
}