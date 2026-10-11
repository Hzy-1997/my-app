// subpackages/ticketOrder/ticketOrder.js

import {
  ticketInfor
} from "../../api/ticketing.js"

import {
  formatDate
} from "../../utils/util"

import Toast from '@vant/weapp/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {

    id: 10,
    userName: "小学校",
    phone: "18782111202",
    error: {
      username: false,
      phone: false,
    },
    purchaseDate: "",

    originalPrice: "", //原价

    Price: 10, //价格
    totalPrice: 0, //总价

    discount: 5,
    totalDiscount: 0, //优惠
    ticketDetails: "",

    selectDate: "",
    // 日期
    minDate: new Date().getTime(),
    // minDate: new Date().getTime(),
    maxDate1: new Date(2026, 5, 31).getTime(),
    // maxDate: new Date(2026, 5, 24).getTime(), // 1月是0
    datePrices: [], // 存储从接口获取的日期价格数据
    priceMap: {}, // 创建一个日期到价格的映射，方便查找
    maxDate: "",
    formatter: null,
    show: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options)

    this.setData({
      id: options.id
    })

    this.getticketInfor()
    this.setData({
      purchaseDate: this.getPurchaseDate()
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


  // 获取商品信息
  async getticketInfor() {
    Toast.loading({
      message: '加载中...',
      forbidClick: true,
    });

    let res = await ticketInfor({
      id: this.data.id
    })
    console.log(res)
    if (res.code == 200) {
      res.data.banners = res.data.banners.split(',')
      res.data.typeDescription = res.data.typeDescription.split(",")

      // 创建日期到价格的映射
      const priceMap = {};
      res.data.datePrices.forEach(item => {
        priceMap[item.date] = {
          price: item.price,
          originalPrice: item.originalPrice,
          dateType: item.dateType,
          dateTypeName: item.dateTypeName
        };
      });
      console.log("日期映射", priceMap)
      console.log("出错数据", res.data)
      console.log("出错了", res.data.datePrices[0])
      this.setData({
        ticketDetails: res.data,
        datePrices: res.data.datePrices,
        priceMap: priceMap,
        // 设置默认价格为第一个日期的价格
        Price: res.data.datePrices[0].price,
        totalPrice: res.data.datePrices[0].price,
        originalPrice: res.data.datePrices[0].originalPrice,
        maxDate: new Date(res.data.priceRules[res.data.priceRules.length - 1].endDate).getTime(),
        totalDiscount: res.data.datePrices[0].originalPrice - res.data.datePrices[0].price
      })
      console.log("时间1", this.data.maxDate)
      console.log("时间2", this.data.maxDate1)
      this.setData({
        formatter: this.formatter.bind(this),
      })
    } else {
      Toast.fail('系统出错了');
    }
    Toast.clear()
  },

  // 获取当前时间
  getPurchaseDate(dateString) {
    console.log("处理日期", dateString)
    let date = ""
    if (dateString) {
      date = new Date(dateString);
    } else {
      date = new Date()
    }


    if (isNaN(date.getTime())) {
      console.error('Invalid date:', date);
      return ''; // 返回空字符串或处理错误
    }

    const month = date.getMonth() + 1;
    const day = date.getDate();
    console.log(`${month}/${day}`)
    return `${month}月${day}日`;
  },

  // 信息填写
  inforNameState(e) {
    console.log(e)
    const {
      phone
    } = this.data;
    this.setData({
      userName: e.detail,
      error: {
        phone: !phone,
      }
    })
  },
  inforPhoneState(e) {
    const {
      userName
    } = this.data;
    this.setData({
      phone: e.detail,
      error: {
        username: !userName,
      }
    })
  },

  // 计算总价
  onChange(event) {
    const quantity = event.detail;
    const selectedDate = this.data.selectDate;

    // 如果有选择日期，使用该日期的价格
    let price = this.data.Price;
    let originalPrice = this.data.originalPrice;

    if (selectedDate) {
      const priceInfo = this.data.priceMap[selectedDate];
      if (priceInfo) {
        price = priceInfo.price;
        originalPrice = priceInfo.originalPrice;
      }
    }

    const totalPrice = Number(price) * quantity;
    const totalDiscount = (Number(originalPrice) - Number(price)) * quantity;

    this.setData({
      totalPrice: totalPrice,
      totalDiscount: totalDiscount
    });
  },

  // 选择日期
  moreDates() {
    this.setData({
      show: true,
      formatter: this.formatter.bind(this),
    })
  },
  // 关闭选择日期
  onClose() {
    this.setData({
      show: false
    });
  },

  // 日期选择
  onConfirm(event) {
    console.log(event);
    const selectedDate = formatDate(event.detail);
    console.log('选择的日期:', selectedDate);

    // 获取选择日期的价格信息
    const priceInfo = this.data.priceMap[selectedDate];

    if (priceInfo) {
      // 更新价格
      const quantity = this.data.quantity || 1; // 假设有数量选择
      const totalPrice = Number(priceInfo.price) * quantity;
      const totalDiscount = (Number(priceInfo.originalPrice) - Number(priceInfo.price)) * quantity;

      this.setData({
        purchaseDate: this.getPurchaseDate(selectedDate),
        show: false,
        selectDate: selectedDate,
        Price: priceInfo.price,
        originalPrice: priceInfo.originalPrice,
        totalPrice: totalPrice,
        totalDiscount: totalDiscount
      });
    } else {
      // 如果没有找到该日期的价格，使用默认价格
      const defaultPrice = this.data.datePrices[0].price;
      const defaultOriginalPrice = this.data.datePrices[0].originalPrice;
      const quantity = this.data.quantity || 1;

      this.setData({
        purchaseDate: this.getPurchaseDate(selectedDate),
        show: false,
        selectDate: selectedDate,
        Price: defaultPrice,
        originalPrice: defaultOriginalPrice,
        totalPrice: defaultPrice * quantity,
        totalDiscount: (defaultOriginalPrice - defaultPrice) * quantity
      });

      Toast('该日期暂无价格信息');
    }
  },



  // 提交
  validateForm() {
    const {
      userName,
      phone,
      selectDate
    } = this.data;

    // 检查是否选择了日期
    if (!selectDate) {
      Toast.fail('请选择日期');
      return;
    }

    // 如果为空，显示错误
    if (!userName || !phone) {
      this.setData({
        error: {
          username: !userName,
          phone: !phone,
        }
      });
      return;
    }

    // 通过校验 
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      Toast.fail('手机号格式不正确');
      return;
    }

    // 获取选择日期的价格信息
    const priceInfo = this.data.priceMap[selectDate];

    if (userName && phone && priceInfo) {
      let data = {
        userName: userName,
        phone: phone,
        totalPrice: this.data.totalPrice,
        date: selectDate,
        price: priceInfo.price,
        originalPrice: priceInfo.originalPrice,
        dateType: priceInfo.dateType,
        dateTypeName: priceInfo.dateTypeName
      }

      console.log('提交数据:', data);
      //调用提交接口
    }
  },


  formatter(day) {
    // 获取 minDate 和 maxDate 的时间戳
    const minDate = new Date(this.data.minDate);
    const maxDate = new Date(this.data.maxDate);
    const dayDate = new Date(day.date);

    // 只比较年月日，忽略时间部分
    const currentDate = new Date(
      dayDate.getFullYear(),
      dayDate.getMonth(),
      dayDate.getDate()
    );

    const minDateOnly = new Date(minDate);
    const minDateYearMonthDay = new Date(
      minDateOnly.getFullYear(),
      minDateOnly.getMonth(),
      minDateOnly.getDate()
    ).getTime();

    const maxDateOnly = new Date(maxDate);
    const maxDateYearMonthDay = new Date(
      maxDateOnly.getFullYear(),
      maxDateOnly.getMonth(),
      maxDateOnly.getDate()
    ).getTime();

    const currentDateTimestamp = currentDate.getTime();

    day.bottomInfo = '';

    if (currentDateTimestamp >= minDateYearMonthDay && currentDateTimestamp <= maxDateYearMonthDay) {
      // 格式化日期为 YYYY-MM-DD
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const dayOfMonth = String(currentDate.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${dayOfMonth}`;

      // 从 priceMap 中获取对应日期的价格
      const priceInfo = this.data.priceMap[formattedDate];

      if (priceInfo) {
        // 显示实际价格，可以根据需要显示 originalPrice 或 price
        day.bottomInfo = `¥${priceInfo.price}`;

        // 如果需要显示折扣信息
        // day.bottomInfo = `¥${priceInfo.price}\n原价¥${priceInfo.originalPrice}`;
      }

      // 设置入住和离店信息
      if (day.type === 'start') {
        day.topInfo = '入住';
      } else if (day.type === 'end') {
        day.topInfo = '离店';
      }
    }

    return day;
  }
})