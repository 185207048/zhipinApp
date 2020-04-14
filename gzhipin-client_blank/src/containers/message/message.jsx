import React, {Component} from 'react'
import {connect} from 'react-redux'
import {List, Badge} from 'antd-mobile'
const Item = List.Item
const Brief = Item.Brief
//对chatMsgS进行分组
/*
1.找出
*/
function getLastMsgs(chatMsgs,userid){
    const lastMsgObjs = {}
    chatMsgs.forEach(msg => {
        //对msg进行个体的统计
        if(msg.to === userid && !msg.read){
            msg.unReadCount = 1
        }else{
            msg.unReadCount = 0
        }
        const chatId = msg.chat_id //得到msg的_id
        const lastMsg = lastMsgObjs[chatId] //获得当前组的msgs
        if(!lastMsg){ //没有lastmsgs,说明当前msg就是所在组的lastMsg
            lastMsgObjs[chatId] = msg
        }else{  //有
            //保存已经统计的未读数量
            const unReadCount = lastMsg.unReadCount
            //如果msg比Lastmsgs晚，msg就是lastmsgs
            if(msg.create_time > lastMsg.create_time){
                lastMsgObjs[chatId] = msg
            }
            //累加unreadcount 并保存
            lastMsgObjs[chatId].unReadCount = unReadCount + msg.unReadCount
        }
        
    });
    const lastMsgs = Object.values(lastMsgObjs)
    lastMsgs.sort(function(m1, m2){ // 如果结果小于0
        return m2.create_time - m1.create_time
    })

    return lastMsgs
}
class Message extends Component {
render() {
    const {user, chat} = this.props
    const {users, chatMsgs} = chat
    // 对chatMsgs进行分组
    const lastMsgs = getLastMsgs(chatMsgs,user._id)
    console.log(lastMsgs)
    return (
        <List style={{marginTop:50,marginBottom:50}}>
            {
                lastMsgs.map(msg =>{
                    const targetUserId = msg.to ===user._id ? msg.from : msg.to
                    const targetUser = users[targetUserId]
                    console.log(targetUser)
                    return(
                        <Item
                        key={msg._id}
                        extra={<Badge text={msg.unReadCount}/>}
                        thumb={require('../../assets/imgs/头像1.png')}
                        arrow='horizontal'
                        onClick={()=>this.props.history.push(`/chat/${targetUserId}`)}
                        >
                        {msg.content}
                        <Brief>{targetUser.username}</Brief>
                        </Item>
                    )
                })
            }
        </List>
        )
    }
}
export default connect(
    state => ({user:state.user,chat:state.chat}),{}
)(Message)