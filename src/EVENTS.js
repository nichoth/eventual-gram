var namespace = require('@nichoth/events/namespace')

var evs = namespace({
    test: ['foo'],
    profile: ['setAvatar', 'save', 'get'],
    route: ['change']
})

module.exports = evs
