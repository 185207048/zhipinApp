import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Result ,List ,WhiteSpace ,Button, Modal} from 'antd-mobile'
import Cookies from 'js-cookie'
import {resetUser} from '../../redux/actions'
import '../../assets/css/index.less'

const Item = List.Item
const Brief = Item.Brief
class Personal extends Component{
    loginout = () =>{
        /*
        组件分为标签组件和非标签组件 
            标签组件就是div
            这里用的是非标签组件
        */

        Modal.alert('退出','确认退出登录?',[
            {text:'取消'},
            {
                text:'确定',
                onPress: ()=>{
                    //干掉userid
                    Cookies.remove('userid');
                    //干掉redux,不需要和后台进行通信只用一个同步action就可以了
                    this.props.resetUser();
                }
            }
        ])
    }
    render(){
        // debugger
        const {user} = this.props
        return(
            <div style={{marginBottom:50,marginTop:50}}>
                <Result
                    img={<img src={user.header} style={{width: 50}} alt="header"></img>}
                    title={user.username}
                    message={user.company}
                ></Result>
                
                <List renderHeader={() => '相关信息'}>
                    <Item multipleLine>
                        <Brief>职位：{user.post}</Brief>
                        <Brief>简介：{user.info}</Brief>
                        {user.salary ? <Brief>薪资：{user.salary}</Brief> : null}
                    </Item>
                </List>
                <WhiteSpace></WhiteSpace>
                <List>
                    <Button type='warning' onClick={this.loginout} id='per_btn'>退出登录</Button>
                </List>
            </div>
        )
    }
}
export default connect(
    state => ({user:state.user}),{resetUser}
)(Personal)