/** Jest setup for this app's test project: instant mock delay, fixed date, fresh mock database per test. */
import { setMockDelay, resetDb } from '@mowly/mocks';
import { setToday } from '@mowly/types';

setMockDelay(0, 0);
setToday('2026-10-20');
beforeEach(() => resetDb());
