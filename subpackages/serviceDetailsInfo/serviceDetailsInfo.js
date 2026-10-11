const app = getApp()

import {
  serviceApi,
  parkingApi
} from "../../api/index"

import Toast from '@vant/weapp/toast/toast';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    headerBgColor: 'rgba(255, 255, 255, 0)', // 初始完全透明
    textColor: 'rgba(255, 255, 255, 1)',
    textShow: false,
    navTitle: '页面标题',
    statusBarHeight: 0, // 状态栏高度
    totalTopBarHeight: 0, // 整个导航栏高度
    gImgUrl: app.globalData.gImgUrl,
    id: "",
    dataInfo: "",
    spotList: "",
    availableColor: "",
    html: "",
    type: "",
    show: false,
    startTime: "",
    endTime: "",

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options)
    this.setData({
      id: options.id,
      type: options.type
    })
    this.initNavBar();
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
    this.getDataInfo()
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

  /**
   * 页面滚动事件
   */
  onPageScroll(e) {
    // e.scrollTop 是页面滚动距离
    const scrollTop = e.scrollTop;

    // 计算透明度：滚动距离 / 最大滚动距离（200px达到完全不透明）
    let opacity = scrollTop / 50;

    // 限制透明度范围在 0-1 之间
    if (opacity > 1) opacity = 1;
    if (opacity < 0) opacity = 0;
    console.log(opacity)
    this.setData({
      headerBgColor: `rgba(255, 255, 255, ${opacity})`,
    });

    // 根据透明度改变标题和按钮颜色（可选）
    if (opacity > 0.8) {
      // 背景变白时，内容应该变深
      console.log("黑")
      this.setData({
        // textColor: '#ff6f20'
        textColor: '#1a1a1a',
        textShow: true
      });
    } else {
      console.log("白")
      this.setData({
        // textColor: '#d5006d'
        textColor: 'rgba(255, 255, 255, 1)',
        textShow: false
      });
    }
  },

  /**
   * 自定义标题
   */
  setNavTitle(title) {
    this.setData({
      navTitle: title
    });
  },

  /**
   * 初始化导航栏高度
   */
  initNavBar() {
    try {
      // 获取系统信息
      const systemInfo = wx.getSystemInfoSync();
      const statusBarHeight = systemInfo.statusBarHeight;

      // 获取胶囊按钮位置信息
      const menuButtonInfo = wx.getMenuButtonBoundingClientRect();

      // 计算导航栏高度
      // 导航栏高度 = 状态栏高度 + (胶囊按钮距顶部距离 - 状态栏高度) * 2 + 胶囊按钮高度
      const navBarHeight = (menuButtonInfo.top - statusBarHeight) * 2 + menuButtonInfo.height;

      // 整个top-bar的总高度
      const totalTopBarHeight = statusBarHeight + navBarHeight;

      this.setData({
        statusBarHeight,
        navBarHeight,
        totalTopBarHeight
      });

      // 将导航栏总高度存储到全局，方便其他页面使用
      wx.setStorageSync('navBarHeight', totalTopBarHeight);

    } catch (error) {
      console.error('获取导航栏高度失败:', error);
      // 设置默认值
      this.setData({
        statusBarHeight: 44,
        totalTopBarHeight: 132
      });
    }
  },

  /**
   * 返回按钮点击事件
   */
  goBack() {
    const pages = getCurrentPages();
    if (pages.length > 1) {
      // 如果有上一页，返回上一页
      wx.navigateBack({
        delta: 1
      });
    } else {
      // 如果是第一个页面，跳转到首页 serviceApi
      wx.switchTab({
        url: '/pages/index/index'
      });
    }
  },
  /**
   * 获取详情
   */
  getDataInfo() {

    const type = Number(this.data.type)
    const apiMap = {
      1: serviceApi.getSportsInfo,
      6: serviceApi.getLeisureInfo,
      7: serviceApi.getCateringInfo,
      8: serviceApi.getShoppingInfo,
      9: parkingApi.getParkingDetail,
    }
    console.log(type)
    const apiMethod = apiMap[type]
    if (apiMethod) {
      this.fetchDetail(apiMethod)
    }
  },

  // 运动详情
  async fetchDetail(apiMethod) {
    Toast.loading({
      message: '加载中...',
      forbidClick: true,
    });

    console.log("参数", {
      id: this.data.id,
      apiMethod: apiMethod
    })

    let data = {
      id: this.data.id
    }
    // console.log("数据", data)

    let res = await apiMethod(data)
    console.log(res)
    if (res.code == 200) {
      // console.log("数据", res)
      this.setData({
        dataInfo: res.data,
        html: res.data.description
      })
    } else {
      Toast.fail('系统出错了...');
    }

    Toast.clear()
  },

  async showPopup() {
    // 往后一小时
    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
    const format = (d) => {
      const pad = (n) => String(n).padStart(2, '0');
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ` +
        `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    };
    const startTime = format(now);
    const endTime = format(oneHourLater);

    this.setData({
      startTime,
      endTime
    })

    let res = await parkingApi.getParkingSpots({
      parkingId: 9,
      startTime,
      endTime
    });

    console.log(res);

    this.setData({
      show: true,
      spotList: res.data.spotList
    });
  },

  onClose() {
    this.setData({
      show: false
    });
  },


  // 选择车位
  Confirm(e) {
    let {
      item
    } = e.currentTarget.dataset

    let htis = this


    wx.showModal({
      title: `编号:${item.spotNumber}`,
      content: `你确定预约当前车位吗？`,
      success(res) {
        if (res.confirm) {
          wx.navigateTo({
            url: `/subpackages/paymentPage/paymentPage?id=${item.id}&parkingId=${item.parkingId}&endTime=${htis.data.endTime}&startTime=${htis.data.startTime}`
          })

        } else if (res.cancel) {

          console.log('用户点击取消')
        }
      }
    })

  }


})