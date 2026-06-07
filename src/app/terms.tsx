import { LegalScreen } from '@/screens/LegalScreen';
import { DISCLAIMER } from '@/constants';

export default function Terms() {
  return (
    <LegalScreen
      title="Terms & Conditions"
      updated="June 7, 2026"
      footer={DISCLAIMER}
      sections={[
        {
          heading: 'Acceptance',
          body: 'By using FitBMI you agree to these terms. If you do not agree, please discontinue use of the app.',
        },
        {
          heading: 'Not Medical Advice',
          body: DISCLAIMER +
            ' BMI is a general screening metric and does not account for muscle mass, body composition, pregnancy, or other factors. Always consult a qualified healthcare professional for medical decisions.',
        },
        {
          heading: 'Your Responsibilities',
          body: 'You are responsible for the accuracy of the data you enter and for how you interpret and act on the information the app provides.',
        },
        {
          heading: 'Premium & Purchases',
          body: 'Optional premium features may be offered via in-app purchase. Purchases are handled by the platform app store and are subject to its refund policies.',
        },
        {
          heading: 'Limitation of Liability',
          body: 'FitBMI is provided “as is” without warranties of any kind. The developer is not liable for any health outcomes or losses arising from use of the app.',
        },
        {
          heading: 'Changes',
          body: 'We may update these terms. Continued use after changes constitutes acceptance of the revised terms.',
        },
      ]}
    />
  );
}
