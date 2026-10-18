import {
  request
} from "../utils/request"


//  获取观光车列表
export const scenicBusList = (data) => {
  return request({
    url: "/appointment/scenicBusList",
    method: "get",
    data
  })
}

// 获取单个详情
export const scenicBusDetail = (data) => {
  return request({
    url: "/appointment/scenicBusDetail",
    method: "get",
    data
  })
}