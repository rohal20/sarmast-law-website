import nodemailer from 'nodemailer'

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000
const MAX_REQUESTS_PER_WINDOW = 8
const ipRequestLog = new Map()

function normalize(value) {
  return String(value || '').trim()
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function titleCaseName(value) {
  return normalize(value)
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function buildAutoReplyHtml({ firstName, area, message, phoneDisplay, replyEmail }) {
  const safeFirst = escapeHtml(firstName)
  const safeArea = escapeHtml(area)
  const safeMessage = escapeHtml(message)
  const safePhone = escapeHtml(phoneDisplay)
  const safeEmail = escapeHtml(replyEmail)
  const year = new Date().getFullYear()

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Inquiry Received</title>
</head>
<body style="margin:0;padding:0;background:#0A0A08;font-family:Georgia,'Times New Roman',serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0A0A08;padding:28px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;background:#111110;border:1px solid rgba(201,168,76,0.28);">
          <tr>
            <td style="height:3px;background:linear-gradient(90deg,#A07C30,#C9A84C,#E8C97A,#C9A84C,#A07C30);font-size:0;line-height:0;">&nbsp;</td>
          </tr>
          <tr>
            <td style="padding:28px 28px 8px 28px;">
              <p style="margin:0 0 6px 0;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:#C9A84C;">
                Sarmast Law Associates
              </p>
              <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:0.08em;color:#8A8270;">
                Karachi · Established 2005
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:18px 28px 8px 28px;">
              <h1 style="margin:0;font-weight:normal;font-size:28px;line-height:1.25;color:#F2EBDD;">
                We received your inquiry
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding:12px 28px 0 28px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.7;color:#C8C0B0;">
              <p style="margin:0 0 14px 0;">Dear ${safeFirst},</p>
              <p style="margin:0 0 14px 0;">
                Thank you for contacting <strong style="color:#F2EBDD;">Sarmast Law Associates</strong>.
                Your enquiry has been received and will be reviewed by a member of our legal team.
              </p>
              <p style="margin:0 0 18px 0;">
                We aim to respond within <strong style="color:#E8C97A;">24 hours</strong> on business days.
                If your matter is urgent, please call us directly.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 28px 8px 28px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0A0A08;border:1px solid rgba(201,168,76,0.22);">
                <tr>
                  <td style="padding:16px 18px 6px 18px;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#C9A84C;">
                    Submission summary
                  </td>
                </tr>
                <tr>
                  <td style="padding:4px 18px 14px 18px;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.65;color:#C8C0B0;">
                    <p style="margin:0 0 8px 0;"><span style="color:#8A8270;">Practice area</span><br /><strong style="color:#F2EBDD;">${safeArea}</strong></p>
                    <p style="margin:0;"><span style="color:#8A8270;">Your message</span><br /><span style="color:#D8D0C0;white-space:pre-wrap;">${safeMessage}</span></p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:22px 28px 8px 28px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding-right:10px;">
                    <a href="tel:${safePhone}" style="display:inline-block;padding:11px 18px;background:#C9A84C;color:#0A0A08;text-decoration:none;font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;font-weight:bold;">
                      Call ${safePhone}
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:18px 28px 28px 28px;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.7;color:#8A8270;">
              <p style="margin:0 0 4px 0;color:#C8C0B0;">With regards,</p>
              <p style="margin:0 0 16px 0;color:#F2EBDD;font-family:Georgia,'Times New Roman',serif;font-size:16px;">
                Sarmast Law Associates
              </p>
              <p style="margin:0;font-size:12px;line-height:1.7;color:#8A8270;">
                Suit No. 703, 7th Floor, Land Mark Plaza<br />
                Opposite Jang Press, I.I Chundrigar Road<br />
                Karachi, Sindh, Pakistan<br />
                <a href="mailto:${safeEmail}" style="color:#C9A84C;text-decoration:none;">${safeEmail}</a>
                &nbsp;·&nbsp;
                <a href="tel:${safePhone}" style="color:#C9A84C;text-decoration:none;">${safePhone}</a>
              </p>
              <p style="margin:18px 0 0 0;font-size:11px;color:#5A5448;line-height:1.6;">
                This message is for general acknowledgement only and does not create an attorney-client relationship.
                © ${year} Sarmast Law Associates.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`
}

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for']
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim()
  }
  return req.socket?.remoteAddress || 'unknown'
}

function isRateLimited(ip) {
  const now = Date.now()
  const entries = (ipRequestLog.get(ip) || []).filter((ts) => now - ts < RATE_LIMIT_WINDOW_MS)
  entries.push(now)
  ipRequestLog.set(ip, entries)
  return entries.length > MAX_REQUESTS_PER_WINDOW
}

function parseBody(req) {
  if (!req.body) return {}
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body)
    } catch {
      return {}
    }
  }
  return req.body
}

function friendlyMailError(error) {
  const code = String(error?.code || '')
  const responseCode = Number(error?.responseCode || 0)
  const msg = String(error?.message || '').toLowerCase()

  if (code === 'EAUTH' || responseCode === 535 || msg.includes('invalid login') || msg.includes('username and password')) {
    return 'Email login failed. Please verify the Gmail App Password in Vercel (SMTP_PASS).'
  }
  if (code === 'ESOCKET' || code === 'ECONNECTION' || code === 'ETIMEDOUT' || msg.includes('timeout')) {
    return 'Could not connect to the mail server. Check SMTP_HOST and SMTP_PORT.'
  }
  if (responseCode === 550 || msg.includes('daily sending quota')) {
    return 'Mailbox sending limit reached. Please try again later or call the firm directly.'
  }
  return 'Could not send inquiry. Please try again or call us directly.'
}

function createTransporter() {
  const smtpHost = normalize(process.env.SMTP_HOST)
  const smtpPort = Number(process.env.SMTP_PORT || 587)
  // App passwords are often copied with spaces — strip them.
  const smtpUser = normalize(process.env.SMTP_USER)
  const smtpPass = String(process.env.SMTP_PASS || '').replace(/\s+/g, '')

  if (!smtpHost || !smtpUser || !smtpPass) {
    return { transporter: null, smtpUser, smtpHost, smtpPort }
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    requireTLS: smtpPort === 587,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 20000,
    tls: {
      // Gmail / some hosts are picky on serverless TLS fingerprints.
      minVersion: 'TLSv1.2',
    },
  })

  return { transporter, smtpUser, smtpHost, smtpPort }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ ok: false, error: 'Method not allowed' })
  }

  try {
    const ip = getClientIp(req)
    if (isRateLimited(ip)) {
      return res.status(429).json({ ok: false, error: 'Too many submissions. Please try again shortly.' })
    }

    const body = parseBody(req)
    const fname = normalize(body.fname)
    const lname = normalize(body.lname)
    const email = normalize(body.email)
    const phone = normalize(body.phone)
    const area = normalize(body.area)
    const message = normalize(body.message)
    const website = normalize(body.website)
    const startedAt = Number(body.startedAt || 0)

    // Honeypot: bots fill hidden "website" field.
    if (website) {
      return res.status(200).json({ ok: true })
    }
    // Instant submissions are almost always bots.
    if (startedAt && Date.now() - startedAt < 2500) {
      return res.status(400).json({ ok: false, error: 'Submission blocked. Please try again.' })
    }

    if (!fname || !lname || !email || !area || !message) {
      return res.status(400).json({ ok: false, error: 'Missing required fields' })
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ ok: false, error: 'Invalid email address' })
    }

    const toEmail = normalize(process.env.INQUIRY_TO_EMAIL || process.env.SMTP_USER)
    const ccEmail = normalize(process.env.INQUIRY_CC_EMAIL)
    const bccEmail = normalize(process.env.INQUIRY_BCC_EMAIL)

    const { transporter, smtpUser } = createTransporter()
    // Gmail rejects "from" addresses that don't match the authenticated account.
    const fromEmail = smtpUser || normalize(process.env.INQUIRY_FROM_EMAIL)

    if (!transporter || !toEmail || !fromEmail) {
      console.error('Inquiry config missing', {
        hasTransporter: Boolean(transporter),
        hasTo: Boolean(toEmail),
        hasFrom: Boolean(fromEmail),
        hasUser: Boolean(smtpUser),
      })
      return res.status(500).json({ ok: false, error: 'Email service is not configured' })
    }

    const receivedAt = new Date().toLocaleString('en-US', { timeZone: 'Asia/Karachi' })
    const subject = `New Website Inquiry - ${fname} ${lname} (${area})`

    const textBody = [
      'New inquiry received from the website contact form.',
      '',
      `Name: ${fname} ${lname}`,
      `Email: ${email}`,
      `Phone: ${phone || 'Not provided'}`,
      `Practice area: ${area}`,
      `Received: ${receivedAt} (Pakistan time)`,
      '',
      'Message:',
      message,
    ].join('\n')

    const safeMessage = escapeHtml(message)
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
        <h2 style="margin: 0 0 12px;">New Website Inquiry</h2>
        <table cellpadding="6" cellspacing="0" border="0" style="border-collapse: collapse;">
          <tr><td><strong>Name</strong></td><td>${escapeHtml(fname)} ${escapeHtml(lname)}</td></tr>
          <tr><td><strong>Email</strong></td><td>${escapeHtml(email)}</td></tr>
          <tr><td><strong>Phone</strong></td><td>${escapeHtml(phone || 'Not provided')}</td></tr>
          <tr><td><strong>Practice area</strong></td><td>${escapeHtml(area)}</td></tr>
          <tr><td><strong>Received</strong></td><td>${escapeHtml(receivedAt)} (Pakistan time)</td></tr>
        </table>
        <p style="margin: 16px 0 6px;"><strong>Message</strong></p>
        <div style="white-space: pre-wrap; border: 1px solid #ddd; padding: 10px; border-radius: 6px;">${safeMessage}</div>
      </div>
    `

    // Primary delivery — must succeed.
    await transporter.sendMail({
      from: `"Sarmast Website" <${fromEmail}>`,
      to: toEmail,
      cc: ccEmail || undefined,
      bcc: bccEmail || undefined,
      replyTo: email,
      subject,
      text: textBody,
      html: htmlBody,
    })

    // Auto-reply is optional — never fail the inquiry if this bounces.
    try {
      const displayFirst = titleCaseName(fname) || 'Client'
      const phoneDisplay = process.env.INQUIRY_PHONE_DISPLAY || '021-37121333'

      const autoReplyText = [
        `Dear ${displayFirst},`,
        '',
        'Thank you for contacting Sarmast Law Associates.',
        'Your enquiry has been received and will be reviewed by a member of our legal team.',
        'We aim to respond within 24 hours on business days.',
        '',
        'Submission summary',
        `Practice area: ${area}`,
        `Your message: ${message}`,
        '',
        'If your matter is urgent, please call us directly.',
        `Phone: ${phoneDisplay}`,
        `Email: ${toEmail}`,
        '',
        'With regards,',
        'Sarmast Law Associates',
        'Suit No. 703, 7th Floor, Land Mark Plaza, Karachi',
      ].join('\n')

      await transporter.sendMail({
        from: `"Sarmast Law Associates" <${fromEmail}>`,
        to: email,
        replyTo: toEmail,
        subject: 'We received your inquiry | Sarmast Law Associates',
        text: autoReplyText,
        html: buildAutoReplyHtml({
          firstName: displayFirst,
          area,
          message,
          phoneDisplay,
          replyEmail: toEmail,
        }),
      })
    } catch (autoReplyError) {
      console.error('Inquiry auto-reply failed (inquiry still delivered):', autoReplyError)
    }

    return res.status(200).json({ ok: true })
  } catch (error) {
    console.error('Inquiry send error:', {
      code: error?.code,
      responseCode: error?.responseCode,
      command: error?.command,
      message: error?.message,
    })
    return res.status(500).json({ ok: false, error: friendlyMailError(error) })
  }
}
