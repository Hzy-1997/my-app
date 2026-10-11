// subpackages/strategy/strategy.js
const app = getApp()
import {
  serviceApi
} from "../../api/index"

import Toast from '@vant/weapp/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    images: [],
    columns: [
      [],
      []
    ], // 两列
    num: 0,
    size: 20,
    gImgUrl: app.globalData.gImgUrl,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.strategyList()
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


  // 获取攻略信息
  async strategyList() {
    Toast.loading({
      message: '加载中...',
      forbidClick: true,
    });

    const {
      images,
      columns
    } = this.data;

    let res1 = await serviceApi.strategyListApi()

    console.log(res1.data.rows)
    let res = images.splice(this.data.num, this.data.size)

    this.setData({
      images: res1.data.rows
    })
    this.distributeImages(this.data.images)
    Toast.clear()
  },
  // 分配图片到列
  async distributeImages(row) {
    const imagesWithHeight = await Promise.all(
      row.map(async (item) => {
        try {
          const height = await this.get_img_height(item.cover)
          return {
            ...item,
            height: height
          }
        } catch (error) {
          console.error('获取图片高度失败:', error)
          return {
            ...item,
            height: 200 // 默认高度
          }
        }
      })
    )
    console.log('获取高度后的数据:', imagesWithHeight)
    const newColumns = [
      [],
      []
    ]
    const columnHeights = [0, 0]

    imagesWithHeight.forEach(item => {
      console.log(columnHeights)
      const columnIndex = columnHeights[0] <= columnHeights[1] ? 0 : 1
      console.log(columnIndex)
      newColumns[columnIndex].push(item)
      columnHeights[columnIndex] += parseFloat(item.height || 200)
    })
    this.setData({
      columns: newColumns
    })
  },

  // 图片加载完成时获取高度
  onImageLoad(e) {
    setTimeout(() => {
      const query = wx.createSelectorQuery();
      query.select(`#left`).boundingClientRect();
      query.select(`#right`).boundingClientRect();
      query.exec((res) => {
        if (res[0]) {
          this.setData({
            leftHeight: res[0].height,
            rightHeight: res[1].height
          });
        }
      });
    }, 20);
  },

  // 获取图片高度
  get_img_height(url) {
    return new Promise(ress => {
      wx.getImageInfo({
        src: this.data.gImgUrl + url,
        success(res) {
          ress(res.height)
          return res.height
        }
      })
    })
  },

  //攻略详情查看
  goDetails(row) {
    console.log(row)
    let {
      id
    } = row.currentTarget.dataset
    wx.navigateTo({
      url: `/subpackages/guideDetails/guideDetails?id=${id}`,
    })
  },

  // 添加触底加载更多
  onReachBottom() {
    console.log('触底，可以加载更多数据')
  }
})