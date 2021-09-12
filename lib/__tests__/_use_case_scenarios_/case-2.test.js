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
const epService = require('../../services/escalationPolicy')
const pager = require("../../../lib/services/pager");
const sms = require('../../services/sms')
const timer = require('../../services/timer')

/**
 Given a Monitored Service in an Unhealthy State,
 the corresponding Alert is not Acknowledged
 and the last level has not been notified,
 when the Pager receives the Acknowledgement Timeout,
 then the Pager notifies all targets of the next level of the escalation policy
 and sets a 15-minutes acknowledgement delay.
 */


describe('Given a Monitored Service in an Unhealthy State, the corresponding Alert is not Acknowledged and the last level has not been notified', ()=>{
    const monitoredServiceId = 1
    const rightMessage= {monitoredServiceId, message: 'any-1'}
    beforeEach(()=>{
        // set Unhealthy State to service 1
        pager.processAlert(rightMessage)
    })

    it(' when the Pager receives the Acknowledgement Timeout, then the Pager notifies all targets of the next level of the escalation policy and sets a 15-minutes acknowledgement delay.', ()=>{
        const escalationPolicy = epService.getPolicyByServiceId(monitoredServiceId)
        // When timeOut expires this handleAcknowledgedTimeout is called
        pager.handleAcknowledgedTimeout(escalationPolicy,monitoredServiceId)
        expect(sms.sendSMS).toBeCalled()
        expect(timer.setAcknowledgedTimeout).toBeCalledWith(expect.anything(), expect.anything(), 15)
    })
})
