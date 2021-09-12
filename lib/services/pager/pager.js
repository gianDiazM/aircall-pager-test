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

const pendingAlerts = {

}


const updateServiceHealthyStatus= (serviceId ,status) => {
  return pagerDataSource.updateServiceHealthyStatus(serviceId, status);
};

const sendNotifications = (policyLevel) => {
  policyLevel.targets.forEach((target) => {
    const notify = notificationMethods[target.type];
    notify(target);
  });
  policyLevel.sentToTargets()
};

/**
 *
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
    pendingAlerts[alert.monitoredServiceId] = true
    alertProcessed= true
  }
  return alertProcessed
};

const handleAcknowledgedTimeout = (escalationPolicy, monitoredServiceId)=>{
  console.log(pendingAlerts)
  if(pendingAlerts[monitoredServiceId]){
    return notifyNextAvailableTargets(escalationPolicy)
  }
}

const handleAcknowledged = (serviceId)=>{
  if(pendingAlerts[serviceId]){
    updateServiceHealthyStatus(serviceId, true)
    pendingAlerts[serviceId] = false
    const escalationPolicy = epService.getPolicyByServiceId(
        serviceId
    );
    escalationPolicy.currentSentPolicyLevel().sent = false
  }
}

/**
 *
 * @param policyLevel
 * @param serviceId
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
  handleAcknowledged
};
