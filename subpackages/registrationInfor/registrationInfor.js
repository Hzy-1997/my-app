// subpackages/registrationInfor/registrationInfor.js
import {
  fields,
} from "./data"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    fields: [],
    participants: [],
    campsiteId: "",
    inputValue: "", //购买数量
    sessionId: "",
    ticketId: "",

    // 选择器状态
    showPicker: false,
    currentOptions: [], // 当前 picker 的选项
    currentIndex: 0, // 当前操作第几个参与者
    currentField: "", // 当前操作哪个字段
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options)

    const {
      campsiteId,
      inputValue,
      sessionId,
      ticketId
    } = options

    const count = Number(inputValue) || 0

    const participants = Array.from({
      length: count
    }, (_, index) => ({
      id: index + 1,
      errors: {}, // 新增：记录每个字段的错误信息
      camperName: "",
      camperGender: "",
      camperAge: "",
      idType: "",
      idCard: "",
      height: "",
      weight: "",
      way: "",
      campCategory: "",
      notice: "",
      dietaryRestrictions: "",
      parentPhone: "",
      parentName: "",
      parentWechat: "",
      parentIdCard: "",
      shippingAddress: "",
    }))

    this.setData({
      participants,
      campsiteId,
      inputValue,
      sessionId,
      ticketId,
      fields: fields,
    })

    console.log(this.data.participants)
    console.log(this.data.fields)

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

  // 输入类字段更新（通用）
  onFieldChange(e) {
    const {
      index,
      field
    } = e.currentTarget.dataset
    const value = e.detail.value !== undefined ? e.detail.value : e.detail

    this.setData({
      [`participants[${index}].${field}`]: value,
      [`participants[${index}].errors.${field}`]: "", // 清掉当前字段的错误
    })
  },

  // 2. 点击选择类字段，弹出 picker
  onOpenPicker(e) {
    console.log(123, e)
    const {
      index,
      field,
      options
    } = e.currentTarget.dataset

    this.setData({
      showPicker: true,
      currentOptions: options, // dataset 传过来的数组
      currentIndex: index,
      currentField: field,
    })
  },

  // 3. picker 确认选择
  onPickerConfirm(e) {
    console.log(123)
    const {
      currentIndex,
      currentField
    } = this.data
    const value = e.detail.value

    this.setData({
      [`participants[${currentIndex}].${currentField}`]: value,
      [`participants[${currentIndex}].errors.${currentField}`]: "",
      showPicker: false,
    })
  },

  // 失焦时校验必填
  // onFieldBlur(e) {
  //   const {
  //     index,
  //     field
  //   } = e.currentTarget.dataset

  //   // 从 fields 配置里找到这个字段
  //   const fieldConfig = this.data.fields.find(f => f.key === field)
  //   if (!fieldConfig || !fieldConfig.required) return

  //   const value = this.data.participants[index][field]
  //   const isEmpty = value === undefined || value === null || String(value).trim() === ""

  //   if (isEmpty) {
  //     this.setData({
  //       [`participants[${index}].errors.${field}`]: `请填写${fieldConfig.label}`
  //     })
  //   }
  // },
  onFieldBlur(e) {
    const {
      index,
      field
    } = e.currentTarget.dataset
    this.validateField(index, field)
  },
  // 4. 关闭 picker
  // onClosePicker() {
  //   const {
  //     currentIndex,
  //     currentField
  //   } = this.data

  //   // 校验当前字段
  //   const fieldConfig = this.data.fields.find(f => f.key === currentField)
  //   if (fieldConfig && fieldConfig.required) {
  //     const value = this.data.participants[currentIndex][currentField]
  //     if (value === undefined || value === null || String(value).trim() === "") {
  //       this.setData({
  //         [`participants[${currentIndex}].errors.${currentField}`]: `请选择${fieldConfig.label}`
  //       })
  //     }
  //   }

  //   this.setData({
  //     showPicker: false
  //   })
  // },
  onClosePicker() {
    const {
      currentIndex,
      currentField
    } = this.data
    this.validateField(currentIndex, currentField)
    this.setData({
      showPicker: false
    })
  },

  /**
   * 校验单个字段
   * @param {number} index 参与者下标
   * @param {string} field 字段 key
   * @returns {boolean} 是否通过
   */
  validateField(index, field) {
    const fieldConfig = this.data.fields.find(f => f.key === field)
    if (!fieldConfig || !fieldConfig.required) return true

    const value = this.data.participants[index][field]
    const isEmpty = value === undefined || value === null || String(value).trim() === ""

    if (isEmpty) {
      const action = fieldConfig.type === "picker" ? "请选择" : "请填写"
      this.setData({
        [`participants[${index}].errors.${field}`]: `${action}${fieldConfig.label}`
      })
      return false
    }

    // 通过则清掉错误
    this.setData({
      [`participants[${index}].errors.${field}`]: ""
    })
    return true
  },
})