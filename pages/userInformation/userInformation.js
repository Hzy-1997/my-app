// pages/userInformation/userInformation.js

const app = getApp()

import {
  topBarHeight
} from "../../utils/util"


import {
  orderData
}
from "./data.js"

import {
  loginApi,
} from "../../api/index"

import {
  cryptoUtil
} from "../../utils/util"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderData,
    navTitle: '页面标题',
    userInformation: "",
    gImgUrl: app.globalData.gImgUrl,
    totalTopBarHeight: "0",
    seasonBg: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let height = topBarHeight()
    console.log(height)
    this.setSeasonBg();
    this.setData({
      totalTopBarHeight: topBarHeight()
    })
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
    this.getUserInfo()
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
  setSeasonBg() {
    const month = new Date().getMonth() + 1;
    let seasonBg = '';

    if (month >= 3 && month <= 8) {
      // 春
      seasonBg = 'https://hezhaoyu.oss-cn-hangzhou.aliyuncs.com/staticImage/backgroundSpring.png';
    } else if (month >= 9 && month <= 12) {
      // 秋
      seasonBg = 'https://hezhaoyu.oss-cn-hangzhou.aliyuncs.com/staticImage/backgroundAutumn.png';
    } else {
      // 冬
      seasonBg = 'https://hezhaoyu.oss-cn-hangzhou.aliyuncs.com/staticImage/backgroundWinter.png';
    }

    this.setData({
      seasonBg
    });
  },

  login() {
    wx.navigateTo({
      url: '/pages/login/login',
    })

  },

  // 获取用户信息
  async getUserInfo() {
    let res = await loginApi.getUserInfo()
    console.log(res)
    if (res.code != 200) {
      this.login()
      return
    }
    res.data = cryptoUtil.decrypt(res.data)
    this.setData({
      userInformation: JSON.parse(res.data)
    })

  },

  // 意见反馈
  goFeedback(data) {
    wx.navigateTo({
      url: `/subpackages/feedback/feedback`,
    })
  },

  // 更改信息
  changeInformation(data) {
    wx.navigateTo({
      url: `/subpackages/personalInformation/personalInformation`,
    })
  },
  // 关于我们
  goAboutUs() {
    wx.navigateTo({
      url: `/subpackages/aboutUs/aboutUs`,
    })
  }
})