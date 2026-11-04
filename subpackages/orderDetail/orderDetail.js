Page({
  data: {
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
  getDetail(id) {
    wx.showLoading({ title: '加载中' })
    setTimeout(() => {
      const mock = [
        {
          id: 1,
          orderNo: "OD202611040001",
          goodsName: "光雾山单人年卡",
          cover: "https://picsum.photos/id/237/400/400",
          amount: 198,
          status: 1,
          createTime: "2026-11-04 09:10",
          payTime: "",
          payWay: "",
          verifyCode: "",
          validDate: "",
          refundTime: "",
          refundReason: ""
        },
        {
          id: 2,
          orderNo: "OD202611040002",
          goodsName: "光雾山双人年卡",
          cover: "https://picsum.photos/id/239/400/400",
          amount: 368,
          status: 2,
          createTime: "2026-11-04 09:10",
          payTime: "2026-11-04 09:11",
          payWay: "微信支付",
          verifyCode: "GW2026110488721",
          validDate: "2026-11-04 ~ 2027-11-03",
          refundTime: "",
          refundReason: ""
        },
        {
          id: 3,
          orderNo: "OD202611040003",
          goodsName: "光雾山家庭年卡",
          cover: "https://picsum.photos/id/240/400/400",
          amount: 520,
          status: 3,
          createTime: "2026-11-04 09:10",
          payTime: "2026-11-04 09:11",
          payWay: "微信支付",
          verifyCode: "GW2026110466192",
          validDate: "2026-11-04 ~ 2027-11-03",
          refundTime: "",
          refundReason: ""
        },
        {
          id: 4,
          orderNo: "OD202611040004",
          goodsName: "光雾山单人年卡",
          cover: "https://picsum.photos/id/241/400/400",
          amount: 198,
          status: 4,
          createTime: "2026-11-04 09:10",
          payTime: "2026-11-04 09:11",
          payWay: "微信支付",
          verifyCode: "",
          validDate: "",
          refundTime: "2026-11-05 10:20",
          refundReason: "行程变更"
        },
        {
          id: 5,
          orderNo: "OD202611040005",
          goodsName: "光雾山单人年卡",
          cover: "https://picsum.photos/id/242/400/400",
          amount: 198,
          status: 5,
          createTime: "2026-11-04 09:10",
          payTime: "",
          payWay: "",
          verifyCode: "",
          validDate: "",
          refundTime: "",
          refundReason: ""
        }
      ]
      const item = mock.find(i => i.id === id)
      if (item) {
        item.statusText = this.data.statusMap[item.status]
        this.setData({ detail: item })
      }
      wx.hideLoading()
    }, 300)
  },
  goPay() {
    wx.showToast({ title: "跳转支付", icon: "none" })
  },
  cancelOrder() {
    wx.showModal({
      title: "提示",
      content: "确定取消订单？",
      success: res => {
        if (res.confirm) {
          wx.showToast({ title: "已取消", icon: "success" })
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
          wx.showToast({ title: "退款申请已提交", icon: "success" })
        }
      }
    })
  },
  backList() {
    wx.navigateBack()
  }
})
