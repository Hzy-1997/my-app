const app = getApp()

import {
  serviceApi,
  parkingApi
} from "../../api/index"

import Toast from '@vant/weapp/toast/toast';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    navTitle: '页面标题',
    gImgUrl: app.globalData.gImgUrl,
    id: "",
    dataInfo: "",
    spotList: "",
    availableColor: "",
    html: "",
    type: "",
    show: false,
    startTime: "",
    endTime: "",

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options)
    this.setData({
      id: options.id,
      type: options.type
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
    this.getDataInfo()
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

  /**
   * 页面滚动事件
   */
  onPageScroll(e) {
    // 通知导航栏组件更新透明度和文字颜色
    this.selectComponent('#nav-bar').onScroll(e.scrollTop);
  },

  /**
   * 获取详情
   */
  getDataInfo() {

    const type = Number(this.data.type)
    const apiMap = {
      1: serviceApi.getSportsInfo,
      6: serviceApi.getLeisureInfo,
      7: serviceApi.getCateringInfo,
      8: serviceApi.getShoppingInfo,
      9: parkingApi.getParkingDetail,
    }
    console.log(type)
    const apiMethod = apiMap[type]
    if (apiMethod) {
      this.fetchDetail(apiMethod)
    }
  },

  // 运动详情
  async fetchDetail(apiMethod) {
    Toast.loading({
      message: '加载中...',
      forbidClick: true,
    });

    console.log("参数", {
      id: this.data.id,
      apiMethod: apiMethod
    })

    let data = {
      id: this.data.id
    }
    // console.log("数据", data)

    let res = await apiMethod(data)
    console.log(res)
    if (res.code == 200) {
      // console.log("数据", res)
      this.setData({
        dataInfo: res.data,
        html: res.data.description
      })
    } else {
      Toast.fail('系统出错了...');
    }

    Toast.clear()
  },

  async showPopup() {
    // 往后一小时
    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
    const format = (d) => {
      const pad = (n) => String(n).padStart(2, '0');
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ` +
        `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    };
    const startTime = format(now);
    const endTime = format(oneHourLater);

    this.setData({
      startTime,
      endTime
    })

    let res = await parkingApi.getParkingSpots({
      parkingId: 9,
      startTime,
      endTime
    });

    console.log(res);

    this.setData({
      show: true,
      spotList: res.data.spotList
    });
  },

  onClose() {
    this.setData({
      show: false
    });
  },


  // 选择车位
  Confirm(e) {
    let {
      item
    } = e.currentTarget.dataset

    let htis = this


    wx.showModal({
      title: `编号:${item.spotNumber}`,
      content: `你确定预约当前车位吗？`,
      success(res) {
        if (res.confirm) {
          wx.navigateTo({
            url: `/subpackages/paymentPage/paymentPage?id=${item.id}&parkingId=${item.parkingId}&endTime=${htis.data.endTime}&startTime=${htis.data.startTime}`
          })

        } else if (res.cancel) {

          console.log('用户点击取消')
        }
      }
    })

  }


})