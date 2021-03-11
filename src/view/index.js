import { render } from 'preact'
import { useState, useEffect } from 'preact/hooks';
import { html } from 'htm/preact'
var Route = require('route-event')
var raf = require('raf')
var Router = require('./routes')
var Shell = require('./shell')
var evs = require('../EVENTS')

function Component ({ emit, state }) {
    var router = Router({ emit, state })
    const [_state, setState] = useState(state())

    state(function onChange (newState) {
        raf(() => setState(newState))
    })

    useEffect(() => {
        emit(evs.profile.get, null)
    }, [])

    var match = router.match(_state.route || '/')
    var route = match ? match.action(match) : null
    var routeView = route ? route.view : null

    console.log('in component', _state)

    return html`<${Shell} emit=${emit} ...${_state}>
        <${routeView} emit=${emit} ...${_state} />
    <//>`
}

module.exports = function Eventual ({ state, emit }) {
    var onRoute = Route()

    onRoute(path => emit(evs.route.change, path))
    var { setRoute } = onRoute 

    // trying this for wonky electron routes
    process.nextTick(() => emit(evs.route.change, '/'))

    var _html = html`<${Component} emit=${emit} state=${state} />`

    render(_html, document.getElementById('content'))

    return { setRoute }
}
