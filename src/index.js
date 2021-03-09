var S = require('pull-stream')
var wsClient = require('pull-ws/client')
var muxrpc = require('muxrpc')
var manifest = require('./manifest.json')
var muxrpc = require('muxrpc')
var view = require('./view')

// -------------------------------------
var subscribe = require('./subscribe')
var state = require('./state')
// -------------------------------------

var WS_URL = 'ws://localhost:' + (process.env.WS_PORT || '8000')

function connectSbot ({ onClose }, cb) {
    wsClient(WS_URL, {
        binary: true,
        onConnect
    })

    function onConnect (err, wsStream) {
        if (err) return cb(err)

        // sbot is rpc client
        var sbot = muxrpc(manifest, null)()
        var rpcStream = sbot.createStream(function _onClose (err) {
            if (onClose) onClose(err)
        })
        S(wsStream, rpcStream, wsStream)

        cb(null, sbot)
    }
}


connectSbot({}, function (err, sbot) {
    if (err) throw err
    var bus = subscribe({ state, sbot })
    var emit = bus.emit.bind(bus)
    view({ state, emit })
    console.log('sbooooot', err, sbot)
})
