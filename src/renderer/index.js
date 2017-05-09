import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import SearchPage from './containers/SearchPage.jsx'
import {createStore, applyMiddleware} from 'redux'
import thunk from 'redux-thunk';
import {Provider} from 'react-redux'
import searchReducer from './reducers/searchReducer'
import './index.scss'

const middlewares = [];

if (process.env.NODE_ENV === `development`) {
    const { logger } = require(`redux-logger`);
    middlewares.push(logger);
}
middlewares.push(thunk)

const store = createStore(searchReducer, applyMiddleware(...middlewares));

class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <MuiThemeProvider>
                    <SearchPage/>
                </MuiThemeProvider>
            </Provider>)

    }
}

ReactDOM.render(<App/>, document.getElementById('root'))