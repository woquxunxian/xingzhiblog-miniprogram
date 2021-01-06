const app = getApp()
const apiService = require('../../utils/requestUtil')
const showToastUtil = require('../../utils/showToastUtil')

Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    tagList: null,
    searchValue: "", //搜索值
  },
  onLoad() {
    this.getAllTag();
  },
  onReady() {

  },

  // 在输入时获取搜索框的文本
  getSearchBoxValue(e) {
    this.data.searchValue = e.detail.value;
    console.log(this.data.searchValue)
  },

  getAllTag(){
    apiService.get("/tag/all", {})
    .then(res => {
      this.getTagSuccess(res);
    })
    .catch(err => {
      this.getTagFail(err);
    })
  },



  onSearch(){
    let tagName = this.data.searchValue;
    // 如果用户没有输入值的话就默认搜索 设计模式 相关的内容
    if (tagName == "") {
      this.getAllTag();
      return;
    };
    apiService.get('/tag/search', {tagName,})
    .then(res => {
      this.getTagSuccess(res);
    })
    .catch(err => {
      this.getTagFail(err);
    })
  },

  getTagSuccess(res) {
    console.log(res);
    let tagList = res.data.data;
    if (tagList.length == 0) {
      showToastUtil.showNoResultToast();
      return;
    }
    this.setData({
      tagList: tagList,
    })
  },

  getTagFail(err) {
    console.log(err)
    showToastUtil.showErrorToast();
  }

});