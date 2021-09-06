const Target = require("./target");
const { TARGETS } = require("./constants");
const { validaPhoneNumber } = require("../utils/common");

class SmsTarget extends Target {
  constructor(phoneNumber) {
    super(TARGETS.TYPES.SMS);
    if (!validaPhoneNumber(phoneNumber)){
        throw new Error(`Invalid phone-number :: ${phoneNumber} `);
    }
    this.phoneNumber = phoneNumber;
  }

  getPhoneNumber() {
    return this.phoneNumber;
  }
}

module.exports = SmsTarget;
