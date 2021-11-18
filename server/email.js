/* eslint-disable no-console */
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
  from: 'admin@narratives.imaginerio.org',
  subject: 'Verify your email for imagineRio Narratives',
};

module.exports.sendEmail = ({ to, key, host }) => {
  sgMail
    .send({
      ...msg,
      to,
      html: `
        <p>
          Thank you for registering an account on <a href="http://narratives.imaginerio.org">imagineRio Narratives</a>.
          Please click the link below to verify your account.
        </p>
        <p><a href="${host}/user/verify/${key}">Verify your email for imagineRio Narratives</a></p>
      `,
    })
    .then(response => {
      console.log(response[0].statusCode);
      console.log(response[0].headers);
    })
    .catch(error => {
      console.error(error);
    });
};
