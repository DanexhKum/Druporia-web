import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Privacy Policy' }

export default function PrivacyPage() {
  return (
    <div className="container-page py-16 max-w-3xl prose prose-slate">
      <h1>Privacy Policy</h1>
      <p>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      <p>
        Druporia (&quot;we&quot;) respects your privacy. We collect account information via
        Clerk for authentication, order and download data for marketplace services, and
        contact form submissions when you reach out to us.
      </p>
      <h2>Data we collect</h2>
      <ul>
        <li>Name, email, and profile image from your auth provider</li>
        <li>Purchase and download history for digital products</li>
        <li>Technical logs for security and performance</li>
      </ul>
      <h2>Contact</h2>
      <p>Questions: dhanesh.kumar15@gmail.com</p>
    </div>
  )
}
