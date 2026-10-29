import { NextResponse } from 'next/server'

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xojypayy'

export async function POST(request: Request) {
  const formData = await request.formData()

  const name = String(formData.get('name') ?? '').trim()
  const email = String(formData.get('email') ?? '').trim()
  const subject = String(formData.get('subject') ?? '').trim()
  const message = String(formData.get('message') ?? '').trim()
  const services = formData
    .getAll('services')
    .map((value) => String(value).trim().slice(0, 60))
    .filter(Boolean)
    .slice(0, 10)

  if (!name || !email || !message) {
    return NextResponse.json(
      { ok: false, message: 'Please fill in all required fields.' },
      { status: 400 }
    )
  }

  const payload = new URLSearchParams({
    name,
    email,
    subject: subject || 'Website contact form',
    message: services.length
      ? `Services: ${services.join(', ')}

${message}`
      : message,
    _replyto: email,
  })

  const response = await fetch(FORMSPREE_ENDPOINT, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: payload,
  })

  if (!response.ok) {
    return NextResponse.json(
      { ok: false, message: 'Message could not be sent.' },
      { status: 502 }
    )
  }

  return NextResponse.json({ ok: true })
}
