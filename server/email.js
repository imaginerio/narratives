/* eslint-disable no-console */
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const templates = (template, { host, key }, lang) => {
  switch (template) {
    case 'reset-password':
      return lang === 'pt'
        ? `<p>Clique <a href="${host}/user/reset/${key}">aqui</a> para redefinir sua senha.</p>`
        : `<p>Click <a href="${host}/user/reset/${key}">here</a> to reset your password.</p>`;
    default:
      return `<p>
        ${
          lang === 'pt'
            ? 'Obrigado por registrar uma conta no '
            : 'Thank you for registering an account on '
        }<a href="http://narratives.imaginerio.org">imagineRio Narratives</a>.
        ${
          lang === 'pt'
            ? 'Clique no link abaixo para verificar sua conta.'
            : 'Please click the link below to verify your account.'
        }
      </p>
      <p><a href="${host}/user/verify/${key}">${
        lang === 'pt'
          ? 'Verifique seu e-mail para imagineRio Narratives'
          : 'Verify your email for imagineRio Narratives'
      }</a></p>`;
  }
};

module.exports.sendEmail = ({ to, key, host, template, lang }) => {
  sgMail
    .send({
      from: 'admin@narratives.imaginerio.org',
      subject:
        lang === 'pt'
          ? 'Verifique seu e-mail para imagineRio Narratives'
          : 'Verify your email for imagineRio Narratives',
      to,
      html: templates(template, { host, key }, lang),
    })
    .then(response => {
      console.log(response[0].statusCode);
      console.log(response[0].headers);
    })
    .catch(error => {
      console.error(error);
    });
};
