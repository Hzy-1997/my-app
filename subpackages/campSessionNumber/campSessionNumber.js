import {
  campsiteApi,
} from "../../api/index"


Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: "",
    scheduleIndex: "",
    ticketTierIndex: "",
    data: "",
    scheduleList: [],
    scheduleItem: "",
    inputValue: 1,
    discountedPrice: 0,
    originalPrice: 0,
    campsiteId: "",
    sessionId: "",
    ticketId: "",
    select: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
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


  // 获取详细信息
  async getCampsiteDetail() {
    let res = await campsiteApi.campsiteDetail({
      id: this.data.id
    })
    res.data.campSessions = res.data.campSessions.map((item) => {
      const end = item.endDate ? item.endDate.slice(5) : ''
      const start = item.startDate ? item.startDate.slice(5) : ''
      return {
        ...item,
        dateRange: `${start}-${end}`,
      }
    })

    this.setData({
      data: res.data,
      campsiteId: res.data.id
    })
  },


  // 期数详细
  async getCampsiteSessionDetail(id) {
    let res = await campsiteApi.campsiteSessionDetail({
      id: id
    })
    this.setData({
      scheduleList: res.data.ticketTypes,
      sessionId: res.data.id,
    })
  },



  // 档期选择
  onSelectSchedule(e) {
    const {
      data,
      index
    } = e.currentTarget.dataset;
    this.getCampsiteSessionDetail(data.id)
    this.setData({
      scheduleIndex: index,
      ticketTierIndex: ""
    })
  },

  // 票档选择
  onticketTier(e) {
    const {
      data,
      index
    } = e.currentTarget.dataset;
    this.setData({
      ticketTierIndex: index,
      ticketId: data.id,
      select: true,
    })
  },

  onChange(event) {
    const newValue = event.detail;
    let a = 3288;
    let b = 3888;
    this.setData({
      discountedPrice: a * newValue,
      originalPrice: b * newValue,
      inputValue: newValue,
    })
  },

  determine() {
    if (this.data.select) {
      wx.navigateTo({
        url: `/subpackages/registrationInfor/registrationInfor?campsiteId=${this.data.campsiteId}&sessionId=${this.data.sessionId}&ticketId=${this.data.ticketId}&inputValue=${this.data.inputValue}`,
      })
    } else {
      wx.showToast({
        title: '未选择票档',
        icon: 'error',
        duration: 2000
      })
    }

  }
})