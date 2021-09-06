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
jest.mock("../../services/mail/mail");
jest.mock("../../services/sms/sms");
jest.mock("../../services/timer/timer");

const SmsTarget = require("../../../lib/models/smsTarget");
const EmailTarget = require("../../../lib/models/emailTarget");
const timerService = require("../../services/timer/timer");
const emailService = require("../../services/mail/mail");
const smsService = require("../../services/sms/sms");
const Alert = require("../../models/alert");
const pager = require("../../../lib/services/pager/pager");

describe(
    'Given a Monitored Service in an Unhealthy State,\n' +
    'when the Pager receives a Healthy event related to this Monitored Service\n' +
    'and later receives the Acknowledgement Timeout,\n' +
    'then the Monitored Service becomes Healthy,\n' +
    'the Pager doesn’t notify any Target\n' +
    'and doesn’t set an acknowledgement delay',
    () => {
        // eslint-disable-next-line no-unused-vars
        let incomingAlert1 = null;
        let incomingAlert2 = null;
        const monitoredServiceId = 515;
        const dummyMessage = "dummyMessage-5";

        beforeEach(() => {
            incomingAlert1 = new Alert(monitoredServiceId, dummyMessage);
            pager.processAlert(incomingAlert1);
            pager.eventEmitter.emit('acknowledged', null, monitoredServiceId )
        });

        it("Once we set the status of the service to healthy, and we return to process another message from the same service, it follows the normal flow", () => {
            incomingAlert2 = new Alert(monitoredServiceId, dummyMessage);
            const acknowledgedAlert = pager.processAlert(incomingAlert2);
            expect(acknowledgedAlert).toBeTruthy();
            expect(timerService.setAcknowledgedTimeout).toBeCalled();
            expect(smsService.sendSMS).toBeCalled();
            expect(emailService.sendMail).toBeCalled();
        });
    }
);
