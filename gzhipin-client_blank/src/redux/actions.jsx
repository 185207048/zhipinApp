/*
包含n个action creator
异步action
同步action

TypeError: Object(...) is not a function 是版本不匹配，将版本降成6.0.1
*/
//注册异步acition
import {reqRegister,reqLogin,reqUpdata,reqUser, reqUserList, reqChatMsgList, reqReadMsg} from '../api'
import {AUTH_SUCCESS,ERROR_MSG,RECEIVE_USER,RESET_USER, RECEIVE_USER_LIST,RECEIVE_MSG,RECEIVE_MSG_LIST,MSG_READ} from './action-type'
import io from 'socket.io-client'
/*同步action */
export const authSuccess = (user) =>({type:AUTH_SUCCESS,data:user});
export const errorMsg = (msg) =>({type:ERROR_MSG,data:msg});
export const receiveUser = (user) => ({type:RECEIVE_USER,data:user});
export const resetUser = (msg) => ({type:RESET_USER,data:msg});
export const receiveUserList = (userList) => ({type:RECEIVE_USER_LIST,data:userList});
export const receiveMsgList = ({users,chatMsgs,userid}) => ({type:RECEIVE_MSG_LIST,data:{users,chatMsgs}})
//接收一个消息的同步action
const  receiveMsg = (chatMsg,userid) => ({type:RECEIVE_MSG, data:{chatMsg,userid}})
//读取某个聊天消息的同步action
const msgRead = ({count, from ,to}) => ({type: MSG_READ, data:{count, from ,to} })
// 异步获取消息列表数据
async function getMsgList(dispatch,userid){ //https://emojipedia.org/
    initIO(dispatch,userid)
    const response = await reqChatMsgList()
    const result = response.data
    if(result.code === 0){
        const {users,chatMsgs} = result.data
        // 分发同步action
        dispatch(receiveMsgList({users,chatMsgs,userid}))
    }
}

/*异步action */
export const register = (user) =>{
    const {username,password,password2,type} = user;
    if(!username){
        return errorMsg('不能为空');
    }
    if(password !== password2){ //前台验证
        return errorMsg('两次密码要一致');
    }
    return async dispatch =>{
        //发送注册的异步请求
        // const promise = reqRegister(user);
        // promise.then(response=>{
        //     const result = response.data; //{code:1,data}
        // })
        const response = await reqRegister({username,password,type});
        const result = response.data;
        if(result.code === 0){
            getMsgList(dispatch, result.data._id)
            dispatch(authSuccess(result.data));
        }else{
            dispatch(errorMsg(result.msg));
        }
    }
}

export const login = (user) =>{
    const {username,password} = user;
    if(!username){
        return errorMsg('不能为空');
    }
    if(!password){
        return errorMsg('不能为空');
    }
    return async dispatch =>{
        //发送注册的异步请求
        // promise.then(response=>{
        //     const result = response.data; //{code:1,data}
        // })
        const response = await reqLogin(user);
        const result = response.data;
        if(result.code === 0){
            getMsgList(dispatch, result.data._id)
            dispatch(authSuccess(result.data));
        }else{
            dispatch(errorMsg(result.msg));
        }
    }
}

export const updateUser = (user) => {
    return async dispatch => {
        const response = await reqUpdata(user);
        const result = response.data;
        if(result.code === 0){  //更新成功:data
            dispatch(receiveUser(result.data));
        }else{
            dispatch(resetUser(result.msg));
        }
    }
}

export const getUser = () =>{
    return async dispatch =>{
        //执行异步请求
        const response = await reqUser();
        const result = response.data;
        if(result.code === 0){
            getMsgList(dispatch, result.data._id)
            dispatch(receiveUser(result.data));
        }else{
            dispatch(resetUser(result.msg));
        }
    }
}

export const getUserList = (type) =>{
    return async dispatch => {
        //执行异步ajax请求
        const response = await reqUserList(type);
        const result = response.data;
        //分发给redux
        if(result.code === 0){
            dispatch(receiveUserList(result.data));
        }
    }
}

// 引入io,单例对象
// 1.创建对象之前：判断对象是否已经创建，只有没有创建才会创建
// 2.创建对象之后：保存对象
function initIO(dispatch,userid){
    if(!io.socket){
        //连接服务器
        io.socket = io('ws://localhost:4000')
    }
    // 绑定监听，接收服务器发送消息
    io.socket.on('receiveMsg',function(chatMsg){
        console.log('客户端接受服务器发送消息',chatMsg)
        // 只有当chatMsg是与当前用户相关的消息，才去分发同步action保存消息
        if(userid === chatMsg.from || userid === chatMsg.to){
            dispatch(receiveMsg(chatMsg,userid))
        }
    })
}

export const sendMsg = ({from ,to ,content}) => {
    return dispatch => {
        console.log('客户端向服务器发送消息',{from,to,content})
        // 发消息
        io.socket.emit('sendMsg', {from,to,content})
    }
}

//读取消息的异步action
export const readMsg = (from ,to) =>{
    return async dispatch => {
        const response = await reqReadMsg(from)
        const result = response.data
        if(result.code === 0){
            const count =result.data
            dispatch(msgRead({count,from,to}))
        }
    }
}