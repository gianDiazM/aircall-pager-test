const config = require('../../config')
const MemoryPagerDataSource = require('./providers/memoryPagerDataSource')
const {DATA_SOURCE} = require('../constants')

/**
 *
 * @return {PagerDataSource}
 */
const getDataSourceProvider = ()=>{
    const source = config.get('dataSource.escalationPolicy.provider')
    switch (source){
        case DATA_SOURCE.PAGER.TYPE:
          return  new  MemoryPagerDataSource()
        default:
            throw new Error(`The selected provider ${source} is not implemented`)
    }
}

module.exports = {
    getDataSourceProvider
};
