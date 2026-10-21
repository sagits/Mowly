/** The signed-out welcome screen (P01): wordmark, a paging carousel and the log in / sign up buttons. */
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { Button, Wordmark, colors } from '@mowly/ui';

const SLIDES = [
  { icon: 'home', title: 'Your Next Client is a Tap Away', body: 'Get instant offers for jobs that match your expertise. Claim them immediately and start earning.' },
  { icon: 'calendar', title: 'Plan your day', body: 'See every job on your calendar and open the route to each stop.' },
  { icon: 'cash', title: 'Get paid weekly', body: 'Finish a job and your earnings land in your bank account every week.' },
] as const;

/** The signed-out welcome screen. */
export default function WelcomeScreen() {
  const { width } = useWindowDimensions();
  const [page, setPage] = useState(0);
  return (
    <View testID="screen-welcome" className="flex-1 bg-surface pb-8 pt-20">
      <Wordmark subtitle="for lawn care professionals" />
      <Text className="mt-4 text-center text-sm text-ink">Mowly for Providers - v1.0.0</Text>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        className="mt-6 flex-grow-0"
        onMomentumScrollEnd={(e) => setPage(Math.round(e.nativeEvent.contentOffset.x / width))}
      >
        {SLIDES.map((slide, i) => (
          <View key={slide.title} testID={`welcome-slide-${i}`} style={{ width }} className="items-center px-8">
            <Ionicons name={slide.icon} size={120} color={colors.primary} />
            <Text className="mt-6 text-center text-xl font-semibold text-ink">{slide.title}</Text>
            <Text className="mt-3 text-center text-body-lg text-ink">{slide.body}</Text>
          </View>
        ))}
      </ScrollView>
      <View className="mt-6 flex-row justify-center gap-3">
        {SLIDES.map((slide, i) => (
          <View key={slide.title} testID={`welcome-dot-${i}`} className={`h-3 w-3 rounded-full ${i === page ? 'bg-primary' : 'bg-surfaceMuted'}`} />
        ))}
      </View>
      <View className="flex-1" />
      <View className="gap-3 px-5">
        <Button testID="welcome-login" label="Log in" onPress={() => router.push('/sign-in')} />
        <Button testID="welcome-signup" label="Sign up" variant="outline" onPress={() => router.push('/sign-up')} />
      </View>
    </View>
  );
}
