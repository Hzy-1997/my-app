// subpackages/sightseeingBus/sightseeingBus.js

import {
  scenicBusApi
} from "../../api/index"

import Toast from '@vant/weapp/toast/toast';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    background: ['demo-text-1', 'demo-text-2', 'demo-text-3'],
    indicatorDots: true,
    vertical: false,
    autoplay: false,
    interval: 2000,
    duration: 500,
    scenicBusList: [],
    page: 1,
    pageSize: 10,
    active: 0,
    hint: true,
    show: false,
    buyShow: false,
    quantity: 1,
    ticketDetails: "",
    unitPrice: "",
    totalPrice: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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
    this.getscenicBusList()
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

  // 切换种类
  onChangeType(e) { // 注意：原代码这里叫 onChange 会和下面输入框的 onChange 重名冲突，建议改成 onChangeType (记得同步改 wxml 的 bind:change)
    let {
      index,
      title
    } = e.detail
    this.setData({
      active: index
    })
    this.getscenicBusList()
  },

  async getscenicBusList() {

    Toast.loading({
      message: '加载中...',
      forbidClick: true,
    });
    let data = {
      page: this.data.page,
      pageSize: this.data.pageSize,
      ticketType: this.data.active + 1
    }
    let res = await scenicBusApi.scenicBusList(data)
    console.log(res)
    if (res.code == 200) {

      const list = res.data.scenicBusList || [];

      const now = new Date();

      const filtered = list
        .filter(item => {
          // 当前日期大于 endDate 的剔除
          const endDate = new Date(item.endDate + ' 23:59:59');
          return now <= endDate;
        })
        .map(item => {
          // 解析 timeSlot 的结束时间，如 "08:00-17:00" -> "17:00"
          let cannot = false;
          if (item.timeSlot) {
            const parts = item.timeSlot.split('-');
            const endTime = parts[1] ? parts[1].trim() : '';
            if (endTime) {
              const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
              const slotEnd = new Date(`${today} ${endTime}:00`);
              cannot = now > slotEnd;
            }
          }
          return {
            ...item,
            cannot
          };
        });
      console.log(filtered)
      this.setData({
        scenicBusList: filtered,
        hint: filtered.length > 0
      });


    } else {
      Toast.fail('系统出错了...');
    }

    Toast.clear()
  },

  // 获取单个详情
  async onBuy(parameter) {
    let {
      cannot,
      item
    } = parameter.currentTarget.dataset

    if (cannot) {
      Toast('当前车票不可购买');
      return;
    }

    // 可选：加个 loading 防止用户狂点
    // Toast.loading({ message: '加载中...', forbidClick: true });

    let res = await scenicBusApi.scenicBusDetail({
      id: item.id
    })
    console.log(res.data)

    if (res.code === 200 && res.data) {
      this.setData({
        show: true,
        ticketDetails: res.data,
        unitPrice: res.data.price,
        // 初始化时保留两位小数
        totalPrice: Number(res.data.price),
        quantity: 1 // 每次打开弹窗，数量重置为1
      });
    } else {
      Toast('当前车票不可购买');
    }
  },

  onClose() {
    this.setData({
      show: false,
      buyShow: false
    });
  },


  agree() {
    this.setData({
      show: false,
      buyShow: true
    });
  },

  // 点击减号
  btnMinus() {
    if (this.data.quantity <= 1) {
      Toast('最少购买1张');
      return;
    }
    let newQuantity = this.data.quantity - 1;
    this.setData({
      quantity: newQuantity,
      // 重点：用最新算出的 newQuantity 来乘，且保留两位小数
      totalPrice: (this.data.unitPrice * newQuantity)
    })
  },

  // 点击加号
  btnPlus() {
    if (this.data.quantity >= 50) {
      Toast('最多购买50张');
      return;
    }
    let newQuantity = this.data.quantity + 1;
    this.setData({
      quantity: newQuantity,
      // 重点：用最新算出的 newQuantity 来乘，且保留两位小数
      totalPrice: (this.data.unitPrice * newQuantity)
    })
  },

  // 手动输入
  onChange(e) {
    let value = Number(e.detail.value);

    if (isNaN(value)) {
      return;
    }

    let finalQuantity = value;

    if (value < 1) {
      finalQuantity = 1;
      Toast('最少购买1张');
    } else if (value > 50) {
      finalQuantity = 50;
      Toast('最多购买50张');
    }

    this.setData({
      quantity: finalQuantity,
      // 重点：同步更新总价
      totalPrice: (this.data.unitPrice * finalQuantity)
    });
  }

})