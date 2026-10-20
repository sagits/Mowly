// Domain types shared by the mocks, the API layer and both apps.

/** A calendar day as 'YYYY-MM-DD' in local time. */
export type IsoDate = string;

/** Every service a customer can book. */
export type ServiceId =
  | 'mowing' | 'leaf-removal' | 'flower-bed-weeding' | 'bush-trimming' | 'pool-cleaning'
  | 'lawn-treatment' | 'mosquito-prevention' | 'aeration' | 'aeration-overseeding' | 'cleanup' | 'weeding';

/** How often a service repeats. */
export type Frequency = 'weekly' | 'every-2-weeks' | 'monthly' | 'one-time' | 'recurring';

/** Display label for each frequency. */
export const FREQUENCY_LABELS: Record<Frequency, string> = {
  weekly: 'Weekly',
  'every-2-weeks': 'Every 2 Weeks',
  monthly: 'Monthly',
  'one-time': 'One-time',
  recurring: 'Recurring',
};

/** Days that Skip pushes the next visit by, per frequency. */
export const FREQUENCY_DAYS: Record<Frequency, number> = {
  weekly: 7,
  'every-2-weeks': 14,
  monthly: 30,
  'one-time': 7,
  recurring: 30,
};

/** One priced way to book a service. */
export type PlanOption = { frequency: Frequency; price: number; recommended: boolean };

/** A bookable service and its plans. */
export type Service = { id: ServiceId; name: string; included: string; plans: PlanOption[] };

/** A street address. */
export type Address = { id: string; line1: string; city: string; state: string; zip: string };

/** The signed-in customer. */
export type Customer = { name: string; email: string; phone: string; address: Address; card: string };

/** Lifecycle state of a booking. */
export type BookingStatus = 'scheduled' | 'paused' | 'cancelled';

/** A service a customer has booked. */
export type Booking = {
  id: string; serviceId: ServiceId; serviceName: string; frequency: Frequency; price: number;
  nextDate: IsoDate; status: BookingStatus; pausedUntil: IsoDate | null; proName: string;
  address: Address; createdAt: number;
};

/** What the customer submits to create a booking. */
export type NewBooking = { serviceId: ServiceId; frequency: Frequency; price: number; startDate: IsoDate; addressId: string };

/** A change the customer can make to an existing booking. */
export type BookingChange =
  | { type: 'skip' }
  | { type: 'reschedule'; date: IsoDate }
  | { type: 'frequency'; frequency: Frequency; price: number }
  | { type: 'pause'; until: IsoDate }
  | { type: 'cancel' };

/** One chat message. `sentAt` is epoch milliseconds. */
export type Message = { id: string; from: 'customer' | 'pro'; text: string; sentAt: number };

/** A conversation between a customer and a pro. */
export type Thread = { id: string; proName: string; initials: string; serviceName: string; messages: Message[] };

/** A job a pro can claim or has claimed. */
export type Job = {
  id: string; customerName: string; address: Address; yardSqft: number; serviceName: string; frequency: Frequency;
  price: number; availableDates: IsoDate[]; claimedDate: IsoDate | null; distanceMiles: number;
  pin: { x: number; y: number }; routeOrder: number | null; notes: string;
};

/** One line of the pro's billing history. */
export type BillingEntry = { jobId: string; date: IsoDate; description: string; amount: number };

/** The pro's balance and its entries. */
export type Billing = { balance: number; entries: BillingEntry[] };

/** The steps of the pro's setup checklist. */
export type ChecklistItemId = 'profile' | 'skills' | 'evaluate' | 'work-area' | 'gps' | 'damage-fee' | 'tax' | 'bank';

/** A way to notify the pro. */
export type NotificationChannel = 'email' | 'text' | 'push';

/** Which channels the pro wants for each kind of notification. */
export type NotificationPrefs = Record<'jobs' | 'messages', Record<NotificationChannel, boolean>>;

/** Tax details the pro enters during setup. */
export type TaxInfo = {
  entityType: 'individual' | 'llc' | 'corporation'; legalName: string; dateOfBirth: string; legalAddress: string;
};

/** The pro's profile and setup progress. */
export type Pro = {
  firstName: string; lastName: string; businessName: string; yearFounded: string; crewSize: number; city: string;
  customersServed: number; email: string; mobilePhone: string; officePhone: string; businessAddress: string; bio: string;
  avatar: number | null; truckPhoto: number | null; category: 'lawn' | 'pool'; skills: string[];
  equipment: { mower: boolean; trimmer: boolean; blower: boolean }; equipmentAnswered: boolean;
  startingPoint: Address; workAreaMode: 'one' | 'by-day'; workAreaSaved: boolean; gpsEnabled: boolean;
  damageFeeAccepted: boolean; taxInfo: TaxInfo | null; bankLinked: boolean; notifications: NotificationPrefs;
};

/** A suggested extra service a pro can recommend to a customer. */
export type Recommendation = { id: string; jobId: string; service: string; price: number; note: string };
