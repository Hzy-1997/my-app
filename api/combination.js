import {
  request
} from "../utils/request"


export const getPrimaryComboList = (data) => {
  return request({
    url: "/package/packageProductList",
    method: "get",
    data
  });
};

export const getPrimaryComboInfo = (data) => {
  return request({
    url: "/package/comboList",
    method: "get",
    data
  });
}