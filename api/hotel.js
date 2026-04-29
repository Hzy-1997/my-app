import {
  request
} from "../utils/request"


export const hotelList = (data) => {
  return request({
    url: "/wx/hotel/hotelList",
    method: "get",
    data
  })
}

export const hotelInfor = (data) => {
  return request({
    url: "/wx/hotelInformation/hotelInformation",
    method: "get",
    data
  })
}