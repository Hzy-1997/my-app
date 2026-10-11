import {
  request
} from "../utils/request"


// 营地列表
export const campsiteList = (data) => {
  return request({
    url: "/appointment/campsiteList",
    method: "get",
    data,
  })
}

// 营地详情
export const campsiteDetail = (data) => {
  return request({
    url: "/appointment/campsiteDetail",
    method: "get",
    data,
  })
}

//期数详情
export const campsiteSessionDetail = (data) => {
  return request({
    url: "/appointment/campsiteSessionDetail",
    method: "get",
    data
  })
}