const app = getApp()
import {
  navMenu,
  categoryMenu
} from "./data"

import {
  hotelApi,
  strategyApi,
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
    hotelList: [],
    strategyList: [],
    tickeList: [],
    gImgUrl: app.globalData.gImgUrl,
    dada: [{
        title: "崇礼之巅观光缆车票",
        pice: "150",
        shoumai: "21414",
        picea: "100"
      },
      {
        title: "崇礼之巅观光缆车票:(单次往返大事发生法发的撒大苏打大撒)dasdasdsada",
        pice: "150",
        shoumai: "21414",
        picea: "100"
      }, {
        title: "崇礼之巅观光缆车票:(单次往返)",
        pice: "150",
        shoumai: "21414",
        picea: "100"
      }, {
        title: "崇礼之巅观光缆车票:(单次往返)",
        pice: "150",
        shoumai: "21414",
        picea: "100"
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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

  onPageScroll(e) {
    // e.scrollTop 是页面滚动距离
    const scrollTop = e.scrollTop;
    // 计算透明度：滚动距离 / 最大滚动距离（比如100px达到完全不透明）
    let opacity = scrollTop / 100;
    // 限制透明度范围在 0-1 之间
    if (opacity > 1) opacity = 1;
    if (opacity < 0) opacity = 0;
    this.setData({
      headerBgColor: `rgba(255, 255, 255, ${opacity})`
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
    let res = await strategyApi.strategyListApi()
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
        wx.showToast({
          title: `${item.name}页面开发中`,
          icon: 'none'
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
        wx.showToast({
          title: `${item.name}页面开发中`,
          icon: 'none'
        })
        break;
      case "2":
        wx.navigateTo({
          url: '/pages/strategy/strategy',
        })
        break;
      case "3":
        wx.showToast({
          title: `${item.name}页面开发中`,
          icon: 'none'
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
        wx.showToast({
          title: `${item.name}页面开发中`,
          icon: 'none'
        })
        break;
      case "7":
        wx.showToast({
          title: `${item.name}页面开发中`,
          icon: 'none'
        })
        break;
      case "8":
        wx.showToast({
          title: `${item.name}页面开发中`,
          icon: 'none'
        })
        break;
      case "9":
        wx.showToast({
          title: `${item.name}页面开发中`,
          icon: 'none'
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
})