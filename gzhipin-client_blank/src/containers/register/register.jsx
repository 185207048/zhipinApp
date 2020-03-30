/*注册路由组件*/
import React ,{Component} from 'react'
import {NavBar, WingBlank, List ,InputItem , WhiteSpace, Radio, Button} from 'antd-mobile'
import Logo from '../../components/logo/logo'
import {connect} from 'react-redux'
import {register} from '../../redux/actions'
import {Redirect} from 'react-router-dom'
const ListItem = List.Item; //包住复选框
class Register extends Component{
    state = {
        username:'',
        password:'',
        password2:'',
        type:'dashen'
    }
    
    submit =() =>{
        this.props.register(this.state);
    }
    
    handleChange =(name,val) =>{
        this.setState({[name] : val}); //[]里面放String类型可以把字符串变成变量
    }

    toLogin =()=>{
        this.props.history.replace('./login');
    }
    render(){
        const {type} = this.state;
        const {msg,redirectTo} = this.props.user;
        if(redirectTo){
            console.log(redirectTo);
            return <Redirect to={redirectTo}></Redirect>
        }
        return(
            <div>
                <NavBar>硅&nbsp;谷&nbsp;直&nbsp;聘</NavBar>
                <Logo/>
                <WingBlank>
                    <List>
                        {msg?<div className='error-msg'>{msg}</div>:null}
                        <WhiteSpace></WhiteSpace>
                        <InputItem onChange={val => {this.handleChange('username',val)}}>用户名:</InputItem>
                        <WhiteSpace></WhiteSpace>
                        <InputItem type='password' onChange={val => {this.handleChange('password',val)}}>密&nbsp;&nbsp;&nbsp;码:</InputItem>
                        <WhiteSpace></WhiteSpace>
                        <InputItem type='password' onChange={val => {this.handleChange('password2',val)}}>确认密码:</InputItem>
                        <WhiteSpace></WhiteSpace>
                        <ListItem>
                            <span>用户类型:</span>
                            &nbsp;&nbsp;&nbsp;
                            <Radio checked={type==='dashen'} onChange={()=>this.handleChange('type','dashen')}>大神</Radio>
                            &nbsp;&nbsp;&nbsp;
                            <Radio checked={type==='laoban'} onChange={()=>this.handleChange('type','laoban')}>老板</Radio>
                        </ListItem>
                        <WhiteSpace></WhiteSpace>
                        <Button type='primary' onClick={this.submit}>注&nbsp;册</Button>
                        <WhiteSpace></WhiteSpace>
                        <Button onClick={this.toLogin}>已有账户</Button>
                    </List>
                </WingBlank>
            </div>
        )
    }
}
export default connect(state => ({user:state.user}),{register})(Register) //读user