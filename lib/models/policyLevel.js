const Target = require('./target')

class PolicyLevel {

    /**
     *
     * @param {Array<Target>} targets
     */
    constructor(targets = []) {
        this.verified = false
        this.targets = targets
    }

    isVerified(){
        return this.verified
    }

    verify(){
        this.verified = true
    }

    addTarget(target){
        if(!(target instanceof Target) ){
            throw new Error('target parmeter should be an instance of Target')
        }
        this.targets.push(target)
    }

    getTargets(){
        return this.targets
    }
}

module.exports = PolicyLevel
