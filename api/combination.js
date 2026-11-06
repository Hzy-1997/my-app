import {
  request
} from "../utils/request"

// 套餐列表
export const getPrimaryComboList = (data) => {
  return request({
    url: "/package/packageProductList",
    method: "get",
    data
  });
};

// 套餐信息
export const getPrimaryComboInfo = (data) => {
  return request({
    url: "/package/comboList",
    method: "get",
    data
  });
}

// 套餐订单信息
export const getComboOrderInfo = (data) => {
  return request({
    url: "/wx/combo/comboOrderDetail",
    method: "get",
    data
  });
}