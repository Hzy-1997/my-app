// subpackages/HotelDetails/hotelDetails.js

const app = getApp()

import {
  hotelApi
} from "../../api/index"



Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: "",
    hotelDetails: "",
    controlHeigth: false,
    gImgUrl: app.globalData.gImgUrl,
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
    this.getHotelDetails()
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

  // 获取酒店详情
  async getHotelDetails() {
    let res = await hotelApi.hotelDetail({
      id: this.data.id
    })

    res.data.intro = res.data.intro.split('；')
    res.data.facilities = JSON.parse(res.data.facilities)
    res.data.banner = res.data.banner.split(",")
    res.data.tags = res.data.tags.split(",")
    res.data.openingTime = new Date(res.data.openingTime).toISOString().split('T')[0];
    this.setData({
      hotelDetails: res.data
    })

    console.log(this.data.hotelDetails)
  },

  onMoreFacility() {
    this.setData({
      controlHeigth: !this.data.controlHeigth
    });
  },

  // 预览图片

  previewImage(e) {
    // 获取点击的图片索引
    const index = e.currentTarget.dataset.index;
    // 获取所有图片名称
    const bannerList = this.data.hotelDetails.banner;
    // 拼接完整URL
    const baseUrl = this.data.gImgUrl;

    // 构建完整图片URL列表
    const imageUrls = bannerList.map(item => baseUrl + item);

    // 预览图片
    wx.previewImage({
      current: imageUrls[index], // 当前显示图片
      urls: imageUrls // 所有图片列表
    });
  },

  goPhone(data) {
    let {
      call
    } = data.currentTarget.dataset
    wx.makePhoneCall({
      phoneNumber: call
    })
  }





})