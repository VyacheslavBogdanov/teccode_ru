import nodemailer from 'nodemailer';

let transporter = null;

function getTransporter() {
	if (transporter) return transporter;

	const host = String(process.env.SMTP_HOST ?? '').trim();
	const port = Number(process.env.SMTP_PORT ?? 587);
	const user = String(process.env.SMTP_USER ?? '').trim();
	const pass = String(process.env.SMTP_PASS ?? '').trim();

	if (!host || !user || !pass) return null;

	transporter = nodemailer.createTransport({
		host,
		port,
		secure: port === 465,
		auth: { user, pass },
	});

	return transporter;
}

export function isMailConfigured() {
	return getTransporter() !== null;
}

function escapeHtml(str) {
	return String(str)
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
}

export async function sendContactEmail({ name, email, message }) {
	const t = getTransporter();
	if (!t) {
		console.warn('[mailer] SMTP не настроен — письмо не отправлено');
		return false;
	}

	const contactEmail = String(process.env.CONTACT_EMAIL ?? 'info@teccode.ru').trim();
	const from = String(process.env.SMTP_USER ?? '').trim();

	await t.sendMail({
		from,
		to: contactEmail,
		replyTo: email,
		subject: `Заявка с сайта от ${name}`,
		html: `
			<h2>Новая заявка с сайта</h2>
			<p><strong>Имя:</strong> ${escapeHtml(name)}</p>
			<p><strong>Email:</strong> ${escapeHtml(email)}</p>
			<p><strong>Сообщение:</strong></p>
			<p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>
		`,
	});

	return true;
}
