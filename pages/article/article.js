const app = getApp()
const apiService = require('../../utils/requestUtil')
const showToastUtil = require('../../utils/showToastUtil')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    md: "",
    // 文章内容
    articleContent: "",
    // 点赞图标路径
    likeIconSrc: "../../images/like_grey.png",
    // 收藏图标路径
    markIconSrc: "../../images/love_unSelect.png",
    // 用户是否已经登录
    isLogin: false,
    // 用户是否已经点赞
    isLike: false,
    // 输入框
    inputValue: "",
    // 用户个人信息
    userInfo: "",
    // 是否展示模态框
    modalName: "null",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    this.data.blogId = parseInt(options.blogId);
    let id = wx.getStorageSync('userId');
    if (id) this.getUserLikeStatus(id);
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
      // console.log(err)
    })
  },

  getBlogDeatilSuccees(res) {
    this.setData({
      articleContent: res.data.data.articleContent,
      articleCommentVOList: res.data.data.articleCommentVOList
    })
  },

  /**
   * 微信登录：在我这个项目中我的思路是这样的
   * 服务端：
      接收到登录请求时:
        1、接收小程序端传过来的用户基本信息和加密信息，解密加密信息
        2、得到UnionID，判断UnionID是否存在
          - 如果存在，则直接返回用户id
          - 如果不存在，则把用户微信头像、昵称、UnionID存入数据库，得到mysql自增主键
        3、返回id和UnionID给小程序端
      接收到需要登陆的业务请求时：
        1、接收到用户id，用id去进行业务操作
        2、返回响应数据

    微信小程序端：
      1、获取用户基本信息和加密信息
      2、把得到的数据发送给后端解密
      3、接收后端传回来的数据库自增id和微信生态的UnionID，存到缓存
      4、之后的每次使用到要登陆的业务会有两种情况：
        - 缓存的id还在，用缓存的id去请求业务
        - 缓存的id不在了，重新请求获取id
   */
  wxLogin() {
    wx.login({
      timeout: 2000,
      success: (result) => {
        wx.getUserInfo({
          success: res => {
            let data = {
              "rawData": res.rawData,
              "signature": res.signature,
              "code": result.code,
              "encryptedData": res.encryptedData,
              "iv": res.iv,
              "avatarUrl": res.userInfo.avatarUrl,
              "nickName": res.userInfo.nickName
            }
            // console.log(data)
            this.getUserInfoByAllData(data);
          }
        })
      }
    })
  },

  // 通过用户id获取用户信息
  getUserInfoById(id) {
    apiService.post('/wx/' + id)
      .then(res => {
        // console.log(res)
        this.data.userInfo = res.data.data
      })
      .catch(err => {
        // console.log(err)
        showToastUtil.showErrorToast();
      })
  },

  // 获取用户信息（即用户登录）并缓存用户id
  getUserInfoByAllData(data) {
    apiService.post('/wx/login', data)
    .then (res => {
      // console.log(res)
      this.data.userInfo = res.data.data;
      let id = parseInt(res.data.data.id);
      this.data.userId = id;
      this.data.isLogin = true;
      this.storageUserId(id)
      showToastUtil.showToast("登录成功啦~~");
      this.hideModal();
      this.getUserLikeStatus(id);
    })
    .catch (err => {
      // console.log(err)
      showToastUtil.showErrorToast();
    })
  },

  getUserLikeStatus(userId) {
    let data = {
      "blogId": this.data.blogId, 
      "userId": userId
    }
    apiService.get('/article/like/status', data)
    .then (res => {
      // console.log('/article/like/status', res);
      let isLike = res.data.data;
      this.data.isLike = isLike;
      if (isLike == 1) {
        this.setData({
          likeIconSrc: "../../images/like_red.png",
        })
      } else {
        this.setData({
          likeIconSrc: "../../images/like_grey.png",
        })
      }
    })
    .catch (err => {
      // console.log('/article/like/status', err);
      showToastUtil.showErrorToast();
    })
  },
  
  storageUserId(id) {
    wx.setStorageSync('userId', id);
  },

  /**
   * 我原本以为小程序端获取到头像图片路径
     是临时路径，所以就蒙着头把图片上传到七牛云的代码给写了，写完之后突然想起应该先
     查查其是不是临时路径，结果一看，还真不是...裂开了，算了，先用微信自己的吧
     不过貌似用户换了头像后之前的地址就不行了
   * @param {*} imgUrl 
   */
  getBase64: function(imgUrl){
    return new Promise(((resolve, reject) => {
      wx.downloadFile({
        url: imgUrl,
        success(res) {
          wx.getFileSystemManager().readFile({
            filePath: res.tempFilePath, 
            encoding: 'base64', 
              success: res => { 
                resolve(res.data)
              }
          })
        }
      })
    }))
  },

  sendComment(userId) {
    let data = {
      "blogId": this.data.blogId,
      "userId": userId,
      "content": this.data.inputValue
    }
    // console.log(data)
    apiService.get('/article/comment/parent',data)
    .then(res => {
      // console.log(res)
      showToastUtil.showSucceesToast();
      this.getCommentByBlogId(this.data.blogId);
      this.setData({
        inputValue:null,
      })
    })
    .catch(err => {
      // console.log(err)
      showToastUtil.showErrorToast();
    }) 
  },

  getCommentByBlogId(blogId) {
    apiService.get('/article/comment/' + blogId)
    .then (res => {
      // console.log('article/comment/', res)
      this.setData({
        articleCommentVOList: res.data.data
      })
    })
    .catch (err => {
      // console.log(err)
    })
  },

  // 模态框
  showModal() {
    this.setData({
      modalName: "Modal",
    })
  },
  hideModal() {
    this.setData({
      modalName: "cancel",
    })
  },

  onSend() {
    let id = wx.getStorageSync('userId');
    if(id) {
      this.sendComment(id);
    } else {
      this.showModal();
    }
  },

  /**
   * 点赞逻辑：
   * 如果用户没登陆，则让用户先登录
   * 如果用户登录了，则进行点赞操作
   */
  onLike() {
    let id = wx.getStorageSync('userId');
    if(id) {
      this.updateLikeStatus()
    } else {
      this.showModal();
    }
    // let id = wx.getStorageSync('userId');
    // if (id) {
    //   this.updateLikeStatus();
    // } else {
    //   // 没登陆就先登录，只执行登录操作
    //   this.wxLogin();
    // }
  },

  updateLikeStatus() {
    let blogId = this.data.blogId;
    let isLike = this.data.isLike;
    // 如果用户已经点赞了
    if (isLike == 1) {
      this.setData({
        likeIconSrc: "../../images/like_grey.png",
      })
      apiService.put('/article/unlike/number?blogId=' + blogId + '&userId=' + wx.getStorageSync('userId'))
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
        // console.log(err)
        this.setData({
          likeIconSrc: "../../images/like_red.png",
        })
        showToastUtil.showErrorToast();
      })
    } else { // 未点
      this.setData({
        likeIconSrc: "../../images/like_red.png",
      })
      apiService.put('/article/like/number?blogId=' + blogId + '&userId=' + wx.getStorageSync('userId'))
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
        // console.log(err)
        this.setData({
          likeIconSrc: "../../images/like_grey.png",
        })
        showToastUtil.showErrorToast();
      })
    }
  },

  updateViewNumber(blogId) {
    apiService.put('/article/view/number?blogId=' + blogId)
    .then(res => {
      // console.log(res)
    })
    .catch(err => {
      // console.log(err)
      showToastUtil.showErrorToast();
    })
  },
  
  onMark() {
    showToastUtil.showNoFunctionToast();
  },

   // 在输入时获取搜索框的文本
   getInputBoxValue(e) {
    this.data.inputValue = e.detail.value;
  },

})