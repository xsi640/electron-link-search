import React, {Component} from 'react'
import {connect} from 'react-redux'
import {
    Paper,
    TextField,
    RaisedButton,
    LinearProgress,
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui'
const {shell} = require('electron')
import {searchActions} from '../actions/searchActions'

class SearchPage extends Component {

    constructor(props) {
        super(props);
        this.handlerSearch = this.handlerSearch.bind(this);
        this.changeProps = this.changeProps.bind(this);
        this.state = {
            data: [],
            index: 0
        }
    }

    componentDidMount() {
        this.props.readSettings();
    }

    componentWillReceiveProps(nextProps) {
        if (typeof nextProps.data !== 'undefined' &&
            nextProps.data.length > 0) {
            for (let item of nextProps.data) {
                this.state.index += 1;
                item.id = this.state.index;
                this.state.data.push(item);
            }
        }
        return nextProps;
    }

    handlerSearch() {
        this.state.data = [];
        this.state.index = 0;
        this.props.search({
            url: this.props.url,
            inSelector: this.props.inSelector,
            aSelector: this.props.aSelector,
            keyword: this.props.keyword,
            pageIndex: this.props.pageIndex,
            pageSize: this.props.pageSize
        })
        this.props.saveSettings({
            url: this.props.url,
            inSelector: this.props.inSelector,
            aSelector: this.props.aSelector,
            keyword: this.props.keyword,
            pageIndex: this.props.pageIndex,
            pageSize: this.props.pageSize
        })
    }

    handlerOpen(data, e) {
        shell.openExternal(data)
    }

    changeProps(e) {
        this.props.changeProps({[e.target.name]: e.target.value});
    }

    render() {

        let rows = [];
        if (typeof this.state.data !== 'undefined') {
            this.state.data.map(item => {
                rows.push(
                    <TableRow key={item.id}>
                        <TableRowColumn style={{width: '50px'}}>{item.id}</TableRowColumn>
                        <TableRowColumn>
                            <a href='###' onClick={this.handlerOpen.bind(this, item.url)}>{item.title}</a>
                        </TableRowColumn>
                    </TableRow>);
            })
        }

        let progress = 'hidden';
        if(this.props.progress_value != 100){
            progress = 'visible';
        }
        return (
            <Paper style={style}>
                <TextField hintText="请输入URL,Page占位符{0}" value={this.props.url} fullWidth={true} name="url"
                           onChange={this.changeProps}/><br/>
                <TextField hintText="在哪个区域内搜索" value={this.props.inSelector} name="inSelector"
                           onChange={this.changeProps}/><br/>
                <TextField hintText="搜索什么样的a标签（a标签的class）" value={this.props.aSelector}
                           name="aSelector" onChange={this.changeProps}/><br/>
                <TextField hintText="关键字" value={this.props.keyword} name="keyword"
                           onChange={this.changeProps}/><br/>
                <TextField hintText="开始页数" value={this.props.pageIndex} name="pageIndex"
                           onChange={this.changeProps}/><br/>
                <TextField hintText="结束页数" value={this.props.pageSize} name="pageSize"
                           onChange={this.changeProps}/><br/>
                <RaisedButton label="搜索" primary={true} onClick={this.handlerSearch}/><br/><br/>
                <LinearProgress mode="determinate" value={this.props.progress_value} style={{visibility:progress}} />
                <br/>
                <Table height={500}>
                    <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                        <TableRow>
                            <TableHeaderColumn style={{width: '50px'}}>ID</TableHeaderColumn>
                            <TableHeaderColumn>Link</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={false}>
                        {rows}
                    </TableBody>
                </Table>
            </Paper>
        )
    }
}

const style = {
    height: '100%',
    padding: '40px',
}

const mapStateToProps = (state) => {
    return state;
}

export default SearchPage = connect(mapStateToProps, searchActions)(SearchPage);