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
    show: false,
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
    this.performanceDetail()
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

      // 处理时间（后端返回 "YYYY-MM-DD HH:mm:ss" 北京时间字符串，直接截取时分）
      if (res.data.reminders && res.data.reminders.length > 0) {
        res.data.reminders.forEach((item) => {
          item.isAppointment = Number(item.isAppointment); // 统一成数字
          item.time1 = item.projectStartTime;
          item.time2 = item.projectStartTime.substring(11, 16);
        });
      }

      // 是否有预约
      if (res.data.schedules && res.data.schedules.length > 0) {
        res.data.schedules.forEach((element) => {
          const matched = (res.data.reminders || []).some(
            (item) => item.time2 === element.showTime && Number(item.isAppointment) === 1
          );
          element.isAppointment = matched ? 1 : 2;
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
    const showTime = e.currentTarget.dataset.date;

    // ✅ 已预约的场次不允许再操作
    const current = (this.data.program.schedules || []).find(
      (item) => item.showTime === showTime
    );
    if (current && current.isAppointment === 1) {
      wx.showToast({
        title: '该场次已预约，请勿重复预约',
        icon: 'none'
      });
      return;
    }

    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const currentTime = `${pad(now.getHours())}:${pad(now.getMinutes())}`;

    if (currentTime >= showTime) {
      wx.showToast({
        title: '该场次已开始或已结束',
        icon: 'none'
      });
      return;
    }

    this.setData({
      show: true,
      time: showTime
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

    const TMPL_ID = 'yMeLNPKJYKIT3klh_KbyaiX7G2xIGeHBQsiKBnogXsc';



    // 先让用户授权
    wx.requestSubscribeMessage({
      tmplIds: [TMPL_ID],
      success: async (res) => {
        console.log('订阅结果:', res);

        // 关键：判断用户是否真的同意
        if (res[TMPL_ID] !== 'accept') {
          wx.showToast({
            title: '需要开启提醒才能预约',
            icon: 'none'
          });
          return;
        }

        // 用户同意后，再创建提醒
        let data = {
          projectId: this.data.program.id,
          projectStartTime: `${dateStr} ${time}:00`, // 项目开始时间
          reminderTime: t1, //提醒时间 
          reminderType: '开演提醒',
          reminderTimeType: selectedMinutes,
          reminderContent: `预约场次将于${time}开始，请提前准备`
        };
        console.log("预约提醒参数", data)
        try {
          let res2 = await performanceApi.reminder(data);
          console.log('提醒创建结果:', res2);

          // ✅ 前端假更新：把当前场次标记为已预约
          const schedules = this.data.program.schedules.map((item) => {
            if (item.showTime === time) {
              return {
                ...item,
                isAppointment: 1
              };
            }
            return item;
          });

          this.setData({
            'program.schedules': schedules,
            show: false, // 关闭弹窗
            time: '',
          });

          wx.showToast({
            title: '预约成功',
            icon: 'success'
          });

          // this.onClose(); // 用上面 setData 关弹窗即可，onClose 也行
        } catch (err) {
          console.error('提醒创建失败:', err);
          wx.showToast({
            title: '提醒创建失败',
            icon: 'none'
          });
        }
      },
      fail: (err) => {
        console.error('订阅调用失败:', err);
        wx.showToast({
          title: '订阅失败',
          icon: 'none'
        });
      }
    });
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
    dateObj.setMinutes(dateObj.getMinutes() - minutes);

    const pad = (n) => String(n).padStart(2, '0');
    return `${dateObj.getFullYear()}-${pad(dateObj.getMonth() + 1)}-${pad(dateObj.getDate())} ${pad(dateObj.getHours())}:${pad(dateObj.getMinutes())}:00`;
  }

})