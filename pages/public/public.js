// pages/public/public.js
var config = require('../../config/config.js');
var tips = require('../../components/tips.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    picList:[],
    region:[],
    classList: [
      {
      id: 0,
      name:'类别一'
      },
      {
        id: 1,
        name: '类别二'
      }],

  },
  chooseImg(){//选择图片
    let {picList=[]} = this.data;
    wx.chooseImage({
      success:(res)=>{
        const imgSrc = res.tempFilePaths;
        picList = picList.concat(imgSrc);
        this.setData({
          picList
        });
        const data = { path: imgSrc};
        // this.uploadimg(data);
      }
    })
  },
  uploadimg(data){//上传图片
    let that = this, i = data.i ? data.i : 0,
    success = data.success ? data.success : 0, 
    fail = data.fail ? data.fail : 0;
    wx.uploadFile({
      url: '',
      filePath: data.path[i],
      name: 'file',
      formData: null,//这里是上传图片时一起上传的数据
      success:(resp)=>{
        success++;

      },
      fail:(res)=>{
        fail++;
      },
      complete:()=>{
        i++;
        if(i == data.path.length){
          console.log('执行完毕');
        }else{
          data.i = i;
          data.success = success;
          data.fail = fail;
          that.uploadimg(data);
        }
      }
    })
  },
  regionChange(e){//选择地区
    this.setData({
      region: e.detail.value
    })
  },
  classChange(e) {//选择类别
    this.setData({
      classvalue: e.detail.value
    })
  },
  dateChange(e) {//选择日期
    this.setData({
      datevalue: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})