const config = require('../../config')
const MockPagerDataSource = require('./providers/mockPagerDataSource')

/**
 *
 * @return {MockPagerDataSource}
 */
const getDataSourceProvider = ()=>{

    const source = config.get('dataSource.escalationPolicy.provider')
    switch (source){
        case 'MOCK':
          return  new  MockPagerDataSource()
        default:
            throw new Error(`The selected provider ${source} is not implemented`)
    }
}

module.exports = {
    getDataSourceProvider
};
