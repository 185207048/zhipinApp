import React, {Component} from 'react'
import {connect} from 'react-redux'
import {getUserList} from '../../redux/actions'
import  UserList from '../../components/user-list/user-list'

class Laoban extends Component{
    componentDidMount(){
        // 获取userList
        this.props.getUserList('dashen');
    }
    render(){
        return(
            <UserList userList={this.props.userList}></UserList>
        )
    }
}
export default connect(
    state => ({userList: state.userList}),{getUserList}
)(Laoban)