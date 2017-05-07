import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {createStore} from 'redux';
import {Provider, connect} from 'react-redux'
const {ipcRenderer} = require('electron')
import './index.scss'

class Text extends Component {

    componentWillReceiveProps(nextProps) {
        console.log("nextProps", nextProps);
    }

    render() {
        return <h1>{this.props.text}</h1>
    }
}

class App extends Component {

    constructor(props) {
        super(props);
        this.handlerClick = this.handlerClick.bind(this);
    }

    handlerClick(e) {
        // console.log(this.refs.inputText.value);
        this.props.change(this.refs.inputText.value);

        console.log(ipcRenderer.sendSync('synchronous-message', 'ping')) // prints "pong"

        ipcRenderer.on('asynchronous-reply', (event, arg) => {
            console.log(arg) // prints "pong"
        })
        ipcRenderer.send('asynchronous-message', 'ping')

    }

    render() {
        return (
            <div>
                <div className="App">
                    <button> button </button>
                    121212123
                </div>
                <input type="text" ref="inputText"/>
                <button onClick={this.handlerClick}> click</button>
                <Text ref="output" text={this.props.text}></Text>
            </div>);
    }
}

const actions = {
    change(text){
        return {
            type: "change",
            payload: text
        }
    }
}

function reducer(state, action) {
    if (typeof state === "undefined") return {text: ""};
    switch (action.type) {
        case "change":
            return Object.assign({}, state, {text: action.payload});
        default:
            return state;
    }
}

const store = createStore(reducer);

function mapStateToProps(state) {
    console.log(state);
    return state;
}

const AppX = connect(mapStateToProps, actions)(App);


ReactDOM.render(
    <Provider store={store}>
        <AppX />
    </Provider>,
    document.getElementById('root')
);
