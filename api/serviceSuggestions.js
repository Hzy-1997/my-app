import {
  request
} from "../utils/request"

// 智能问答题目及答案
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

// 意见反馈
export const feedbackOperation = (data) => {
  return request({
    url: "/serviceSuggestions/opinionsFeedbackOperation",
    method: "post",
    data
  })

}