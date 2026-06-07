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
          body: 'FitBMI ("the app", "we") respects your privacy. This policy explains what data the app handles, where it is stored, and the limited cases where data leaves your device. By using FitBMI you agree to this policy.',
        },
        {
          heading: 'Data We Store (On Your Device)',
          body: 'All of your data — profile (name, gender, age, height, weight, target), BMI history, daily health metrics (water, sleep, calories, steps, body fat), goals, achievements, gamification progress, chat history, and settings — is stored locally on your device using on-device storage. We do not run a backend server and we do not collect, sell, or transmit this data to us.',
        },
        {
          heading: 'AI Features & Third-Party Processing',
          body: 'When you use an AI feature (AI Health Coach, insights, meal/workout/recipe/goal/report generators), the text of your request together with relevant profile context (e.g. age, gender, height, weight, BMI) is sent to OpenRouter (openrouter.ai) and the AI model you are routed to, solely to generate a response. This happens only when you actively use an AI feature. Do not enter information you do not want processed by a third party. AI processing is governed by OpenRouter’s and the model provider’s own privacy policies. If no API key is configured, no AI requests are made.',
        },
        {
          heading: 'Motion & Activity Data',
          body: 'If you enable step tracking, the app reads your device’s pedometer / step-counter (and on Android requests the Physical Activity permission) to display your daily steps. This motion data is processed on your device and stored locally; it is never sent to us. You can decline the permission and enter steps manually instead.',
        },
        {
          heading: 'Notifications',
          body: 'Optional local reminders (water, weight, sleep, morning motivation) are scheduled on your device and never leave it. You can disable them in Settings.',
        },
        {
          heading: 'No Account Required',
          body: 'FitBMI works without an account. We do not require your email, phone number, or any login credentials. (Any sign-in screens present in the app are non-functional UI placeholders for a future release.)',
        },
        {
          heading: 'Advertising',
          body: 'Ads are disabled by default. If a future version enables ad-supported features, the ad provider (e.g. Google AdMob) may process limited device identifiers under its own policy; premium users can disable ads entirely. We will update this policy before enabling ads.',
        },
        {
          heading: 'Data Export & Deletion',
          body: 'You can export your data (CSV / report) at any time and clear all stored data from within the app. Uninstalling the app permanently removes all local data from your device.',
        },
        {
          heading: 'Children’s Privacy',
          body: 'FitBMI is not directed to children under 13. A guardian and a qualified healthcare professional should be consulted before tracking a minor’s health metrics.',
        },
        {
          heading: 'Changes to This Policy',
          body: 'We may update this policy as the app evolves. Material changes will be reflected here with a new "Last updated" date.',
        },
        {
          heading: 'Contact',
          body: 'For privacy questions, contact the developer via the support email on the app’s store listing.',
        },
      ]}
    />
  );
}
