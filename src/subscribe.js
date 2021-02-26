var evs = require("./EVENTS")
var ts = require('./types')
var Bus = require('@nichoth/events')
var getAvatar = require('ssb-avatar')
var toURL = require('ssb-serve-blobs/id-to-url')
var S = require('pull-stream')
var _ = {
    get: require('lodash/get')
}
var after = require('after')
// var xtend = require('xtend')

function subscribe ({ sbot, state }) {
    var bus = Bus({
        memo: true
    })

    bus.on(evs.test.foo, ev => {
        ev.preventDefault()
        console.log('got a foo', ev)
        state.foo.set(state.foo() + 1)
    })

    bus.on(evs.route.change, path => {
        console.log('subscribed on route', path)
        state.route.set(path)
    })

    bus.on(evs.profile.get, () => {
        getProfile(function (err, profile) {
            if (err) throw err

            // get the avatarUrl here
            getUrlForHash(image, (err, imgUrl) => {
                if (err) throw err
                acc[id] = { name, image, imgUrl }
                next(null, acc)
            })


            state.me.set(profile)
        })
    })

    bus.on(evs.posts.get, () => {
        console.log('get posts in subscribe')

        getPosts(function (err, msgs) {
            if (err) throw err

            var posts = msgs.map(([hash, url, post]) => post)
            var urls = msgs.reduce(function (acc, [hash, url, post]) {
                acc[hash] = url
                return acc
            }, {})

            state.postUrls.set(urls)
            state.posts.set(posts)

            var authorIds = posts.map(post => post.value.author)

            var next = after(authorIds.length, function (err, res) {
                if (err) throw err
                state.people.set(res)
            })

            var acc = {}
            authorIds.forEach(function (id) {
                getProfileById(id, function (err, person) {
                    if (err) return next(err)
                    var { name, image } = person
                    getUrlForHash(image, (err, imgUrl) => {
                        if (err) throw err
                        acc[id] = { name, image, imgUrl }
                        next(null, acc)
                    })
                })
            })
        })
    })

    bus.on(evs.followed.get, function () {
        getFollowing(function (err, folls) {
            console.log('got following', err, folls)
            if (err) throw err
            state.followed.set(folls)
        })
    })





    // -------------------------------------------------





    function getFollowing (cb) {
        S(
            sbot.friends.createFriendStream({ meta: true, hops: 1 }),
            S.collect(function (err, res) {
                cb(err, res)
            })
        )
    }

    function getProfile (cb) {
        sbot.whoami(function (err, res) {
            if (err) throw err
            var { id } = res

            getAvatar(sbot, id, id, function (err, profile) {
                cb(err, profile)
            })
        })
    }

    function getPosts (cb) {
        S(
            sbot.messagesByType({
                type: ts.post,
                reverse: true
            }),
            getUrlForPost(),
            S.collect(function (err, data) {
                cb(err, data)
            })
        )
    }

    function getUrlForPost () {
        return S(
            S.map(function onData (post) {
                if (!post.value.content.mentions) return null

                var hash = post.value.content.mentions[0] ?
                    post.value.content.mentions[0].link :
                    null
                if (!hash) return null
                if (hash[0] != '&') return null
                return [hash, post]
            }),
            S.map(function ([hash, post]) {
                return [hash, toURL(hash), post]
            })
        )
    }

    function getProfileById (id, cb) {
        S(
            sbot.links({
                source: id,
                dest: id,
                rel: 'about',
                values: true
            }),
            S.collect(function (err, msgs) {
                var nameMsgs = msgs.filter(msg => msg.value.content.name)
                var nameMsg = nameMsgs[nameMsgs.length - 1]
                var images = msgs.filter(msg => msg.value.content.image)
                var imageMsg = images[images.length - 1]

                if (err) return cb(err)

                cb(err, {
                    name: nameMsg ? nameMsg.value.content.name : '' + id,
                    image: _.get(imageMsg, 'value.content.image', null)
                })
            })
        )
    }

    function getUrlForHash (hash, cb) {
        S(
            sbot.blobs.get(hash),
            S.collect(function (err, values) {
                if (err) {
                    // return null so the avatar shows as a broken link
                    return cb(null, null)
                }
                var blob = new Blob(values)
                var imageUrl = URL.createObjectURL(blob)
                cb(null, imageUrl)
            })
        )
    }


    return bus
}


module.exports = subscribe
