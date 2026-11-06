import {
  request
} from "../utils/request"


// 酒店列表
export const hotelList = (data) => {
  return request({
    url: "/wx/hotel/hotelList",
    method: "get",
    data
  })
}

// 酒店房型列表
export const hotelInfor = (data) => {
  return request({
    url: "/wx/hotelInformation/hotelInformation",
    method: "get",
    data
  })
}

// 酒店详情
export const hotelDetail = (data) => {
  return request({
    url: "/wx/hotel/hotelDetails",
    method: "get",
    data
  })
}

// 酒店订单信息
export const hotelOrderDetail = (data) => {
  return request({
    url: "/wx/hotel/hotelOrderDetail",
    method: "get",
    data
  })
}