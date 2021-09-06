class Alert {

    /**
     *
     * @param {Number} monitoredServiceId
     * @param {string} message
     */
    constructor(monitoredServiceId, message = '') {
        this.monitoredServiceId = monitoredServiceId
        this.message = message
    }
}

module.exports = Alert
