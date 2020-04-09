//index.js
//获取应用实例
 const app = getApp()
import {request} from "../../request/index.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //轮播图数组
    swiperList:[]
    //导航数组
    ,catesList:[]
    //
    ,floorList:[]
  },

  //开始加载页面触发
  onLoad: function (options) {
    this.getSwiperList();
    this.getCateList();
    this.getFloorList();
  },

  getSwiperList(){
    request({ url: '/home/swiperdata' }).then(res => {
      this.setData({
        swiperList: res.data.message
      })
    })
  },
  //获取分类导航数据
  getCateList() {
    request({ url: '/home/catitems' }).then(res => {
      this.setData({
        catesList: res.data.message
      })
    })
  },
  //获取楼层数据
  getFloorList(){
    request({ url: '/home/floordata' }).then(res => {
      this.setData({
        floorList: res.data.message
      })
    })
  }
})
