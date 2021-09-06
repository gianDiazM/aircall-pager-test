const pagerDataSource =
    require("../../dataSources/pager/PagerProvidersFactory").getDataSourceProvider();
const config = require('../../config')
const defaultTimeOut = config.get('services.timer.timeout')
const epService = require("../escalationPolicy/escalationPolicy");
const { sendMail } = require("../mail/mail");
const { sendSMS } = require("../sms/sms");
const { setAcknowledgedTimeout } = require("../timer/timer");
const {
  TARGETS: { TYPES },
} = require("../../models/constants");

const notificationMethods = {
  [TYPES.SMS]: sendSMS,
  [TYPES.EMAIL]: sendMail,
};
const events = require('events');
const eventEmitter = new events.EventEmitter();

/**
 *
 * @param {Number} serviceId
 * @return {MonitoredService}
 */
const getServiceById = (serviceId) => {
  return pagerDataSource.getMonitoredServiceById(serviceId);
};

const updateServiceHealthyStatus= (serviceId ,status) => {
  return pagerDataSource.updateServiceHealthyStatus(serviceId, status);
};

const sendNotifications = (targets) => {
  targets.forEach((target) => {
    const notify = notificationMethods[target.type];
    notify(target);
  });
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
  let monitoredService = getServiceById(alert.monitoredServiceId)
  if(monitoredService.healthyStatus) {
    monitoredService = updateServiceHealthyStatus(alert.monitoredServiceId, false)
    const escalationPolicy = epService.getPolicyByServiceId(
        monitoredService.id
    );
    const policyLevel = escalationPolicy.getNextNonVerifiedPolicyLevel()
    notifyNextAvailableTargets(policyLevel)
    setAcknowledgedTimeout(monitoredService, policyLevel, defaultTimeOut, eventEmitter)
    alertProcessed= true
  }
  return alertProcessed
};

const notifyNextAvailableTargets = (policyLevel, serviceId)=>{
  if (policyLevel && !policyLevel.verified && policyLevel.targets.length) {
    sendNotifications(policyLevel.targets);
    policyLevel.verify()
  }
  if(serviceId){
    updateServiceHealthyStatus(serviceId, true)
  }
}


eventEmitter.on('acknowledgedTimeoutExpired', notifyNextAvailableTargets);
eventEmitter.on('acknowledged', notifyNextAvailableTargets);

module.exports = {
  getServiceById,
  processAlert,
  notifyNextAvailableTargets,
  eventEmitter

};
