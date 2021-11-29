/* eslint-disable no-console */
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
  from: 'admin@narratives.imaginerio.org',
  subject: 'Verify your email for imagineRio Narratives',
};

const templates = (template, { host, key }) => {
  switch (template) {
    case 'reset-password':
      return `<p>Click <a href="${host}/user/reset/${key}">here</a> to reset your password.</p>`;
    default:
      return `<p>
        Thank you for registering an account on <a href="http://narratives.imaginerio.org">imagineRio Narratives</a>.
        Please click the link below to verify your account.
      </p>
      <p><a href="${host}/user/verify/${key}">Verify your email for imagineRio Narratives</a></p>`;
  }
};

module.exports.sendEmail = ({ to, key, host, template }) => {
  sgMail
    .send({
      ...msg,
      to,
      html: templates(template, { host, key }),
    })
    .then(response => {
      console.log(response[0].statusCode);
      console.log(response[0].headers);
    })
    .catch(error => {
      console.error(error);
    });
};
