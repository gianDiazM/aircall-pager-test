const MockPagerDataSource = require('./__mocks__/mockPagerDataSource')
const MockEPDataSource = require('./__mocks__/mockEPDataSource')
const mockPagerDataSource = new MockPagerDataSource()
const mockEPDataSource = new MockEPDataSource()

jest.mock('../../services/sms')
jest.mock('../../services/timer')
jest.mock('../../../lib/dataSources/pager/PagerProvidersFactory', ()=>{
    return {
        getDataSourceProvider: ()=> mockPagerDataSource
    }
})
jest.mock('../../../lib/dataSources/escalationPolicy/EPProvidersFactory', ()=>{
    return {
        getDataSourceProvider: ()=> mockEPDataSource
    }
})
const pager = require("../../../lib/services/pager");
const sms = require('../../services/sms')
const timer = require('../../services/timer')

/**
 * Given a Monitored Service in a Healthy State,
 when the Pager receives an Alert related to this Monitored Service,
 then the Monitored Service becomes Unhealthy,
 the Pager notifies all targets of the first level of the escalation policy,
 and sets a 15-minutes acknowledgement delay
 */

describe('When the alert has a wrong format', ()=>{
    it('the process should throws an error', ()=>{
        expect(pager.processAlert).toThrow(Error)
    })
})

describe('When the alert has a right format but the related service Id is not at database', ()=>{
    it('the process alert method does nothing and returns a flag indicating that the message has not been processed', ()=>{
        const rightMessage= {monitoredServiceId: 111, message: 'any'}
        expect(pager.processAlert(rightMessage)).toBeFalsy()
    })
})

describe('Given a Monitored Service in a Healthy State, when the Pager receives an Alert related to this Monitored Service,', ()=>{

    it('then the Monitored Service becomes Unhealthy',()=>{
        const monitoredServiceId = 1
        const incomingAlert = {
            monitoredServiceId: monitoredServiceId,
            message: 'any-1'
        }
        pager.processAlert(incomingAlert);
        const monitoredService = mockPagerDataSource.getMonitoredServiceById(monitoredServiceId)
        expect(monitoredService.healthyStatus).toBeFalsy()
    })

    it('and the Pager notifies all targets of the first level of the escalation policy,',()=>{
        const monitoredServiceId = 2
        const incomingAlert = {
            monitoredServiceId: monitoredServiceId,
            message: 'any-2'
        }
        pager.processAlert(incomingAlert);
        expect(sms.sendSMS).toBeCalled()

    })

    it('and sets a 15-minutes acknowledgement delay',()=>{
        const monitoredServiceId = 3
        const incomingAlert = {
            monitoredServiceId: monitoredServiceId,
            message: 'any-3'
        }
        pager.processAlert(incomingAlert);
        expect(timer.setAcknowledgedTimeout).toBeCalled()

    })

})
