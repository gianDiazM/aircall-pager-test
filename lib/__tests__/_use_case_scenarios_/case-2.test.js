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

jest.mock("../../services/sms/sms");

const PolicyLevel = require("../../../lib/models/policyLevel");
const SmsTarget = require("../../../lib/models/smsTarget");
const EmailTarget = require("../../../lib/models/emailTarget");
const smsService = require("../../services/sms/sms");
const MockPagerDataSource = require("../../dataSources/pager/providers/mockPagerDataSource");
const Alert = require("../../models/alert");
const pager = require("../../../lib/services/pager/pager");
const mixtargets = [
    new SmsTarget("711445601"),
    new EmailTarget("mix1@gmail.com"),
    new SmsTarget("711445602"),
    new EmailTarget("mix2@gmail.com"),
];

const smsTargets = [
    new SmsTarget("811445601"),
    new SmsTarget("811445602"),
    new SmsTarget("811445902"),
];

describe(
  "Given a Monitored Service in an Unhealthy State,\n" +
    "the corresponding Alert is not Acknowledged\n" +
    "and the last level has not been notified,\n" +
    "when the Pager receives the Acknowledgement Timeout,\n" +
    "then the Pager notifies all targets of the next level of the escalation policy\n" +
    "and sets a 15-minutes acknowledgement delay.",
  () => {
    // eslint-disable-next-line no-unused-vars
    let incomingAlert = null;
    const monitoredServiceId = 212;
    const dummyMessage = "dummyMessage";

    beforeEach(() => {
      incomingAlert = new Alert(monitoredServiceId, dummyMessage);
      MockPagerDataSource.prototype.getMonitoredServiceById.mockReturnValueOnce(
        { healthyStatus: false }
      );
    });

    it("the corresponding Alert is not Acknowledged", () => {
      const acknowledgedAlert = pager.processAlert(incomingAlert);
      expect(acknowledgedAlert).toBeFalsy();
    });
    it("The corresponding Alert is not Acknowledged and the last level has not been notified when the Pager receives the Acknowledgement Timeout then the Pager notifies all targets of the next level of the escalation policy and sets a 15-minutes acknowledgement delay. ", () => {
        const mockPolicyLevels = [
            new PolicyLevel(mixtargets),
            new PolicyLevel(smsTargets),
        ];

        mockPolicyLevels[0].verify()
        pager.eventEmitter.emit('acknowledgedTimeoutExpired', mockPolicyLevels[1])
        expect(smsService.sendSMS).toBeCalledTimes(3);
    });
  }
);
