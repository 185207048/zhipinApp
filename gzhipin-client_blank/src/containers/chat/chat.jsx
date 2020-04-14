import React, {Component} from 'react'
import {connect} from 'react-redux'
import {NavBar, List , InputItem, Grid} from 'antd-mobile'
import {sendMsg} from '../../redux/actions'
import QueueAnim from 'rc-queue-anim'

const Item = List.Item
class Chat extends Component{

    state = {
        content:'',
        isShow:false
    }

    //在第一次render()之前回调
    componentWillMount(){
        const emojis = ['😃','😃','😃','😃','😃','😃','😃','😃','😃','😃','😃','😃','😃','😃','😃','😃','😃','😃','😃','😃','😃','😃','😃','😃','😃','😃','😃','😃','😃','😃','😃','😃']
        this.emojis = emojis.map(emoji => ({text:emoji}))
    }
    componentDidMount(){
        //初始显示列表
        window.scrollTo(0,document.body.scrollHeight)
        //发请求更新未读状态
        
    }
    componentWillUnmount(){  //
        const from = this.props.match.params.userid
        const to = this.props.user._id
        this.props.readMsg(from, to)
    }

    handleSend = () =>{
        const from = this.props.user._id
        const to = this.props.match.params.userid
        const content = this.state.content
        console.log(from ,to ,content)
        if(content){
            this.props.sendMsg({from,to,content})
        }
        this.setState({
            content:'',
            isShow:false
        })
    }
    toggleShow = () =>{
        let isShow = true
        this.setState({isShow})

        //异步手动派发resize事件，解决表情列表显示的bug
        if(isShow){
            setTimeout(() => {
                window.dispatchEvent(new Event('resize'))
            },0)
        }
    }

    render(){
        const {user} = this.props
        const {users,chatMsgs} = this.props.chat

        // 计算当前聊天的chatID
        const meId = user._id
        const targetId = this.props.match.params.userid
        const chatId = [meId,targetId].sort().join('_')
        // 对chatMsgs进行过滤
        const msgs = chatMsgs.filter(msg => msg.chat_id === chatId)
        //得到目标用户的头像header图片对象
        // console.log("users[targetId]:"+users.header)
        // const targetHeader = users[targetId].header
        // const tagertIcon = targetHeader == undefined ? require(targetHeader) : null
        console.log(this.state.isShow)
        return(
            <div id='chat-page'>
                <NavBar className='sticky-header'>xx</NavBar>
                <List>
                    <QueueAnim type='alpha' delay={100}>
                        {
                            msgs.map(msg=>{
                                if(meId === msg.to) { //对方发给我的
                                    return (
                                        <Item
                                            key={msg._id}
                                            thumb = {require('../../assets/imgs/头像1.png')}
                                        >{msg.content }</Item>
                                    )
                                } else {                //我发的消息
                                    return (
                                        <Item
                                            key={msg._id}
                                            className='chat-me'
                                            extra='我'
                                        >{msg.content }</Item>
                                    )
                                }
                            })
                        }
                    </QueueAnim>
                </List>
                <div className='am-tab-bar'>
                    <InputItem
                        placeholder="请输入"
                        value={this.state.content}
                        onChange={val => this.setState({content:val})}
                        onFocus={() => this.setState({isShow:false})}
                        extra={
                            <span>
                                <span onClick = {this.toggleShow} style={{marginRight:5}}>😃</span>
                                <span onClick={this.handleSend}>发送</span>
                            </span>
                        }
                    />
                {this.state.isShow ? (
                    <Grid
                    data={this.emojis}
                    columnNum={8}
                    carouselMaxRow={4}
                    isCarousel={true}
                    onClick={(item) => {
                        this.setState({isShow:true})
                        this.setState({content: this.state.content + item.text})
                    }}
                />
                ) : null}
                </div>
            </div>
        )
    }
}
export default connect(
    state => ({user:state.user, chat: state.chat}),
    {sendMsg}
)(Chat)

