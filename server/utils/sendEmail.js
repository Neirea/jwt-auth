const sgMail = require("@sendgrid/mail");

const sendEmail = async ({ to, subject, html }) => {
	sgMail.setApiKey(process.env.SENDGRID_API_KEY);

	const info = await sgMail.send({
		to,
		from: process.env.SENDGRID_EMAIL, //change to your verified sender
		subject,
		html,
	});
	return info;
};

module.exports = sendEmail;
