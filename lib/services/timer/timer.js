/**
 * @param {Object} service - service
 * @param {Object} escalationPolicy - service id
 * @param {Number} timeout - in minutes
 * @param {module:events.EventEmitter} eventEmitter -
 */
const setAcknowledgedTimeout =  (service,policyLevel, timeout, eventEmitter)=>{
    console.log(`the timeout for service id <${service.id}> is sat in ${timeout} minutes`)
    setTimeout(()=>{
        eventEmitter.emit('acknowledgedTimeoutExpired', policyLevel)
    }, timeout*60*1000)

}

module.exports = {
    setAcknowledgedTimeout
}
