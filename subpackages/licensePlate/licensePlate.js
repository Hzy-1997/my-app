// subpackages/licensePlate/licensePlate.js

import {
  loginApi,
} from "../../api/index"


Page({
  /**
   * 页面的初始数据
   */
  data: {
    car: [ //车牌
      {
        id: 0,
        text: ''
      },
      {
        id: 1,
        text: ''
      },
      {
        id: 2,
        text: ''
      },
      {
        id: 3,
        text: ''
      },
      {
        id: 4,
        text: ''
      },
      {
        id: 5,
        text: ''
      },
      {
        id: 6,
        text: ''
      },
      {
        id: 7,
        text: ''
      },
    ],
    selectIdx: 0,
    keyboardText: '京津沪渝苏浙豫粤川陕冀辽吉皖闽鄂湘鲁晋黑赣贵甘桂琼云青蒙藏宁新港澳台使领警学挂',
    keyboardNumber: '1234567890ABCDEFGHJKLMNPQRSTUVWXYZO使领警学',
    keyboard: "",
    carNumber: '', //最终的车牌号
    cardNo: "",
    showKey: false,
    showLast: true,
    showO: true,
    textEnergy: true,
    id: "",
    cardNo: "",

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      id: options.id,
      cardNo: options.carnumber,
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


  // 点击某一位车牌
  selectCarNum(e) {
    let {
      id
    } = e.currentTarget
    id = Number(id)

    this.changeKeyboard(id)

    this.setData({
      selectIdx: id,
      showKey: true
    })
  },

  // 点击键盘按键
  keyboardTap(e) {
    let {
      index
    } = e.currentTarget.dataset
    index = Number(index)

    let {
      keyboard,
      car,
      selectIdx
    } = this.data
    let key = keyboard[index]

    if (!key || key.disabled) return

    let newCar = car.map(item => ({
      ...item
    }))
    newCar[selectIdx].text = key.char

    let nextIdx = selectIdx
    if (selectIdx < 7) nextIdx = selectIdx + 1

    this.changeKeyboard(nextIdx)

    this.setData({
      car: newCar,
      selectIdx: nextIdx
    })
  },

  changeKeyboard(index) {
    let {
      keyboardText,
      keyboardNumber
    } = this.data
    let baseStr = index === 0 ? keyboardText : keyboardNumber

    // 定义"每位允许的字符"规则
    let allowStr = ''
    if (index === 0) {
      allowStr = keyboardText
    } else if (index === 1) {
      allowStr = 'ABCDEFGHJKLMNPQRSTUVWXYZ'
    } else if (index === 6 || index === 7) {
      allowStr = '1234567890ABCDEFGHJKLMNPQRSTUVWXYZ使领警学'
    } else {
      allowStr = '1234567890ABCDEFGHJKLMNPQRSTUVWXYZ'
    }

    let keyboard = baseStr.split('').map(char => ({
      char,
      disabled: !allowStr.includes(char) //  不可输入的键置灰
    }))

    this.setData({
      keyboard
    })
  },

  // 删除当前位
  deleteTap() {
    let {
      car,
      selectIdx
    } = this.data
    const newCar = car.map(item => ({
      ...item
    }))
    newCar[selectIdx].text = ''
    // 回退一位
    const prevIdx = selectIdx > 0 ? selectIdx - 1 : 0
    newCar[prevIdx].text = newCar[prevIdx].text || ''
    this.changeKeyboard(prevIdx)

    this.setData({
      car: newCar,
      selectIdx: prevIdx
    })
  },

  // 回填车牌号 "苏D0D58V"
  backfill(e) {

    let {
      no
    } = e.currentTarget.dataset

    let data = this.data.car.map((it, index) => {
      return {
        ...it,
        text: no[index],
      };
    })

    console.log(data)
    this.changeKeyboard(no.length)
    this.setData({
      selectIdx: no.length,
      car: data,
      showKey: true
    })

  },


  async submit() {
    this.data.carNumber = this.data.car.map(item => item.text).join('');
    if (this.data.carNumber.length < 7) {
      wx.showToast({
        title: '请输入正确车牌号',
        icon: 'error',
        duration: 2000
      })

      return;
    }
    let res = await loginApi.updateUserInfo({
      id: this.data.id,
      licensePlate: this.data.carNumber
    })

    if (res.code == 200) {
      wx.showToast({
        title: '已经完成车牌登记',
        icon: 'success',
        duration: 2000
      })

      setTimeout(() => {
        wx.navigateBack({
          delta: 1
        });
      }, 1000)
    }

  }




})