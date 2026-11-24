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