// pages/cart/index.js
import {requestPayment,getSetting,chooseAddress,openSetting,showModal,showToast} from "../../utils/asyncWx.js";
import { request } from "../../request/index.js";
import regeneratorRuntime from '../../libs/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address:{},
    cart:[],
    totalPrice:0,
    totalNum:0,
  },

  onShow(){
    const address=wx.getStorageSync("address");
    //获取购物车数据
    let cart=wx.getStorageSync("cart")||[];

    cart=cart.filter(v=>v.checked);

    let totalPrice=0;
    let totalNum=0;

    cart.forEach(v=>{
      totalPrice+=v.num*v.goods_price;
      totalNum+=v.num;
    })

    this.setData({
      cart,
      totalNum,
      totalPrice,
      address
    });
  },

  //支付
  async handlePrderPay(){
    //console.log("sdfsdf");
    //判断缓存中有没有token
    const token=wx.getStorageSync("token");
    //判断
    if(!token){
      wx.navigateTo({url:'/pages/auth/index'},);
      return;
    }

    try{
      //创建订单
      //准备请求头参数
      const header={Authorization:token};
      //准备请求体参数
      const order_price=this.data.totalPrice;
      const consignee_addr=this.data.address;
      const cart=this.data.cart;
      let goods=[];
      cart.forEach(v=>goods.push({
        goods_id:v.goods_id,
        goods_number:v.num,
        goods_price:v.goods_price
      }))

      //准备发送请求 创建订单 获取订单编号
      const orderParms={order_price,consignee_addr,goods};
      //由于token是自己随便写的所以请求后不会得到订单编号
      const res=await request({url:"/my/orders/create",method:"POST",data:orderParms,header});
      //const {order_number}=await request({url:"/my/orders/create",method:"POST",data:orderParms,header});
      //自己写一个订单编号
      const order_number="HSDFL520332";

      //发起预支付接口
      const res2=await request({url:"/my/orders/req_unifiedorder",method:"POST",header,data:{order_number}});
      //const {pay}=await request({url:"/my/orders/req_unifiedorder",method:"POST",header,data:{order_number}});

      //由于订单编号自己生成所以不会获取成功 下面直接模
      const pay={
        nonceStr:"U6tYjNdYvm3ReKgI",
        package:"prepay_id=wx09182118356902a15c8b8d071931343000",
        paySign:"C514E29387794F84004C983AFFF4707F",
        signType:"MD5",
        timeStamp:"1565346079"
      }

      //发起微信支付
      const n=await requestPayment(pay);
    }catch(error){
      showToast({title:"由于没有企业账号无法做微信支付功能"});
    }
  }
})