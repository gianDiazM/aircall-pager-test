const EscalationPolicyDataSource = require('../../../dataSources/escalationPolicy/escalationPolicyDataSource')
const EscalationPolicy = require('../../../models/escalationPolicy')
const PolicyLevel = require('../../../models/policyLevel')

const SmsTarget = require('../../../models/smsTarget')
const EmailTarget = require('../../../models/emailTarget')

const smsTargets = [new SmsTarget('611445601'), new SmsTarget('611445602'), new SmsTarget('611445603')]
const emailTargets =[new EmailTarget('email1@gmail.com'), new EmailTarget('email2@gmail.com'), new EmailTarget('email3@gmail.com')]
const mixtargets = [new SmsTarget('711445601'), new EmailTarget('mix1@gmail.com'), new SmsTarget('711445602'), new EmailTarget('mix2@gmail.com')]

const mockPolicyLevels = [
    new PolicyLevel(smsTargets),
    new PolicyLevel(mixtargets),
    new PolicyLevel(emailTargets)
]

class EPDataSource extends EscalationPolicyDataSource {

    constructor() {
        super();
    }

    /**
     * @param {Number} monitoredServiceId
     * @return {EscalationPolicy}
     */
    getEscalationPolicyByServiceId(monitoredServiceId){
        return new EscalationPolicy(monitoredServiceId, mockPolicyLevels)
    }

}

module.exports = EPDataSource
