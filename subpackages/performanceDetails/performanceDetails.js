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
    navTitle: "演绎详情",
    show: true,
    time: "",
    reminderArray: [10, 30, 40, 60],
    selectedIndex: 0,
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

      let day = new Date().getDay()
      const currentShowTimes = []
      if (res.data.schedules.length > 0) {
        res.data.schedules.map((item) => {
          if (item.weekDay == day) {
            currentShowTimes.push(item)
          }
        })
      }



      res.data.schedules = currentShowTimes.sort()

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

  // goReserve() {
  //   const {
  //     id,
  //     title
  //   } = this.data.program;
  //   wx.navigateTo({
  //     url: `/pages/reserve/index?id=${id}&title=${encodeURIComponent(title || '')}`
  //   });
  // },


  showPopup(e) {
    console.log(e)
    this.setData({
      show: true,
      time: e.currentTarget.dataset.date
    });
  },

  onClose() {
    this.setData({
      show: false
    });
  },

  // 提醒间隔选择
  remindTime() {

  },

  // 点击选择提醒时间
  handleSelectTime(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      selectedIndex: index
    });
  },

  // 开演提醒
  async startReminding() {
    const {
      reminderArray,
      selectedIndex,
      time
    } = this.data;

    const selectedMinutes = Number(reminderArray[selectedIndex]);
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const dateStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
    const t1 = this.addMinutesToTime(dateStr, time, selectedMinutes);

    let data = {
      projectId: this.data.program.id,
      projectStartTime: `${dateStr} ${time}:00`,
      reminderTime: t1,
      reminderType: '开演提醒',
      reminderTimeType: selectedMinutes,
      reminderContent: `您预约的场次将于 ${dateStr} ${time}:00 开始，请提前做好准备。`
    }

    console.log('计算后的提醒时间:', data);

    let res = await performanceApi.reminder(data)

    console.log(res)


    return;
    wx.requestSubscribeMessage({
      tmplIds: ['yMeLNPKJYKIT3klh_KbyaiX7G2xIGeHBQsiKBnogXsc'],
      success(res) {
        console.log(res)
        this.onClose();
      }
    })
  },



  /**
   * 在指定日期时间上加分钟
   * @param {string} dateStr 日期 "2026-11-24"
   * @param {string} timeStr 时间 "09:00"
   * @param {number} minutes 要加的分钟数
   * @returns {string} "YYYY-MM-DD HH:mm:ss"
   */
  addMinutesToTime(dateStr, timeStr, minutes) {
    const baseStr = `${dateStr} ${timeStr}:00`;
    const dateObj = new Date(baseStr.replace(/-/g, '/'));
    dateObj.setMinutes(dateObj.getMinutes() + minutes);

    const pad = (n) => String(n).padStart(2, '0');
    return `${dateObj.getFullYear()}-${pad(dateObj.getMonth() + 1)}-${pad(dateObj.getDate())} ${pad(dateObj.getHours())}:${pad(dateObj.getMinutes())}:00`;
  }



})