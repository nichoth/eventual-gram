import { render } from 'preact'
import { useState } from 'preact/hooks';
import { html } from 'htm/preact'
var Router = require('./routes')
var Shell = require('./shell')
var evs = require('../EVENTS')
// var catchRoutes = require('@nichoth/catch-routes')
var Route = require('route-event')

var router = Router()

function Component ({ emit, state }) {
    const [_state, setState] = useState(state())

    state(function onChange (newState) {
        setState(newState)
    })

    var match = router.match(_state.route || '/')
    var route = match ? match.action(match) : null
    var routeView = route ? route.view : null

    console.log('route', route)

    console.log('in component', _state)

    return html`<${Shell} emit=${emit} ...${_state}>
        <${routeView} emit=${emit} ...${_state} />
        <p>foos: ${_state.foo}</p>
        <button onClick=${emit(evs.test.foo)}>foo</button>
    <//>`

    // return html`<form>
    //     <p>foos: ${_state.foo}</p>
    //     <button onClick=${emit(evs.test.foo)}>foo</button>
    // </form>`
}

module.exports = function Eventual ({ state, emit }) {

    var route = Route()
    route(function onRoute (path) {
        console.log('onRoute', path)
        emit(evs.route.change, path)
    })

    var _html = html`<div>
        <p>Hello from JS</p>
        <${Component} emit=${emit} state=${state} />
    </div>`

    var el =  document.getElementById('content')

    render(_html, el)
}
