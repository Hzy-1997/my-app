import {
  request
} from "../utils/request"


// 攻略列表
export const strategyListApi = (data) => {
  return request({
    url: "/wx/strategy/strategyList",
    method: "get",
    data
  })
}

export const strategyInfo = (data) => {
  return request({
    url: "/wx/strategy/strategyInfo",
    method: "get",
    data
  })
}