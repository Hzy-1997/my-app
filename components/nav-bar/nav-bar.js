// components/nav-bar/nav-bar.js
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    // 导航栏标题
    title: {
      type: String,
      value: ''
    },

    // 是否展示返回按钮
    backShow: {
      type: Boolean,
      value: true
    },
    // 是否始终显示标题（默认滚动到背景变白后才显示标题）
    alwaysShowTitle: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    statusBarHeight: 0, // 状态栏高度
    totalTopBarHeight: 0, // 整个导航栏高度
    headerBgColor: 'rgba(255, 255, 255, 0)', // 初始完全透明
    textColor: 'rgba(255, 255, 255, 1)',
    textShow: false,
  },

  lifetimes: {
    attached() {
      this.initNavBar();
      if (this.data.alwaysShowTitle) {
        this.setData({
          textShow: true
        });
      }
    }
  },

  methods: {

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
          totalTopBarHeight
        });

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
     * 页面滚动时更新导航栏样式
     * 在页面 onPageScroll 中调用：this.selectComponent('#nav-bar').onScroll(e.scrollTop)
     */
    onScroll(scrollTop) {
      // 计算透明度：滚动 50px 达到完全不透明
      let opacity = scrollTop / 50;

      // 限制透明度范围在 0-1 之间
      if (opacity > 1) opacity = 1;
      if (opacity < 0) opacity = 0;

      // 背景变白时，标题和按钮颜色变深，并显示标题
      const dark = opacity > 0.8;

      this.setData({
        headerBgColor: `rgba(255, 255, 255, ${opacity})`,
        textColor: dark ? '#1a1a1a' : 'rgba(255, 255, 255, 1)',
        textShow: dark || this.data.alwaysShowTitle
      });
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
        // 如果是第一个页面，跳转到首页
        wx.switchTab({
          url: '/pages/index/index'
        });
      }
    }
  }
})