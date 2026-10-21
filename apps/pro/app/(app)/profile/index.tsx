/** Build a profile, intro (P08). */
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { Button, colors } from '@mowly/ui';

export default function ProfileIntro() {
  return (
    <View testID="screen-profile-intro" className="flex-1 bg-surface px-5 pb-8">
      <View className="flex-1 items-center justify-center gap-4">
        <Ionicons name="leaf" size={120} color={colors.primary} />
        <Text className="text-center text-xl font-bold text-inkPro">Build a winning profile</Text>
        <Text className="text-center text-base text-inkProBody">
          Your profile is free but it takes time to make it great. This is how you’ll get matched with customers.
        </Text>
      </View>
      <Button testID="profile-intro-continue" label="Continue" onPress={() => router.push('/profile/form' as never)} />
    </View>
  );
}
