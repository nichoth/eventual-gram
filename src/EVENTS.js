var namespace = require('@nichoth/events/namespace')

var evs = namespace({
    test: ['foo'],
    profile: ['setAvatar', 'save', 'get'],
    route: ['change'],
    posts: ['get'],
    followed: ['get'],
    follow: ['start'],
    pub: ['join'],
    feed: ['get'],
    people: ['getProfile']
})

module.exports = evs
