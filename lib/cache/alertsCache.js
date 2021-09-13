class AlertsCache {
     constructor() {
         this.pendingAlerts = {}
     }

     setPendingAlert(serviceId, value){
         this.pendingAlerts[serviceId] = value
     }

     getPendingAlert(servideId){
         return this.pendingAlerts[servideId]
     }

}

module.exports = new AlertsCache()
