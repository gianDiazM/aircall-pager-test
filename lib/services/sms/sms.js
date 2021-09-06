/**
 *
 * @param {SmsTarget} phoneNumber
 */
const sendSMS =  (phoneNumber)=>{
    console.log(`the sms to ${phoneNumber.phoneNumber} was sent`)
}

module.exports = {
    sendSMS
}
