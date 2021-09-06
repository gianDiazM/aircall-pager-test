const PolicyLevel = require('./policyLevel')

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
     * Returns the  first non verified  policy level related to the escalation policy
     * @return {PolicyLevel}
     */
     getNextNonVerifiedPolicyLevel(){
         return  this.policyLevels.find(pl => !pl.verified)

     }
     getMonitoredServiceId(){
         return this.monitoredServiceId
     }

     getPolicyLevels(){
         return this.policyLevels
     }

     addPolicyLevel(policyLevel){
         if(!(policyLevel instanceof PolicyLevel)){
             throw new Error('policyLevel parameter should be an instance of PolicyLevel')
         }
         this.policyLevels.push(policyLevel)
     }
}

module.exports = EscalationPolicy
