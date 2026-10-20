/** Jest setup for this app's test project: instant mock delay, fixed date, fresh mock database per test. */
import 'react-native-gesture-handler/jestSetup';
import { setMockDelay, resetDb } from '@mowly/mocks';
import { useSession } from '@mowly/stores';
import { setToday } from '@mowly/types';

setMockDelay(0, 0);
setToday('2026-10-20');
beforeEach(() => {
  resetDb();
  useSession.getState().signIn();
});

// The drawer needs gesture-handler and reanimated, which have no native side under Jest.
jest.mock('react-native-reanimated', () => jest.requireActual('react-native-reanimated/mock'));
jest.mock('react-native-worklets', () => jest.requireActual('react-native-worklets/src/mock'));
// react-native-drawer-layout reads RN's deprecated InteractionManager and warns; real RN 0.86 yields undefined, which the drawer handles.
// The package's `exports` hides this file from a bare specifier, so mock it by path.
jest.mock('../../node_modules/react-native-drawer-layout/lib/module/views/InteractionManager.native', () => ({ InteractionManager: undefined }));
