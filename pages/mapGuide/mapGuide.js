// pages/mapGuide/mapGuide.js
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
    // 场景：用户刚进小程序，或者把地图缩得很小的时候显示
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
    // 场景：用户点击大区，或者手动放大到 14-15 级时显示
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
    level3Markers: []
  },

  // ================= 页面生命周期：加载 =================
  onLoad() {
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
        // (Math.random() - 0.5) * 0.006 是为了让点位在中心点附近产生随机偏移，避免完全重叠
        latitude: area.lat + (Math.random() - 0.5) * 0.006,
        longitude: area.lng + (Math.random() - 0.5) * 0.006,
        title: `演出点 ${i}`,
        isArea: false,
        iconPath: 'https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/markerDefault.png',
        width: 25,
        height: 25,
        callout: {
          content: `演出点 ${i}`,
          display: 'ALWAYS', // 文字常显
          padding: 8,
          borderRadius: 6
        }
      });
    }

    // 将生成的 60 个点存入 data
    this.setData({
      level3Markers: tempLevel3
    });

    // 记录上一次的缩放级别，防止频繁触发
    this.lastScale = this.data.scale;
    // 首次渲染地图
    this.renderMarkers(this.data.scale);
  },

  // ================= 核心渲染逻辑 =================
  // 根据当前的缩放级别(scale)，决定渲染哪个层级的 Marker
  renderMarkers(scale) {
    if (scale <= 13) {
      // 第一层：大区
      this.setData({
        markers: this.data.level1Markers
      });
    } else if (scale <= 15) {
      // 第二层：片区
      this.setData({
        markers: this.data.level2Markers
      });
    } else {
      // 第三层：演出点（重点：这里不走直接渲染，而是调用自研聚合算法）
      const clusteredMarkers = this.calculateClusters(this.data.level3Markers, scale);
      this.setData({
        markers: clusteredMarkers
      });
    }
  },

  // ================= 【核心算法】自研点聚合计算 =================
  calculateClusters(rawMarkers, currentScale) {
    // 【强制拆解开关】
    // 如果地图缩放到了 19 级以上，或者用户点击了聚合点（isMaxZoom 为 true）
    // 就直接跳过聚合计算，把所有的点原封不动地返回，强制散开！
    if (currentScale >= 19 || this.data.isMaxZoom) {
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

    // 正常聚合计算逻辑：
    // 缩放越大，半径越小。当放大到 18 级时，Math.pow(0.6, 2) = 0.36，半径会变得极小。
    const clusterRadius = 0.002 * Math.pow(0.6, currentScale - 16);
    let clusters = []; // 用来存储聚合簇的临时数组

    // 遍历所有 60 个点，进行距离归类
    rawMarkers.forEach(point => {
      let added = false;

      // 检查当前点是否落在已有的聚合簇内
      for (let i = 0; i < clusters.length; i++) {
        const c = clusters[i];
        const dLat = point.latitude - c.centerLat;
        const dLng = point.longitude - c.centerLng;
        // 勾股定理计算两个经纬度之间的近似直线距离
        const distance = Math.sqrt(dLat * dLat + dLng * dLng);

        if (distance < clusterRadius) {
          // 距离足够近，加入该聚合簇
          c.points.push(point);
          // 重新计算聚合簇的中心点（取所有点的平均值）
          c.centerLat = (c.centerLat * (c.points.length - 1) + point.latitude) / c.points.length;
          c.centerLng = (c.centerLng * (c.points.length - 1) + point.longitude) / c.points.length;
          added = true;
          break;
        }
      }

      // 如果没找到合适的簇，就自己新建一个簇（哪怕里面只有自己 1 个点）
      if (!added) {
        clusters.push({
          centerLat: point.latitude,
          centerLng: point.longitude,
          points: [point]
        });
      }
    });

    // 将计算好的聚合簇，转换成地图需要的 marker 格式
    let finalMarkers = clusters.map((cluster, index) => {
      const count = cluster.points.length;

      // 如果这个簇里只有一个点，就按普通点位渲染
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
      }
      // 如果簇里有多个点，渲染成聚合样式
      else {
        return {
          // 【注意】聚合点分配专属的 ID，从 9000 开始，方便点击时与普通点区分
          id: 9000 + index,
          latitude: cluster.centerLat,
          longitude: cluster.centerLng,
          iconPath: 'https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/markerDefault.png',
          width: 35,
          height: 35,
          callout: {
            // 把数量和一个代表点的名字拼起来，常显
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

  // ================= 监听地图手势缩放 =================
  onRegionChange(e) {
    // 只处理缩放结束的事件，拖动地图不管
    if (e.type !== 'end' || e.causedBy !== 'scale') return;

    const mapCtx = wx.createMapContext('showMap', this);
    // 通过接口获取真实的缩放级别，比直接读取 e.detail.scale 更准
    mapCtx.getScale({
      success: (res) => {
        const realScale = res.scale;
        // 如果两次缩放的差值极小，就不触发重绘，防止卡顿
        if (Math.abs(realScale - this.lastScale) < 0.2) return;

        const oldLevel = this.getLevelByScale(this.lastScale);
        const newLevel = this.getLevelByScale(realScale);

        // 更新记录的状态
        this.lastScale = realScale;

        // 如果用户手动缩小了地图（小于 19 级），说明退出了极限状态，解除强制拆解
        if (realScale < 19) {
          this.setData({
            isMaxZoom: false
          });
        }

        // 只有在层级发生跨越，或者当前处于第 3 层级时，才重新计算聚合
        if (oldLevel !== newLevel || newLevel === 3) {
          this.setData({
            scale: realScale
          });
          this.renderMarkers(realScale);
        }
      }
    });
  },

  // ================= 辅助方法：根据缩放级别划分层级 =================
  getLevelByScale(scale) {
    if (scale <= 13) return 1; // 大区
    if (scale <= 15) return 2; // 片区
    return 3; // 演出点
  },

  // ================= 统一点击事件处理 =================
  onMarkerTap(e) {
    if (!e.detail.markerId) return;

    // 【防抖处理】：如果用户在 600 毫秒内连续点击，只算一次，防止代码死循环或地图卡死
    const now = Date.now();
    if (this.lastClickTime && now - this.lastClickTime < 600) return;
    this.lastClickTime = now;

    const markerId = e.detail.markerId;
    // 从当前渲染的 markers 中找到被点击的那个
    const target = this.data.markers.find(m => m.id === markerId);

    if (!target) return;
    // 情况 1：点击的是 层级 1 或 层级 2（带有 isArea 属性）
    if (target.isArea) {
      // 决定下一跳的缩放级别：如果是大区就进到片区(14)，如果是片区就进到演出点(17)
      let nextScale = this.data.scale <= 13 ? 14 : 17;

      this.setData({
        latitude: target.latitude,
        longitude: target.longitude,
        scale: nextScale,
        isMaxZoom: false // 重置极限状态
      });
      this.lastScale = nextScale;

      // 延迟 400 毫秒，等地图飞行动画做完后，再渲染新一层级的点
      setTimeout(() => this.renderMarkers(nextScale), 400);
    }
    // 情况 2：点击的是自研聚合出来的“聚合点”（ID >= 9000）
    else if (markerId >= 9000) {
      // 直接拉到微信允许的最大缩放级别 20 级
      const maxScale = 20;

      // 先把状态置为极限状态，让 renderMarkers 走强制拆解逻辑
      this.setData({
        scale: maxScale,
        latitude: target.latitude,
        longitude: target.longitude,
        isMaxZoom: true
      });
      this.lastScale = maxScale;

      // 调用地图上下文，平滑移动视野中心到该点，并提供视觉上的“放大”冲击力
      const mapCtx = wx.createMapContext('showMap', this);
      mapCtx.moveToLocation({
        latitude: target.latitude,
        longitude: target.longitude,
        success: () => {
          // 动画完成后，立刻重新渲染，把强制拆解后的点铺上去
          this.renderMarkers(maxScale);
        }
      });
    }
    // 情况 3：点击的是普通的演出点（具体的一个点）
    else {
      // 弹窗展示详情
      wx.showModal({
        title: '演出详情',
        content: target.callout.content,
        showCancel: false
      });
    }
  },
});