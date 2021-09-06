/**
 * @class PagerDataSource
 * @description data source of pager service
 */
class PagerDataSource{

    /**
     *
     * @param {Number} monitoredServiceId
     * @return {MonitoredService}
     */
    // eslint-disable-next-line no-unused-vars
    getMonitoredServiceById(monitoredServiceId){
         throw new Error("this method must be implemented")
    }

    /**
     *
     * @param {Number} monitoredServiceId
     * @param {Boolean} status
     * @return {MonitoredService}
     */
    // eslint-disable-next-line no-unused-vars
    updateServiceHealthyStatus(monitoredServiceId, status){
        throw new Error("this method must be implemented")
    }
}

module.exports = PagerDataSource
