const app = getApp()

import {
  ComboApi,
} from "../../api/index"

import {
  debounceThrottle
} from "../../utils/util.js"

import Toast from '@vant/weapp/toast/toast';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    kindList: [{
      id: 1,
      title: "酒店套餐",
      mainTitle: "酒店超值套餐"
    }, {
      id: 2,
      title: "游玩套餐",
      mainTitle: "游玩超值套餐"
    }, {
      id: 3,
      title: "赛事套餐",
      mainTitle: "赛事超值套餐"
    }],
    type: 1,
    productList: [],
    productInfo: "",
    innerScrollEnabled: false,
    navTitle: '套餐',
    headerBgColor: 'rgba(255, 255, 255, 0)', // 初始完全透明
    textColor: 'rgba(255, 255, 255, 1)',
    statusBarHeight: 0, // 状态栏高度
    totalTopBarHeight: 0, // 整个导航栏高度
    gImgUrl: app.globalData.gImgUrl,
    boxHeight: "",
    pageNum: 1,
    pageSize: 10,
    hasMore: true, // 是否还有更多数据
    isLoading: false, // 是否正在加载
    showLoadMore: false, // 是否显示加载更多提示
    loadMoreText: '加载更多...',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.initNavBar();
    // 创建防抖的加载更多函数，保存为实例方法
    this.debouncedLoadMore = debounceThrottle(
      this.getComboList.bind(this),
      1000,
      'debounce'
    );

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
    this.getComboList()
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



  // 高度获取
  // initNavBar() {
  //   try {
  //     // 获取系统信息
  //     const systemInfo = wx.getSystemInfoSync();
  //     const statusBarHeight = systemInfo.statusBarHeight;
  //     console.log("屏幕滑动", statusBarHeight)

  //   } catch {

  //   }
  // },

  /**
   * 页面滚动事件
   */
  onPageScroll(e) {
    // e.scrollTop 是页面滚动距离
    const scrollTop = e.scrollTop;
    let opacity = scrollTop / 50;
    // 限制透明度范围在 0-1 之间
    if (opacity > 1) opacity = 1;
    if (opacity < 0) opacity = 0;
    this.setData({
      headerBgColor: `rgba(255, 255, 255, ${opacity})`,
    });
    // 根据透明度改变标题和按钮颜色（可选）
    if (opacity > 0.8) {
      // 背景变白时，内容应该变深
      this.setData({
        // textColor: '#ff6f20'
        textColor: '#1a1a1a',
        textShow: true
      });
    } else {
      this.setData({
        // textColor: '#d5006d'
        textColor: 'rgba(255, 255, 255, 1)',
        textShow: false
      });
    }
    // 控制滑动
    if (scrollTop >= 160) {
      console.log("scrollTop", scrollTop)
      this.setData({
        innerScrollEnabled: true
      })
    } else if (scrollTop < 5) {
      console.log("scrollTop", scrollTop)
      this.setData({
        innerScrollEnabled: false
      })
    }
  },

  /**
   * 初始化导航栏高度
   */
  initNavBar() {
    try {
      // 获取系统信息
      const systemInfo = wx.getSystemInfoSync();
      console.log("信息", systemInfo)
      const platform = systemInfo.system.split(" ")[0]; // 'ios' 或 'android'
      console.log("机型", platform)
      // 设置不同的高度
      let boxHeight = platform === 'iOS' ? '1200rpx' : '1250rpx';
      const statusBarHeight = systemInfo.statusBarHeight;

      // 获取胶囊按钮位置信息
      const menuButtonInfo = wx.getMenuButtonBoundingClientRect();

      // 计算导航栏高度
      // 导航栏高度 = 状态栏高度 + (胶囊按钮距顶部距离 - 状态栏高度) * 2 + 胶囊按钮高度
      const navBarHeight = (menuButtonInfo.top - statusBarHeight) * 2 + menuButtonInfo.height;

      // 整个top-bar的总高度
      const totalTopBarHeight = statusBarHeight + navBarHeight;
      console.log(boxHeight)
      this.setData({
        statusBarHeight,
        navBarHeight,
        totalTopBarHeight,
        boxHeight
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



  // 获取列表
  async getComboList() {
    Toast.loading({
      message: '加载中...',
      forbidClick: true,
    });
    let res = await ComboApi.getPrimaryComboList({
      pageNum: this.data.pageNum,
      pageSize: this.data.pageSize,
      type: this.data.type
    })
    console.log("获取数据", res)

    res.data.list.map((item) => {
      item.includes = item.includes
        .split(";")
        .filter(it => it !== "")
        .map((it) => it.split(","))
    })



    if (res.code == 200) {
      this.setData({
        productList: [...this.data.productList, ...res.data.list],
        productInfo: res.data.info,
      })
      console.log(this.data.productList, this.data.productInfo)
    } else {
      Toast.fail('系统出错了...');
    }
    Toast.clear()
  },

  // 种类选择
  choiceKind(data) {
    let {
      index
    } = data.currentTarget.dataset

    console.log(index)
    this.setData({
      type: index,
      productList: [],
      pageNum: 1
    })
    this.getComboList()
  },


  // 上拉触底加载更多
  onLoadMore() {
    if (this.data.isLoading || !this.data.hasMore) {
      return;
    }
    console.log("加载更多")
    this.debouncedLoadMore();

    this.setData({
      pageNum: this.data.pageNum + 1
    })


    // this.loadData();
  },

  // 抢购
  goBuy(it) {
    let {
      id
    } = it.currentTarget.dataset
    console.log(id)


    wx.navigateTo({
      url: `/subpackages/combinationItem/combinationItem?id=${id}`
    })

  },
})