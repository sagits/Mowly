/** Jest setup for this app's test project: instant mock delay, fixed date, fresh mock database per test. */
import { setMockDelay, resetDb } from '@mowly/mocks';
import { setToday } from '@mowly/types';

// Reanimated 4 in Jest: mock the native worklets module, then run animations on the fake timers.
jest.mock('react-native-worklets', () => require('react-native-worklets/src/mock'));
require('react-native-reanimated').setUpTests();

setMockDelay(0, 0);
setToday('2026-10-20');
beforeEach(() => resetDb());
