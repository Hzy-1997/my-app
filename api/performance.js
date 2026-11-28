import {
  request
} from "../utils/request"


// 演出列表
export const strategyListApi = (data) => {
  return request({
    url: "/performance/performanceList",
    method: "get",
    data
  })
}

// 节目详细
export const performanceDetail = (data) => {
  return request({
    url: "/performance/performanceDetail",
    method: "get",
    data
  })
}

// 预约提醒
export const reminder = (data) => {
  return request({
    url: "/wx/subscribe/reminder",
    method: "post",
    data
  })
}

// 轮播图管理
export const bannerImageList = (data) => {
  return request({
    url: "/performance/bannerList",
    method: "get",
    data
  })
}


// 首页弹窗管理
export const popupImage = (data) => {
  return request({
    url: "/performance/popupList",
    method: "get",
    data
  })
}