jest.mock("../../dataSources/pager/providers/mockPagerDataSource", () => {
    const toBeModified = jest.requireActual(
        "../../dataSources/pager/providers/mockPagerDataSource"
    );
    const getMonitoredServiceById =
        toBeModified.prototype.getMonitoredServiceById;
    toBeModified.prototype.getMonitoredServiceById = jest
        .fn()
        .mockImplementation(getMonitoredServiceById);
    return toBeModified;
});

jest.useFakeTimers();

jest.mock("../../services/sms/sms");

const MockPagerDataSource = require("../../dataSources/pager/providers/mockPagerDataSource");
const Alert = require("../../models/alert");
const pager = require("../../../lib/services/pager/pager");

describe(
    'Given a Monitored Service in an Unhealthy State,\n' +
    'when the Pager receives an Alert related to this Monitored Service,\n' +
    'then the Pager doesn’t notify any Target\n' +
    'and doesn’t set an acknowledgement delay',
    () => {
        // eslint-disable-next-line no-unused-vars
        let incomingAlert1 = null;
        let incomingAlert2 = null;
        const monitoredServiceId = 414;
        const dummyMessage = "dummyMessage-4";

        beforeEach(() => {
            incomingAlert1 = new Alert(monitoredServiceId, dummyMessage);
            pager.processAlert(incomingAlert1);
            MockPagerDataSource.prototype.getMonitoredServiceById.mockReturnValueOnce(
                { healthyStatus: false }
            );
        });

        it("In the beforeEach we put the service in unhealthy state then we invoke the service again, as a result the 2 alert is not processed", () => {
            incomingAlert2 = new Alert(monitoredServiceId, dummyMessage);
            pager.processAlert(incomingAlert2);
            const acknowledgedAlert = pager.processAlert(incomingAlert2);
            expect(acknowledgedAlert).toBeFalsy();
        });
    }
);
