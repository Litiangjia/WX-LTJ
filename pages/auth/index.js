// pages/auth/index.js
import {login} from "../../utils/asyncWx.js";
import { request } from "../../request/index.js";
import regeneratorRuntime from '../../libs/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  async handleGetUserInfo(e){
    try{
      //获取用户信息
      const {encryptedData,rawData,iv,signature}=e.detail;
      //获取小程序登录成功后的code
      const {code}=await login();
      const loginParms={encryptedData,rawData,iv,signature,code}
      //发送请求 获取用户的token
      const res=await request({url:"/users/wxlogin",data:loginParms,method:"post"});
      //const {token}=await request({url:"/users/wxlogin",data:loginParms,method:"post"});
      //由于不是企业账户所以暂时填写token
      wx.setStorageSync("token",'sdfdsfdsvdsvdsfdsf');

      wx.navigateBack({
        delta:1
      })
    }catch(error){
      
    }
  }
})