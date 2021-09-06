class MonitoredService {

    /**
     *
     * @param {Number} id
     * @param {Boolean} healthyStatus
     */
    constructor(id, healthyStatus= true) {
        this.id = id
        this.healthyStatus = healthyStatus
    }
}

module.exports = MonitoredService
