// pages/public/public.js
var config = require('../../config/config.js');
var tips = require('../../components/tips.js');
var app = getApp();
let publicService = require("../../service/public.service.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    picList:[],
    region:[],
    price:'',
    wokerTypeList: [],
    isShowNumberModal: false
  },
  chooseImg(){//选择图片
    wx.chooseImage({
      success:(res)=>{
        const imgSrc = res.tempFilePaths;
        const data = { path: imgSrc};
        this.uploadimg(data);
      }
    })
  },
  uploadimg(data){//上传图片
    let that = this, i = data.i ? data.i : 0,
    success = data.success ? data.success : 0, 
    fail = data.fail ? data.fail : 0;
    wx.uploadFile({
      url: 'http://47.98.53.174:8080/v1/attachment/common/upload',
      filePath: data.path[i],
      name: 'file',
      formData: null,//这里是上传图片时一起上传的数据
      success:(resp)=>{
        success++;
        let { picList = [], attachments=[] } = this.data;
        let data = JSON.parse(resp.data);
        picList.push('http://'+data.data.storeUri);
        attachments.push(data.data);
        this.setData({
          picList,
          attachments
        });
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
    console.log(this.data)
  },
  dateChange(e) {//选择日期
    this.setData({
      datevalue: e.detail.value
    })
  },
  openNumberModal() {//价格
    this.setData({
      isShowNumberModal: true
    })
  },
  closeNumberModal() {//价格
    this.setData({
      isShowNumberModal: false
    })
  },
  bindinput(e){
    let value = e.detail.value;
    let {name} = e.currentTarget.dataset;
    this.setData({
      [name]: value
    });
  },
  savePrice(e){
    let { priceSource} = this.data;
    if (priceSource && priceSource !=0){
      this.setData({
        price: priceSource,
        isShowNumberModal: false
      })
    }else{
      tips.show(this,'请输入价格',3000);
    }
  },
  publicSubmit(){
    wx.showLoading({
      title: '发布中'
    })
    let { subject, content, attachments, region, address, classvalue, wokerTypeList, datevalue, price} = this.data;
    let data = {
      userId: wx.getStorageSync('userId'),
      topic: subject,
      description: content,
      attachments,
      address:{
        nation:'中国',
        province: region[0],
        city: region[1],
        district: region[2],
        street: address
      },
      typeCode: wokerTypeList[classvalue].code,
      expireDate: datevalue,
      price
    }
    publicService.api({
      url: '/v1/order/release',
      method:'post',
      data
    }).then((res) => {
      wx.hideLoading();
      if(res.data){
        tips.show(this, '发布成功', 3000);
        this.setData({
          picList: [],
          region: [],
          price: '',
          wokerTypeList: [],
          subject: '', 
          content: '', 
          attachments: [], 
          address: '',
          classvalue: '',
          datevalue: ''

        })
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let wokerTypeList = wx.getStorageSync('wokerTypeList');
    this.setData({
      wokerTypeList
    })
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