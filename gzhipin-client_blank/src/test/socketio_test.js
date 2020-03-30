import io from 'socket.io-client'

//连接服务器,得到代表连接的socket对象
const socket = io('ws://localhost:4000')

//发送消息
socket.emit('sendMsg' , {name:'abc'})
console.log('发送完毕')
//绑定监听，接收服务器发送的消息
socket.on('receiveMsg',function(data){
    console.log(data)
})