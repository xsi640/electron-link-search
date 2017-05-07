const {app, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')
const regIPCMessage = require('./regIPCMessage')

require('electron-reload')(path.join(__dirname, '../../public/'), {electron: require('electron-prebuilt')});

let win

function createWindow() {
    regIPCMessage();
    win = new BrowserWindow({
        width: 1000,
        height: 1140,
        webPreferences: {
            experimentalFeatures: true
        }
    })

    win.loadURL(url.format({
        pathname: path.join(__dirname, '../../public/index.html'),
        protocol: 'file:',
        slashes: true
    }))

    win.webContents.openDevTools()

    win.on('closed', () => {
        win = null
    })
}

app.on('ready', createWindow)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (win === null) {
        createWindow()
    }
})