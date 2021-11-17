const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
  from: 'admin@narratives.imaginerio.org', // Change to your verified sender
  subject: 'Verify your email for imagineRio Narratives',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
};

module.exports.sendEmail = ({ to, key }) => {
  sgMail
    .send({
      ...msg,
      to,
      html: `<a href="${process.env.SERVER_URL}/verify/${key}">Verify your email for imagineRio Narratives</a>`,
    })
    .then(response => {
      console.log(response[0].statusCode);
      console.log(response[0].headers);
    })
    .catch(error => {
      console.error(error);
    });
};
