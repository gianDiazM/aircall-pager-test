
/**
 * @class EscalationPolicy
 * @description An escalation policy is composed by the service id and policy levels
 */
class EscalationPolicy {

    /**
     *
     * @param {Number} monitoredServiceId
     * @param {Array<PolicyLevel>} policyLevels
     */
     constructor(monitoredServiceId, policyLevels = []) {
         this.monitoredServiceId = monitoredServiceId
         this.policyLevels = policyLevels
     }

    /**
     * Returns the  first non sent  policy level related to the escalation policy
     * @return {PolicyLevel}
     */
    getNextNonSentPolicyLevel(){
        return  this.policyLevels.find(pl => !pl.sent)

    }

    currentSentPolicyLevel(){
         return this.policyLevels.find(pl => pl.sent)
    }

}

module.exports = EscalationPolicy
