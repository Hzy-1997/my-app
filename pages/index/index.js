const app = getApp()
import {
  navMenu,
  categoryMenu
} from "./data"

import {
  hotelApi,
  serviceApi,
  ticketingApi
} from "../../api/index"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    navMenu,
    categoryMenu,
    background: 5,
    currentIndex: 0,
    headerBgColor: 'rgba(255, 255, 255, 0)', // 初始透明
    textColor: "#fff",
    navBarHeight: 0,
    hotelList: [],
    strategyList: [],
    tickeList: [],
    gImgUrl: app.globalData.gImgUrl,
    dada: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
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
    this.getHotelList()
    this.getStrategyList()
    this.getTicketList()
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
  onPullDownRefresh() {},

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

  // // 初始化导航栏高度
  initNavBar() {
    try {
      const systemInfo = wx.getSystemInfoSync();
      const statusBarHeight = systemInfo.statusBarHeight;
      const menuButtonInfo = wx.getMenuButtonBoundingClientRect();

      // 导航栏内容高度
      const navBarHeight = (menuButtonInfo.top - statusBarHeight) * 2 + menuButtonInfo.height;

      // 计算右侧间距，避免遮挡胶囊按钮
      const menuButtonRight = (systemInfo.windowWidth - menuButtonInfo.right);

      this.setData({
        statusBarHeight: statusBarHeight,
        navBarHeight: navBarHeight,
        menuButtonRight: menuButtonRight, // 保存右侧间距
      });

    } catch (error) {
      console.error('获取导航栏高度失败:', error);
      this.setData({
        statusBarHeight: 20,
        navBarHeight: 44,
        menuButtonRight: 20,
      });
    }
  },
  onPageScroll(e) {
    // e.scrollTop 是页面滚动距离
    const scrollTop = e.scrollTop;
    // 计算透明度：滚动距离 / 最大滚动距离（比如100px达到完全不透明）
    let opacity = scrollTop / 100;
    // 限制透明度范围在 0-1 之间
    if (opacity > 1) opacity = 1;
    if (opacity < 0) opacity = 0;

    const gray = Math.round(255 - opacity * 255);
    const textColor = `rgb(${gray}, ${gray}, ${gray})`;

    this.setData({
      headerBgColor: `rgba(255, 255, 255, ${opacity})`,
      textColor: textColor,
    });
  },

  // 获取酒店列表
  async getHotelList() {
    let res = await hotelApi.hotelList()
    console.log(res.data)
    let data = res.data.splice(0, 5);
    this.setData({
      hotelList: data
    })
  },
  // 攻略列表
  async getStrategyList() {
    let res = await serviceApi.strategyListApi()
    let data = res.data.rows.splice(0, 5);
    this.setData({
      strategyList: data
    })
  },
  // 产品列表
  async getTicketList() {
    let res = await ticketingApi.ticketingListApi({
      category: 0
    })
    this.setData({
      tickeList: res.data
    })
  },

  // 预订/票务相关
  onTopRowClick(e) {
    console.log(e)
    let {
      num,
      item
    } = e.currentTarget.dataset

    switch (num) {
      case '1':
        wx.navigateTo({
          url: "/pages/theater/theater"
        })
        break;
      case '2':
        wx.navigateTo({
          url: "/subpackages/combination/combination"
        })
        break;
      case '3':
        wx.navigateTo({
          url: '/pages/hotel/hotel',
        })
        break;
      case '4':
        wx.showToast({
          title: `${item.name}页面开发中`,
          icon: 'none'
        })
        break;
      case '5':
        wx.showToast({
          title: `${item.name}页面开发中`,
          icon: 'none'
        })
        break;
      default:
        console.log('访客');
    }
  },

  // 服务/设施相关
  onBottomRowClick(e) {
    console.log(e)
    let {
      num,
      item
    } = e.currentTarget.dataset

    switch (num) {
      case "1":
        wx.navigateTo({
          url: `/pages/touristGuide/touristGuide?type=${num}`,
        })
        break;
      case "2":
        wx.navigateTo({
          url: '/pages/strategy/strategy',
        })
        break;
      case "3":
        // wx.showToast({
        //   title: `${item.name}页面开发中`,
        //   icon: 'none'
        // })
        wx.navigateTo({
          url: "/pages/campsitePage/campsitePage"
        })

        break;
      case "4":
        wx.showToast({
          title: `${item.name}页面开发中`,
          icon: 'none'
        })
        break;
      case "5":
        wx.showToast({
          title: `${item.name}页面开发中`,
          icon: 'none'
        })
        break;
      case "6":
        wx.navigateTo({
          url: `/pages/touristGuide/touristGuide?type=${num}`,
        })
        break;
      case "7":
        wx.navigateTo({
          url: `/pages/touristGuide/touristGuide?type=${num}`,
        })
        break;
      case "8":
        wx.navigateTo({
          url: `/pages/touristGuide/touristGuide?type=${num}`,
        })
        break;
      case "9":
        wx.navigateTo({
          url: `/subpackages/parkingSpace/parkingSpace`
        })
        break;

      default:
        console.log('访客');
    }
  },

  // 酒店更多
  toHotel() {
    wx.navigateTo({
      url: '/pages/hotel/hotel',
    })
  },
  // 酒店详情
  goRoomType(row) {
    let {
      id
    } = row.currentTarget.dataset
    console.log(id)
    wx.navigateTo({
      url: `/subpackages/hotelRoomType/hotelRoomType?id=${id}`,
    })
  },

  // 攻略更多
  toStrategy() {
    wx.navigateTo({
      url: '/pages/strategy/strategy',
    })
  },
  // 攻略详情
  goDetails(row) {
    console.log(row)
    let {
      id
    } = row.currentTarget.dataset
    wx.navigateTo({
      url: `/subpackages/guideDetails/guideDetails?id=${id}`,
    })
  },

  // 票务更多
  toModule() {
    wx.navigateTo({
      url: "/pages/theater/theater"
    })
  },
  // 票务详情
  purchase(row) {
    let {
      index
    } = row.currentTarget.dataset;
    console.log(123)
    wx.navigateTo({
      url: `/subpackages/ticketOrder/ticketOrder?id=${index}`,
    });
  },


  onSwiperChange(e) {
    this.setData({
      currentIndex: e.detail.current
    })
  },

  // 截图
})