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
    category: 1,
    timelineData: [],
    programTime: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
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
      title: '加载中'
    })

    try {
      const res = await performanceApi.strategyListApi({
        page: 1,
        pageSize: 10,
        performanceTypes: 1
      })

      const rows = res.data.rows || []

      console.log('原始rows', rows)
      console.log('今天getDay()', new Date().getDay())
      console.log('schedules里的weekDay', rows.map(r => (r.schedules || []).map(s => s.weekDay)))

      // 1. 按节目展示用
      const performanceList = this.buildPerformanceList(rows)

      // 2. 按时间展示用
      const timelineData = this.buildTimelineData(performanceList)

      console.log('programTime', performanceList.map(p => ({
        id: p.id,
        programTime: p.programTime
      })))
      console.log('timelineData', timelineData)


      this.setData({
        performanceList,
        timelineData
      })

      wx.hideLoading()
    } catch (error) {
      console.log(error)
      wx.hideLoading()
      wx.showToast({
        title: '系统错误',
        icon: 'error',
        duration: 2000
      })
    }
  },

  // 按节目展示的数据处理
  buildPerformanceList(rows) {
    const now = new Date()
    const currentHour = now.getHours().toString().padStart(2, '0')
    const currentMinute = now.getMinutes().toString().padStart(2, '0')
    const currentTimeStr = `${currentHour}:${currentMinute}`
    const day = now.getDay()

    return rows.map(row => {
      const currentShowTimes = []

      if (row.schedules && row.schedules.length > 0) {
        row.schedules.forEach(schedule => {
          if (schedule.weekDay == day) {
            if (!currentShowTimes.includes(schedule.showTime)) {
              currentShowTimes.push(schedule.showTime)
            }
          }
        })
      }

      currentShowTimes.sort()

      const validTimes = currentShowTimes.filter(time => time > currentTimeStr)

      return {
        ...row,
        csThere: validTimes.length > 0,
        nextShowTime: validTimes.length > 0 ? validTimes[0] : '',
        programTime: currentShowTimes
      }
    })
  },

  // 按时间展示的数据处理
  buildTimelineData(rows) {
    const now = new Date()
    const currentHour = now.getHours().toString().padStart(2, '0')
    const currentMinute = now.getMinutes().toString().padStart(2, '0')
    const currentTimeStr = `${currentHour}:${currentMinute}`

    // 1. 先拍平成「场次」
    const scheduleList = []

    rows.forEach(row => {
      const times = row.programTime || []

      times.forEach((time, index) => {
        scheduleList.push({
          time,
          performance: row,
          scheduleIndex: index
        })
      })
    })

    // 2. 全部展示，已开始的场次标记 isPast
    // 3. 按时间排序
    scheduleList.sort((a, b) => {
      if (a.time < b.time) return -1
      if (a.time > b.time) return 1
      return a.performance.id - b.performance.id
    })

    // 4. 按时间分组
    const timelineData = []

    scheduleList.forEach(item => {
      let group = timelineData.find(g => g.time === item.time)

      if (!group) {
        group = {
          time: item.time,
          list: []
        }
        timelineData.push(group)
      }

      group.list.push({
        ...item.performance,
        showTime: item.time,
        scheduleIndex: item.scheduleIndex,
        isPast: item.time < currentTimeStr
      })
    })

    return timelineData
  },


  // 底部按钮点击事件
  goDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.showToast({
      title: '查看详情 ' + id,
      icon: 'none'
    });
    wx.navigateTo({
      url: `/subpackages/performanceDetails/performanceDetails?id=${id}`
    })
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