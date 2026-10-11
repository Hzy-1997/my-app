const app = getApp()

import {
  ComboApi,
} from "../../api/index"

import Toast from '@vant/weapp/toast/toast';


Page({

  /**
   * 页面的初始数据
   */
  data: {
    idL: "",
    gImgUrl: app.globalData.gImgUrl,
    showPackage: false,
    currentIndex: 0,
    hotelList: [],
    iteminfo: {},
    dataInfo: {},
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
    this.getItemInfo()
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


  // 获取信息

  async getItemInfo() {
    Toast.loading({
      message: '加载中...',
      forbidClick: true,
    });

    let res = await ComboApi.getPrimaryComboInfo({
      id: this.data.id
    })
    console.log("获取数据", res)

    if (res.code != 200) {
      wx.showToast({
        title: "系统出现错误",
        icon: 'error',
        duration: 2000
      })
    }

    let data = {};
    if (res.data.list[0].items.length > 0) {
      data = res.data.list[0].items.reduce((min, item) => {
        return parseFloat(item.originalPrice) < parseFloat(min.originalPrice) ? item : min;
      });
    }

    res.data.list[0].includes = res.data.list[0].includes
      .split(";")
      .filter(it => it !== "")
      .map((it) => it.split(","))




    this.setData({
      iteminfo: res.data.list[0],
      dataInfo: data,
      hotelList: res.data.list[0].items
    })

    console.log(data)
    console.log(this.data.iteminfo)
    console.log(this.data.hotelList)
  },



  toggleCard(e) {
    const index = e.currentTarget.dataset.index;
    const hotelList = this.data.hotelList;

    // 如果点击的是同一个卡片，就切换状态
    if (this.data.currentIndex === index) {
      hotelList[index].showPackage = !hotelList[index].showPackage;
      this.setData({
        hotelList: hotelList,
        currentIndex: hotelList[index].showPackage ? index : -1
      });
    } else {
      // 收起所有卡片
      hotelList.forEach((item, i) => {
        item.showPackage = (i === index);
      });
      this.setData({
        hotelList: hotelList,
        currentIndex: index
      });
    }
  },


  // 跳转酒店详细
  goHotelInfo(e) {
    let {
      id
    } = e.currentTarget.dataset

    wx.navigateTo({
      url: `/subpackages/hotelDetails/hotelDetails?id=${id}`
    })
  },

})