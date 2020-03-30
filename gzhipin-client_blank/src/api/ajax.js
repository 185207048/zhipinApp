/*
能发送ajax请求的函数模块

*/
import axios from 'axios'
export default function ajax(url,data={},type){
    if(type==='GET'){
        let paramStr='';
        Object.keys(data).forEach(key=>{
            paramStr += key + '=' +data[key] + '&'
        });
        if(paramStr){
            paramStr.substring(0,paramStr.length-1);
        }
        return axios.get(url + '?' + paramStr);
    }else{
        return axios.post(url,data);
    }
}