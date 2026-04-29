// hotel/hotel.js
import {
  hotelApi
} from "../../api/index"

Page({
  /**
   * 页面的初始数据
   */
  data: {
    value: "3",
    hotelList: []
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
    this.getHotelList()
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

  // 获取列表
  async getHotelList() {
    wx.showLoading({
      title: '加载中',
    })
    let res = await hotelApi.hotelList()
    console.log(res.data)
    if (res.code == 200) {
      res.data.map((item) => {
        item.tags = item.tags.split(",")
        item.level = this.starFunction(item.star_rating)
      })
      console.log(res.data)
      this.setData({
        hotelList: res.data
      })
      wx.hideLoading()
    }
  },

  starFunction(num) {
    let level;
    switch (num) {
      case 1:
        level = "一星级"
        break;
      case 2:
        level = "二星级"
        break;
      case 3:
        level = "三星级"
        break;
      case 4:
        level = "四星级"
        break;
      default:
        level = "五星级"
        break;
    }
    return level
  },

  // 房型查看
  goRoomType(data) {
    let {
      id
    } = data.currentTarget.dataset
    wx.navigateTo({
      url: `/subpackages/hotelRoomType/hotelRoomType?id=${id}`,
    })
  }


})