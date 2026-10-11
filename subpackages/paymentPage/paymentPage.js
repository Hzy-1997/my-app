// subpackages/paymentPage/paymentPage.js

import dayjs from 'dayjs';
import Toast from '@vant/weapp/toast/toast';

import {
  parkingApi
} from "../../api/index"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: "",
    parkingId: "",
    startTime: "",
    endTime: "",
    baseEndTime: "", // 记录基础结束时间
    inputValue: 1,
    phone: "",
    carNumber: "",
    idCard: "",
    checked: false,
    price: "",
    unitPrice: "",
    show: false,
    inputValue: 1,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options)
    this.setData({
      id: options.id,
      parkingId: options.parkingId,
      startTime: options.startTime,
      endTime: options.endTime,
      baseEndTime: options.startTime,
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
    this.getProductInformation()
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


  // 获取商品信息
  async getProductInformation() {
    Toast.loading({
      message: '加载中...',
      forbidClick: true,
    });
    let res = await parkingApi.getParkingDetail({
      id: this.data.parkingId
    })

    this.setData({
      price: res.data.price,
      unitPrice: res.data.price,
    })

    Toast.clear()
  },



  // 预约数量
  onChange(event) {
    const newValue = event.detail;

    const newEndTime = dayjs(this.data.baseEndTime)
      .add(newValue, 'hour')
      .format('YYYY-MM-DD HH:mm:ss');

    // 用固定单价计算
    const settlementPrice = this.data.unitPrice * newValue;

    this.setData({
      endTime: newEndTime,
      price: settlementPrice,
      inputValue: newValue
    });

  },

  // 用户协议
  onChangeRadio(event) {
    console.log(event.detail)
    this.setData({
      checked: event.detail,
    });
  },


  // 提交
  goSubmit() {
    if (!this.data.checked) {
      Toast('请先阅读并勾选底部协议');
      return;
    }

    wx.showModal({
      title: `提示`,
      content: `当前产品购买即是核销，请谨慎下单`,
      success(res) {
        if (res.confirm) {

          console.log('用户点击确定')
        } else if (res.cancel) {

          console.log('用户点击取消')
        }
      }
    })
  },


  showPopup() {
    this.setData({
      show: true
    });
  },

  onClose() {
    this.setData({
      show: false
    });
  },
})