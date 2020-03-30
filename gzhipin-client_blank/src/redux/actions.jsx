/*
包含n个action creator
异步action
同步action

TypeError: Object(...) is not a function 是版本不匹配，将版本降成6.0.1
*/
//注册异步acition
import {reqRegister,reqLogin,reqUpdata,reqUser, reqUserList} from '../api'
import {AUTH_SUCCESS,ERROR_MSG,RECEIVE_USER,RESET_USER, RECEIVE_USER_LIST} from './action-type'
/*同步action */
export const authSuccess = (user) =>({type:AUTH_SUCCESS,data:user});
export const errorMsg = (msg) =>({type:ERROR_MSG,data:msg});
export const receiveUser = (user) => ({type:RECEIVE_USER,data:user});
export const resetUser = (msg) => ({type:RESET_USER,data:msg});
export const receiveUserList = (userList) => ({type:RECEIVE_USER_LIST,data:userList});

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