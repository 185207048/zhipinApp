/*注路由组件*/
import React ,{Component} from 'react'
import {Route, Switch, Redirect} from 'react-router-dom'
import {connect} from 'react-redux'
import Cookies from 'js-cookie'
import {NavBar} from 'antd-mobile'

import LaobanInfo from '../laoban-info/laoban-info'
import DashenInfo from '../dashen-info/dashen-info'
import {getRedirectTo} from '../../utils/index'
import {getUser} from '../../redux/actions'
import Dashen from '../dashen/dashen'
import Laoban from '../laoban/laoban'
import Message from '../message/message'
import Personal from '../personal/personal'
import NotFound from '../../components/not-found/not-found'
import NavFooter from '../../components/nav-footer/nav-footer'
import Chat from '../chat/chat'

class Main extends Component{
    navList = [
        {
            path:'/laoban',
            component:Laoban,
            title:'大神列表',
            icon:'dashen',
            text:'大神'
        },
        {
            path: '/dashen', // 路由路径
            component: Dashen,
            title: '老板列表',
            icon: 'laoban',
            text: '老板',
        },
        {
            path: '/message', // 路由路径
            component: Message,
            title: '消息列表',
            icon: 'message',
            text: '消息',
        },
        {
            path: '/personal', // 路由路径
            component: Personal,
            title: '用户中心',
            icon: 'personal',
            text: '个人',
        }
    ]
    componentDidMount(){
        //登录过（cookie中有userid），但没有登录（redux管理的user中没有_id) 发请求获取对应的user
        const userid = Cookies.get('userid');
        const {_id} = this.props.user;
        if(userid && !_id){
            //发送异步请求获取user信息
            // console.log('发送异步请求');
            this.props.getUser();
        }
    }
    // 检查用户是否登录，如果没有，自动重定向到登录界面
    render(){
        // 读取cookie中的userid
        const userid = Cookies.get('userid');
        // 如果没有，自动重定向到登录界面
        if(!userid){
            return <Redirect to='/login'></Redirect>
        }
        // 如果有，读取redux中的user状态
        const {user} = this.props;
        // 如果user有_id没有,返回null(不做任何显示)
        if(!user._id){
            return null;//分发了新的状态之后会进行渲染
        }else{
            //如果请求根路径根据user的type和header来计算出一个重定向的路由路径，并自动重定向,这种情况是已经登陆了
            let path = this.props.location.pathname;
            if(path === '/'){
                path = getRedirectTo(user.type, user.header);
                return <Redirect to={path}></Redirect>
            }
        }
        //  如果有_id ,显示对应的界面
        const {navList} = this;
        const path = this.props.location.pathname;
        const currentNav = navList.find(nav => nav.path === path);//可能会为空

        if(currentNav){
            //决定哪个路由需要被隐藏
          if(user.type === 'laoban'){
            navList[1].hide = true;
          }else{
            navList[0].hide = true;
          }
        }
        return(
            <div>
                {currentNav ? <NavBar className='stick-header'>{currentNav.title}</NavBar> : null}
                <Switch>
                    {
                        currentNav ? navList.map((nav,index) => <Route path={currentNav.path} component={currentNav.component} key={index}></Route>) : null
                    }
                    <Route path='/laobaninfo' component={LaobanInfo}></Route>
                    <Route path='/dasheninfo' component={DashenInfo}></Route>
                    <Route path='/chat/:userid' component={Chat}></Route>
                    <Route component={NotFound}></Route>
                </Switch>
                {currentNav ? <NavFooter navList = {navList}></NavFooter> : null}
            </div>
        )
    }
}

export default connect(state=>({user:state.user}),{getUser})(Main)

/*
实现自动登录
    cookie中有userid,向后台发请求获取对应的user
    如果cookie中没有userid,进入登录界面
如果已经登录，如果请求根路径
    根据user的type和header来计算出一个重定向的路由路径，并自动重定向
*/