jest.mock("../../dataSources/pager/providers/mockPagerDataSource", () => {
  const toBeModified = jest.requireActual(
    "../../dataSources/pager/providers/mockPagerDataSource"
  );
  const updateServiceHealthyStatus =
    toBeModified.prototype.updateServiceHealthyStatus;
  toBeModified.prototype.updateServiceHealthyStatus = jest
    .fn()
    .mockImplementation(updateServiceHealthyStatus);
  return toBeModified;
});

jest.mock("../../services/escalationPolicy/escalationPolicy");
jest.mock("../../services/mail/mail");
jest.mock("../../services/sms/sms");
jest.mock("../../services/timer/timer");

const timerService = require("../../services/timer/timer");
const emailService = require("../../services/mail/mail");
const smsService = require("../../services/sms/sms");
const epService = require("../../services/escalationPolicy/escalationPolicy");
const MockPagerDataSource = require("../../dataSources/pager/providers/mockPagerDataSource");
const Alert = require("../../models/alert");
const pager = require("../../../lib/services/pager/pager");
const SmsTarget = require("../../../lib/models/smsTarget");
const EmailTarget = require("../../../lib/models/emailTarget");
const PolicyLevel = require("../../../lib/models/policyLevel");
const EscalationPolicy = require("../../../lib/models/escalationPolicy");

describe(
  "Given a Monitored Service in a Healthy State,\n" +
    "when the Pager receives an Alert related to this Monitored Service,\n" +
    "then the Monitored Service becomes Unhealthy,\n" +
    "the Pager notifies all targets of the first level of the escalation policy,\n" +
    "and sets a 15-minutes acknowledgement delay",
  () => {
    // eslint-disable-next-line no-unused-vars
    let incomingAlert = null;
    let mockPolicyLevels = null;
    const monitoredServiceId = 111;
    const dummyMessage = "dummyMessage";

    afterEach(()=>{
        pager.eventEmitter.emit('acknowledged', null, monitoredServiceId )
    })
    beforeEach(() => {
      incomingAlert = new Alert(monitoredServiceId, dummyMessage);

      const smsTargets = [
        new SmsTarget("811445601"),
        new SmsTarget("811445602"),
      ];
      const mixtargets = [
        new SmsTarget("711445601"),
        new EmailTarget("mix1@gmail.com"),
        new SmsTarget("711445602"),
        new EmailTarget("mix2@gmail.com"),
      ];

      mockPolicyLevels = [
        new PolicyLevel(mixtargets),
        new PolicyLevel(smsTargets),
      ];
    });

    it("the Monitored Service becomes Unhealthy", () => {
      epService.getPolicyByServiceId.mockReturnValueOnce(
        new EscalationPolicy(monitoredServiceId, [])
      );
      const acknowledgedAlert = pager.processAlert(incomingAlert);
      const expectedStatus = false; // set false status
      expect(acknowledgedAlert).toBeTruthy();
      expect(
        MockPagerDataSource.prototype.updateServiceHealthyStatus
      ).toBeCalledWith(monitoredServiceId, expectedStatus);
    });

    it("the Pager notifies all targets of the first level of the escalation policy", () => {
      epService.getPolicyByServiceId.mockReturnValueOnce(
        new EscalationPolicy(monitoredServiceId, mockPolicyLevels)
      );
      const acknowledgedAlert = pager.processAlert(incomingAlert);
      expect(acknowledgedAlert).toBeTruthy();
      expect(smsService.sendSMS).toBeCalledTimes(2);
      expect(emailService.sendMail).toBeCalledTimes(2);
    });

    it("sets a 15-minutes acknowledgement delay", () => {
      epService.getPolicyByServiceId.mockReturnValueOnce(
        new EscalationPolicy(monitoredServiceId, mockPolicyLevels)
      );
      const acknowledgedAlert = pager.processAlert(incomingAlert);
      expect(acknowledgedAlert).toBeTruthy();
      expect(timerService.setAcknowledgedTimeout).toBeCalled();
    });
  }
);
