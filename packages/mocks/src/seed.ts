// The seed data for both apps. Every date is built from today().
import { addDays, today } from '@mowly/types';
import type { Address, Frequency, Job, Pro, Service, ServiceId } from '@mowly/types';
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

const PRO: Pro = {
  firstName: 'Mike', lastName: 'Sullivan', businessName: 'Sullivan Lawn Care', yearFounded: '2018', crewSize: 2,
  city: 'Austin', customersServed: 1291, email: 'mike@sullivanlawncare.example', mobilePhone: '(512) 555-0188', officePhone: '',
  businessAddress: '', bio: '', avatar: null, truckPhoto: null, category: 'lawn', skills: ['Lawn Mowing', 'Leaf Removal', 'Cleanup'],
  equipment: { mower: false, trimmer: false, blower: false }, equipmentAnswered: false, startingPoint: ADDRESSES[0]!,
  workAreaMode: 'one', workAreaSaved: false, gpsEnabled: false, damageFeeAccepted: false, taxInfo: null, bankLinked: false,
  notifications: {
    jobs: { email: true, text: true, push: true },
    messages: { email: true, text: true, push: true },
  },
};

// [street, zip, yardSqft, service, frequency, price, miles from previous job, pin x, pin y]
type JobRow = [string, string, number, string, Frequency, number, number, number, number];

const ROWS: JobRow[] = [
  ['1402 Rutland Drive', '78758', 5200, 'Lawn mowing', 'weekly', 34.99, 1.2, 0.22, 0.31],
  ['908 Kenwood Avenue', '78704', 4100, 'Lawn mowing', 'every-2-weeks', 29.99, 0.8, 0.41, 0.58],
  ['2210 Stratford Lane', '78746', 7800, 'Lawn mowing', 'weekly', 40.99, 2.4, 0.68, 0.24],
  ['515 Chicon Street', '78702', 3600, 'Leaf Removal', 'one-time', 36.99, 1.9, 0.52, 0.44],
  ['3307 Duval Road', '78759', 6100, 'Bush Trimming', 'one-time', 38.99, 3.1, 0.15, 0.72],
  ['1189 Brodie Lane', '78748', 5600, 'Lawn mowing', 'every-2-weeks', 32.99, 2.7, 0.8, 0.66],
  ['724 Bluebonnet Trail', '78745', 4800, 'Leaf Removal', 'one-time', 35.99, 1.5, 0.35, 0.85],
  ['4620 Hyridge Drive', '78731', 8300, 'Bush Trimming', 'one-time', 39.99, 3.6, 0.88, 0.14],
  ['2905 Guadalupe Street', '78705', 3900, 'Lawn mowing', 'weekly', 30.99, 0.6, 0.58, 0.78],
  ['6011 Burnet Road', '78757', 5000, 'Lawn mowing', 'every-2-weeks', 33.99, 2.1, 0.12, 0.5],
  ['3815 Speedway', '78751', 4400, 'Lawn mowing', 'weekly', 31.99, 1.1, 0.3, 0.2],
  ['1620 Enfield Road', '78703', 6700, 'Lawn mowing', 'every-2-weeks', 37.99, 1.8, 0.46, 0.36],
  ['2501 Windsor Road', '78703', 5900, 'Bush Trimming', 'one-time', 36.99, 0.9, 0.62, 0.52],
  ['918 Bouldin Avenue', '78704', 3800, 'Leaf Removal', 'one-time', 34.99, 1.4, 0.74, 0.7],
  ['4402 Avenue F', '78751', 4700, 'Lawn mowing', 'weekly', 32.99, 1.0, 0.2, 0.62],
  ['7305 Shoal Creek Boulevard', '78757', 6400, 'Lawn mowing', 'every-2-weeks', 38.99, 2.2, 0.84, 0.4],
  ['1104 Westover Road', '78703', 5300, 'Bush Trimming', 'one-time', 35.99, 1.6, 0.28, 0.46],
  ['3003 Hancock Drive', '78731', 7100, 'Lawn mowing', 'weekly', 39.99, 2.0, 0.56, 0.18],
  ['2118 Cedar Avenue', '78704', 4200, 'Lawn mowing', 'every-2-weeks', 30.99, 0.7, 0.38, 0.8],
  ['5207 Teakwood Drive', '78745', 5800, 'Leaf Removal', 'one-time', 33.99, 2.5, 0.7, 0.86],
  ['1912 Ridgelea Drive', '78704', 4600, 'Lawn mowing', 'weekly', 31.99, 1.3, 0.5, 0.64],
  ['8110 Spicewood Springs Road', '78759', 7500, 'Lawn mowing', 'every-2-weeks', 40.99, 3.3, 0.9, 0.28],
];

// Day offsets from today. Available jobs offer these dates; claimed jobs sit on the single date at their index.
const AVAILABLE_DAYS = [[0, 1, 3], [0, 2], [1, 2, 4], [0, 1], [2, 3], [1, 3, 4], [0, 4], [3, 4], [0, 1, 2], [2, 3, 4]];
// Capped at 28: the calendar shows two months, and the next month ends at least 28 days out.
const CLAIMED_DAYS = [0, 0, 0, 1, 2, 4, 7, 12, 16, 20, 24, 28];

function buildJob(i: number): Job {
  const [street, zip, yardSqft, serviceName, frequency, price, distanceMiles, x, y] = ROWS[i]!;
  const claimed = i >= 10;
  const dates = claimed ? [addDays(today(), CLAIMED_DAYS[i - 10]!)] : AVAILABLE_DAYS[i]!.map((n) => addDays(today(), n));
  const todayCount = CLAIMED_DAYS.filter((n) => n === 0).length;
  return {
    id: `job-${String(i + 1).padStart(2, '0')}`, customerName: 'Austin homeowner', address: addr(`addr-job-${i + 1}`, street, zip),
    yardSqft, serviceName, frequency, price, availableDates: claimed ? [] : dates, claimedDate: claimed ? dates[0]! : null,
    distanceMiles, pin: { x, y }, routeOrder: claimed && i - 10 < todayCount ? i - 9 : null,
    notes: 'Gate code is on the side fence. Please close the latch.',
  };
}

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
    pro: structuredClone(PRO),
    jobs: ROWS.map((_, i) => buildJob(i)),
    recommendations: [],
    crew: [{ id: 'crew-mike', name: 'Mike Sullivan', role: 'Owner' }, { id: 'crew-dan', name: 'Dan Ortiz', role: 'Crew member' }],
    performance: [{ label: 'Rating', value: '4.9' }, { label: 'Jobs completed', value: '126' }, { label: 'On-time rate', value: '97%' }],
    // The customer-facing Thread type is reused: proName holds the customer's name.
    proThreads: [
      {
        id: 'pt-renato', proName: 'Renato Probst', initials: 'RP', serviceName: 'Lawn Mowing',
        messages: [{ id: 'pm-1', from: 'customer', text: 'Great, the gate code is 4417.', sentAt: now - 2 * hour }],
      },
      {
        id: 'pt-jane', proName: 'Jane Kim', initials: 'JK', serviceName: 'Leaf Removal',
        messages: [{ id: 'pm-2', from: 'customer', text: 'Can you come Friday instead?', sentAt: now - 5 * hour }],
      },
    ],
  };
}
