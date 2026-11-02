import {
  request
} from "../utils/request"


export const getTouristServicesList = (data) => {
  return request({
    url: "/serviceSuggestions/touristServicesList",
    method: "get",
    data
  })
}


// 智能AI回答
export const questionsAnswersDetail = (data) => {
  return request({
    url: "/serviceSuggestions/questionsAnswersDetail",
    method: "post",
    data
  })
}