/*大神信息完善的路由容器组件 */
import React ,{Component} from 'react'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'
import {NavBar,InputItem,Button} from'antd-mobile'
import HeaderSelector from '../../components/header-selector/header-selector'
import {updateUser} from '../../redux/actions'
class DashenInfo extends Component{
    state={
        header: '', // 头像名称
        post: '', // 职位
        info: '', // 个人或职位简介
    }
    setHeader = (text) => {
        this.setState({
            header:text
        })
    }
    handleChange = (name,val) => {
        this.setState({
            [name]:val
        })
    }

    save = () => {
        // console.log(this.state);
        this.props.updateUser(this.state);
    }
    render(){
        const {header,type} = this.props.user;
        if(header){
            const path = type === 'dashen' ? '/dashen' : '/laoban'
            return <Redirect to = {path}></Redirect>
        }
        return(
            <div>
                 <NavBar>大神信息完善</NavBar>
                <HeaderSelector setHeader={this.setHeader}></HeaderSelector>
                <InputItem onChange={val => {this.handleChange('post',val)}}>求职岗位:</InputItem>
                <InputItem onChange={val => {this.handleChange('info',val)}}>个人介绍:</InputItem>
                <Button type='primary' onClick={this.save}>保存</Button>
            </div>
        )
    }
}
export default connect(state =>({user:state.user}),{updateUser})(DashenInfo)