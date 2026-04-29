// subpackages/bookRoom/bookRoom.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: "",
    roomsNumber: 1,
    pricePerRoom: 0,
    discountedPrice: 0,
    userInfor: {
      username: "",
      phone: "",
      idCard: ""
    },

    userInformation: [{
        username: "何昭宇1",
        phone: "789456123",
        idCard: "123456789"
      },
      {
        username: "何昭宇2",
        phone: "789456123",
        idCard: "123456789"
      },
      {
        username: "新增",
        phone: "789456123",
        idCard: "123456789"
      }
    ],
    activeIndex: 0, // -1 表示没有高亮项
    nameNotFilled: "",
    phoneNotFilled: "",
    show: false,
    noticeShow: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const data = JSON.parse(decodeURIComponent(options.id))
    console.log(data)
    data.includes = data.includes.split(",")
    this.setData({
      content: data,
      pricePerRoom: data.totalPrice,
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


  onChange(event) {
    console.log(event.detail)

    this.setData({
      roomsNumber: event.detail,
      pricePerRoom: this.data.content.totalPrice * event.detail
    })
  },


  // 增加出行人
  increaseUsers(data) {
    console.log(data)
    const {
      index,
      item
    } = data.currentTarget.dataset

    this.setData({
      activeIndex: this.data.activeIndex === index ? 0 : index,
      userInfor: {
        ...this.data.userInfor,
        username: item.username,
        phone: item.phone
      },
    })
  },



  // 信息验证
  contentName(event) {
    const {
      value,
      cursor
    } = event.detail
    if (cursor == 0 && cursor == "") {
      this.setData({
        nameNotFilled: "此项必填"
      })
    } else {
      this.setData({
        nameNotFilled: ""
      })
    }
  },
  // 信息验证
  contentPhone(event) {
    const {
      value,
      cursor
    } = event.detail

    if (cursor == 0 && cursor == "") {
      this.setData({
        phoneNotFilled: "此项必填"
      })
    } else {
      var isPhone = /^1[3-9]\d{9}$/;
      if (!isPhone.test(value)) {
        this.setData({
          phoneNotFilled: "手机号格式错误"
        })
      } else {
        this.setData({
          phoneNotFilled: ""
        })
      }
    }
  },

  // 明细
  details() {
    this.setData({
      show: !this.data.show
    })
  },
  onClose() {
    this.setData({
      show: false,
      noticeShow: false,
    });
  },

  // 须知
  notice() {
    this.setData({
      noticeShow: !this.data.noticeShow
    })
  },

  // 提交
  // userInfor: {
  //   username: "",
  //   phone: "",
  //   idCard: ""
  // },
  submit() {

    if (this.data.userInfor.username || this.data.userInfor.phone || this.data.userInfor.idCard) {
      wx.showLoading({
        title: '提交订单中...',
      });
      const orderData = {
        userName: this.data.userInfor.name,
        userPhone: this.data.userInfor.phone,
        totalAmount: this.data.totalPrice,
        couponId: this.data.coupon?.id,
      };
    }
  },


})