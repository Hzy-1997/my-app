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