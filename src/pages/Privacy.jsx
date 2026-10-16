import LegalPage from './LegalPage'
import { siteConfig } from '../siteConfig'

export default function Privacy() {
  return (
    <LegalPage
      title="Privacy Policy"
      subtitle={`This Privacy Policy explains how ${siteConfig.firmName} collects, uses, and protects information provided through this website.`}
      lastUpdated="May 27, 2026"
      sections={[
        {
          title: 'Information We Collect',
          content: (
            <>
              <p>
                We may collect information you provide through forms on this site, such as your name, email address,
                phone number, and the details you include in your message.
              </p>
              <p>
                We may also collect basic technical data (for example, browser type, pages visited, and approximate
                location) through standard analytics and server logs.
              </p>
            </>
          ),
        },
        {
          title: 'How We Use Information',
          content: (
            <>
              <p>
                We use information to respond to enquiries, schedule consultations, improve our services, and maintain
                the security and performance of this website.
              </p>
              <p>
                We do not sell your personal information.
              </p>
            </>
          ),
        },
        {
          title: 'Sharing & Disclosure',
          content: (
            <>
              <p>
                We may share information with trusted service providers who help us operate the website (for example,
                email delivery or hosting) and only to the extent necessary.
              </p>
              <p>
                We may disclose information if required by law or to protect our rights, clients, or the integrity of
                our systems.
              </p>
            </>
          ),
        },
        {
          title: 'Data Security',
          content: (
            <>
              <p>
                We take reasonable measures to protect information against loss, misuse, and unauthorized access.
                However, no website or internet transmission is completely secure.
              </p>
            </>
          ),
        },
        {
          title: 'Your Choices',
          content: (
            <>
              <p>
                You may request access, correction, or deletion of your information by contacting us using the details
                on the Contact section of this site.
              </p>
            </>
          ),
        },
      ]}
    />
  )
}

