import {
  request
} from "../utils/request"

// 车位列表
export const parkingList = (data) => {
  return request({
    url: "/appointment/parkingList",
    method: "get",
    data
  })
}

// 车位详情（停车场静态信息 + 车位配置，不含时段可用性）
export const getParkingDetail = (data) => {
  return request({
    url: "/appointment/parkingDetail",
    method: "get",
    data
  })
}

// 查询指定时段的可选车位（每项含 available 标记，选车位页面用）
// data: { parkingId, startTime, endTime }，时段必须为整1小时
export const getParkingSpots = (data) => {
  return request({
    url: "/appointment/parkingSpots",
    method: "get",
    data
  })
}

// 停车场预约（选定具体车位 + 时段下单）
export const parkingAppointment = (data) => {
  return request({
    url: "/appointment/parkingAppointment",
    method: "post",
    data
  })
}