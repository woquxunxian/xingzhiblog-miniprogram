const app = getApp()

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
    blogInfo: "",
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
    this.getAllInfoById();
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
    wx.request({
      url: 'http://localhost:8081/info/blog',
      data: {
        id: 1
      },
      method: 'GET',
      success: res => {
        let blogInfo = res.data.data;
        this.setData({
          blogInfo,
        })
        app.blogInfo = blogInfo;
      },
      fail: err => {
        wx.showToast({
          title: '博客信息获取失败',
          icon: 'none'
        })
      }
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

  longTapCopy(e) {
    
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
