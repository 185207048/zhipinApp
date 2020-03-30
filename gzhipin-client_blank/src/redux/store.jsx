/*
向外暴露store对象
*/
import {createStore,applyMiddleware} from 'redux'
import reducers from './reducers'
import thunk from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'

export default createStore(reducers,composeWithDevTools(applyMiddleware(thunk)));