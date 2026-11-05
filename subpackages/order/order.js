const app = getApp()

import {
  ticketingApi
} from "../../api/index"



Page({
  data: {
    gImgUrl: app.globalData.gImgUrl,
    currentTab: 0,
    tabList: [{
        label: '全部',
        value: 0
      },
      {
        label: '待支付',
        value: 1
      },
      {
        label: '已支付',
        value: 2
      },
      {
        label: '已完成',
        value: 3
      },
      {
        label: '已退款',
        value: 4
      },
      {
        label: '已取消',
        value: 5
      }
    ],
    statusMap: {
      1: '待支付',
      2: '已支付',
      3: '已完成',
      4: '已退款',
      5: '已取消'
    },
    mockAllData: [],
    orderList: [],
    page: 1,
    pageSize: 10,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.filterOrder()
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
  onReachBottom(e) {
    console.log("触底", e)
    this.setData({
      page: this.data.page + 1
    })
    this.filterOrder()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  switchTab(e) {
    const val = e.currentTarget.dataset.value
    this.setData({
      currentTab: Number(val),
      page: 1,
      orderList: [],
    })
    this.filterOrder()
  },

  async filterOrder() {

    wx.showLoading({
      title: '加载中',
    })

    let res = await ticketingApi.ticketOrderDetail({
      payStatus: this.data.currentTab,
      page: this.data.page
    })

    if (res.code == 200) {
      wx.hideLoading()

      let list = [...this.data.orderList, ...res.data]
      if (this.data.currentTab !== 0) {
        list = list.filter(i => i.payStatus === this.data.currentTab)
      }
      list.forEach(item => {
        item.statusText = this.data.statusMap[item.payStatus]
      })
      this.setData({
        orderList: list
      })
    }
  },

  goPay(e) {
    const id = e.currentTarget.dataset.id
    wx.showToast({
      title: `跳转支付 id:${id}`,
      icon: "none"
    })
  },
  cancelOrder(e) {
    const id = e.currentTarget.dataset.id
    wx.showModal({
      title: "提示",
      content: "确定取消订单？",
      success: res => {
        if (res.confirm) {
          wx.showToast({
            title: "已取消",
            icon: "success"
          })
          this.filterOrder()
        }
      }
    })
  },
  goDetail(e) {
    console.log(123)
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/subpackages/orderDetail/orderDetail?id=${id}`
    })
  }
})