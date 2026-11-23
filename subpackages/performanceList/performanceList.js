// subpackages/performanceList/performanceList.js

import {
  performanceApi,
} from "../../api/index"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    performanceList: [],
    type: 1,
    category: 2,
    timelineData: [{
        id: 1,
        startTime: '10:30',
        title: '红庙学校',
        timeRange: '10:20~10:48',
        capacity: 180,
        cover: 'https://via.placeholder.com/140', // 换成你的真实图片
        notice: '较难排队 谢绝学龄前儿童观看'
      },
      {
        id: 2,
        startTime: '10:40',
        title: '薛怀义',
        timeRange: '10:30~11:02',
        capacity: 300,
        cover: 'https://via.placeholder.com/140',
        notice: '较难排队 不适合未成年人观看'
      },
      {
        id: 3,
        startTime: '10:50',
        title: '老院子',
        timeRange: '10:40~11:08',
        capacity: 200,
        cover: 'https://via.placeholder.com/140',
        notice: ''
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options)
    this.setData({
      type: options.type
    })
    this.getPerformanceList()
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
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },


  // 获取演出列表
  async getPerformanceList() {
    wx.showLoading({
      title: '加载中',
    })

    try {
      let res = await performanceApi.strategyListApi({
        page: 1,
        pageSize: 10,
        // performanceTypes: this.data.type
        performanceTypes: 1
      })
      this.setData({
        performanceList: res.data.rows
      })
      console.log(res.data.rows)
      wx.hideLoading()

    } catch (error) {
      wx.showToast({
        title: '系统错误',
        icon: 'error',
        duration: 2000
      })
    }
  },
  // 底部按钮点击事件
  goDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.showToast({
      title: '查看详情 ' + id,
      icon: 'none'
    });
  },

  setReminder(e) {
    const id = e.currentTarget.dataset.id;
    wx.showToast({
      title: '设置提醒成功',
      icon: 'success'
    });
  },

  goNavigation(e) {
    const id = e.currentTarget.dataset.id;
    wx.showToast({
      title: '打开地图导航',
      icon: 'none'
    });
  },


  // 展示切换
  displayCategory(e) {
    let {
      id
    } = e.currentTarget.dataset

    this.setData({
      category: id == 1 ? 1 : 2
    })




  }



})