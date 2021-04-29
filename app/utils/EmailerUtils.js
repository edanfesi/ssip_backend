const EmailerUtils = module.exports;

const nodemailer = require('nodemailer');

EmailerUtils.sendEmail = async (email, message) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: 'ssip.team.proj01@gmail.com',
        pass: 'npexpxbosxflmzuh',
      },
    });

    await transporter.sendMail({
      from: '"SSIP Team" <ssip.team.proj01@gmail.com>',
      to: `${email}`,
      subject: 'Auth token',
      text: `${message}`,
      html: `<b>${message}</b>`,
    });
  } catch (error) { console.log(error); }
};
