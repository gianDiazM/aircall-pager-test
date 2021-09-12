const Target = require('./target')

class PolicyLevel {

    /**
     *
     * @param {Array<Target>} targets
     */
    constructor(targets = []) {
        this.sent = false
        this.targets = targets
    }

    sentToTargets(){
        this.sent = true
    }
}

module.exports = PolicyLevel
