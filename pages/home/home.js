const app = getApp()
const apiService = require('../../utils/requestUtil')
const showToastUtil = require('../../utils/showToastUtil')

Page({
  data: {
    triggered: false,
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
    searchValue: "", //搜索文本，默认搜索设计模式
    isSearch: false, //是否进行了搜索行为
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
      this.getBlogInfo();
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
    // this.getBlogInfo();
    this.getArticleList();
  },
  onReady() {

  },

  // 在输入时获取搜索框的文本
  getSearchBoxValue(e) {
    this.data.searchValue = e.detail.value;
    console.log(this.data.searchValue)
  },

  // 搜索按钮事件
  onSearch() {
    let articleTitle = this.data.searchValue;
    // 如果用户没有输入值的话就默认搜索 设计模式 相关的内容
    if (articleTitle == "") articleTitle = "设计模式";
    apiService.get('/article/search', {articleTitle,})
    .then(res => {
      let blogList = res.data.data;
      if (blogList.length == 0) {
        showToastUtil.showNoResultToast();
        return;
      }
      console.log("/article/search",res)
      this.setData({
        blogList,
        isSearch: true
      })
    })
    .catch(err => {
      showToastUtil.showErrorToast();
    })
  },

  getBlogInfo(id) {
    apiService.get('/info/all')
    .then (res => {
      let blogInfo = res.data.data;
      this.setData({
        blogInfo,
      })
      app.blogInfo = blogInfo;
    })
    .catch (err => {
      showToastUtil.showErrorToast();
    })
  },

  getArticleList(e) {
    apiService.get('/article/all')
    .then (res => {
      let blogList = res.data.data;
      console.log("/article/all",res)
      this.setData({
        blogList,
      })
    })
    .catch (err => {
      console.log(err)
      showToastUtil.showErrorToast();
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

  navToHome(e) {
    this.getArticleList();
    this.setData({
      isSearch: false,
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

  // 重新请求接口获取数据
  refreshData(e) {
    this.getArticleList();
    this.setData({
      triggered: false
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
