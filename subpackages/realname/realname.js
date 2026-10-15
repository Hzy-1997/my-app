// subpackages/realname/realname.js

import {
  loginApi,
} from "../../api/index"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    frontImage: true,
    backImage: true,
    frontImageUrl: "",
    backImageUrl: "",
    frontInfo: null,
    backInfo: null,
    uploading: false,

    id: "",
    userName: "",
    idCard: "",
    region: ""



  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      id: options.id
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



  chooseImage(e) {
    let {
      side
    } = e.currentTarget.dataset
    const that = this;

    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sizeType: ['compressed'], // 压缩，尽量不超
      sourceType: ['camera', 'album'],
      success(res) {
        const tempFilePath = res.tempFiles[0].tempFilePath;
        const size = res.tempFiles[0].size;

        if (size > 2 * 1024 * 1024) {
          wx.showToast({
            title: '图片不能超过 2M',
            icon: 'none'
          });
          return;
        }


        if (side === 'front') {
          that.setData({
            frontImage: false,
            frontImageUrl: tempFilePath
          });
        } else {
          that.setData({
            backImage: false,
            backImageUrl: tempFilePath
          });
        }

        console.log("参数", tempFilePath, side)
        // 上传识别
        that.uploadIdCard(tempFilePath, side);
      },
    });
  },

  async uploadIdCard(filePath, side) {
    const that = this;
    this.setData({
      uploading: true
    });
    wx.showLoading({
      title: '识别中...'
    });

    try {
      const res = await loginApi.recognizeIdCard(filePath);

      const result = res.data; // 微信 OCR 的真实结果在这里
      if (result.errcode && result.errcode !== 0) {
        wx.showToast({
          title: result.errmsg || '识别失败',
          icon: 'none'
        });
        return;
      }

      if (side === 'front') {

        let data = {

        }

        that.setData({
          frontInfo: result,
          userName: result.name,
          idCard: result.id,
          region: result.addr,
        });
        console.log('正面:', result.name, result.id, result.addr);
      } else {
        that.setData({
          backInfo: result
        });
        console.log('反面:', result.valid_date);
      }

      wx.showToast({
        title: '识别成功',
        icon: 'success'
      });
    } catch (err) {
      console.error('识别失败:', err);
      // uploadFile 封装里已经弹过 toast，这里不重复弹
    } finally {
      wx.hideLoading();
      that.setData({
        uploading: false
      });
    }
  },

  // 提交信息
  async submit() {

    let {
      id,
      userName,
      region,
      idCard
    } = this.data

    let data = {
      id,
      userName,
      region,
      idCard: cryptoUtil.encrypt(idCard),
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


  }
})