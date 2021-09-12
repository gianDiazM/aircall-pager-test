const EscalationPolicyDataSource = require('../escalationPolicyDataSource')

/**
 * @class MemoryEscalationPolicyDataSource
 * @description specific implementation for the MOCK type provider
 */
class MemoryEscalationPolicyDataSource extends EscalationPolicyDataSource {

    constructor() {
        super();
        this.escalationPolicies = {}
    }

    /**
     * @param {Number} monitoredServiceId
     * @return {EscalationPolicy}
     */
    getEscalationPolicyByServiceId(monitoredServiceId) {
        return this.escalationPolicies[monitoredServiceId]
    }

    /**
     * @param {EscalationPolicy} escalationPolicy
     */
    addEscalationPolicy(escalationPolicy) {
        this.escalationPolicies[escalationPolicy.monitoredServiceId] = escalationPolicy
    }
}

module.exports = MemoryEscalationPolicyDataSource
