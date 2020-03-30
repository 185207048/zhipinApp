/*登录路由组件*/
import React ,{Component} from 'react'
import {NavBar, WingBlank, List ,InputItem , WhiteSpace, Button} from 'antd-mobile'
import Logo from '../../components/logo/logo'
import {Redirect} from 'react-router-dom'
import {connect} from 'react-redux'
import {login} from '../../redux/actions'
class Login extends Component{
    state = {
        username:'',
        password:''
    }
    
    submit =() =>{
        // console.log(this.state);
        this.props.login(this.state);
    }
    
    handleChange =(name,val) =>{
        this.setState({[name] : val}); //[]里面放String类型可以把字符串变成变量
    }

    toRegister =()=>{
        this.props.history.replace('./register');
    }
    render(){
        const {msg,redirectTo} = this.props.user;
        if(redirectTo){
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
                        <InputItem onChange={val => this.handleChange('username',val)}>用户名:</InputItem>
                        <WhiteSpace></WhiteSpace>
                        <InputItem type='password' onChange={val => this.handleChange('password',val)}>密&nbsp;&nbsp;&nbsp;码:</InputItem>
                        <WhiteSpace></WhiteSpace>
                        <Button type='primary' onClick={this.submit}>登&nbsp;录</Button>
                        <WhiteSpace></WhiteSpace>
                        <Button onClick={this.toRegister}>还没有用户</Button>
                    </List>
                </WingBlank>
            </div>
        )
    }
}
export default connect(state => ({user:state.user}),{login})(Login) //读user
