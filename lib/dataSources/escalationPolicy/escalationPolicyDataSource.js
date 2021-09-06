/**
 * @class EscalationPolicyDataSource
 * @description data source of escalation policy
 */
class EscalationPolicyDataSource{

    /**
     *
     * @param {Number} monitoredServiceId
     * @return {EscalationPolicy}
     */
    // eslint-disable-next-line no-unused-vars
    getEscalationPolicyByServiceId(monitoredServiceId){
         throw new Error("this method must be implemented")
    }
}

module.exports = EscalationPolicyDataSource
