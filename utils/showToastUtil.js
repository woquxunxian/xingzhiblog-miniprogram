const showErrorToast = () => {
  wx.showToast({
    title: '哎呀出错啦，稍后再来吧\n＞﹏＜',
    icon: 'none',
    duration: 2200
  })
}

const showNoResultToast = () => {
  wx.showToast({
    title: '哎呀，没有找到相关结果\n＞﹏＜',
    icon: 'none',
    duration: 2200
  })
}

const showNoFunctionToast = () => {
  wx.showToast({
    title: '哎呀，这个功能还没开发\n＞﹏＜',
    icon: 'none',
    duration: 2200
  })
}

const showSucceesToast = () => {
  wx.showToast({
    title: '操作成功啦',
    icon: 'none',
    duration: 2200
  })
}

// 自定义title
const showToast = (title) => {
  wx.showToast({
    title,
    icon: 'none',
    duration: 2200
  })
}

module.exports = {
  showErrorToast,
  showNoResultToast,
  showNoFunctionToast,
  showSucceesToast,
  showToast,
}