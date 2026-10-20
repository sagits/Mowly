// Every query key of the data layer in one file, so the customer and pro tracks never edit the same one.

/** Query keys for every hook, shared so screens and mutations invalidate the same entries. */
export const queryKeys = {
  services: ['services'] as const,
  service: (id: string) => ['services', id] as const,
  addresses: (query: string) => ['addresses', query] as const,
  quote: (serviceId: string | null, addressId: string | null) => ['quote', serviceId, addressId] as const,
  neighbors: (zip: string) => ['neighbors', zip] as const,
  customer: ['customer'] as const,
  bookings: ['bookings'] as const,
  booking: (id: string) => ['bookings', id] as const,
  threads: ['threads'] as const,
  thread: (id: string) => ['threads', id] as const,
  pro: ['pro'] as const,
  jobs: ['jobs'] as const,
  availableJobs: (day?: string) => ['jobs', 'available', day ?? null] as const,
  claimedJobs: ['jobs', 'claimed'] as const,
  job: (id: string) => ['jobs', id] as const,
  route: ['route'] as const,
  billing: ['billing'] as const,
};
