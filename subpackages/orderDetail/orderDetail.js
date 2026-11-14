const app = getApp()

import QR from 'wx-base64-qrcode'


import {
  statusMap,
  typeMap,
  tipsCard,
} from "./data"


import {
  ticketingApi,
  hotelApi,
  ComboApi,
  parkingApi,
  campsiteApi,
  scenicBusApi
} from "../../api/index"



Page({
  data: {
    gImgUrl: app.globalData.gImgUrl,
    imageSrc: '',
    statusMap,
    typeMap,
    tipsCard,
    detail: null,
    type: 0
  },

  onLoad(options) {
    const idOn = options.idOn
    const type = Number(options.type)
    console.log(idOn)
    this.setData({
      type: type
    })
    this.getDetail(idOn)
  },

  async getDetail(idOn) {
    wx.showLoading({
      title: '加载中'
    })

    let res = {}

    console.log(this.data.type)
    console.log(idOn)

    switch (Number(this.data.type)) {
      case 1:
        /* 票务订单 */
        res = await ticketingApi.ticketOrderDetail({
          orderNumber: idOn
        })
        break;
      case 2:
        /* 酒店订单 */
        res = await hotelApi.hotelOrderDetail({
          orderNumber: idOn
        })
        break;
      case 3:
        /* 套餐订单 */
        res = await ComboApi.getComboOrderInfo({
          orderNumber: idOn
        })
        break;
      case 4:
        /* 营地订单 */
        res = await campsiteApi.getCampOrderInfo({
          orderNumber: idOn
        })
        break;
      case 5:
        /* 活动订单 */
        break;
      case 6:
        /* 班车订单 */
        res = await scenicBusApi.getScenicBusOrderInfo({
          orderNumber: idOn
        })
        break;
      case 7:
        /* 停车订单 */
        res = await parkingApi.getParkingOrderInfo({
          orderNumber: idOn
        })
        break;
      case 8:
        /* 票务订单 */
        break;
      default:
        /* 其他 */
    }


    console.log(res)

    if (res.code == 200) {
      let data = Array.isArray(res.data) ? res.data[0] : res.data
      data.statusText = this.data.statusMap[data.payStatus]

      let base64Data = ""
      const size = 100; //宽高
      if (data.verificationCode) {
        base64Data = QR.createQrCodeImg(data.verificationCode, size)
      } else if (data.transactionNumber) {
        base64Data = QR.createQrCodeImg(data.transactionNumber, size)
      }

      if (data.items) {
        data.items.map((it) => {
          it.qrImg = QR.createQrCodeImg(it.verifyCode, size)
        })
      }


      console.log("数据", data)


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