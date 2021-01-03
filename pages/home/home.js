const app = getApp()
const apiService = require('../../utils/requestUtil')
const commonUtil = require('../../utils/commonUtil')

Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    TabCur: 1,
    scrollLeft: 0,
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    hidden: true,
    blogInfo: null,
    infoModal:"",
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  showModal(e) {
    if (this.data.blogInfo == null) {
      this.getAllInfoById();
    }
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },

  onLoad() {
    // this.getAllInfoById();
    this.getArticleList();
  },
  onReady() {

  },

  getAllInfoById(id) {
    apiService.get('/info/all')
    .then (res => {
      let blogInfo = res.data.data;
      this.setData({
        blogInfo,
      })
      app.blogInfo = blogInfo;
    })
    .catch (err => {
      commonUtil.showErrorToast();
    })
  },

  getArticleList(e) {
    apiService.get('/article/all')
    .then (res => {
      let blogList = res.data.data;
      console.log(res)
      this.setData({
        blogList,
      })
    })
    .catch (err => {
      console.log(err)
      commonUtil.showErrorToast();
    })
  },

  navToArticle(e) {
    let data = e.currentTarget.dataset;
    let id = data.blogid;
    let avatar = data.avatar;
    let nickName = data.nickname;
    let createTime = data.createtime;
    wx.navigateTo({
      url: `${"../article/article?blogId="}${id}${"&avatar="}${avatar}
      ${"&nickName="}${nickName}${"&createTime="}${createTime}`,
    })
  },
  showInfoModal(e) {
    let target = e.currentTarget.dataset.target;
    this.setData({
      infoModal: target,
    })
  },

  hideInfoModal(e) {
    this.setData({
      infoModal: null
    })
  },

  showLoading(e) {
    wx.showToast({
      title: '数据加载中...',
      icon: 'none'
    })
  },

  navToCataegories(e) {
    wx.navigateTo({
      url: '/pages/categories/categories',
    })
  },

  navToTimeLine(e) {
    wx.navigateTo({
      url: '/pages/timeline/timeline',
    })
  },


})
