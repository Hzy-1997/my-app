// subpackages/serviceDetails/serviceDetails.js

const app = getApp()

import {
  serviceSuggestionsApi
} from "../../api/index"

import Toast from '@vant/weapp/toast/toast';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: "",
    show: false,
    gImgUrl: app.globalData.gImgUrl,
    dataList: [],
    info: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      type: options.type
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
    this.convenienceServices()
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



  async convenienceServices() {
    Toast.loading({
      message: '加载中...',
      forbidClick: true,
    });
    let res = await serviceSuggestionsApi.getTouristServicesList({
      serviceType: this.data.type
    })
    console.log("返回数据", res)

    this.setData({
      dataList: res.data.rows
    })

    Toast.clear();
  },

  showPopup() {
    this.setData({
      show: true
    });
  },

  onClose() {
    this.setData({
      show: false
    });
  },


})