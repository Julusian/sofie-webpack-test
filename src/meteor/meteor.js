const Meteor = {
     _debug: (line) => {
        console.debug(line)
    },

    _suppressed_log_expected: () => {
        return true
    },
    _suppress_log: (i) => {
        //
    },

    _noYieldsAllowed: (cb) => {
        return cb()
    },

    _setImmediate: (cb) => {
        return setTimeout(cb, 0)
    },

    setTimeout: (...args) => {
        return setTimeout(...args)
    },
    setInterval: (...args) => {
        return setInterval(...args)
    },
    clearInterval: (...args) => {
        return clearInterval(...args)
    },

    defer: (cb) => {
        return setTimeout(cb, 0)
    },

    makeErrorType: (type, factory) => {
        throw new Error('not implemented')
    },

    bindEnvironment: (cb, errorhandler) => {
        throw new Error('not implemented')
    },

    _nodeCodeMustBeInFiber: () => {
        // TODO
        throw new Error('not implemented')
    },

    absoluteUrl: (url) => {
        throw new Error('not implemented')
    },
    _relativeToSiteRootUrl: (url) => {
        throw new Error('not implemented')
    },

    settings: {},

    isClient: true,
    isServer: false,
    isTest: false,
};

class _SynchronousQueue {
    constructor(){
        throw new Error('not implemented')
    }
}
class EnvironmentVariable {
    constructor() {
        throw new Error('not implemented')
    }
}
class MeteorError {
    constructor() {
        throw new Error('not implemented')
    }
}

Meteor._SynchronousQueue = _SynchronousQueue;
Meteor.EnvironmentVariable = EnvironmentVariable;
Meteor.Error = MeteorError;

export { Meteor }
window.Meteor = Meteor