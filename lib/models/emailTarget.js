const Target = require("./target");
const { TARGETS } = require("./constants");
const { validateEmail } = require("../utils/common");

class EmailTarget extends Target {
  constructor(email) {
    super(TARGETS.TYPES.EMAIL);
    if (!validateEmail(email)) {
      throw new Error(`Invalid Email ${email}`);
    }
    this.email = email;
  }

  getEmail() {
    return this.email;
  }
}

module.exports = EmailTarget;
