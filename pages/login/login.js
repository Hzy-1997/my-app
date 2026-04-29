// pages/login/login.js

import {
  loginApi,
  loginByPhone
} from "../../api/index"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loginCode: '' // 存储wx.login获取的code
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 页面加载时预获取code
    this.performWxLogin();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  // 预执行wx.login获取code
  performWxLogin() {
    wx.login({
      success: (res) => {
        if (res.code) {
          this.setData({
            loginCode: res.code
          });
          console.log('预获取code成功:', res.code);
        }
      },
      fail: (err) => {
        console.error('wx.login失败:', err);
      }
    });
  },
  // 手机号一键登录（替换原来的userAuthorization）
  getPhoneNumber: function (e) {
    // 检查用户是否同意授权
    if (e.detail.errMsg !== 'getPhoneNumber:ok') {
      wx.showModal({
        title: '提示',
        content: '需要获取您的手机号才能登录',
        showCancel: false
      });
      return;
    }

    try {
      wx.showLoading({
        title: '登录中...',
        mask: true
      });
      // 确保有code，如果没有重新获取
      if (!this.data.loginCode) {
        wx.login({
          success: (res) => {
            if (res.code) {
              this.handlePhoneLogin(res.code, e.detail.encryptedData, e.detail.iv);
            } else {
              wx.hideLoading();
              wx.showModal({
                title: '系统提示',
                content: '登录失败，请重试！',
              });
            }
          }
        });
      } else {
        this.handlePhoneLogin(this.data.loginCode, e.detail.encryptedData, e.detail.iv);
      }
    } catch (error) {
      wx.hideLoading();
      console.error('登录异常:', error);
    }
  },

  // 处理手机号登录
  handlePhoneLogin: async function (code, encryptedData, iv) {
    try {
      // 调用后端接口 - 注意这里要修改为手机号登录接口
      let status = await loginApi.loginByPhone({
        code: code,
        encryptedData: encryptedData,
        iv: iv
      });

      console.log("登录返回状态", status);

      if (status.code != 200) {
        wx.hideLoading();
        return wx.showModal({
          title: '系统提示',
          content: status.message || '系统异常请重新登录！',
        });
      }

      // 存储登录态
      wx.setStorageSync('token', status.data.token);
      wx.setStorageSync('access_token', status.data.accessToken);
      // 可选：存储用户手机号等基本信息
      if (status.data.userInfo) {
        wx.setStorageSync('userInfo', status.data.userInfo);
      }

      wx.hideLoading();
      // 返回上一页或跳转到首页
      wx.navigateBack({
        delta: 1
      });

    } catch (error) {
      wx.hideLoading();
      console.error('登录请求失败:', error);
      wx.showModal({
        title: '系统提示',
        content: '网络异常，请重试！',
      });
    }
  },

  // 用户授权登录
  userAuthorization: function () {
    try {
      wx.showLoading({
        title: '授权中...'
      })
      if (!wx.getUserProfile) {
        return wx.showModal({
          title: '系统提示',
          content: '您的微信版本太低，请升级版本后再试！',
        });
      }

      wx.getUserProfile({
        desc: '用于完善会员资料',
        success: async (res) => {
          console.log(res)
          let {
            userInfo
          } = res;
          wx.setStorageSync('avatarUrl', userInfo.avatarUrl)
          wx.setStorageSync('nickName', userInfo.nickName)
          wx.login({
            success: async (res) => {
              console.log(res)
              if (res.code) {
                let status = await loginApi.login({
                  code: res.code,
                  userName: userInfo.nickName,
                  avatar: userInfo.avatarUrl
                })
                console.log("状态", status)
                if (status.code != 200) {
                  return wx.showModal({
                    title: '系统提示',
                    content: '系统异常请重新登录！',
                  });
                }
                wx.setStorageSync('token', status.data.token)
                wx.setStorageSync('access_token', status.data.accessToken)
                wx.hideLoading()
                wx.navigateBack({
                  delta: 1
                })
              }
            }
          })
        }
      })

    } catch (error) {

    }

  },


})