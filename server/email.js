/* eslint-disable no-console */
const https = require('https');

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
  const body = JSON.stringify({
    from: 'no-reply@email.imaginerio.org',
    subject:
      lang === 'pt'
        ? 'Verifique seu e-mail para imagineRio Narratives'
        : 'Verify your email for imagineRio Narratives',
    to,
    html: templates(template, { host, key }, lang),
  });

  const options = {
    hostname: 'api.resend.com',
    path: '/emails',
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(body),
    },
  };

  const req = https.request(options, res => {
    console.log(res.statusCode);
    console.log(res.headers);
    res.on('data', () => {});
    res.on('end', () => {});
  });

  req.on('error', error => {
    console.error(error);
  });

  req.write(body);
  req.end();
};
