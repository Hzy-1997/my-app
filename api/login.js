import {
  request
} from "../utils/request"


export const login = (data) => {
  return request({
    url: "/wx/login/login",
    method: "post",
    data
  })
}

export const loginByPhone = (data) => {
  return request({
    url: "/wx/login/loginByPhone",
    method: "post",
    data
  })
}

export const getUserInfo = (data) => {
  return request({
    url: "/wx/login/memberInfo",
    method: "get",
    data
  })
}