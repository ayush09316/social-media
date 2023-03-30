import nodemailer from "nodemailer";

export const sendMail = async (str, data) => {
  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    var Osubject, Ohtml;

    if (str == "register") {
      Osubject = `Thank you for signin ${data.firstName}`;
      Ohtml = `
        Welcome to SocialPedia
        Hope you have a good time ! Here are your details-
        Name- ${data.firstName}
        Email-${data.email}`;
    } else if (str == "resetpassword") {
      Osubject = `Reset Password`;
      Ohtml = `Hello user,
      Somebody requested a new password for the socialpedia account associated with ${data.email}.No changes have been made to your account yet.You can reset your password by clicking the link below:
      ${data.resetPasswordLink}
      If you did not request a new password, please let us know immediately by replying to this email.
      
      Yours,
      The SocialPedia team`;
    }

    let info = await transporter.sendMail({
      from: process.env.EMAIL,
      to: data.email,
      subject: Osubject,
      text: Ohtml,
    });
  } catch (err) {
    console.log(err);
  }
};
