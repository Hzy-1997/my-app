import {
  request
} from "../utils/request"


// 攻略列表
export const strategyListApi = (data) => {
  return request({
    url: "/wx/service/strategyList",
    method: "get",
    data
  })
}

export const strategyInfo = (data) => {
  return request({
    url: "/wx/service/strategyInfo",
    method: "get",
    data
  })
}

// 运动
export const getSportsList = (data) => {
  return request({
    url: "/service/sportsList",
    method: "get",
    data
  })
}
// 运动详情
export const getSportsInfo = (data) => {
  return request({
    url: "/wx/service/sportsInfo",
    method: "get",
    data
  })
}

// 休闲
export const leisureList = (data) => {
  return request({
    url: "/service/leisureList",
    method: "get",
    data
  })
}

// 休闲详情
export const getLeisureInfo = (data) => {
  return request({
    url: "/wx/service/leisureInfo",
    method: "get",
    data
  })
}

// 购物
export const shoppingList = (data) => {
  return request({
    url: "/service/shoppingList",
    method: "get",
    params: data
  })
}

// 购物详情
export const getCateringInfo = (data) => {
  return request({
    url: "/wx/service/cateringInfo",
    method: "get",
    data
  })
}

// 餐饮
export const cateringList = (data) => {
  return request({
    url: "/service/cateringList",
    method: "get",
    params: data
  })
}

// 餐饮详情
export const getShoppingInfo = (data) => {
  return request({
    url: "/wx/service/cateringInfo",
    method: "get",
    data
  })
}