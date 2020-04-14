/*
    包含n个reducer函数，根据老的state和指定的action返回一个新的state
*/
import {combineReducers} from 'redux'
import {AUTH_SUCCESS,ERROR_MSG,RECEIVE_USER,RESET_USER,RECEIVE_USER_LIST,RECEIVE_MSG_LIST,RECEIVE_MSG, MSG_READ} from './action-type'
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

const initChat = {
    users:{},//所有用户信息的对象
    chatMsgs:[],//当前用户所以相关msg的数组
    unReadCount:0 //总的未读数量
}
//聊天的reducer
function chat(state=initChat,action){
    switch(action.type){
        case RECEIVE_MSG_LIST:
            const {users, chatMsgs , userid} = action.data
            return {
                users,
                chatMsgs,
                unReadCount:chatMsgs.reduce((preTotal, msg) => preTotal + (!msg.read && msg.to === userid?1:0),0)
            }
        case RECEIVE_MSG:
            const {chatMsg} = action.data
            return{
                users:state.users,
                chatMsgs: [...state.chatMsgs, chatMsg], //?????
                unReadCount:state.unReadCount + (!chatMsg.read && chatMsg.to === action.data.userid?1:0)
            }
        case MSG_READ:
            const {from, to ,count} = action.data
            state.chatMsgs.forEach(msg => {
                if(msg.from === from && msg.to === to && !msg.read){
                    return {...msg, read: true}
                }
            })
            return{
                users:state.users,
                chatMsgs: state.chatMsgs.map(msg => {
                    if(msg.from === from && msg.to === to && !msg.read){   //需要更新的
                        
                        return
                    }else{ //不需要更新
                        return msg
                    }
                }), //?????
                
                unReadCount:state.unReadCount - count
            }
        default:
            return state
    }
}

export default combineReducers({
    user,
    userlist,
    chat
});

//向外暴露的状态的结构：{user:{} , userlist:[] , chat:[]}
