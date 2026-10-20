// Pro-side query hooks: one per resolver in @mowly/mocks.
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  claimJob, getAvailableJobs, getBilling, getClaimedJobs, getJob, getPro, getTodayRoute, sendRecommendation, updatePro,
} from '@mowly/mocks';
import type { IsoDate, Pro, Recommendation } from '@mowly/types';
import { queryKeys } from './customer';

/** The signed-in demo pro. */
export const usePro = () => useQuery({ queryKey: queryKeys.pro, queryFn: getPro });

/** Updates the pro's profile and refreshes it. */
export const useUpdatePro = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (patch: Partial<Pro>) => updatePro(patch),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.pro }),
  });
};

/** Jobs open to claim, optionally only those available on one day. */
export const useAvailableJobs = (day?: IsoDate) =>
  useQuery({ queryKey: queryKeys.availableJobs(day), queryFn: () => getAvailableJobs(day) });

/** Jobs the pro has claimed. */
export const useClaimedJobs = () => useQuery({ queryKey: queryKeys.claimedJobs, queryFn: getClaimedJobs });

/** One job by id. */
export const useJob = (id: string) => useQuery({ queryKey: queryKeys.job(id), queryFn: () => getJob(id) });

/** Today's route. */
export const useTodayRoute = () => useQuery({ queryKey: queryKeys.route, queryFn: getTodayRoute });

/** Earnings and payout summary. */
export const useBilling = () => useQuery({ queryKey: queryKeys.billing, queryFn: getBilling });

/** Claims a job for a date and refreshes every jobs list. */
export const useClaimJob = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, date }: { id: string; date: IsoDate }) => claimJob(id, date),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.jobs }),
  });
};

/** Sends a recommendation to a neighbor. */
export const useSendRecommendation = () =>
  useMutation({ mutationFn: (input: Omit<Recommendation, 'id'>) => sendRecommendation(input) });
