// subpackages/campDetails/campDetails.js
const app = getApp()

import Toast from '@vant/weapp/toast/toast';
import {
  campsiteApi,
} from "../../api/index"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    headerBgColor: 'rgba(255, 255, 255, 0)', // 初始完全透明
    textColor: 'rgba(255, 255, 255, 1)',
    textShow: true,
    navTitle: '页面标题',
    statusBarHeight: 0, // 状态栏高度
    totalTopBarHeight: 0, // 整个导航栏高度
    gImgUrl: app.globalData.gImgUrl,
    id: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options)
    this.setData({
      id: options.id
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
    this.getCampsiteDetail()
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


  // 获取详细信息
  async getCampsiteDetail() {
    let res = await campsiteApi.campsiteDetail({
      id: this.data.id
    })
    console.log("查看", res)
  },




  generatePoster() {
    wx.onGeneratePoster(function () {
      console.log('需要开发者生成自定义海报')
      return {
        src: 'images/a.jpg',
        promise: new Promise((resolve) => { // 通过promise延时传递小程序的query参数
          setTimeout(() => {
            resolve({
              src: 'images/a.jpg',
            })
          }, 1000) // 在1秒内对query进行解析
        })
      }
    })
  },

  participate() {

    wx.navigateTo({
      url: `/subpackages/campSessionNumber/campSessionNumber?id=${this.data.id}`
    })

  }


})