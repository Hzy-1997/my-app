import {
  loginApi,
} from "../../api/index"

import {
  cryptoUtil
} from "../../utils/util"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 控制性别选择弹窗
    showGenderModal: false,
    // 临时选中的性别（确认前）
    tempGender: '',
    index: 0,
    index1: 0,
    genderArray: ['男', '女', '未知'],
    documentType: ['身份证', '普通护照(Passport)', '台湾居民来往大陆通行证', '来往港澳通行证'],
    userInformation: {
      avatar: "",
      email: "",
      licensePlate: "",
      memberCardNo: "",
      memberCardType: "",
      nickName: "",
      phone: "",
      region: "",
      userName: "",
      idCardType: "",
      memberLevel: "",
      sex: "",
      id: ""
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 可以从服务器加载用户资料
    console.log('加载可编辑资料');
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getUserInfo()
    // 每次显示时，可以检查数据是否更新
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '编辑个人资料',
      path: '/pages/editInfo/editInfo'
    };
  },


  // 获取用户信息
  async getUserInfo() {
    let res = await loginApi.getUserInfo()

    if (res.code != 200) {
      this.login()
      return
    }
    res.data = JSON.parse(cryptoUtil.decrypt(res.data))

    // res.data.encryptionIdCard = res.data.idCard.replace(/(\d{6})\d{8}(\d{4})/, '$1********$2')
    // res.data.encryptionPhone = res.data.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
    res.data.idCardType = res.data.idCardType - 1
    res.data.sex = res.data.sex - 1
    for (let key in res.data) {
      this.setData({
        [`userInformation.${key}`]: res.data[key]
      });
    }
    console.log(this.data.userInformation)

  },



  /**
   * 保存资料
   */
  saveInfo: function () {
    const {
      name,
      phone,
      nickname,
      gender,
      region,
      idType,
      idNumber,
      email
    } = this.data;

    // 表单验证示例
    if (!name) {
      wx.showToast({
        title: '请输入姓名',
        icon: 'none'
      });
      return;
    }


    wx.showToast({
      title: '保存成功',
      icon: 'success',
      success: () => {
        setTimeout(() => {
          this.goBack();
        }, 1500);
      }
    });
  },

  /**
   * 输入事件处理
   */
  // 名称
  onNameInput: function (e) {
    this.setData({
      userInformation: {
        ...this.data.userInformation,
        userName: e.detail.value
      }
    })
  },
  // 手机号
  onPhoneInput: function (e) {
    console.log(e)
    this.setData({
      userInformation: {
        ...this.data.userInformation,
        phone: e.detail.value
      }
    })
  },
  // 昵称
  onNicknameInput: function (e) {
    this.setData({
      userInformation: {
        ...this.data.userInformation,
        nickName: e.detail.value
      }
    })
  },

  // 地区
  onRegionInput: function (e) {
    this.setData({
      userInformation: {
        ...this.data.userInformation,
        region: e.detail.value
      }
    })
  },

  // 证件类型
  onIdTypeInput: function (e) {
    this.setData({
      userInformation: {
        ...this.data.userInformation,
        region: e.detail.value
      }
    })
  },
  // 身份证
  onIdNumberInput: function (e) {
    this.setData({
      userInformation: {
        ...this.data.userInformation,
        idCard: e.detail.value
      }
    })
  },
  // 邮箱
  onEmailInput: function (e) {
    this.setData({
      userInformation: {
        ...this.data.userInformation,
        email: e.detail.value
      }
    })
  },

  /**
   * 性别选择相关
   */
  showGenderPicker: function () {
    this.setData({
      tempGender: this.data.gender,
      showGenderModal: true
    });
  },

  bindPickerChange(e) {
    this.setData({
      index: e.detail.value,
      userInformation: {
        ...this.data.userInformation,
        sex: Number(e.detail.value)
      }
    })
  },

  binddocumentChange(e) {
    this.setData({
      index1: e.detail.value,
      userInformation: {
        ...this.data.userInformation,
        idCardType: Number(e.detail.value)
      }
    })
  },

  hideGenderPicker: function () {
    this.setData({
      showGenderModal: false
    });
  },

  selectGender: function (e) {
    const gender = e.currentTarget.dataset.gender;
    this.setData({
      tempGender: gender
    });
  },

  confirmGender: function () {
    if (this.data.tempGender) {
      this.setData({
        gender: this.data.tempGender,
        showGenderModal: false
      });
    } else {
      this.hideGenderPicker();
    }
  },

  /**
   * 更换头像
   */
  // changeAvatar: function () {
  //   wx.showActionSheet({
  //     itemList: ['拍照', '从相册选择'],
  //     success: (res) => {
  //       wx.chooseImage({
  //         count: 1,
  //         success: (res) => {
  //           const tempFilePaths = res.tempFilePaths;
  //           // 这里可以上传头像
  //           console.log('选择头像：', tempFilePaths);
  //           wx.showToast({
  //             title: '头像已更新',
  //             icon: 'success'
  //           });
  //         }
  //       });
  //     }
  //   });
  // },

  onChooseAvatar(e) {
    const {
      avatarUrl
    } = e.detail
    console.log(avatarUrl)
    this.setData({
      userInformation: {
        ...this.data.userInformation,
        avatar: avatarUrl
      }
    })
    console.log(this.data.userInformation.avatar)
    wx.showToast({
      title: '头像已更新',
      icon: 'success'
    });
  },

  /**
   * 去实名认证
   */
  goRealName: function () {
    wx.showToast({
      title: '跳转实名认证',
      icon: 'none'
    });
    // wx.navigateTo({ url: '/pages/realname/realname' })
  },

  /**
   * 去绑定车牌
   */
  goLicensePlate: function () {
    wx.showToast({
      title: '跳转车牌绑定',
      icon: 'none'
    });
    // wx.navigateTo({ url: '/pages/plate/plate' })
  },

  close: function () {
    this.setData({
      showKey: false
    })
  },

  submit() {
    console.log(this.data.userInformation)
    const {
      avatar,
      email,
      licensePlate,
      memberCardNo,
      memberCardType,
      nickName,
      phone,
      region,
      userName,
      idCardType,
      memberLevel,
      sex,
      id
    } = this.data.userInformation

  },


})