const app = getApp()
const apiService = require('../../utils/requestUtil')
const showToastUtil = require('../../utils/showToastUtil')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    md: "",
    articleContent: "",
    likeIconSrc: "../../images/like_grey.png",
    markIconSrc: "../../images/love_unSelect.png",
    isLike: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.data.blogId = options.blogId;
    this.setData({
      nickName: options.nickName,
      avatar: options.avatar,
      createTime: options.createTime
    })
    this.getBlogDeatil(options.blogId);
    this.updateViewNumber(options.blogId)
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

  onSend() {
    showToastUtil.showNoFunctionToast();
  },

  onLike() {
    // showToastUtil.showNoFunctionToast();
    let blogId = this.data.blogId;
    let isLike = this.data.isLike;
    // 如果用户已经点赞了
    if (isLike) {
      this.setData({
        likeIconSrc: "../../images/like_grey.png",
      })
      apiService.put('/article/number/unlike', {blogId,})
      .then(res => {
        if (res.data.data == 1) {
          this.data.isLike = false;
        } else {
          showToastUtil.showErrorToast();
          this.setData({
            likeIconSrc: "../../images/like_red.png",
          })
        }
      })
      .catch(err => {
        console.log(err)
        this.setData({
          likeIconSrc: "../../images/like_red.png",
        })
        showToastUtil.showErrorToast();
      })
    } else { // 未点
      this.setData({
        likeIconSrc: "../../images/like_red.png",
      })
      apiService.put('/article/number/like', {blogId,})
      .then(res => {
        if (res.data.data == 1) {
          this.data.isLike = true;
        } else {
          this.setData({
            likeIconSrc: "../../images/like_grey.png",
          })
          showToastUtil.showErrorToast();
        }
      })
      .catch(err => {
        console.log(err)
        this.setData({
          likeIconSrc: "../../images/like_grey.png",
        })
        showToastUtil.showErrorToast();
      })
    }
  },

  updateViewNumber(blogId) {
    // let blogId = this.data.blogId;
    apiService.put('/article/number/view', {blogId,})
    .then(res => {
      console.log(res)
    })
    .catch(err => {
      console.log(err)
      showToastUtil.showErrorToast();
    })
  },
  
  onMark() {
    showToastUtil.showNoFunctionToast();
  }

})