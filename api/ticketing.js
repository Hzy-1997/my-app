import {
  request
} from "../utils/request"


// 票务列表
export const ticketingListApi = (data) => {
  return request({
    url: "/wx/ticket/list",
    method: "get",
    data
  })
}

// 票务信息
export const ticketInfor = (data) => {
  return request({
    url: "/wx/ticket/infor",
    method: "get",
    data
  })
}

// 获取票务订单
export const ticketOrderDetail = (data) => {
  return request({
    url: "/wx/ticket/orderDetail",
    method: "get",
    data
  })
}