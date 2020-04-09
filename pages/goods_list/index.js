// pages/goods_list/index.js
import { request } from "../../request/index.js";
import regeneratorRuntime from '../../libs/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs:[
      {
        id:0,
        value:"综合",
        isActive:true
      },
      {
        id:1,
        value:"销量",
        isActive:false
      },
      {
        id:2,
        value:"价格",
        isActive:false
      },
    ],
    goodsList: []
  },
  //接口参数
  QueryParams:{
    query:"",
    cid:"",
    pagenum:1,
    pagesize:10
  },

  //总页数 默认值1
  totalPages:1,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.QueryParams.cid=options.cid;
    this.getGoodsList();
  },

  //获取商品数据
  async getGoodsList(){
    const res=await request({url:"/goods/search",data:this.QueryParams});
    
    //获取 总条数
    const total=res.data.message.total;
    //计算总页数
    this.totalPages=Math.ceil(total/this.QueryParams.pagesize);
    this.setData({
      goodsList:[...this.data.goodsList,...res.data.message.goods]
    })
  },


  //标题点击事件（子组件传递）
  handleTabsItemChange(e){
    const {index}=e.detail;
    let {tabs}=this.data;
    tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
    this.setData({
      tabs
    })
  },

  //页面滑动 滚动条触底事件
  onReachBottom(){
   // console.log("sdfdsf");
    if(this.QueryParams.pagenum>=this.totalPages){
      //没有数据
      wx.showToast({title: '没有数据了'})
    }else{
      //还有数据
      this.QueryParams.pagenum++;
      this.getGoodsList();
    }
  },

  //下拉刷新事件
  onPullDownRefresh(){
    this.setData({goodsList:[]})
    this.QueryParams.pagenum=1;
    this.getGoodsList();
    wx.stopPullDownRefresh();
  }

})