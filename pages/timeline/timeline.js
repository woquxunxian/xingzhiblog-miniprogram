const app = getApp()
const apiService = require('../../utils/requestUtil')
const showToastUtil = require('../../utils/showToastUtil')

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getTimeLineData();
  },

  getTimeLineData() {
    apiService.get('/timeline/all')
    .then(res => {
      let data = res.data.data;
      console.log(data)
      this.getAllArticleCount(data);
      this.setData({
        timeLineList: data,
      })
    })
    .catch(err => {
      console.log(err)
      showToastUtil.showErrorToast();
    })
  },

  // 计算并展示文章总数
  getAllArticleCount(timeLineList) {
    let timeLineListLength = timeLineList.length;
    let sum = 0;
    for (let i = 0; i < timeLineListLength; ++i) {
      sum += timeLineList[i].count;
    }
    this.setData({
      articleNumber: sum,
    })
  }

})