// The customer-side seed data. Every date is built from today().
import { addDays, today } from '@mowly/types';
import type { Address, Frequency, Pro, Service, ServiceId } from '@mowly/types';
import type { MockDb } from './db';

const addr = (id: string, line1: string, zip = '78704'): Address => ({ id, line1, city: 'Austin', state: 'TX', zip });

const ADDRESSES: Address[] = [
  addr('addr-maple-ridge', '1820 Maple Ridge Drive'),
  addr('addr-barton-hills', '2406 Barton Hills Drive'),
  addr('addr-oak-hollow', '715 Oak Hollow Lane', '78745'),
  addr('addr-live-oak', '3310 Live Oak Street', '78722'),
  addr('addr-cedar-crest', '9102 Cedar Crest Road', '78748'),
  addr('addr-pecan-grove', '1204 Pecan Grove Court', '78704'),
];


const service = (id: ServiceId, name: string, included: string, prices: [Frequency, number][]): Service => ({
  id,
  name,
  included,
  plans: prices.map(([frequency, price], i) => ({ frequency, price, recommended: i === 0 })),
});

const SERVICES: Service[] = [
  service('mowing', 'Mowing', 'Mowing, edging, trimming and blowing off walkways.', [['weekly', 57], ['every-2-weeks', 60], ['monthly', 60]]),
  service('leaf-removal', 'Leaf Removal', 'Leaves raked or blown from the lawn and beds, then bagged and hauled away.', [['one-time', 129], ['monthly', 99]]),
  service('flower-bed-weeding', 'Flower Bed Weeding', 'Weeds pulled by hand from flower beds and borders, and debris removed.', [['one-time', 79], ['monthly', 69]]),
  service('bush-trimming', 'Bush Trimming', 'Shrubs and hedges trimmed and shaped, with clippings cleaned up.', [['one-time', 89], ['monthly', 79]]),
  service('pool-cleaning', 'Pool Cleaning', 'Skimming, brushing, vacuuming and a check of the chemical balance.', [['monthly', 119], ['every-2-weeks', 129]]),
  service('lawn-treatment', 'Lawn Treatment', 'Fertilizer and weed control applied for a thicker, greener lawn.', [['monthly', 69], ['every-2-weeks', 79]]),
  service('mosquito-prevention', 'Mosquito Prevention', 'Barrier spray on foliage and shaded areas where mosquitoes rest.', [['monthly', 74], ['every-2-weeks', 84]]),
  service('aeration', 'Aeration', 'Core aeration to loosen compacted soil so water and nutrients reach the roots.', [['one-time', 119], ['monthly', 109]]),
  service('aeration-overseeding', 'Aeration & Overseeding', 'Core aeration followed by overseeding to fill in thin and bare spots.', [['one-time', 189], ['monthly', 169]]),
  service('cleanup', 'Cleanup', 'Yard debris, sticks and clutter cleared and hauled away.', [['one-time', 149], ['monthly', 129]]),
  service('weeding', 'Weeding', 'Weeds removed from lawn edges, walkways and driveway cracks.', [['one-time', 69], ['monthly', 59]]),
];

// Task 4 replaces this with the real Mike Sullivan seed.
const PLACEHOLDER_PRO: Pro = {
  firstName: 'Placeholder', lastName: 'Pro', businessName: 'Placeholder Lawn Care', yearFounded: '2020', crewSize: 1,
  city: 'Austin', customersServed: 0, email: 'pro@example.com', mobilePhone: '', officePhone: '', businessAddress: '', bio: '',
  avatar: null, truckPhoto: null, category: 'lawn', skills: [], equipment: { mower: false, trimmer: false, blower: false },
  equipmentAnswered: false, startingPoint: ADDRESSES[0]!, workAreaMode: 'one', workAreaSaved: false, gpsEnabled: false,
  damageFeeAccepted: false, taxInfo: null, bankLinked: false,
  notifications: {
    jobs: { email: true, text: true, push: true },
    messages: { email: true, text: true, push: true },
  },
};

/** Builds a fresh database with the full seed. Dates are relative to `today()`. */
export function createSeed(): MockDb {
  const home = ADDRESSES[0]!;
  const now = Date.now();
  const hour = 3_600_000;
  return {
    services: structuredClone(SERVICES),
    addresses: structuredClone(ADDRESSES),
    customer: { name: 'Renato Probst', email: 'renato.probst@example.com', phone: '(512) 555-0147', address: structuredClone(home), card: '4242' },
    bookings: [
      {
        id: 'b-mowing', serviceId: 'mowing', serviceName: 'Lawn Mowing', frequency: 'monthly', price: 53,
        nextDate: addDays(today(), 5), status: 'scheduled', pausedUntil: null, proName: 'Greenleaf Lawn Co.',
        address: structuredClone(home), createdAt: now - 1000,
      },
      {
        id: 'b-treatment', serviceId: 'lawn-treatment', serviceName: 'Lawn Treatment', frequency: 'recurring', price: 69,
        nextDate: addDays(today(), 10), status: 'scheduled', pausedUntil: null, proName: 'Greenleaf Lawn Co.',
        address: structuredClone(home), createdAt: now - 2000,
      },
    ],
    threads: [
      {
        id: 't-greenleaf', proName: 'Greenleaf Lawn Co.', initials: 'GL', serviceName: 'Lawn Mowing',
        messages: [
          { id: 'm-1', from: 'pro', text: 'Hi Renato, this is Greenleaf Lawn Co. We are all set for your first mow.', sentAt: now - 26 * hour },
          { id: 'm-2', from: 'customer', text: 'Great, thanks! The side gate is unlocked.', sentAt: now - 25 * hour },
          { id: 'm-3', from: 'pro', text: 'Perfect, we will see you on the next service day.', sentAt: now - 24 * hour },
        ],
      },
    ],
    pro: PLACEHOLDER_PRO,
    jobs: [],
    recommendations: [],
  };
}
