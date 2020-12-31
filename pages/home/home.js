const app = getApp()
const apiService = require('../../utils/requestUtil')

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
  tabSelect(e) {
    console.log(e);
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
  },
  onLoad() {
    // this.getAllInfoById();
    this.getArticleList();
    let list = [];
    for (let i = 0; i < 26; i++) {
      list[i] = String.fromCharCode(65 + i)
    }
    this.setData({
      list: list,
      listCur: list[0]
    })
  },
  onReady() {

  },
  //获取文字信息
  getCur(e) {
    this.setData({
      hidden: false,
      listCur: this.data.list[e.target.id],
    })
  },

  setCur(e) {
    this.setData({
      hidden: true,
      listCur: this.data.listCur
    })
  },
  //滑动选择Item
  tMove(e) {
    let y = e.touches[0].clientY,
      offsettop = this.data.boxTop,
      that = this;
    //判断选择区域,只有在选择区才会生效
    if (y > offsettop) {
      let num = parseInt((y - offsettop) / 20);
      this.setData({
        listCur: that.data.list[num]
      })
    };
  },

  //触发全部开始选择
  tStart() {
    this.setData({
      hidden: false
    })
  },

  //触发结束选择
  tEnd() {
    this.setData({
      hidden: true,
      listCurID: this.data.listCur
    })
  },
  indexSelect(e) {
    let that = this;
    let barHeight = this.data.barHeight;
    let list = this.data.list;
    let scrollY = Math.ceil(list.length * e.detail.y / barHeight);
    for (let i = 0; i < list.length; i++) {
      if (scrollY < i + 1) {
        that.setData({
          listCur: list[i],
          movableY: i * 20
        })
        return false
      }
    }
  },

  /**
   *  ------------------------------ xingzhi ---------------------------
   **/

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
      wx.showToast({
        title: '博主数据获取失败',
        icon: 'none'
      })
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
      wx.showToast({
        title: '文章列表获取失败',
        icon: 'none'
      })
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

  /**
   *  -----------------------------------end----------------------------------
   **/

})
