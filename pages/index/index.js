import {
  navMenu,
  categoryMenu
} from "./data"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    navMenu,
    categoryMenu,
    background: 5,
    currentIndex: 0,
    headerBgColor: 'rgba(255, 255, 255, 0)' // 初始透明
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
  onPullDownRefresh() {},

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

  onPageScroll(e) {
    // e.scrollTop 是页面滚动距离
    const scrollTop = e.scrollTop;
    // 计算透明度：滚动距离 / 最大滚动距离（比如100px达到完全不透明）
    let opacity = scrollTop / 100;
    // 限制透明度范围在 0-1 之间
    if (opacity > 1) opacity = 1;
    if (opacity < 0) opacity = 0;
  
    this.setData({
      headerBgColor: `rgba(255, 255, 255, ${opacity})`
    });
  },


  login() {
    console.log(123)
    wx.navigateTo({
      url: '/pages/login/login',
    })
  },
  toModule() {
    let data = 1
    wx.navigateTo({
      url: "/pages/theater/theater"
    })
    console.log(123)
  },

  toStrategy() {
    // return;
    wx.navigateTo({
      url: '/pages/strategy/strategy',
    })
    console.log("攻略")
  },
  toHotel() {
    wx.navigateTo({
      url: '/pages/hotel/hotel',
    })
  },
  onSwiperChange(e) {
    this.setData({
      currentIndex: e.detail.current
    })
  }
})