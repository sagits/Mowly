/** The Browse tab: recommendations and every service to explore (C18). */
import { useRouter } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { useServices } from '@mowly/api';
import type { ServiceId } from '@mowly/types';
import { Screen, Skeleton } from '@mowly/ui';
import { CustomerHeader } from '../../src/components/CustomerHeader';
import { RecommendedCarousel } from '../../src/components/RecommendedCarousel';
import { ServiceExploreRow } from '../../src/components/ServiceExploreRow';
import { useQuoteDraft } from '../../src/stores/useQuoteDraft';

/** The Browse tab. */
export default function BrowseScreen() {
  const router = useRouter();
  const { data: services } = useServices();
  // Both shortcuts skip service select: fresh draft, service chosen, straight to the form.
  const quote = (id: ServiceId) => {
    const draft = useQuoteDraft.getState();
    draft.reset();
    draft.selectService(id);
    router.push('/quote/details');
  };
  return (
    <View testID="screen-browse" className="flex-1">
      <Screen>
        <CustomerHeader title="Browse" />
        <ScrollView className="flex-1" contentContainerClassName="px-4 pb-8 pt-6">
          <Text className="mb-4 text-title-sm text-ink">Recommended for you</Text>
          <RecommendedCarousel onQuote={quote} />
          <Text className="mb-4 mt-8 text-title-sm text-ink">Services to explore</Text>
          {services
            ? services.map((s) => <ServiceExploreRow key={s.id} service={s} onViewPrice={() => quote(s.id)} />)
            : [0, 1, 2].map((i) => <Skeleton key={i} testID={i === 0 ? 'browse-loading' : undefined} className="mb-4 h-36 w-full" />)}
        </ScrollView>
      </Screen>
    </View>
  );
}
