// pages/performance/performance.js

import {
  performanceApi,
} from "../../api/index"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navTitle: "演绎演出",
    acePerformance: [],
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
    this.getPerformanceList()
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

  // 获取演出列表
  async getPerformanceList() {
    let res = await performanceApi.strategyListApi({
      page: 1,
      pageSize: 99
    })

    let data = res.data.rows
    let list = []
    data.map((item) => {
      item.name = item.title.split("·")[0]
      if (item.isSmartRecommended) {
        console.log(item)
        list.push(item)
      }
    })

    this.setData({
      acePerformance: list
    })
  },



  // 热门看点
  goPopular() {
    wx.navigateTo({
      url: '/subpackages/traditional/traditional',
    })
  },
  // 互动指南
  goInteraction() {
    wx.navigateTo({
      url: '/subpackages/interactive/interactive',
    })
  },
})