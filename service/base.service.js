let utils = require("../utils/util.js");
const url = 'http://47.98.53.174:8080';
let formData;
const apiPrefixList = {
  MHYQ: url,
  MHYQMINIAPP: url + "/"


};
const apiPrefix = url + '/';
function qrstring(url, params) {
  let keys = Object.keys(params);
  let str = '';
  if (url.indexOf("?") == -1 && keys.length > 0) {
    str = '?';
    keys.map((item) => {
      str = str + "&" + item + "=" + params[item]
    })
  }
  return str;

}
function service({ formType, apiPrefix, url, method = 'get', params = {}, data = {}, header = {'content-type': 'application/json'}}) {
  return new Promise((reslove, reject) => {
    apiPrefix = apiPrefixList[apiPrefix] || apiPrefixList.MHYQMINIAPP;
    var urlData = apiPrefix + url + qrstring(url, params);
    wx.request({
      url: urlData,
      header,
      method,
      data,
      formData,
      formType,
      complete: function (res) {

      },
      success: function (res) {
        if (res.errMsg == "success" || res.errMsg == "request:ok" ) {
          reslove(res.data);
        } else {
          reject(res);
        }
      }

    });
  })

}
module.exports = {
  service
}