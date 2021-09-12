const PagerDataSource = require('../../../dataSources/pager/pagerDataSource')
const MonitoredService = require('../../../models/monitoredService')

class MockPagerDataSource extends PagerDataSource {

    constructor(servicesCount = 10) {
        super();
        this.monitoredServices = {}
        for (let i = 1; i <= servicesCount; i++) {
            this.monitoredServices[i] = new MonitoredService(i)
        }
    }

    /**
     * @param {Number} monitoredServiceId
     * @return {MonitoredService}
     */
    getMonitoredServiceById(monitoredServiceId){
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
