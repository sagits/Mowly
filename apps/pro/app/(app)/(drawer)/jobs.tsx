/** Available Jobs (P10): day filter, city map with price pins, a pager and the selected job's card. */
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useAvailableJobs } from '@mowly/api';
import { formatMoney } from '@mowly/types';
import type { IsoDate, Job } from '@mowly/types';
import { colors, Skeleton } from '@mowly/ui';
import { CityMap } from '../../../src/components/CityMap';
import { ClaimSheet } from '../../../src/components/ClaimSheet';
import { DayStrip } from '../../../src/components/DayStrip';
import { JobCard } from '../../../src/components/JobCard';
import { MapPin } from '../../../src/components/MapPin';

export default function JobsScreen() {
  const [day, setDay] = useState<IsoDate | undefined>();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  // The job is kept in state, not looked up: the sheet must still show it after the claim removes it from the list.
  const [claim, setClaim] = useState<{ job: Job; date: IsoDate } | null>(null);
  const [claimOpen, setClaimOpen] = useState(false);
  const { data: jobs } = useAvailableJobs(day);
  // The selection falls back to the first job when it is unset (day changed) or gone (claimed).
  const index = Math.max(0, jobs?.findIndex((j) => j.id === selectedId) ?? 0);
  const job = jobs?.[index];
  const go = (i: number) => jobs?.[i] && setSelectedId(jobs[i].id);

  return (
    <View testID="screen-jobs" className="flex-1 bg-surface">
      <DayStrip value={day} onChange={(d) => { setDay(d); setSelectedId(null); }} />
      <ScrollView>
        <CityMap height={280}>
          {jobs?.map((j) => (
            <MapPin key={j.id} testID={`pin-${j.id}`} x={j.pin.x} y={j.pin.y} label={formatMoney(j.price)} selected={j.id === job?.id} onPress={() => setSelectedId(j.id)} />
          ))}
        </CityMap>
        {!jobs ? (
          <View testID="jobs-loading" className="gap-3 p-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-40 w-full" />
          </View>
        ) : !job ? (
          <Text testID="jobs-empty" className="p-8 text-center text-lg text-inkProBody">No jobs available for this day.</Text>
        ) : (
          <>
            <View className="flex-row items-center justify-between border-b border-border px-4 py-3">
              <Pressable testID="pager-prev" accessibilityRole="button" accessibilityLabel="Previous job" hitSlop={12} disabled={index === 0} onPress={() => go(index - 1)}>
                <Ionicons name="chevron-back" size={26} color={index === 0 ? colors.disabled : colors.primary} />
              </Pressable>
              <Text testID="pager-label" className="text-xl text-inkPro">{`${index + 1} of ${jobs.length} jobs`}</Text>
              <Pressable testID="pager-next" accessibilityRole="button" accessibilityLabel="Next job" hitSlop={12} disabled={index === jobs.length - 1} onPress={() => go(index + 1)}>
                <Ionicons name="chevron-forward" size={26} color={index === jobs.length - 1 ? colors.disabled : colors.primary} />
              </Pressable>
            </View>
            <JobCard job={job} onPickDate={(date) => { setClaim({ job, date }); setClaimOpen(true); }} />
          </>
        )}
      </ScrollView>
      <ClaimSheet job={claim?.job ?? null} date={claim?.date ?? null} visible={claimOpen} onClose={() => setClaimOpen(false)} />
    </View>
  );
}
