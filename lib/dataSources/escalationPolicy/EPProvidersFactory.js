const config = require('../../config')
const MockEscalationPolicyDataSource = require('./providers/mockEscalationPolicyDataSource')

/**
 *
 * @return {MockEscalationPolicyDataSource}
 */
const getDataSourceProvider = ()=>{

    const source = config.get('dataSource.escalationPolicy.provider')
    switch (source){
        case 'MOCK':
          return  new  MockEscalationPolicyDataSource()
        default:
            throw new Error(`The selected provider ${source} is not implemented`)
    }
}

module.exports = {
    getDataSourceProvider
};
