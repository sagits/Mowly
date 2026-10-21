// Tests the crew, performance and pro inbox resolvers.
import { configureMocks, getCrew, getPerformance, getProThreads, resetDb } from './index';

afterEach(() => {
  configureMocks({ seed: true });
  resetDb();
});

test('seeded counts', async () => {
  expect((await getCrew()).map((c) => c.name)).toEqual(['Mike Sullivan', 'Dan Ortiz']);
  expect(await getPerformance()).toHaveLength(3);
  expect(await getProThreads()).toHaveLength(2);
});
test('empty with seed off', async () => {
  configureMocks({ seed: false });
  resetDb();
  expect(await getCrew()).toEqual([]);
  expect(await getPerformance()).toEqual([]);
  expect(await getProThreads()).toEqual([]);
});
