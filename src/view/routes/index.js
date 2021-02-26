var Router = require('ruta3')
var Home = require('./home')
var New = require('./new')
var createFeedRoute = require('./feed')
var createPostView = require('./post')
var Pubs = require('./pubs')
var evs = require('../../EVENTS')

function _Router ({ emit, state }) {
    var router = Router()
    router.addRoute('/', function (match) {
        // if (!state.posts()) {
        //     emit(evs.posts.get, null)
        // }
        return { view: Home }
    })

    router.addRoute('/new', () => {
        return { view: New }
    })

    router.addRoute('/pubs', () => {
        return { view: Pubs, events: [evs.pub.route] }
    })

    // user route
    router.addRoute('/@*', function (match) {
        var { splats } = match
        var userId =  '@' + splats[0]
        return { view: createFeedRoute(userId) }
    })

    // encoded percent sign
    // post route
    router.addRoute('/%25*', function (match) {
        var { splats } = match
        // var postId = splats[0]
        console.log('splats', splats)
        var postId = '%' + decodeURIComponent(splats[0])
        console.log('***postId***', postId)
        return { view: createPostView(postId) }
    })

    return router
}

module.exports = _Router
