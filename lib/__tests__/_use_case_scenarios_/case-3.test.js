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
const epService = require('../../services/escalationPolicy')

/**
 Given a Monitored Service in an Unhealthy State
 when the Pager receives the Acknowledgement
 and later receives the Acknowledgement Timeout,
 then the Pager doesn't notify any Target
 and doesn't set an acknowledgement delay.
 */


describe(' Given a Monitored Service in an Unhealthy State\n' +
    ' when the Pager receives the Acknowledgement\n' +
    ' and later receives the Acknowledgement Timeout,', ()=>{
    const monitoredServiceId = 1
    const rightMessage= {monitoredServiceId, message: 'any-1'}
    beforeEach(()=>{
        // set Unhealthy State to service 1
        pager.processAlert(rightMessage)

        // pager receives the Acknowledgement ()
        pager.handleAcknowledged(monitoredServiceId)
        // reset mock
        sms.sendSMS.mockClear()
    })

    it('then the Pager doesn\'t notify any Target\n' +
        ' and doesn\'t set an acknowledgement delay.', ()=>{
        const escalationPolicy = epService.getPolicyByServiceId(monitoredServiceId)
        // When timeOut expires this notifyNextAvailableTargets is called
        pager.handleAcknowledgedTimeout(escalationPolicy)
        // Service is no called
        expect(sms.sendSMS).toBeCalledTimes(0)
    })
})
