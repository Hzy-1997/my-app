// pages/mapGuide/mapGuide.js

// ================= 工具函数：判断点是否在多边形内部（射线法） =================
function isPointInPolygon(point, polygon) {
  let x = point.longitude;
  let y = point.latitude;
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    let xi = polygon[i].longitude,
      yi = polygon[i].latitude;
    let xj = polygon[j].longitude,
      yj = polygon[j].latitude;
    let intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

// ================= 顶部导航 Tab 布局常量（单位 rpx，需与 wxss 中 .top-menu 的宽度、边距保持一致） =================
const TAB_WIDTH = 120; // 单个标签宽度
const TAB_MARGIN = 10; // 标签左右外边距
const TAB_STEP = TAB_WIDTH + TAB_MARGIN * 2; // 每个标签占据的步长：140rpx
const LINE_WIDTH = 50; // 下划线宽度

Page({
  data: {
    // ================= 基础地图配置 =================
    longitude: 119.3098, // 地图中心点经度
    latitude: 31.7868, // 地图中心点纬度
    scale: 12, // 初始缩放级别（12级能看到宏观大区）
    markers: [], // 最终交给地图组件渲染的标记点数组

    // ================= 状态控制变量 =================
    isMaxZoom: false, // 终极开关：标记当前是否处于“点击聚合点强制炸开”的极限状态

    // ================= 景区边界多边形配置 =================
    polygons: [{
      points: [{
        latitude: 31.790,
        longitude: 119.305
      },
      {
        latitude: 31.790,
        longitude: 119.320
      },
      {
        latitude: 31.785,
        longitude: 119.320
      },
      {
        latitude: 31.785,
        longitude: 119.305
      }
      ],
      strokeWidth: 2, // 边框宽度
      strokeColor: "#1E90FF", // 边框颜色
      fillColor: "#1E90FF22", // 填充颜色（末尾的22代表透明度）
    }],

    // ================= 层级 1：宏观 3个大区 =================
    level1Markers: [{
      id: 101,
      latitude: 31.790,
      longitude: 119.310,
      title: '核心大区',
      isArea: true,
      iconPath: 'https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/markerDefault.png',
      width: 40,
      height: 40,
      callout: {
        content: '核心大区',
        display: 'ALWAYS',
        padding: 8
      }
    },
    {
      id: 102,
      latitude: 31.785,
      longitude: 119.320,
      title: '东部大区',
      isArea: true,
      iconPath: 'https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/markerDefault.png',
      width: 40,
      height: 40,
      callout: {
        content: '东部大区',
        display: 'ALWAYS',
        padding: 8
      }
    },
    {
      id: 103,
      latitude: 31.795,
      longitude: 119.305,
      title: '西部大区',
      isArea: true,
      iconPath: 'https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/markerDefault.png',
      width: 40,
      height: 40,
      callout: {
        content: '西部大区',
        display: 'ALWAYS',
        padding: 8
      }
    }
    ],

    // ================= 层级 2：中观 6个片区 =================
    level2Markers: [{
      id: 201,
      parentId: 101,
      latitude: 31.791,
      longitude: 119.311,
      title: '核心-广场',
      isArea: true,
      iconPath: 'https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/markerDefault.png',
      width: 35,
      height: 35,
      callout: {
        content: '核心-广场',
        display: 'BYCLICK',
        padding: 8
      }
    },
    {
      id: 202,
      parentId: 101,
      latitude: 31.789,
      longitude: 119.312,
      title: '核心-剧院',
      isArea: true,
      iconPath: 'https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/markerDefault.png',
      width: 35,
      height: 35,
      callout: {
        content: '核心-剧院',
        display: 'BYCLICK',
        padding: 8
      }
    },
    {
      id: 206,
      parentId: 102,
      latitude: 31.786,
      longitude: 119.321,
      title: '东区-水幕',
      isArea: true,
      iconPath: 'https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/markerDefault.png',
      width: 35,
      height: 35,
      callout: {
        content: '东区-水幕',
        display: 'BYCLICK',
        padding: 8
      }
    },
    {
      id: 207,
      parentId: 102,
      latitude: 31.784,
      longitude: 119.322,
      title: '东区-花海',
      isArea: true,
      iconPath: 'https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/markerDefault.png',
      width: 35,
      height: 35,
      callout: {
        content: '东区-花海',
        display: 'BYCLICK',
        padding: 8
      }
    },
    {
      id: 211,
      parentId: 103,
      latitude: 31.794,
      longitude: 119.306,
      title: '西区-草坪',
      isArea: true,
      iconPath: 'https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/markerDefault.png',
      width: 35,
      height: 35,
      callout: {
        content: '西区-草坪',
        display: 'BYCLICK',
        padding: 8
      }
    },
    {
      id: 212,
      parentId: 103,
      latitude: 31.796,
      longitude: 119.307,
      title: '西区-舞台',
      isArea: true,
      iconPath: 'https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/markerDefault.png',
      width: 35,
      height: 35,
      callout: {
        content: '西区-舞台',
        display: 'BYCLICK',
        padding: 8
      }
    }
    ],

    // ================= 层级 3：微观演出点 =================
    // 原始数据池，不会直接渲染，而是经过算法计算后再渲染
    level3Markers: [],

    // 顶部菜单 (修复了原先 id 重复的问题)
    topMenuList: [{
      id: 1,
      icon: "@",
      selectedIcon: "#",
      status: true,
      title: "玩乐"
    }, {
      id: 2,
      icon: "@",
      selectedIcon: "#",
      status: true,
      title: "演出"
    }, {
      id: 3,
      icon: "@",
      selectedIcon: "#",
      status: true,
      title: "餐饮"
    }, {
      id: 4,
      icon: "@",
      selectedIcon: "#",
      status: true,
      title: "商店"
    }, {
      id: 5,
      icon: "@",
      selectedIcon: "#",
      status: true,
      title: "公共服务"
    }, {
      id: 6,
      icon: "@",
      selectedIcon: "#",
      status: true,
      title: "停车"
    }, {
      id: 7,
      icon: "@",
      selectedIcon: "#",
      status: true,
      title: "商店"
    }, {
      id: 8,
      icon: "@",
      selectedIcon: "#",
      status: true,
      title: "厕所"
    }, {
      id: 9,
      icon: "@",
      selectedIcon: "#",
      status: true,
      title: "停车"
    },],

    isActive: 1,
    scrollLeft: 0, // 导航栏横向滚动距离（px）
    lineOffset: 0, // 下划线位置（px），由 calcLineOffset 计算
  },

  // ================= 页面生命周期：加载 =================
  onLoad() {
    // rpx 与 px 的换算比例（750rpx = 屏幕宽度），用于计算下划线位置和导航栏滚动距离
    const { windowWidth } = wx.getSystemInfoSync();
    this.rpxScale = windowWidth / 750;
    this.windowWidth = windowWidth;

    let tempLevel3 = [];

    // 定义6个片区的中心点坐标
    const areaCenters = [{
      areaId: 201,
      lat: 31.791,
      lng: 119.311
    },
    {
      areaId: 202,
      lat: 31.789,
      lng: 119.312
    },
    {
      areaId: 206,
      lat: 31.786,
      lng: 119.321
    },
    {
      areaId: 207,
      lat: 31.784,
      lng: 119.322
    },
    {
      areaId: 211,
      lat: 31.794,
      lng: 119.306
    },
    {
      areaId: 212,
      lat: 31.796,
      lng: 119.307
    }
    ];

    // 模拟生成 60 个演出点，随机散布在 6 个片区中心点附近
    for (let i = 1; i <= 60; i++) {
      const area = areaCenters[i % 6]; // 轮流分配到不同片区
      tempLevel3.push({
        id: 1000 + i,
        areaId: area.areaId,
        latitude: area.lat + (Math.random() - 0.5) * 0.006,
        longitude: area.lng + (Math.random() - 0.5) * 0.006,
        title: `演出点 ${i}`,
        isArea: false,
        iconPath: 'https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/markerDefault.png',
        width: 25,
        height: 25,
        callout: {
          content: `演出点 ${i}`,
          display: 'ALWAYS',
          padding: 8,
          borderRadius: 6
        }
      });
    }

    this.setData({
      level3Markers: tempLevel3
    });

    // 初始化下划线位置（onLoad 里的 setData 会参与首次渲染，不会闪动画）
    const initIndex = Math.max(0, this.data.topMenuList.findIndex(t => t.id === this.data.isActive));
    this.setData({
      lineOffset: this.calcLineOffset(initIndex)
    });

    this.lastScale = this.data.scale;
    this.renderMarkers(this.data.scale);
  },

  // ================= 页面初次渲染完成后：测量导航栏真实布局 =================
  // onLoad 里按常量公式放置的只是初值；这里量一次真实位置并以此为准
  // （Vant 也是这么做的：实际渲染的宽度/间距和 rpx 公式有细微出入时，误差会随标签序号累积）
  onReady() {
    const query = wx.createSelectorQuery();
    query.selectAll('.top-menu').boundingClientRect(); // 所有标签
    query.select('.navbar').boundingClientRect(); // 滚动容器
    query.select('.navbar').scrollOffset(); // 当前滚动距离（此时应为 0，保险起见取真实值）
    query.select('.tabs-line').boundingClientRect(); // 下划线真实宽度
    query.exec((res) => {
      const [tabRects, navRect, navOffset, lineRect] = res;
      if (!tabRects || !tabRects.length || !navRect) return; // 测不到就沿用公式兜底

      const scrolled = navOffset ? navOffset.scrollLeft : 0;
      // 每个标签在“滚动内容坐标系”里的真实左边缘与宽度（px）
      this.navTabs = tabRects.map((r) => ({
        left: r.left - navRect.left + scrolled,
        width: r.width
      }));
      // 真实的一个标签位宽度（用前两个标签的间距推算）
      this.navStepPx = this.navTabs.length > 1 ?
        this.navTabs[1].left - this.navTabs[0].left :
        TAB_STEP * this.rpxScale;
      // 视口宽、下划线宽，以测量为准
      this.navViewportWidth = navRect.width;
      this.navLineWidth = lineRect ? lineRect.width : LINE_WIDTH * this.rpxScale;
      // 内容总宽用标签自身推算：最后一个标签的右边缘 + 一个边距（与首标签的左边距一致）
      // 注意：不能用 .nav-inner 的宽度——块级布局下它只等于可视宽度，会把最大滚动距离算成 0，导致滚动失效
      const lastTab = this.navTabs[this.navTabs.length - 1];
      this.navContentWidth = lastTab.left + lastTab.width + this.navTabs[0].left;

      // 用真实位置修正当前选中标签的下划线
      const activeIndex = this.data.topMenuList.findIndex((t) => t.id === this.data.isActive);
      if (activeIndex > -1) {
        this.setData({
          lineOffset: this.calcLineOffset(activeIndex)
        });
      }
    });
  },

  // ================= 核心渲染逻辑 =================
  renderMarkers(scale) {
    if (scale <= 13) {
      this.setData({
        markers: this.data.level1Markers
      });
    } else if (scale <= 15) {
      this.setData({
        markers: this.data.level2Markers
      });
    } else {
      const clusteredMarkers = this.calculateClusters(this.data.level3Markers, scale);
      this.setData({
        markers: clusteredMarkers
      });
    }
  },

  // ================= 【核心算法】自研点聚合计算 =================
  calculateClusters(rawMarkers, currentScale) {
    if (currentScale >= 18 || this.data.isMaxZoom) {
      return rawMarkers.map(single => {
        return {
          id: single.id,
          latitude: single.latitude,
          longitude: single.longitude,
          iconPath: single.iconPath,
          width: single.width,
          height: single.height,
          callout: single.callout
        };
      });
    }

    const clusterRadius = 0.002 * Math.pow(0.6, currentScale - 16);
    let clusters = [];

    rawMarkers.forEach(point => {
      let added = false;
      for (let i = 0; i < clusters.length; i++) {
        const c = clusters[i];
        const dLat = point.latitude - c.centerLat;
        const dLng = point.longitude - c.centerLng;
        const distance = Math.sqrt(dLat * dLat + dLng * dLng);

        if (distance < clusterRadius) {
          c.points.push(point);
          c.centerLat = (c.centerLat * (c.points.length - 1) + point.latitude) / c.points.length;
          c.centerLng = (c.centerLng * (c.points.length - 1) + point.longitude) / c.points.length;
          added = true;
          break;
        }
      }

      if (!added) {
        clusters.push({
          centerLat: point.latitude,
          centerLng: point.longitude,
          points: [point]
        });
      }
    });

    let finalMarkers = clusters.map((cluster, index) => {
      const count = cluster.points.length;

      if (count === 1) {
        const single = cluster.points[0];
        return {
          id: single.id,
          latitude: single.latitude,
          longitude: single.longitude,
          iconPath: single.iconPath,
          width: single.width,
          height: single.height,
          callout: single.callout
        };
      } else {
        return {
          id: 9000 + index,
          latitude: cluster.centerLat,
          longitude: cluster.centerLng,
          iconPath: 'https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/markerDefault.png',
          width: 35,
          height: 35,
          callout: {
            content: `【${count}个】${cluster.points[0].title}`,
            display: 'ALWAYS',
            padding: 6,
            borderRadius: 8,
            bgColor: '#ffffff',
            color: '#333333',
            fontSize: 12
          }
        };
      }
    });

    return finalMarkers;
  },

  // ================= 监听地图手势缩放与拖动 =================
  onRegionChange(e) {
    const mapCtx = wx.createMapContext('showMap', this);

    // ----- 1. 处理拖动结束（边界回弹检测） -----
    if (e.type === 'end' && e.causedBy === 'drag') {
      setTimeout(() => {
        mapCtx.getCenterLocation({
          success: (res) => {
            const polygon = this.data.polygons[0].points;
            const inBounds = isPointInPolygon(res, polygon);

            if (!inBounds) {
              wx.showToast({
                title: '已到达边界',
                icon: 'none',
                duration: 1500
              });

              // 【核心修改】：平滑滑动回中心点
              mapCtx.moveToLocation({
                latitude: 31.7868,
                longitude: 119.3098
              });
            }
          }
        });
      }, 300);
      return;
    }

    // ----- 2. 处理缩放结束 -----
    if (e.type !== 'end' || e.causedBy !== 'scale') return;

    mapCtx.getScale({
      success: (res) => {
        const realScale = res.scale;
        if (Math.abs(realScale - this.lastScale) < 0.2) return;

        const oldLevel = this.getLevelByScale(this.lastScale);
        const newLevel = this.getLevelByScale(realScale);

        this.lastScale = realScale;

        if (realScale < 18) {
          this.setData({
            isMaxZoom: false
          });
        }

        if (oldLevel !== newLevel || newLevel === 3) {
          this.renderMarkers(realScale);
        }
      }
    });
  },

  // ================= 辅助方法：根据缩放级别划分层级 =================
  getLevelByScale(scale) {
    if (scale <= 13) return 1;
    if (scale <= 15) return 2;
    return 3;
  },

  // ================= 统一点击事件处理 =================
  onMarkerTap(e) {
    if (!e.detail.markerId) return;

    const now = Date.now();
    if (this.lastClickTime && now - this.lastClickTime < 600) return;
    this.lastClickTime = now;

    const markerId = e.detail.markerId;
    const target = this.data.markers.find(m => m.id === markerId);

    if (!target) return;

    // 情况 1：点击的是 层级 1 或 层级 2
    if (target.isArea) {
      let nextScale = this.lastScale <= 13 ? 14 : 17;

      // 使用 moveToLocation 平滑移动到目标区域
      const mapCtx = wx.createMapContext('showMap', this);

      // 先设置状态
      this.setData({
        scale: nextScale,
        isMaxZoom: false
      });
      this.lastScale = nextScale;

      // 平滑移动视野
      mapCtx.moveToLocation({
        latitude: target.latitude,
        longitude: target.longitude,
        success: () => {
          setTimeout(() => this.renderMarkers(nextScale), 400);
        }
      });

    }
    // 情况 2：点击的是自研聚合出来的“聚合点”
    else if (markerId >= 9000) {
      const maxScale = 18;
      const mapCtx = wx.createMapContext('showMap', this);

      this.setData({
        scale: maxScale,
        isMaxZoom: true
      });
      this.lastScale = maxScale;

      mapCtx.moveToLocation({
        latitude: target.latitude,
        longitude: target.longitude,
        success: () => {
          this.renderMarkers(maxScale);
        }
      });
    }
    // 情况 3：点击的是普通的演出点
    else {
      wx.showModal({
        title: '演出详情',
        content: target.callout.content,
        showCancel: false
      });
    }
  },


  // 标签切换
  menuType(e) {
    const type = Number(e.currentTarget.dataset.type);
    const index = Number(e.currentTarget.dataset.index); // wx:for 的下标，用于定位标签位置

    if (type === this.data.isActive) return; // 点的是当前已选中的标签，不处理

    this.setData({
      isActive: type,
      // 下划线滑到新标签下方：transform 值变化会触发 CSS transition 补间动画
      lineOffset: this.calcLineOffset(index)
    });

    this.scrollNavTo(index);
  },

  // ================= 计算下划线的位置（单位 px） =================
  calcLineOffset(index) {
    // 优先用 onReady 里量到的真实布局：下划线中心 = 标签左边缘 + 标签宽度的一半
    // （文字在标签里是居中的，所以线对准标签中心，就正好在文字下方居中）
    const tab = this.navTabs && this.navTabs[index];
    if (tab) {
      return tab.left + tab.width / 2 - (this.navLineWidth || LINE_WIDTH * this.rpxScale) / 2;
    }
    // 兜底公式（onReady 测量完成前 / 测量失败时使用）
    const leftRpx = index * TAB_STEP + TAB_MARGIN + (TAB_WIDTH - LINE_WIDTH) / 2;
    return leftRpx * this.rpxScale;
  },

  // ================= 导航栏滚动到选中标签对应的位置 =================
  scrollNavTo(index) {
    // 优先用 onReady 量到的真实布局（步长/视口宽/内容宽），公式仅作兜底
    const stepPx = this.navStepPx || TAB_STEP * this.rpxScale; // 一个标签位的像素宽度
    const viewportWidth = this.navViewportWidth || this.windowWidth; // 可视区域宽度
    const contentWidth = this.navContentWidth || this.data.topMenuList.length * stepPx; // 标签总宽度
    const maxScroll = Math.max(0, contentWidth - viewportWidth); // 最大可滚动距离

    // 滚动规则（和你描述的一致）：
    // 点第 1~2 个不滚，点第 3~4 个往左滚 1 个标签位，点第 5~6 个滚 2 个，点第 7~8 个滚 3 个……
    // 点靠右的标签时把后面的露出来；反之点靠左的标签 scrollLeft 变小，自然往右滑回来
    let target = Math.floor(index / 2) * stepPx;

    // 在原规则基础上，保证点击的“下一个标签”也完整露出来
    // （比如点倒数第 2 个“厕所”时，最后一个“停车”要完整展示，而不是只露一条边）
    const nextTab = this.navTabs && this.navTabs[index + 1];
    if (nextTab) {
      const needed = nextTab.left + nextTab.width + this.navTabs[0].left - viewportWidth;
      if (needed > target) target = needed;
    }

    if (target > maxScroll) target = maxScroll; // 最多滚到最后一个标签贴右边界

    // 用户手动滑动过导航栏时，data.scrollLeft 与实际位置不一致，以 bindscroll 记录的实际位置为准
    const current = this.navScrollLeft != null ? this.navScrollLeft : this.data.scrollLeft;
    if (Math.abs(target - current) < 0.5) return; // 已经在目标位置

    if (Math.abs(this.data.scrollLeft - target) < 0.5) {
      // scroll-left 属性值不变化就不会触发滚动，先写回实际位置强制制造一次变化
      this.setData({
        scrollLeft: current
      }, () => {
        this.setData({
          scrollLeft: target
        });
      });
    } else {
      this.setData({
        scrollLeft: target
      });
    }
  },

  // ================= 记录导航栏实际滚动位置（手动滑动后点击逻辑依然准确） =================
  onNavbarScroll(e) {
    this.navScrollLeft = e.detail.scrollLeft;
  }
});