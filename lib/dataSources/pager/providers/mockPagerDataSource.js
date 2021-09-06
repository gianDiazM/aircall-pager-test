const PagerDataSource = require('../pagerDataSource')
const MonitoredService = require('../../../models/monitoredService')

/**
 * @class MockPagerDataSource
 * @description specific implementation for the MOCK type provider
 */
class MockPagerDataSource extends PagerDataSource {

    constructor() {
        super();
        this.monitoredServices = {}
    }

    /**
     * @param {Number} monitoredServiceId
     * @return {MonitoredService}
     */
    getMonitoredServiceById(monitoredServiceId){
        if(!this.monitoredServices[monitoredServiceId] ){
            this.monitoredServices[monitoredServiceId] =  new MonitoredService(monitoredServiceId)
        }
        return this.monitoredServices[monitoredServiceId]

    }

    /**
     *
     * @param {Number} monitoredServiceId
     * @param {Boolean} status
     * @return {MonitoredService}
     */
    updateServiceHealthyStatus(monitoredServiceId, status){
        if(this.monitoredServices[monitoredServiceId] ){
            this.monitoredServices[monitoredServiceId].healthyStatus =  status
        }
        return  this.monitoredServices[monitoredServiceId]
    }
}

module.exports = MockPagerDataSource
