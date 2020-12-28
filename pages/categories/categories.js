const app = getApp()
const apiService = require('../../utils/requestUtil')

Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    tagList: null,
  },
  onLoad() {
    this.getAllTag();
  },
  onReady() {
    // let that = this;
    // wx.createSelectorQuery().select('.indexBar-box').boundingClientRect(function(res) {
    //   that.setData({
    //     boxTop: res.top
    //   })
    // }).exec();
    // wx.createSelectorQuery().select('.indexes').boundingClientRect(function(res) {
    //   that.setData({
    //     barTop: res.top
    //   })
    // }).exec()
  },

  getAllTag(){
    apiService.get("/blog/tag/all", {})
    .then(res => {
      console.log(res);
      let tagList = res.data.data;
      this.setData({
        tagList: tagList,
      })
    })
    .catch(err => {
      console.log(err)
    })
  }

});