const {ChatModel} = require('../db/models')
module.exports = function(server){
    const io = require('socket.io')(server)
    //监视客户端与服务器的连接
    io.on('connection' , function(socket){
        console.log('有一个客户端连接上了服务器')
        //绑定监听,接收客户端发送的消息
        socket.on('sendMsg' , function({from,to,content}){
            // 接收到数据后
            console.log("socketIO",{from,to,content})
            // 准备消息对象 from_to或者to_from
            const chat_id = [from ,to].sort().join('_') //??
            const create_time = Date.now()
            // 保存消息
            new ChatModel({from,to,content,chat_id,create_time}).save(function(error, chatMsg){
                // 向所有连接上的客户发消息 ，但是这里需要自己进行改进，通过上网查找，因为这样的效率太低，不符合市场要求
                console.log("chatMsg:"+chatMsg)
                io.emit('receiveMsg',chatMsg)
            })
            
        })
    })
}