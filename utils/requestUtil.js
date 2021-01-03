
const app = getApp()
 
const request = (url, options) => {
    return new Promise((resolve, reject) => {
        wx.showLoading({
            title: '加载中',
        })
        wx.request({
            url: `${app.globalData.baseUrl}${url}`,
            method: options.method,
            data: options.data,
            header: {
                'content-type': options.isObj ? 'application/json' : 'application/x-www-form-urlencoded',
            },
            success(res) {
                console.log(url + " : success");
                if (res.data.code == 1) {
                    resolve(res)
                } else {
                    reject(resolve)
                }
            },
            fail(error) {
                console.log(url + " : fail");
                reject(error.data)
            }, complete: () => {
                setTimeout(() => {
                    wx.hideLoading();
                }, 100);
            }
        })
    })
}
 
const get = (url, options = {}) => {
    return request(url, { method: 'GET', data: options })
}
 
//post对象
const postObj = (url, options) => {
    return request(url, { method: 'POST', data: options, isObj: true })
}
//post参数
const post = (url, options) => {
    return request(url, { method: 'POST', data: options, isObj: false })
}
 
const put = (url, options) => {
    return request(url, { method: 'PUT', data: options })
}
 
// 不能声明DELETE（关键字）
const remove = (url, options) => {
    return request(url, { method: 'DELETE', data: options })
}
 
module.exports = {
    get,
    post,
    put,
    remove,
    postObj,
}