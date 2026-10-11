// subpackages/hotelRoomType/hotelRoomType.js

import {
  hotelApi
} from "../../api/index"


import {
  formatDate
} from "../../utils/util"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hotelId: "",
    hotelData: "",
    value: "3",
    activeId: null, // 当前打开的面板ID
    panels: [],
    show: false,
    formatter: null,
    // 日期
    minDate: new Date().getTime(),

    dateList: [], //价格日期
    priceMap: {}, // 价格映射
    weekdays: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],

    startDate: "",
    endDate: "",

    selectDateObj: {
      date: "",
      night: "1",
      room: ""
    } //选择展示日期
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options)
    const startDate = new Date()

    // 计算结束日期
    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + 1)
    this.GetCurrentDate(startDate, endDate)

    this.setData({
      hotelId: options.id,
      startDate,
      endDate
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
    this.getHotelInfor()

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


  // 切换面板展开/收起
  togglePanel(e) {
    const id = e.currentTarget.dataset.id;
    const currentActiveId = this.data.activeId;

    if (currentActiveId === id) {
      this.setData({
        activeId: null
      });
    } else {
      this.setData({
        activeId: id
      }, () => {
        this.calculateHeights();
      });
    }
  },

  // 计算每个面板内容的实际高度
  calculateHeights() {
    const query = wx.createSelectorQuery();
    query.selectAll('.content-inner').boundingClientRect();
    query.exec((res) => {
      if (res && res[0]) {
        const newPanels = this.data.panels.map((panel, index) => {
          const rect = res[0][index];
          if (rect) {
            const packageCount = panel.roomData.packages.length;
            panel.contentHeight = packageCount > 0 ?
              rect.height * packageCount :
              rect.height;
          }
          return panel;
        });

        this.setData({
          panels: newPanels
        });
        console.log("数据查看", this.data.panels)
      }
    });
  },


  // 在获取酒店信息后，处理数据格式
  async getHotelInfor() {
    console.log("调用")
    console.log(formatDate(this.data.startDate))
    console.log(formatDate(this.data.endDate))

    let res = await hotelApi.hotelInfor({
      id: this.data.hotelId,
      checkIn: formatDate(this.data.startDate),
      checkOut: formatDate(this.data.endDate)
    })

    if (res.code == 200) {
      console.log(res)
      res.data.hotel.banner = res.data.hotel.banner.split(",")
      res.data.hotel.level = this.starFunction(res.data.hotel.star_rating)

      const panels = res.data.roomTypes.map((item, index) => {
        item.banner = item.banner.split(",")
        return {
          id: index + 1,
          title: item.name,
          content: item.description || '暂无描述',
          contentHeight: 180,
          roomData: item
        }
      })

      console.log("列表值", res.data.dailyMinPrices)
      this.setData({
        hotelData: res.data,
        dateList: res.data.dailyMinPrices,
        panels: panels,
        activeId: null
      })

      setTimeout(() => {
        this.calculateHeights();
      }, 100)
    }

  },
  starFunction(num) {
    let level;
    switch (num) {
      case 1:
        level = "一星级"
        break;
      case 2:
        level = "二星级"
        break;
      case 3:
        level = "三星级"
        break;
      case 4:
        level = "四星级"
        break;
      default:
        level = "五星级"
        break;
    }
    return level
  },

  // 选择日期
  selectDate() {
    this.setData({
      show: true,
      // formatter: this.formatter.bind(this)
    })
  },

  onConfirm(event) {
    let {
      detail
    } = event

    this.setData({
      show: false,
    });

    this.GetCurrentDate(detail[0], detail[1])
    let night = this.calculateNights(detail[0], detail[1])
    this.setData({
      selectDateObj: {
        ...this.data.selectDateObj,
        night: night,
      },
      startDate: formatDate(detail[0]),
      endDate: formatDate(detail[1])
    })
    console.log("改变的", this.data.startDate)
    console.log("改变的", this.data.endDate)
    this.getHotelInfor()

  },

  // 计算入住天数
  calculateNights(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end - start;
    const nights = diffTime / (1000 * 60 * 60 * 24);
    return nights;
  },

  // 获取当前日期
  GetCurrentDate(startDate, endDate) {

    const today = this.getDateInfo(startDate);
    const tomorrow = this.getDateInfo(endDate);

    let dada = {
      today,
      tomorrow
    }
    this.setData({
      selectDateObj: {
        ...this.data.selectDateObj,
        date: dada
      }
    });
  },

  // 获取指定偏移量的日期信息
  getDateInfo(date) {
    return {
      date: formatDate(date, false),
      weekChinese: this.data.weekdays[date.getDay()],
    };
  },

  onClose() {
    this.setData({
      show: false
    });
  },


  // 定义 formatter 函数
  formatter(day) {
    const year = day.date.getFullYear();
    const month = day.date.getMonth() + 1;
    const date = day.date.getDate();
    const dateStr = `${year}-${month.toString().padStart(2, '0')}-${date.toString().padStart(2, '0')}`;

    // 查找价格数据（这里的 this 指向 Page）
    const priceData = this.data.dateList.find(item => item.date === dateStr);
    // 2. 禁用没有价格的日期

    if (!priceData) {
      day.type = 'disabled';
      return day;
    }
    if (priceData) {
      day.bottomInfo = `¥${priceData.minPrice}`;
      // // 可以根据价格添加不同样式
      // if (parseFloat(priceData.minPrice) <= 100) {
      //   day.className = 'low-price'; // 添加样式类
      // }
    }

    // 覆盖入住/离店提示逻辑
    if (day.type === 'start' && !day.topInfo) {
      day.topInfo = '入住';
    } else if (day.type === 'end' && !day.topInfo) {
      day.topInfo = '离店';
    }

    return day;
  },

  // 订购
  order(parameter) {

    const {
      subclass,
      superclass
    } = parameter.currentTarget.dataset
    console.log(subclass, superclass)

    let data = {
      superclassId: superclass.roomData.id,
      superclassTitle: superclass.title,
      dailyStock: subclass.dailyStock,
      subclassId: subclass.id,
      subclassTitle: subclass.name,
      selectDateObj: this.data.selectDateObj,
      includes: subclass.includes,
      price: subclass.price,
      totalPrice: subclass.totalPrice,
      hotelTitle: this.data.hotelData.hotel.title,
      hotelId: this.data.hotelData.hotel.id,
      exitRule: subclass.exitRule,
    }
    console.log(data)
    // return;
    const dataStr = JSON.stringify(data)
    wx.navigateTo({
      url: `/subpackages/bookRoom/bookRoom?id=${encodeURIComponent(dataStr)}`
    })
  },

  // 酒店详情
  gohotelDetails(e){
    wx.navigateTo({
      url:`/subpackages/hotelDetails/hotelDetails?id=${this.data.hotelId}`
    })
  }
})