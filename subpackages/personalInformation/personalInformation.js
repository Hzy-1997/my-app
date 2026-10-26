const app = getApp()

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
      id: "",
    },
    gImgUrl: app.globalData.gImgUrl,
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
    res.data.idCard = cryptoUtil.decrypt(res.data.idCard)
    res.data.phone = cryptoUtil.decrypt(res.data.phone)
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

  async onChooseAvatar(e) {
    const {
      avatarUrl
    } = e.detail; // 临时路径
    console.log('临时路径:', avatarUrl);

    // // 1. 先用临时路径显示，给用户即时反馈
    // this.setData({
    //   'userInformation.avatar': avatarUrl
    // });

    // 2. 上传到后端（封装内部自动拼 BASE_URL、带 token、解析响应）
    wx.showLoading({
      title: '上传中...',
      mask: true
    });
    try {
      const res = await loginApi.uploadImg(avatarUrl);
      const realUrl = res.data.imgUrl; // OSS 完整地址
      console.log('真实地址:', realUrl);
      const pathUrl = realUrl.split('.com')[1]

      // 3. 更新为真正的 URL
      this.setData({
        'userInformation.avatar': pathUrl
      });

      wx.hideLoading();

      // 4. 存到数据库（资料已加载出 id 时立即保存，否则等 submit 统一提交）
      if (this.data.userInformation.id) {
        this.updateUserAvatar(realUrl);
      }

      wx.showToast({
        title: '头像已更新',
        icon: 'success'
      });
    } catch (err) {
      wx.hideLoading();
      console.error('上传失败', err);
      // 业务失败（非200）封装里已提示过，这里只兜底网络异常
      if (!err || !err.message) {
        wx.showToast({
          title: '上传失败',
          icon: 'none'
        });
      }
    }
  },

  // 把真实 URL 存到数据库（复用 updateUserInfo，后端只更新传入字段，不会清空其他资料）
  async updateUserAvatar(avatarUrl) {

    const pathUrl = avatarUrl.split('.com')[1]
    const res = await loginApi.updateUserInfo({
      id: this.data.userInformation.id,
      avatar: pathUrl
    });
    if (res.code == 200) {
      // 更新本地缓存的用户信息
      const userInfo = wx.getStorageSync('userInfo') || {};
      userInfo.avatar = avatarUrl;
      wx.setStorageSync('userInfo', userInfo);
    }
  },

  /**
   * 去实名认证
   */
  goRealName: function (e) {
    wx.showToast({
      title: '跳转实名认证',
      icon: 'none'
    });
    let {
      id
    } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/subpackages/realname/realname?id=${id}`
    })
  },

  /**
   * 去绑定车牌
   */
  goLicensePlate: function (e) {
    wx.showToast({
      title: '跳转车牌绑定',
      icon: 'none'
    });

    let {
      carnumber,
      id
    } = e.currentTarget.dataset
    console.log(e)

    wx.navigateTo({
      url: `/subpackages/licensePlate/licensePlate?id=${id}&carnumber=${carnumber}`
    })
  },

  close: function () {
    this.setData({
      showKey: false
    })
  },

  async submit() {

    const {
      avatar,
      email,
      licensePlate,
      memberCardNo,
      memberCardType,
      nickName,
      phone,
      idCard,
      region,
      userName,
      idCardType,
      memberLevel,
      sex,
      id
    } = this.data.userInformation

    let data = {
      ...this.data.userInformation,
      phone: cryptoUtil.encrypt(phone),
      idCard: cryptoUtil.encrypt(idCard),
      idCardType: idCardType + 1,
      sex: sex + 1
    }
    wx.showLoading({
      title: '正在提交',
      mask: true
    });

    let res = await loginApi.updateUserInfo(data)
    if (res.code == 200) {
      wx.hideLoading();
      wx.showToast({
        title: '修改成功',
        icon: 'success',
        duration: 2000
      })
    }
  },

})