import { LegalScreen } from '@/screens/LegalScreen';
import { DISCLAIMER } from '@/constants';

export default function Privacy() {
  return (
    <LegalScreen
      title="Privacy Policy"
      updated="June 7, 2026"
      footer={DISCLAIMER}
      sections={[
        {
          heading: 'Overview',
          body: 'FitBMI respects your privacy. This policy explains what data the app handles and how it is stored.',
        },
        {
          heading: 'Data We Store',
          body: 'All your data — profile, BMI history, health metrics, goals and settings — is stored locally on your device using encrypted on-device storage (MMKV). We do not operate a backend server and we do not collect or transmit your personal health data.',
        },
        {
          heading: 'No Account Required',
          body: 'FitBMI works without an account. We do not ask for your email, phone number, or any personally identifying credentials.',
        },
        {
          heading: 'Notifications',
          body: 'Local reminders (water, weight, sleep, motivation) are scheduled on your device. They never leave your device.',
        },
        {
          heading: 'Advertising',
          body: 'Ads are disabled by default. If you opt in to ad-supported features in a future release, the ad provider (Google AdMob) may process limited device identifiers in accordance with its own policy. Premium users can disable ads entirely.',
        },
        {
          heading: 'Data Export & Deletion',
          body: 'You can export your data as CSV or a report at any time, and you can clear all stored data from within the app. Uninstalling the app permanently removes all local data.',
        },
        {
          heading: 'Children’s Privacy',
          body: 'FitBMI is not directed to children under 13. Please consult a guardian and a healthcare professional before tracking a minor’s health metrics.',
        },
        {
          heading: 'Contact',
          body: 'For privacy questions, contact the developer through the app store listing.',
        },
      ]}
    />
  );
}
