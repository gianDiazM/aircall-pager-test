const dataSource = require('../../dataSources/escalationPolicy/EPProvidersFactory').getDataSourceProvider()

/**
 *
 * @param {number} monitoredServiceId
 * @return {EscalationPolicy}
 */

const getPolicyByServiceId = (monitoredServiceId)=>{
    return dataSource.getEscalationPolicyByServiceId(monitoredServiceId)
}

module.exports = {
    getPolicyByServiceId
}
