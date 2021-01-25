//index.js
const app = getApp()


Page({
  data: {
    avatarUrl: '../../images/user-unlogin.png',
    userInfo: {},
    login: false,
    isAdmin: false,
    _openid : ''
  },

  onLoad: function () {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      wx.showToast({
        title: '云服务不可用',
      })
      return
    }
     // 获取用户信息
    let self = this
    wx.getUserInfo({
      success: async function (res) {
        console.debug(res)
        var userInfo = res.userInfo
        var nickName = userInfo.nickName
        var avatarUrl = userInfo.avatarUrl
        self.setData({
          login: true,
          avatarUrl: avatarUrl,
          userInfo: userInfo
        })
        var ret = await wx.cloud.callFunction({
          name: 'login',
          data: {
            userInfo: {
              nickName: nickName,
              avatarUrl: avatarUrl
            }
          }
        })
        console.debug(ret)
        self.setData({
          _openid : ret.result.data.openid
        })

        if (ret.result.data.user == "admin") {//user
          self.setData({
            isAdmin: true
          })
        } 
      }
    })

  },
  onShow: function () {

  },
  onGetUserInfo: async function (e) {

    console.log(e)
    let self = this
    if (!this.data.login && e.detail.userInfo) {
      this.setData({
        login: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
      var ret = await wx.cloud.callFunction({
        name: 'login',
        data: {
          userInfo: {
            nickName: this.data.userInfo.nickName,
            avatarUrl: this.data.avatarUrl
          }
        }
      })
      if (ret.result.data.user == "admin") {//user
        self.setData({
          isAdmin: true
        })
      } else {
        wx.redirectTo({
          url: '../../customer/index/index?avatarUrl=' + self.data.avatarUrl +
            "&nickName=" + self.data.userInfo.nickName
        })
      }
    }

  },
  onSelectedCustomer: function (e) {

  },
  onSelectedAdmin: function (e) {

  },

  onShareAppMessage : function(e){
    
  }
})