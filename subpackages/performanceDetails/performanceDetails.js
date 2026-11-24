// subpackages/performanceDetails/performanceDetails.js
import {
  performanceApi,
} from "../../api/index"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 1,
    program: {},
    navTitle: "演绎详情"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      id: options.id
    })

    this.performanceDetail()
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
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 页面滚动事件
   */
  onPageScroll(e) {
    // 通知导航栏组件更新透明度和文字颜色
    this.selectComponent('#nav-bar').onScroll(e.scrollTop);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  // 获取节目

  async performanceDetail() {

    wx.showLoading({
      title: '加载中'
    })

    try {
      let res = await performanceApi.performanceDetail({
        id: this.data.id
      })

      // 处理时间
      if (res.data.reminders.length > 0) {
        res.data.reminders.map((item) => {
          item.time = item.projectStartTime.split('T')[1].substring(0, 5)
        })
      }

      // 是否有预约
      if (res.data.reminders.length > 0 || res.data.schedules > 0) {
        res.data.schedules.forEach((element) => {
          res.data.reminders.map((item) => {
            if (element.showTime == item.time) {
              element.isAppointment = 1
            } else {
              element.isAppointment = 2
            }
          })
        });
      }


      console.log(res)

      this.setData({
        program: res.data
      })

      wx.hideLoading()
    } catch (error) {
      wx.hideLoading()
      console.log(error)
      wx.showToast({
        title: '系统错误',
        icon: 'error',
        duration: 2000
      })
    }
  },

  goReserve() {
    const {
      id,
      title
    } = this.data.program;
    wx.navigateTo({
      url: `/pages/reserve/index?id=${id}&title=${encodeURIComponent(title || '')}`
    });
  }
})