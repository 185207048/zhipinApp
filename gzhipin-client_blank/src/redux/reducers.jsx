/*
    包含n个reducer函数，根据老的state和指定的action返回一个新的state
*/
import {combineReducers} from 'redux'
import {AUTH_SUCCESS,ERROR_MSG,RECEIVE_USER,RESET_USER,RECEIVE_USER_LIST} from './action-type'
import {getRedirectTo} from '../utils/index'
const inituser = {
    username:'',
    type:'',
    msg:'',//错误提示信息
    redirectTo:''//需要自动重定向
}

const initUserList = []

//产生user状态的reducer
function user(state=inituser,action){
    switch(action.type){
        case AUTH_SUCCESS:
            return  { ...action.data,redirectTo:getRedirectTo(action.data.type,action.data.header)} //这个路由分为四种情况进行路由 dashen laoban dasheninfo laobaninfo 计算方式1.先计算类型 2.计算是否已经完善线性
        case ERROR_MSG:
            return  {...state, msg:action.data}
        case RECEIVE_USER:
            return  {...action.data}
        case RESET_USER:
            return {...inituser, msg:action.data}
        default:   
            return state;
    }
}

function userlist(state=initUserList, action){
    switch(action.type){
        case RECEIVE_USER_LIST:
            return action.data
        default:
            return state
    }
}
export default combineReducers({
    user,
    userlist
});

//向外暴露的状态的结构：{user:{} , userlist:[]}
