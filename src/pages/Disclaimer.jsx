import LegalPage from './LegalPage'
import { siteConfig } from '../siteConfig'

export default function Disclaimer() {
  return (
    <LegalPage
      title="Legal Disclaimer"
      subtitle={`Please read this disclaimer before relying on any information on the ${siteConfig.firmName} website.`}
      lastUpdated="May 27, 2026"
      sections={[
        {
          title: 'General Information Only',
          content: (
            <>
              <p>
                This website is provided for general information and marketing purposes only. It does not constitute
                legal advice, and it may not reflect the most current legal developments.
              </p>
            </>
          ),
        },
        {
          title: 'No Guarantees',
          content: (
            <>
              <p>
                Any descriptions of past matters, outcomes, or results are not a guarantee or prediction of similar
                results in future matters. Each case depends on its facts and applicable law.
              </p>
            </>
          ),
        },
        {
          title: 'Confidentiality',
          content: (
            <>
              <p>
                Do not send confidential information through this website unless and until an attorney-client
                relationship has been formally established in writing.
              </p>
            </>
          ),
        },
        {
          title: 'Communication',
          content: (
            <>
              <p>
                Communications sent via forms or email may not be secure. If your matter is time-sensitive, please call
                our office directly using the phone number listed on this website.
              </p>
            </>
          ),
        },
      ]}
    />
  )
}

