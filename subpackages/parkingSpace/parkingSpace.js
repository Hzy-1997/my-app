// pages/touristGuide/touristGuide.js

import Toast from '@vant/weapp/toast/toast';
const app = getApp()

import {
  parkingApi,
} from "../../api/index"


Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: 9,
    gImgUrl: app.globalData.gImgUrl,
    page: 1,
    pageSize: 10,
    dataInfo: [],
    dataList: [],
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
    this.getDataInfo()
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

  /**
   * 获取详情
   */
  async getDataInfo() {
    let res = await parkingApi.parkingList({
      page: this.data.page,
      pageSize: this.data.pageSize
    })

    console.log(res.data.parkingList)
    this.setData({
      dataList: res.data.parkingList
    })

  },

  // 详情
  goDetails(data) {
    let {
      id
    } = data.currentTarget.dataset
    console.log("传递的ID", id)
    wx.navigateTo({
      url: `/subpackages/serviceDetailsInfo/serviceDetailsInfo?id=${id}&type=${this.data.type}`
    })
  }
})