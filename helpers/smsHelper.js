require('dotenv').config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

const createCode = () => {
    const digits = '0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * digits.length);
        code += digits[randomIndex];
    }
    return code;
}

const sendSMS = (toNumber) => {
    const code = createCode();

    client.messages
        .create({
            body: 'Su codigo de verificacion es: ' + code,
            from: '+13202881990',
            to: toNumber
        })
        .then(message => console.log(message.status));

    return code;
}

module.exports = sendSMS;