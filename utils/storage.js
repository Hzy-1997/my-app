


export function SET(key, value, time) {
  if (time) {
    var seconds = parseInt(time);
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000 + seconds;
  }
  time = timestamp ? timestamp : ""
  console.log(key, value, time)
  wx.setStorageSync(key, value, time)
}


export function GET(key) {
  let data = wx.getStorageSync(key)
  console.log("值是什么", data)
  return data
  if (data) {
  }
}


