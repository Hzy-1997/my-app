// subpackages/theater/theater.js

import {
  ticketingApi
} from "../../api/index"
import Toast from '@vant/weapp/toast/toast';
Page({

  /**
   * 页面的初始数据
   */

  data: {
    show: false,
    sidebarItems: ['推荐', '山地项目优惠', '年卡', '优惠票'],
    selectedIndex: 0,
    minDate: new Date().getTime(),
    maxDate: new Date(2026, 0, 24).getTime(), // 1月是0
    formatter: null,
    ticketingList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      formatter: this.formatter.bind(this)
    });
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
    this.getticketingList()
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

  // 选择侧边栏项目
  selectItem: async function (e) {
    this.setData({
      selectedIndex: e.currentTarget.dataset.index
    });
    this.getticketingList()
  },

  purchase(row) {
    let {
      index
    } = row.currentTarget.dataset;
    console.log(123)
    wx.navigateTo({
      url: `/subpackages/ticketOrder/ticketOrder?id=${index}`,
    });
  },


  // 获取票务列表
  async getticketingList() {
    Toast.loading({
      message: '加载中...',
      forbidClick: true,
    });
    this.setData({
      ticketingList: []
    })

    let res = await ticketingApi.ticketingListApi({
      category: this.data.selectedIndex
    })
    console.log("票务", res)
    if (res.code == 200) {


      res.data.forEach((item) => {
        item.banners = item.banners.split(',')
        item.typeDescription = item.typeDescription.split(",")
      })

      this.setData({
        ticketingList: res.data
      })
      console.log("票务列表", this.data.ticketingList)
    } else {
      Toast.fail('系统出错了');
    }
    Toast.clear()

  },

  formatter(day) {
    // 获取 minDate 和 maxDate 的时间戳
    const minDate = this.data.minDate;
    const maxDate = this.data.maxDate;

    // 将 day.date 转换为 Date 对象
    const dayDate = new Date(day.date);

    // 只比较年月日，忽略时间部分
    const currentDate = new Date(
      dayDate.getFullYear(),
      dayDate.getMonth(),
      dayDate.getDate()
    ).getTime();

    // 同样处理 minDate，只取年月日
    const minDateOnly = new Date(minDate);
    const minDateYearMonthDay = new Date(
      minDateOnly.getFullYear(),
      minDateOnly.getMonth(),
      minDateOnly.getDate()
    ).getTime();

    // 同样处理 maxDate，只取年月日
    const maxDateOnly = new Date(maxDate);
    const maxDateYearMonthDay = new Date(
      maxDateOnly.getFullYear(),
      maxDateOnly.getMonth(),
      maxDateOnly.getDate()
    ).getTime();

    // 初始化 bottomInfo
    day.bottomInfo = '';

    // 使用只比较年月日的时间戳
    if (currentDate >= minDateYearMonthDay && currentDate <= maxDateYearMonthDay) {
      // 只有在指定的日期范围内才赋值价格
      day.bottomInfo = '199';

      // 设置入住和离店信息
      if (day.type === 'start') {
        day.topInfo = '入住';
      } else if (day.type === 'end') {
        day.topInfo = '离店';
      }
    }

    // 返回修改后的 day 对象
    return day;
  }
})