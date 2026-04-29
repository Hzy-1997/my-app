// subpackages/guideDetails/guideDetails.js

import {
  strategyInfo
} from "../../api/scenicList.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: "",
    html: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options)
    this.getStrategyInfo(options.id)

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

    // 从服务器获取数据
  async getStrategyInfo(id) {
    let res = await strategyInfo({
      id: id
    })
    const processedData = {
      ...res.data,
      time: this.formatTime(res.data.time)
    }
    const rawContent = res.data.content
    this.setData({
      info: processedData,
      html: rawContent
    })


    console.log("详细信息", this.data.info)
  },
  // 格式化时间函数
  formatTime(timeStr) {
    if (!timeStr) return ''

    try {
      // 将字符串转换为 Date 对象
      const date = new Date(timeStr)
      if (isNaN(date.getTime())) {
        const parts = timeStr.split(/[/ :]/)
        if (parts.length >= 6) {
          const [year, month, day, hour, minute, second] = parts
          return `${year}年${parseInt(month)}月${parseInt(day)}日 ${hour}:${minute}:${second}`
        }
        return timeStr
      }
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const day = date.getDate()
      const hour = date.getHours()
      const minute = date.getMinutes().toString().padStart(2, '0')
      const second = date.getSeconds().toString().padStart(2, '0')

      return `${year}年${month}月${day}日 ${hour}:${minute}:${second}`
    } catch (error) {
      console.error('时间格式化错误:', error)
      return timeStr
    }
  },
})