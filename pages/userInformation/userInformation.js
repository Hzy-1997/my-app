// pages/userInformation/userInformation.js

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
    userInformation: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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

  // 更改信息
  changeInformation(data) {
    wx.navigateTo({
      url: `/subpackages/personalInformation/personalInformation`,
    })

  }
})