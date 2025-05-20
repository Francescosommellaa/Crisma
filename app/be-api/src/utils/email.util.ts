import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendVerificationCode = async (email: string, code: string) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Codice di Verifica',
    text: `Il tuo codice di verifica è: ${code}`,
  });
};

export const sendInviteEmail = async (email: string, link: string) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Invito al workspace',
    html: `<p>Sei stato invitato. Clicca qui per accedere: <a href="${link}">${link}</a></p>`
  });
};