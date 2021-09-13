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
 Given a Monitored Service in an Unhealthy State,
 when the Pager receives an Alert related to this Monitored Service,
 then the Pager doesn’t notify any Target
 and doesn’t set an acknowledgement delay
 */


describe('  Given a Monitored Service in an Unhealthy State,\n' +
    ' when the Pager receives an Alert related to this Monitored Service,\n' +
    ' then the Pager doesn’t notify any Target\n' +
    ' and doesn’t set an acknowledgement delay', ()=>{
    const monitoredServiceId = 1
    const rightMessage= {monitoredServiceId, message: 'any-1'}
    beforeEach(()=>{
        // set Unhealthy State to service 1
        pager.processAlert(rightMessage)
        sms.sendSMS.mockClear()
        timer.setAcknowledgedTimeout.mockClear()

    })

    it('then the Pager doesn\'t notify any Target\n' +
        ' and doesn\'t set an acknowledgement delay.', ()=>{
        // Now send other alert related to the same service
        pager.processAlert(rightMessage)
        // Service is no called
        expect(sms.sendSMS).toBeCalledTimes(0)
        expect(timer.setAcknowledgedTimeout).toBeCalledTimes(0)
    })
})
