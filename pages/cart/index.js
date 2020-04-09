// pages/cart/index.js
import {getSetting,chooseAddress,openSetting,showModal,showToast} from "../../utils/asyncWx.js";
// import { request } from "../../request/index.js";
import regeneratorRuntime from '../../libs/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address:{},
    cart:[],
    allChecked:false,
    totalPrice:0,
    totalNum:0,
  },

  onShow(){
    const address=wx.getStorageSync("address");
    //获取购物车数据
    const cart=wx.getStorageSync("cart")||[];

    this.setData({address});
    this.setCart(cart);
  },
  //点击 收货地址
  async handleChooseAddress(){
    try{
      const res1=await getSetting();
      const scopeAddress=res1.authSetting["scope.address"];
      if(scopeAddress===false){
        await openSetting();
      }
      const address=await chooseAddress();
      address.all=address.provinceName+address.cityName+address.countyName+address.detailInfo;
      wx.setStorageSync("address",address);
    }catch(error){
      console.log(error)
    }
  },

  //商品选中
  handleItemChange(e){
    //console.log(e);
    const goods_id=e.currentTarget.dataset.id;
    console.log(goods_id);
    let {cart}=this.data;

    let index=cart.findIndex(v=>v.goods_id===goods_id);

    console.log(index);

    cart[index].checked=!cart[index].checked;

    this.setCart(cart);
  },

  //商品全选功能
  handleItemAllCheck(){
    let {cart,allChecked}=this.data;
    allChecked=!allChecked;
    cart.forEach(v=>v.checked=allChecked);
    console.log(allChecked);
    this.setCart(cart);
  },

  //商品数量加减功能
  async handleItemNumEdit(e){
    const {operation,id}=e.currentTarget.dataset;
    let {cart}=this.data;
    const index=cart.findIndex(v=>v.goods_id===id);

    if(cart[index].num===1&&operation===-1){
      const res=await showModal({content:"是否要移除该商品?"});
      if(res.confirm){
        cart.splice(index,1);
        this.setCart(cart);
      }
    }else{
      cart[index].num+=operation;
      this.setCart(cart);
    }
  },

  //结算
  async handlePay(){
    const {address,totalNum}=this.data;
    if(!address.userName){
      await showToast({title:'您还没有选择收货地址'});
      return;
    }

    if(totalNum===0){
      await showToast({title:"购物车没有商品无法结算哦"});
      return;
    }

    wx.navigateTo({
      url:'/pages/pay/index'
    });
  },

  setCart(cart){
    let allChecked=cart.length>0?true:false;

    let totalPrice=0;
    let totalNum=0;

    cart.forEach(v=>{
      if(v.checked){
        totalPrice+=v.num*v.goods_price;
        totalNum+=v.num;
      }else{
        allChecked=false;
      }
    })

    this.setData({
      cart,
      allChecked,
      totalNum,
      totalPrice
    });
    wx.setStorageSync("cart",cart);
  }
})