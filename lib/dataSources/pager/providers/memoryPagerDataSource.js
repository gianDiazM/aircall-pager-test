const PagerDataSource = require('../pagerDataSource')

/**
 * @class MemoryPagerDataSource
 * @description specific implementation for the MOCK type provider
 */
class MemoryPagerDataSource extends PagerDataSource {

    constructor() {
        super();
        this.monitoredServices = {}
    }

    /**
     * @param {Number} monitoredServiceId
     * @return {MonitoredService}
     */
    getMonitoredServiceById(monitoredServiceId){
        return this.monitoredServices[monitoredServiceId]
    }

    /**
     * @param {MonitoredService} monitoredService
     * @return {EscalationPolicy}
     */
    addMonitoredService(monitoredService) {
        this.monitoredServices[monitoredService.id] = monitoredService
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

module.exports = MemoryPagerDataSource
