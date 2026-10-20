// Tests the lawn sizing step (C07): neighbor count from the draft ZIP, then auto-advance to the plan.
import { act, screen, waitFor } from '@testing-library/react-native';
import { useQuoteDraft } from '../src/stores/useQuoteDraft';
import { renderApp } from './renderApp';

beforeEach(() => useQuoteDraft.getState().reset());

test('shows the neighbor count and moves on after three seconds', async () => {
  jest.useFakeTimers();
  useQuoteDraft.getState().selectService('mowing');
  useQuoteDraft.getState().setContact({ name: 'Renato Probst', addressId: 'addr-maple-ridge', addressText: '1820 Maple Ridge Drive, Austin, TX 78704', apt: '', phone: '5125550147' });
  await renderApp('/quote/sizing');
  expect(await screen.findByTestId('sizing-neighbors')).toHaveTextContent('Join 49 neighbors in 78704');
  act(() => jest.advanceTimersByTime(3000));
  await waitFor(() => expect(screen).toHavePathname('/quote/plan'));
  jest.useRealTimers();
});
