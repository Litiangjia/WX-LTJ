// pages/goos_detail/index.js
import { request } from "../../request/index.js";
import regeneratorRuntime from '../../libs/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj:{}
  },
  //商品对象
  GoodsInfo:{},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {goods_id}=options;
    this.getGoodsDetail(goods_id);
  },

  async getGoodsDetail(goods_id){
    const res=await request({url:"/goods/detail",data:{goods_id}});
    this.GoodsInfo=res.data.message;
    this.setData({
      goodsObj:{
        goods_name:res.data.message.goods_name,
        goods_price:res.data.message.goods_price,
        goods_introduce:res.data.message.goods_introduce.replace(/\.webp/g,'.jpg'),
        pics:res.data.message.pics,
      }
    })
  },

  handlePrevewImage(e){
    const urls=this.GoodsInfo.pics.map(v=>v.pics_big);
    const current=e.currentTarget.dataset.url;
    wx.previewImage({
      current,
      urls
    })
  },

  iscart:'',//防止频繁点击加入购物车(时间判定)
  //点击加入购物车事件
  handleCartAdd(){
    if(this.iscart==''||Date.now()-this.iscart>=1000*1){
      //获取缓存中的购物车数据数组
      let cart=wx.getStorageSync("cart")||[];
      //判断 商品对象是否存在于购物车数组中
      let index=cart.findIndex(v=>v.goods_id==this.GoodsInfo.goods_id);
      if(index===-1){
        //第一次添加
        this.GoodsInfo.num=1;
        this.GoodsInfo.checked=true;
        cart.push(this.GoodsInfo);
      }else{
        //追加
        cart[index].num++;
      }

      wx.setStorageSync("cart",cart);
      wx.showToast({
        title:'加入成功',
        icon:'success',
        mask:true,
      })

      this.iscart=Date.now();
    }else{
      wx.showToast({title:"别点太快"})
    }
  }
})