export default function (state, action) {
    if (typeof state === 'undefined')
        return {progress_value: 100};
    switch (action.type) {
        case "search":
            return Object.assign({}, state, action.payload);
        case  "readSettings":
            return Object.assign({}, state, action.payload, {progress_value: 100});
        case "changeProps":
            return Object.assign({}, state, action.payload);
        default:
            return state;
    }
}