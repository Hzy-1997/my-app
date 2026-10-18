// subpackages/campDetails/campDetails.js
const app = getApp()

import Toast from '@vant/weapp/toast/toast';
import {
  campsiteApi,
} from "../../api/index"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    navTitle: '页面标题',
    gImgUrl: app.globalData.gImgUrl,
    id: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options)
    this.setData({
      id: options.id
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
    this.getCampsiteDetail()
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
   * 页面滚动事件
   */
  onPageScroll(e) {
    // 通知导航栏组件更新透明度和文字颜色
    this.selectComponent('#nav-bar').onScroll(e.scrollTop);
  },

  // 获取详细信息
  async getCampsiteDetail() {
    let res = await campsiteApi.campsiteDetail({
      id: this.data.id
    })
    console.log("查看", res)
  },




  generatePoster() {
    wx.onGeneratePoster(function () {
      console.log('需要开发者生成自定义海报')
      return {
        src: 'images/a.jpg',
        promise: new Promise((resolve) => { // 通过promise延时传递小程序的query参数
          setTimeout(() => {
            resolve({
              src: 'images/a.jpg',
            })
          }, 1000) // 在1秒内对query进行解析
        })
      }
    })
  },

  participate() {

    wx.navigateTo({
      url: `/subpackages/campSessionNumber/campSessionNumber?id=${this.data.id}`
    })

  }


})