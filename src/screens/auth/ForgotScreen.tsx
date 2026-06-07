import React, { useState } from 'react';
import { useRouter } from 'expo-router';

import { AuthScaffold } from '@/components/auth/AuthScaffold';
import { Field } from '@/components/ui/Field';
import { Button } from '@/components/ui/Button';

export function ForgotScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');

  return (
    <AuthScaffold
      title="Reset password"
      subtitle="Enter your email and we’ll send you a verification code."
    >
      <Field
        label="Email"
        placeholder="you@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <Button title="Send Code" onPress={() => router.push('/auth/otp')} />
    </AuthScaffold>
  );
}
