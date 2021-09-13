const pagerDataSource =
    require("../../dataSources/pager/PagerProvidersFactory").getDataSourceProvider();
const config = require('../../config')
const defaultTimeOut = config.get('services.timer.timeout')
const epService = require("../escalationPolicy/escalationPolicy");
const { sendMail } = require("../mail");
const { sendSMS } = require("../sms");
const { setAcknowledgedTimeout } = require("../timer");
const {
  TARGETS: { TYPES },
} = require("../../models/constants");

const notificationMethods = {
  [TYPES.SMS]: sendSMS,
  [TYPES.EMAIL]: sendMail,
};
const pendingAlertsCache = require('../../cache/alertsCache')

/**
 *
 * @param serviceId
 * @param status
 * @return {MonitoredService}
 */
const updateServiceHealthyStatus= (serviceId ,status) => {
  if(status){
    pendingAlertsCache.setPendingAlert(serviceId, false)
    const escalationPolicy = epService.getPolicyByServiceId(
        serviceId
    );
    escalationPolicy.restorePolicyLevelStatus()
  }
  return pagerDataSource.updateServiceHealthyStatus(serviceId, status);
};


/**
 *
 * @param policyLevel
 */
const sendNotifications = (policyLevel) => {
  policyLevel.targets.forEach((target) => {
    const notify = notificationMethods[target.type];
    notify(target);
  });
  policyLevel.sentToTargets()
};

/**
 * We validate the alert, we put the service status to unhealthy, we notify the targets related to the first level of escalation policy and we put a delay
 * @param {Alert} alert
 */
const processAlert = (alert) => {
  let alertProcessed = false
  if (!alert || !alert.message || !alert.monitoredServiceId) {
    throw new Error("This alert cannot be processed");
  }
  let monitoredService = pagerDataSource.getMonitoredServiceById(alert.monitoredServiceId)
  if(monitoredService && monitoredService.healthyStatus) {
    monitoredService = updateServiceHealthyStatus(alert.monitoredServiceId, false)
    const escalationPolicy = epService.getPolicyByServiceId(
        monitoredService.id
    );
    notifyNextAvailableTargets(escalationPolicy)
    setAcknowledgedTimeout(monitoredService.id, escalationPolicy, defaultTimeOut)
    pendingAlertsCache.setPendingAlert(monitoredService.id, true)
    alertProcessed= true
  }
  return alertProcessed
};

/**
 * If the alert is in pending status we notify the next level of policy related to the service
 * @param {EscalationPolicy} escalationPolicy
 * @param {Number} monitoredServiceId - serviceId relate to monitored service
 */
const handleAcknowledgedTimeout = (escalationPolicy, monitoredServiceId)=>{
  if(pendingAlertsCache.getPendingAlert(monitoredServiceId)){
    notifyNextAvailableTargets(escalationPolicy)
  }
}
/**
 * We acknowledge an alert in pending status
 * @param {Number} serviceId - serviceId relate to monitored service
 */
const handleAcknowledged = (serviceId)=>{
  if(pendingAlertsCache.getPendingAlert(serviceId)){
    updateServiceHealthyStatus(serviceId, true)
  }
}

/**
 * This method is in charge of notifying all targets related to the EP
 * @param {EscalationPolicy} escalationPolicy
 */
const notifyNextAvailableTargets = (escalationPolicy )=>{
  const policyLevel = escalationPolicy.getNextNonSentPolicyLevel()
  if (policyLevel && !policyLevel.sent && policyLevel.targets.length) {
    sendNotifications(policyLevel);
  }
}


module.exports = {
  processAlert,
  handleAcknowledgedTimeout,
  handleAcknowledged,
  updateServiceHealthyStatus
};
