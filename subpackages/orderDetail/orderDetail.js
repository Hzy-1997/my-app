const app = getApp()

import QR from 'wx-base64-qrcode'

import {
  ticketingApi
} from "../../api/index"



Page({
  data: {
    gImgUrl: app.globalData.gImgUrl,
    imageSrc: '',
    statusMap: {
      1: '待支付',
      2: '已支付',
      3: '已完成',
      4: '已退款',
      5: '已取消'
    },
    detail: null
  },
  onLoad(options) {
    const id = Number(options.id)
    this.getDetail(id)
  },

  async getDetail(id) {
    wx.showLoading({
      title: '加载中'
    })

    let res = await ticketingApi.ticketOrderDetail({
      id: id
    })

    console.log(res)

    if (res.code == 200) {
      let data = res.data[0]
      data.statusText = this.data.statusMap[data.payStatus]
      const size = 100; //宽高

      const base64Data = QR.createQrCodeImg('any str code', size) // base64的数据

      this.setData({
        detail: data,
        imageSrc: base64Data
      })
    }
    wx.hideLoading()
  },

  goPay() {
    wx.showToast({
      title: "跳转支付",
      icon: "none"
    })
  },

  cancelOrder() {
    wx.showModal({
      title: "提示",
      content: "确定取消订单？",
      success: res => {
        if (res.confirm) {
          wx.showToast({
            title: "已取消",
            icon: "success"
          })
          this.getDetail(this.data.detail.id)
        }
      }
    })
  },

  applyRefund() {
    wx.showModal({
      title: "申请退款",
      content: "确认提交退款申请？",
      success: res => {
        if (res.confirm) {
          wx.showToast({
            title: "退款申请已提交",
            icon: "success"
          })
        }
      }
    })
  },

  backList() {
    wx.navigateBack()
  }
})