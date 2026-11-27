// subpackages/performanceList/performanceList.js

import {
  performanceApi,
} from "../../api/index"

Page({
  data: {
    performanceList: [],
    type: 1,
    category: 1,
    timelineData: [],
    programTime: [],
    page: 1,
    pageSize: 10,

    hasMore: true, // 是否还有更多数据
    isLoading: false, // 是否正在加载中，防止重复请求
  },

  onLoad(options) {
    this.setData({
      type: options.type || 1
    })
    this.getPerformanceList()
  },

  // 页面上拉触底事件
  onReachBottom(e) {
    // 如果没有更多数据，或者正在加载中，直接拦截
    if (!this.data.hasMore || this.data.isLoading) return;

    this.setData({
      page: this.data.page + 1
    })
    this.getPerformanceList()
  },

  // 获取演出列表
  async getPerformanceList() {

    if (this.data.isLoading) return;
    this.setData({
      isLoading: true
    })
    wx.showLoading({
      title: '加载中',
      mask: true
    })

    try {
      const res = await performanceApi.strategyListApi({
        page: this.data.page,
        pageSize: this.data.category == 1 ? this.data.pageSize : 999,
        performanceTypes: this.data.type
      })

      const rows = res.data.rows || []

      // 1. 判断是否还有更多数据
      // 如果当前返回的数据量少于请求的 pageSize，说明到底了
      const currentPageSize = this.data.category == 1 ? this.data.pageSize : 999;
      if (rows.length < currentPageSize) {
        this.setData({
          hasMore: false
        })
      }

      // 2. 处理节目列表
      const newPerformanceList = this.buildPerformanceList(rows)

      // 3. 合并总列表 (修复重点)
      const totalList = [...this.data.performanceList, ...newPerformanceList]

      // 4. 基于总列表生成时间轴 (修复重点)
      const timelineData = this.buildTimelineData(totalList)

      console.log(totalList)

      this.setData({
        performanceList: totalList,
        timelineData,
      })

    } catch (error) {
      // 如果报错，把页码退回去
      this.setData({
        page: this.data.page > 1 ? this.data.page - 1 : 1
      })
      wx.showToast({
        title: '系统错误',
        icon: 'error',
        duration: 2000
      })
    } finally {
      wx.hideLoading()
      this.setData({
        isLoading: false
      })
    }
  },

  // 按节目展示的数据处理
  buildPerformanceList(rows) {
    const now = new Date()
    const currentTimeStr = this.formatTime(now)
    let day = now.getDay()
    day = day === 0 ? 7 : day

    const list = rows.map(row => {
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
      const validTimes = currentShowTimes.filter(time => {
        return this.timeToMinutes(time) > this.timeToMinutes(currentTimeStr)
      })
      return {
        ...row,
        csThere: validTimes.length > 0,
        nextShowTime: validTimes.length > 0 ? validTimes[0] : '',
        programTime: currentShowTimes
      }
    })

    list.sort((a, b) => {
      if (a.csThere === b.csThere) return 0
      return a.csThere ? -1 : 1
    })

    return list
  },

  // 按时间展示的数据处理
  buildTimelineData(rows) {
    const now = new Date()
    const currentTimeStr = this.formatTime(now)
    const currentTimeMinutes = this.timeToMinutes(currentTimeStr)

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

    // 按时间排序
    scheduleList.sort((a, b) => {
      if (a.time < b.time) return -1
      if (a.time > b.time) return 1
      return a.performance.id - b.performance.id
    })

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
        // 判断是否已过时间
        isPast: this.timeToMinutes(item.time) < currentTimeMinutes
      })
    })

    return timelineData
  },


  // 格式化时间为 HH:mm
  formatTime(date) {
    const h = date.getHours().toString().padStart(2, '0')
    const m = date.getMinutes().toString().padStart(2, '0')
    return `${h}:${m}`
  },

  // 将时间字符串 HH:mm 转为分钟数（用于精准比较）
  timeToMinutes(timeStr) {
    if (!timeStr) return 0;
    const [h, m] = timeStr.split(':');
    return parseInt(h, 10) * 60 + parseInt(m, 10);
  },


  // 底部按钮点击事件
  goDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/subpackages/performanceDetails/performanceDetails?id=${id}`
    })
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
      category: id == 1 ? 1 : 2,
      page: 1,
      hasMore: true,
      performanceList: [],
      timelineData: [],
      programTime: [],
    })

    this.getPerformanceList()
  }
})