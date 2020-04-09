// pages/category/index.js
import { request } from "../../request/index.js";
import regeneratorRuntime from '../../libs/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //左侧商品数据
    leftMenuList:[]
    //右侧商品数据
    ,rightContent:[]
    //左侧被点击的菜单
    ,currentIndex:0
    //右侧滚动条距离顶部位置
    ,scrollTop:0
  },
  //接口数据
  Cates:[],
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //https://api-hmugo-web.itheima.net/api/public/v1/categories

    const Cates=wx.getStorageSync('Cates');
    if(!Cates){
      this.getCates();
    }else{
      if(Date.now()-Cates.time>1000*10){
        console.log('过期')
        this.getCates();
      }else{
        console.log(Cates)
        console.log('有')
        this.Cates=Cates.data;
        //设置左侧菜单数据
        let leftMenuList = this.Cates.map(v => v.cat_name);
        //设置右侧的商品数据
        let rightContent = this.Cates[0].children;
        this.setData({
          leftMenuList,
          rightContent
        })
      }
    }
  },

  async getCates(){
    // request({ url:'/categories'}).then(res=>{
    //   this.Cates=res.data.message;
    //   wx.setStorageSync('Cates', { time: Date.now(), data: this.Cates});
    //   //设置左侧菜单数据
    //   let leftMenuList=this.Cates.map(v=>v.cat_name);
    //   //设置右侧的商品数据
    //   let rightContent=this.Cates[0].children;
    //   this.setData({
    //     leftMenuList,
    //     rightContent
    //   })
    // })


    //使用es7语法
    const res=await request({url:'/categories'});
    this.Cates=res.data.message;
    wx.setStorageSync('Cates', { time: Date.now(), data: this.Cates});
    //设置左侧菜单数据
    let leftMenuList=this.Cates.map(v=>v.cat_name);
    //设置右侧的商品数据
    let rightContent=this.Cates[0].children;
    this.setData({
      leftMenuList,
      rightContent
    })
  },

  //左侧菜单点击事件
  handleItemTap(e){
    const {index}=e.currentTarget.dataset;
    let rightContent=this.Cates[index].children;
    this.setData({
      currentIndex:index,
      rightContent,
      scrollTop:0
    })
  }
})