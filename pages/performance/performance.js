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
    classicNum: "",
    interactionNum: "",
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
    let quantityA = 0
    let quantityB = 0

    data.map((item) => {
      item.name = item.title.split("·")[0]
      if (item.isSmartRecommended) {
        console.log(item)
        list.push(item)
      }
      if (item.performanceTypes == 1) {
        quantityA = quantityA + 1
      } else {
        quantityB = quantityB + 1
      }
    })

    this.setData({
      acePerformance: list,
      classicNum: quantityA,
      interactionNum: quantityB,
    })
  },


  //王牌演出详情
  performanceDetails(e) {
    console.log(e)
    let {
      item
    } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/subpackages/performanceDetails/performanceDetails?id=${item.id}`
    })
  },

  // 经典演出
  classicList() {
    wx.navigateTo({
      url: `/subpackages/performanceList/performanceList?type=1`
    })
  },

  // 互动演出
  interactionList() {
    wx.navigateTo({
      url: `/subpackages/performanceList/performanceList?type=2`
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