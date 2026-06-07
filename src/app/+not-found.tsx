import { View, StyleSheet } from 'react-native';
import { Link, Stack } from 'expo-router';
import { Text } from '@/components/ui/Text';

export default function NotFound() {
  return (
    <>
      <Stack.Screen options={{ title: 'Not Found' }} />
      <View style={styles.container}>
        <Text variant="h2">This screen doesn’t exist.</Text>
        <Link href="/" style={styles.link}>
          <Text variant="title" tone="primary">
            Go to home
          </Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 12,
  },
  link: { marginTop: 12 },
});
