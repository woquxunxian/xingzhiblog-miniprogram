const app = getApp()
const apiService = require('../../utils/requestUtil')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    md: "- awdnjwad",
    articleContent: "<table class='ui celled table'><thead><tr><th>hello</th><th>hi</th><th>哈哈哈</th></tr></thead><tbody><tr><td>斯维尔多</td><td>士大夫</td><td>f啊</td></tr><tr><td>阿什顿发</td><td>非固定杆</td><td>撒阿什顿发</td></tr></tbody></table>"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      nickName: options.nickName,
      avatar: options.avatar,
      createTime: options.createTime
    })
    this.getBlogDeatil(options.blogId)
  },

  getBlogDeatil(blogId) {
    let data = {
      blogId,
    }
    apiService.get("/article/content", data)
    .then(res => {
      this.getBlogDeatilSuccees(res)
    })
    .catch(err => {
      console.log(err)
    })
  },

  getBlogDeatilSuccees(res) {
    this.setData({
      articleContent: res.data.data.articleContent,
      articleCommentVOList: res.data.data.articleCommentVOList
    })
  },

})