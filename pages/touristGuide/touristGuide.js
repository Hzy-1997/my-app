// pages/touristGuide/touristGuide.js

import Toast from '@vant/weapp/toast/toast';
const app = getApp()

import {
  serviceApi,
} from "../../api/index"


Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: "",
    title: [{
      id: 1,
      title: "运动"
    }, {
      id: 6,
      title: "休闲"
    }, {
      id: 7,
      title: "购物"
    }, {
      id: 8,
      title: "餐饮"
    }],
    gImgUrl: app.globalData.gImgUrl,
    page: 1,
    pageSize: 10,
    dataInfo: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options)
    this.setData({
      type: options.type
    })

    this.data.title.map((item) => {
      if (item.id == options.type) {
        wx.setNavigationBarTitle({
          title: item.title
        })
      }
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
   * 获取详情
   */
  getDataInfo() {

    const type = Number(this.data.type)
    const apiMap = {
      1: serviceApi.getSportsList,
      6: serviceApi.leisureList,
      7: serviceApi.shoppingList,
      8: serviceApi.cateringList
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
    let res = await apiMethod({
      page: this.data.page,
      pageSize: this.data.pageSize
    })
    if (res.code == 200) {
      console.log("数据", res)
      this.setData({
        dataInfo: res.data.list,
      })
    } else {
      Toast.fail('系统出错了...');
    }

    Toast.clear()
  },

  // 获取运动列表展示
  async getSportsList() {
    let res = await serviceApi.getSportsList()
    console.log(res)

  },

  // 详情
  goDetails(data) {
    let {
      id
    } = data.currentTarget.dataset
    console.log("传递的ID", id)
    wx.navigateTo({
      url: `/subpackages/serviceDetailsInfo/serviceDetailsInfo?id=${id}&type=${this.data.type}`
    })
  }
})