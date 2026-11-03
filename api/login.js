import {
  request,
  uploadFile
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

export const updateUserInfo = (data) => {
  return request({
    url: "/wx/login/updateUserInfo",
    method: "post",
    data
  })
}

/**
 * 上传图片（头像等）
 * @param {String} filePath 本地临时文件路径
 * @returns {Promise} res.data.imgUrl 为 OSS 完整地址
 */
export const uploadImg = (filePath, category = 'common') => {
  return uploadFile({
    url: `/public/uploadWxImg?category=${category}`,
    filePath,
    name: 'file'
  });
};

export const recognizeIdCard = (filePath) => {
  return uploadFile({
    url: "/wx/login/recognizeIdCard",
    filePath,
    name: "file",
  })
}