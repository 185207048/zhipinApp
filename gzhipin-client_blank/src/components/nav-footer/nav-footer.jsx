import React, {Component} from 'react'
import {TabBar} from 'antd-mobile'
import PropTypes from 'prop-types'
import {withRouter} from 'react-router-dom'

const Item = TabBar.Item

class NavFooter extends Component{
    static propTypes = {
        navList : PropTypes.array.isRequired
    }
    render () {
        let {navList} = this.props;
        //过滤hide为true的
        navList = navList.filter(nav => !nav.hide);
        const path = this.props.location.pathname; //非路由组件操作路由组件API用withRoute()
        return (
            <TabBar>
                {
                    navList.map((nav) => (
                        <Item key={nav.path}
                              title={nav.text}
                              icon={{uri: require(`./images/${nav.icon}.png`)}}
                              selectedIcon={{uri: require(`./images/${nav.icon}-selected.png`)}}
                              selected={path === nav.path}
                              onPress={()=> this.props.history.replace(nav.path)}
                        />
                          ///Expected an assignment or function call and instead saw an expression(期待函数组有回调值)
                    ))
                }
                
            </TabBar>
        )
    }
}
// 内部会向组件中传入一些路由组件特有的属性：history/location/math
//  ↓
export default withRouter(NavFooter) //向外暴露