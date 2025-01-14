import {request} from '../../utils/util'

const app = getApp()
Page({
  data: {
    searchResult: {
      songs: []
    },
    isShowSearchConent: false,
    isShowSearchPanel: false,
    hotTextList: [],
    newBannerList: [],
    recommendListOfficial: [],
    recommendListClassical: [],
    recommendListLove: [],
    recommendListNet: [],
    recommendListKtv: [],
    historyList: [],
    keyValue: '',
    isFocus: false,
    mapList: {
      3317: 'recommendListOfficial',
      59: 'recommendListClassical',
      71: 'recommendListLove',
      3056: 'recommendListNet',
      64: 'recommendListKtv'
    },
    userInfo: {
      nickName: 'Mr.Carl'
    }
  },
  onLoad() {
    this.getRecommendList(3317)
    this.getRecommendList(59)
    this.getRecommendList(71)
    this.getRecommendList(3056)
    this.getRecommendList(64)
    this.getBanner()
  },
  getHistory() {
    let historyList = JSON.parse(wx.getStorageSync('searchKey') ? wx.getStorageSync('searchKey') : '[]')
    this.setData({
      historyList
    })
  },
  deleteSearch() {
    this.setData({
      keyValue: ''
    })
  },
  bindblurSearch() {
    this.setData({
      isFocus: false
    })
  },
  bindFocus() {
    this.getHistory()
    this.getHotTextList()
    this.setData({
      isShowSearchConent: false,
      isShowSearchPanel: true,
      isFocus: true
    })
  },
  chooseHotText(e) {
    let keyValue = e.currentTarget.dataset.key
    this.setData({
      keyValue
    })
    this.getSearchContent(keyValue)
  },
  toIndex() {
    this.setData({
      isShowSearchConent: false,
      isShowSearchPanel:false
    })
  },
  bindconfirm(e) {
    let value = e.detail.value
    this.getSearchContent(value)
  },
  bindblur() {
    this.setData({
      isShowSearchPanel: false
    })
  },
  playMusic(e) {
    wx.navigateTo({
      url: `/pages/play/play?mid=${e.currentTarget.dataset.mid}`
    })
  },
  deleteHis(e) {
    e.cancel
    let key = e.currentTarget.dataset.key
    let keyArr = JSON.parse(wx.getStorageSync('searchKey'))
    let index = keyArr.indexOf(key)
    keyArr.splice(index,1)
    wx.setStorageSync('searchKey', JSON.stringify(keyArr))
    this.setData({
      historyList: keyArr
    })
  },
  getSearchContent(key) {
    let keyArr = wx.getStorageSync('searchKey')
    if(!keyArr) {  
      wx.setStorageSync('searchKey', JSON.stringify([key]))
    }else{
      let arr = JSON.parse(keyArr)
      arr.push(key)
      arr = Array.from(new Set(arr))
      wx.setStorageSync('searchKey', JSON.stringify(arr))
    }
    this.setData({
      isShowSearchPanel: false,
      isShowSearchConent: true,
      'searchResult.songs': []
    })
    request({
      url: 'search',
      data: {
        key,
        pageSize:40
      }
    }).then(({data:{list}})=>{
      this.setData({
        'searchResult.songs': list
      })
    })
  },
  getHotTextList() {
    request({
      url:'search/hot'
    }).then(({data})=>{
      this.setData({
        hotTextList: data.slice(0,10)
      })
    })
  },
  getRecommendList(id){
    request({
      url:'recommend/playlist',
      data: {
        id,
        pageNo: 1,
        pageSize: 20
      }
    }).then(({data:{list}})=>{
      this.setData({
        [this.data.mapList[id]]: list
      })
    })
  },
  chooseBanner(e) {
    // let id = e.currentTarget.dataset.id
    // wx.navigateTo({
    //   url: `/pages/menu/menu?albumId=${id}`
    // })
    wx.showToast({
      title: '别点了，跳转功能还需要完善~', //banner接口仅会返回专辑推荐，但是只能获取 albumid，非 albummid
      icon: 'none'
    })
  },
  goToDeatailMenu(e){
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/menu/menu?id=${id}`
    })
  },
  getBanner() {
    request({
      url:'recommend/banner'
    }).then(({data:newBannerList})=>{
      
      this.setData({
        newBannerList
      })
    })
  },
  toPlay() {
    wx.navigateTo({
      url: '/pages/play/play'
    })
  }
})
