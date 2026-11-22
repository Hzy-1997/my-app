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