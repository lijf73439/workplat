let baseService =  require("./base.service.js");
 function getConfig(){
  return  baseService.service({ url: "/customer-config", method:"get",params:{
    user: wx.getStorageSync('userId')
  }})
}
function getWorkerType() {
  return baseService.service({
    url: '/v1/dimension/workType/getAll'
  })
}
module.exports ={
  getConfig,
  getWorkerType
}