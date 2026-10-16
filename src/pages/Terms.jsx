import LegalPage from './LegalPage'
import { siteConfig } from '../siteConfig'

export default function Terms() {
  return (
    <LegalPage
      title="Terms of Use"
      subtitle={`These Terms of Use govern your access to and use of the ${siteConfig.firmName} website.`}
      lastUpdated="May 27, 2026"
      sections={[
        {
          title: 'No Legal Advice',
          content: (
            <>
              <p>
                Content on this site is provided for general informational purposes only and should not be considered
                legal advice. You should obtain professional advice tailored to your situation before acting.
              </p>
            </>
          ),
        },
        {
          title: 'No Attorney-Client Relationship',
          content: (
            <>
              <p>
                Accessing this website or contacting us through it does not create an attorney-client relationship.
                Such a relationship is only formed through a formal engagement confirmed in writing.
              </p>
            </>
          ),
        },
        {
          title: 'Accuracy & Availability',
          content: (
            <>
              <p>
                We aim to keep information current, but we make no warranties regarding completeness, accuracy, or
                uninterrupted availability. We may update or remove content at any time.
              </p>
            </>
          ),
        },
        {
          title: 'Intellectual Property',
          content: (
            <>
              <p>
                Unless otherwise stated, all content on this website is owned by {siteConfig.firmName} and may not be
                reproduced, distributed, or used without permission, except as allowed by applicable law.
              </p>
            </>
          ),
        },
        {
          title: 'Third-Party Links',
          content: (
            <>
              <p>
                This website may include links to third-party websites. We do not control and are not responsible for
                their content, policies, or practices.
              </p>
            </>
          ),
        },
        {
          title: 'Governing Law',
          content: (
            <>
              <p>
                These Terms are governed by the laws applicable in Pakistan, without regard to conflict-of-law rules.
              </p>
            </>
          ),
        },
      ]}
    />
  )
}

