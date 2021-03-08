const { app, BrowserWindow } = require('electron')
const path = require('path')
const { fork } = require('child_process')

try {
	require('electron-reloader')(module);
} catch {}

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
    app.quit();
};

var server = fork(require.resolve('./server'), [], {
    env: {
        NODE_ENV: 'development'
    }
})
// require('./server')()

server.on('uncaughtException', function (err) {
    console.log('***uncaught exception***', err)
})

const createWindow = () => {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600
    });

    mainWindow.loadFile(path.join(__dirname, 'index.html'))

    // wait for the server to start before loading the UI
    server.once('message', function (msg) {
        // and load the index.html of the app.
        mainWindow.loadFile(path.join(__dirname, 'index.html'))
        console.log('**msg**', msg)
    })

    // and load the index.html of the app.
    // mainWindow.loadFile(path.join(__dirname, 'index.html'));

    // Open the DevTools.
    mainWindow.webContents.openDevTools();
};

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

app.on('will-quit', function (ev) {
    console.log('**will quit**')
    // console.log('**will quit**', ev)
    if (server) server.kill()
    // console.log('ssssssss', server)
    // server.kill()
    // server.exit(0)
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);



// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
