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
    this.initBoxHeight();
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



  /**
   * 页面滚动事件
   */
  onPageScroll(e) {
    const scrollTop = e.scrollTop;

    // 通知导航栏组件更新透明度和文字颜色
    this.selectComponent('#nav-bar').onScroll(scrollTop);

    // 控制滑动
    if (scrollTop >= 160) {
      this.setData({
        innerScrollEnabled: true
      })
    } else if (scrollTop < 5) {
      this.setData({
        innerScrollEnabled: false
      })
    }
  },

  /**
   * 初始化内容区高度（不同机型不同高度）
   */
  initBoxHeight() {
    const systemInfo = wx.getSystemInfoSync();
    const platform = systemInfo.system.split(" ")[0]; // 'iOS' 或 'Android'
    // 设置不同的高度
    const boxHeight = platform === 'iOS' ? '1200rpx' : '1250rpx';

    this.setData({
      boxHeight
    });
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