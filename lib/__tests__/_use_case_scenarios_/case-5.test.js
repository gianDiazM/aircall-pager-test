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
 when the Pager receives a Healthy event related to this Monitored Service
 and later receives the Acknowledgement Timeout,
 then the Monitored Service becomes Healthy,
 the Pager doesn’t notify any Target
 and doesn’t set an acknowledgement delay
 */


describe('Given a Monitored Service in an Unhealthy State,\n', ()=>{
    const monitoredServiceId = 1
    const rightMessage= {monitoredServiceId, message: 'any-1'}
    beforeEach(()=>{
        // set Unhealthy State to service 1
        pager.processAlert(rightMessage)
        sms.sendSMS.mockClear()
        timer.setAcknowledgedTimeout.mockClear()

    })

    it( 'when the Pager receives a Healthy event related to this Monitored Service\n' +
        'and later receives the Acknowledgement Timeout,\n' +
        'then the Monitored Service becomes Healthy,\n' +
        'the Pager doesn’t notify any Target\n' +
        'and doesn’t set an acknowledgement delay', ()=>{
        // send healthy event
        pager.updateServiceHealthyStatus(monitoredServiceId, true)

        // receives the Acknowledgement Timeout
        const escalationPolicy = epService.getPolicyByServiceId(monitoredServiceId)
        // When timeOut expires this handleAcknowledgedTimeout is called
        pager.handleAcknowledgedTimeout(escalationPolicy,monitoredServiceId)

        // Service is no called
        expect(sms.sendSMS).toBeCalledTimes(0)
        expect(timer.setAcknowledgedTimeout).toBeCalledTimes(0)
    })
})
