import React, {Component} from 'react'
import {connect} from 'react-redux'
import {getUserList} from '../../redux/actions'
import  UserList from '../../components/user-list/user-list'

class Dashen extends Component{
    componentDidMount(){
        // 获取userList
        this.props.getUserList('laoban');
    }
    // ???没运行

    render(){
        return(
            <UserList userList={this.props.userList}></UserList>
        )
    }
}
export default connect(
    state => ({userList:state.userlist}),{getUserList}
)(Dashen)