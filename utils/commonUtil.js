const showErrorToast = () => {
  wx.showToast({
    title: '哎呀出错啦，稍后再来吧\n＞﹏＜',
    icon: 'none',
    duration: 2000
  })
} 

module.exports = {
  showErrorToast,
}