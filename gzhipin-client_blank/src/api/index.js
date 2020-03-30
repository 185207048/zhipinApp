/*
包含了n个接口请求的模块
*/
import ajax from '../api/ajax'
//注册接口
export const reqRegister =(user) => ajax('/register',user,'POST');
//登录接口
export const reqLogin =(user) => ajax('/login',user,'POST');
//更新用户接口
export const reqUpdata =(user) => ajax('/update',user,'POST');
//获取用户信息
export const reqUser = () => ajax('/user',{},'GET');
//获取用户列表
export const reqUserList = (type) => ajax('/userlist',{type},'GET');
