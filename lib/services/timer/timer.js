const {handleAcknowledgedTimeout} = require('../pager')


/**
 * @param {Number} serviceId - service
 * @param {Object} escalationPolicy - escalationPolicy
 * @param {Number} timeout - in minutes
 */
const setAcknowledgedTimeout =  (serviceId,escalationPolicy, timeout)=>{
    console.log(`the timeout for service id <${serviceId}> is sat in ${timeout} minutes`)
    setTimeout(()=>{
        handleAcknowledgedTimeout(escalationPolicy, serviceId)
    }, timeout*60*1000)

}

module.exports = {
    setAcknowledgedTimeout
}
