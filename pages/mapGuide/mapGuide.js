// pages/mapGuide/mapGuide.js
Page({
  data: {
    longitude: 119.3098,
    latitude: 31.7868,
    scale: 12,
    markers: [],

    // 用于控制下钻的层级状态
    currentAreaId: null,
    // 防止缩放事件与点击事件冲突的锁
    isAnimating: false,

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
      strokeWidth: 2,
      strokeColor: "#1E90FF",
      fillColor: "#1E90FF22",
    }],

    // 层级 1：宏观 3个大区
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
          content: '核心大区\n(点击放大)',
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
          content: '东部大区\n(点击放大)',
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
          content: '西部大区\n(点击放大)',
          display: 'ALWAYS',
          padding: 8
        }
      }
    ],

    // 层级 2：中观区域（带 parentId）
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
          content: '核心-广场\n(点击放大)',
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
          content: '核心-剧院\n(点击放大)',
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
          content: '东区-水幕\n(点击放大)',
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
          content: '西区-草坪\n(点击放大)',
          display: 'BYCLICK',
          padding: 8
        }
      }
    ],

    // 层级 3：微观演出点（带 areaId）
    level3Markers: []
  },

  onLoad() {
    // 模拟生成 60 个点并分配 areaId
    let tempLevel3 = [];
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
        areaId: 211,
        lat: 31.794,
        lng: 119.306
      }
    ];
    for (let i = 1; i <= 60; i++) {
      const area = areaCenters[i % 4];
      tempLevel3.push({
        id: 1000 + i,
        areaId: area.areaId,
        latitude: area.lat + (Math.random() - 0.5) * 0.0015,
        longitude: area.lng + (Math.random() - 0.5) * 0.0015,
        title: `演出点 ${i}`,
        isArea: false,
        iconPath: 'https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/markerDefault.png',
        width: 25,
        height: 25,
        callout: {
          content: `演出点 ${i}\n场次：${10 + (i % 8)}:00`,
          display: 'BYCLICK',
          padding: 8
        }
      });
    }
    this.setData({
      level3Markers: tempLevel3
    });
    this.renderMarkersByState();
  },

  // 核心渲染逻辑：完全根据 scale 和 currentAreaId 渲染
  renderMarkersByState() {
    const scale = this.data.scale;
    const areaId = this.data.currentAreaId;
    let currentMarkers = [];

    if (scale <= 12) {
      currentMarkers = this.data.level1Markers;
    } else if (scale <= 15) {
      currentMarkers = this.data.level2Markers.filter(item => !areaId || item.parentId === areaId);
    } else {
      currentMarkers = this.data.level3Markers.filter(item => !areaId || item.areaId === areaId);
    }
    this.setData({
      markers: currentMarkers
    });
  },

  // 监听地图状态：区分用户拖动缩放和代码强制缩放
  onRegionChange(e) {
    if (e.type === 'end') {
      const newScale = e.detail.scale || this.data.scale;

      // 如果是代码触发的缩放，不处理（避免打断下钻流程）
      if (e.causedBy === 'update') {
        return;
      }

      // 如果是用户手动缩放（gesture/drag）
      const oldLevel = this.getLevelByScale(this.data.scale);
      const newLevel = this.getLevelByScale(newScale);

      if (oldLevel !== newLevel) {
        // 用户手势改变层级时，重置区域限制，展示全局层级内容
        this.setData({
          scale: newScale,
          currentAreaId: null
        });
        this.renderMarkersByState();
      } else {
        this.setData({
          scale: newScale
        });
      }
    }
  },

  getLevelByScale(scale) {
    if (scale <= 12) return 1;
    if (scale <= 15) return 2;
    return 3;
  },

  // 点击事件：一步到位放大并切换数据
  onMarkerTap(e) {
    if (this.data.isAnimating) return;
    this.setData({
      isAnimating: true
    });

    const markerId = e.detail.markerId;
    const target = this.data.markers.find(m => m.id === markerId);
    if (!target) {
      this.setData({
        isAnimating: false
      });
      return;
    }

    if (target.isArea) {
      let nextScale = this.data.scale;
      if (this.data.scale <= 12) nextScale = 14;
      else if (this.data.scale <= 15) nextScale = 17;

      const mapCtx = wx.createMapContext('showMap', this);

      // 第一步：移动视野到点击中心
      mapCtx.moveToLocation({
        latitude: target.latitude,
        longitude: target.longitude,
        success: () => {
          // 第二步：同步数据，立即放大
          this.setData({
            scale: nextScale,
            currentAreaId: target.id
          });

          // 第三步：重新计算并渲染点位
          this.renderMarkersByState();

          // 动画结束，解锁
          setTimeout(() => {
            this.setData({
              isAnimating: false
            });
          }, 300);
        }
      });

    } else {
      wx.showModal({
        title: '演出详情',
        content: target.callout.content,
        showCancel: false
      });
      this.setData({
        isAnimating: false
      });
    }
  }
})