const config = require('../../config')
const MemoryEscalationPolicyDataSource = require('./providers/memoryEscalationPolicyDataSource')
const {DATA_SOURCE} = require('../constants')

/**
 *
 * @return {EscalationPolicyDataSource}
 */
const getDataSourceProvider = ()=>{
    const source = config.get('dataSource.escalationPolicy.provider')
    switch (source){
        case DATA_SOURCE.ESCALATION_POLICY.TYPE:
          return  new  MemoryEscalationPolicyDataSource()
        default:
            throw new Error(`The selected provider ${source} is not implemented`)
    }
}

module.exports = {
    getDataSourceProvider
};
