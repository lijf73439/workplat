// pages/minecoupons/minecoupons.js
var couponService = require("./minecoupons.service");
var util = require('../../utils/util.js');
var app = getApp();
var userId = wx.getStorageSync('userId');
var tips = require('../../components/tips.js');
var loader = require('../../components/loader.js');
let _options ={};
Page({

  /**
   * 页面的初始数据
   */
  data: {
    coupons: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onPullDownRefresh: function () {
    this.onLoad(_options)
  },
  onLoad: function (options) {
    var that = this;
    this.setData({
      amountInfo: options
    })
    let { totalPrice } = options;
    loader.show(this);
    _options = options;
    couponService.getMyCoupons({ user: wx.getStorageSync('userId') })
    .then((res) => {
      res.coupons = res.coupons.map((item) => {
        return {
          ...item,
          expireTime: [util.formatTime(item.coupon.expireTime[0]), util.formatTime(item.coupon.expireTime[1])],
          tag: that.timeCal(item.coupon.expireTime[1], item.coupon.expireTime[0]),
          isValid: that.checkCouponValid(item, 0) 

        }
      });
      that.setData({
        coupons: res.coupons
      });
      loader.hide(that, 1);
      wx.stopPullDownRefresh();
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
    this.setData({
      selectedCouponId: app.selectedCouponId
    });
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#333333',
      animation: {
        duration: 400,
        timingFunc: 'easeIn'
      }
    })
  },
  checkCouponValid(item, totalPrice) {
    return util.checkCouponValid(item, this.data.amountInfo.totalPrice||0)
  },
  timeCal(value){
   var day = 1000 * 60 * 60 * 24*3;
    let endTime = new Date(value).getTime();
    let now = new Date().getTime();
    if (endTime < now){
      return '已过期';
    }
    if (value &&endTime>now&& endTime - now <= day){
        return '即将过期';
    }


  },
  voucherBtn: function (event) {
    if (!this.data.amountInfo.totalPrice) {
      return
    }
    var id = event.currentTarget.dataset.id;
    var item = this.data.coupons.find(item => item._id == id);
    var valid = this.checkCouponValid(item, this.data.amountInfo.totalPrice);
    if (valid) {
      app.selectedCouponId = id;
      this.setData({ selectedCouponId: id });
      wx.navigateTo({
        url: '/pages/confirmorder/confirmorder?id=' + id + '&amount=' + item.coupon.amount
      });
    } else {
      tips.show(this, '该优惠券暂无法使用', 500);
    }
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