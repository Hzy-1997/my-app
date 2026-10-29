// subpackages/feedback/feedback.js

import {
  rawCountryData
} from "./data"

import Toast from '@vant/weapp/toast/toast';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    rawCountryData: rawCountryData,
    problemType: '',
    content: '',
    imageList: [],
    name: '',
    phone: '',
    columns: ['功能异常', '优化建议', '体验反馈', '景区问题', '其他问题'],
    index: "",
    groupedCountries: [],
    letterList: [],
    show: false,
    // 索引相关状态
    letters: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
    letterMap: {}, // 记录哪些字母有数据，用于置灰没数据的字母
    activeLetter: '', // 当前高亮的字母
    scrollIntoView: '', // 控制滚动到的锚点ID

    // 内部计算使用
    groupPositions: [], // 记录每个分组在列表中的位置
    scrollTop: 0,
    listScrollHeight: 0,
    totalHeight: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 1. 格式化数据
    const {
      groupedCountries
    } = this.formatDataByEnglish(rawCountryData);

    // 2. 生成右侧可用字母的字典
    const letterMap = {};
    groupedCountries.forEach(group => {
      letterMap[group.letter] = true;
    });

    // 3. 一次性 setData，保证数据同步
    this.setData({
      groupedCountries,
      letterMap,
      activeLetter: groupedCountries.length > 0 ? groupedCountries[0].letter : ''
    });

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

  // 自动按照英文首字母分组并排序
  formatDataByEnglish(data) {
    const groupedMap = {};

    data.forEach(item => {
      // 1. 取英文名的第一个字母，并转大写
      let firstLetter = item.en.charAt(0).toUpperCase();

      // 2. 防止异常数据（比如首字母不是A-Z的，统一放到 '#'）
      if (!/[A-Z]/.test(firstLetter)) {
        firstLetter = '#';
      }

      // 3. 塞入对应分组
      if (!groupedMap[firstLetter]) {
        groupedMap[firstLetter] = [];
      }

      // 把数据组装成我们需要的格式
      groupedMap[firstLetter].push({
        name: item.cn,
        code: item.code,
        letter: firstLetter,
        en: item.en // 保留英文名备用
      });
    });

    // 4. 提取存在的字母并排序 (A-Z, 最后是 #)
    const sortedLetters = Object.keys(groupedMap).sort((a, b) => {
      if (a === '#') return 1;
      if (b === '#') return -1;
      return a.localeCompare(b);
    });

    // 5. 组装成 WXML 需要的数组结构
    return {
      groupedCountries: sortedLetters.map(letter => ({
        letter: letter,
        list: groupedMap[letter]
      })),
      letterList: sortedLetters // 用于渲染右侧索引条
    };
  },
  // 问题选择
  bindPickerChange(e) {
    console.log(e)
    let {
      value
    } = e.detail

    this.setData({
      index: value
    })
  },



  // 监听文本输入
  onInput(e) {
    console.log(e)
    let {
      cursor,
      value
    } = e.detail

    if (cursor === 200) {
      // 震动提示
      wx.vibrateShort({
        type: 'heavy'
      });
      Toast('最多只能输入200字哦');
      return;
    }

    this.setData({
      content: value
    });
  },

  // 监听姓名输入
  onNameInput(e) {
    this.setData({
      name: e.detail.value
    });
  },

  // 监听手机号输入
  onPhoneInput(e) {
    this.setData({
      phone: e.detail.value
    });
  },

  // 选择图片
  chooseImage() {
    const that = this;
    wx.chooseMedia({
      count: 3 - that.data.imageList.length,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success(res) {
        const tempFiles = res.tempFiles;
        const newImages = tempFiles.map(item => item.tempFilePath);
        that.setData({
          imageList: that.data.imageList.concat(newImages)
        });
      }
    });
  },

  // 删除图片
  deleteImage(e) {
    const index = e.currentTarget.dataset.index;
    const list = this.data.imageList;
    list.splice(index, 1);
    this.setData({
      imageList: list
    });
  },

  // 提交反馈
  submitFeedback() {
    const {
      problemType,
      content,
      name,
      phone
    } = this.data;

    // 简单校验
    if (!problemType) {
      return wx.showToast({
        title: '请选择问题类型',
        icon: 'none'
      });
    }
    if (!content) {
      return wx.showToast({
        title: '请输入反馈内容',
        icon: 'none'
      });
    }

    // 这里通常需要先调用 wx.uploadFile 上传图片，然后再调用接口提交表单
    console.log('提交的数据：', {
      type: problemType,
      content,
      name,
      phone,
      images: this.data.imageList
    });

    wx.showLoading({
      title: '提交中...'
    });

    // 模拟网络请求
    setTimeout(() => {
      wx.hideLoading();
      wx.showToast({
        title: '提交成功',
        icon: 'success',
        duration: 2000,
        success: () => {
          // 提交成功后返回
          setTimeout(() => {
            wx.navigateBack();
          }, 2000);
        }
      });
    }, 1000);
  },
  /* =========== 弹窗相关 =========== */
  showPopup() {
    this.setData({
      show: true
    });
    // 使用 setTimeout 等待弹窗动画完成后再计算高度
    setTimeout(() => {
      this.calculatePositions();
    }, 400); // 稍微调大一点时间，确保 Vant 弹窗完全渲染
  },

  onClose() {
    this.setData({
      show: false
    });
  },

  // 初始化数据处理
  initData() {
    const {
      groupedCountries,
      letters
    } = this.data;
    const letterMap = {};

    // 1. 生成 letterMap
    groupedCountries.forEach(group => {
      letterMap[group.letter] = true;
    });

    this.setData({
      letterMap
    });
  },

  // 打开弹窗时调用
  openPopup() {
    this.setData({
      show: true,
      activeLetter: this.data.groupedCountries[0]?.letter || ''
    });
    // 等弹窗渲染完成后，获取各个元素的高度位置用于滚动监听
    setTimeout(() => {
      this.calculatePositions();
    }, 300);
  },

  onClose() {
    this.setData({
      show: false
    });
  },

  // 计算每个字母分组的高度位置
  calculatePositions() {
    const query = wx.createSelectorQuery().in(this);
    query.selectAll('.group-anchor').boundingClientRect();
    query.select('.list-scroll').boundingClientRect();
    query.exec((res) => {
      if (!res[0] || !res[1] || res[0].length === 0) return;

      const anchors = res[0];
      const scrollViewRect = res[1];

      const groupPositions = [];
      anchors.forEach((anchor, index) => {
        groupPositions.push({
          letter: this.data.groupedCountries[index].letter,
          // 为了更精准，向下取整
          top: Math.floor(anchor.top - scrollViewRect.top)
        });
      });

      this.setData({
        groupPositions
      });
    });
  },

  noop() {},
  // 点击右侧字母
  onIndexClick(e) {
    const letter = e.currentTarget.dataset.letter;
    if (!this.data.letterMap[letter]) return;

    const anchorId = letter === '#' ? 'sharp' : letter;

    // 关键：先清空，再设置，强制 scroll-view 重新触发滚动
    console.log("letter", letter)
    this.setData({
      scrollIntoView: '',
      activeLetter: letter
    }, () => {
      // 下一帧再设置，确保值变化能触发滚动
      wx.nextTick(() => {
        this.setData({
          scrollIntoView: `anchor-${anchorId}`
        });
      });
    });
  },

  // 列表滚动时，计算当前高亮的字母
  onListScroll(e) {
    const scrollTop = e.detail.scrollTop;
    const {
      groupPositions
    } = this.data;
    if (groupPositions.length === 0) return;

    // 关键修复：把 offset 改大一点（比如 20-40 左右）
    // 因为标题栏是有高度的（大概30px），当 L 的标题刚好滑到顶部时，才应该高亮 L
    const offset = 35;
    let currentLetter = groupPositions[0].letter;

    for (let i = 0; i < groupPositions.length; i++) {
      // 如果滚动距离 大于 该字母的位置 减去 偏移量，说明已经滑到了这个字母的区域
      if (scrollTop >= groupPositions[i].top - offset) {
        currentLetter = groupPositions[i].letter;
      } else {
        break; // 后面的更靠下，不用比了
      }
    }

    if (this.data.activeLetter !== currentLetter) {
      this.setData({
        activeLetter: currentLetter
      });
    }
  },

  // 选中国家
  onSelectCountry(e) {
    const country = e.currentTarget.dataset.item;
    console.log('选中国家：', country);
    this.setData({
      show: false
    });
    // 这里可以处理你选中国家的业务逻辑，比如把区号填入输入框
  },
  chooseImage() {
    const that = this;
    wx.chooseMedia({
      count: 3 - that.data.imageList.length,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success(res) {
        const tempFiles = res.tempFiles;
        const newImages = tempFiles.map(item => item.tempFilePath);
        that.setData({
          imageList: that.data.imageList.concat(newImages)
        });
      }
    });
  },

  deleteImage(e) {
    const index = e.currentTarget.dataset.index;
    const list = this.data.imageList;
    list.splice(index, 1);
    this.setData({
      imageList: list
    });
  },
})