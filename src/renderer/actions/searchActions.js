import {ipcRenderer} from 'electron'

export const searchActions = {
    search(parameters){
        return dispatch => {
            let index = parameters.pageIndex;
            function searchListener(event, args) {
                if (typeof args.err === 'undefined') {
                    dispatch({
                        type: 'search',
                        payload: {
                            currentPageIndex: args.pageIndex,
                            progress_value: index / parameters.pageSize * 100,
                            data: args.data,
                            err: null
                        }
                    })

                    index++;
                    if (index <= parameters.pageSize) {
                        ipcRenderer.once('search', searchListener);
                        ipcRenderer.send('search', Object.assign(parameters, {pageIndex: index}))
                    }

                } else {
                    dispatch({
                        type: 'search',
                        payload: {
                            currentPageIndex: args.pageIndex,
                            err: args.err
                        }
                    })
                }
            }
            ipcRenderer.once('search', searchListener);
            ipcRenderer.send('search', Object.assign(parameters, {pageIndex: index}))

            return {
                type: 'search',
                payload: {
                    progress_value: 0,
                    data: []
                }
            }
        }
    },
    readSettings(){
        return dispatch => {
            ipcRenderer.on('readSettings', (event, args) => {
                dispatch({
                    type: 'readSettings',
                    payload: args
                })
            });
            ipcRenderer.send('readSettings');
        }
    },
    saveSettings(json){
        ipcRenderer.send('saveSettings', json);
        return {type: 'saveSettings'};
    },
    changeProps(props){
        return {
            type: 'changeProps',
            payload: props
        }
    }
}