// Tests the Create your account step and booking (C13-C15): validation gate, single booking, clean funnel.
import { act, fireEvent, screen, waitFor } from '@testing-library/react-native';
import { getDb, setMockDelay } from '@mowly/mocks';
import { useQuoteDraft } from '../src/stores/useQuoteDraft';
import { renderApp } from './renderApp';

beforeEach(() => {
  const d = useQuoteDraft.getState();
  d.reset();
  d.selectService('leaf-removal');
  d.setContact({ name: 'Renato Probst', addressId: 'addr-maple-ridge', addressText: '1820 Maple Ridge Drive, Austin, TX 78704', apt: '', phone: '5125550147' });
  d.choosePlan('one-time');
  d.setStartDate('2026-10-21');
});

const fill = async () => {
  await fireEvent.changeText(screen.getByTestId('account-first'), 'Renato');
  await fireEvent.changeText(screen.getByTestId('account-last'), 'Probst');
  await fireEvent.changeText(screen.getByTestId('account-email'), 'renato@example.com');
};

test('BOOK NOW unlocks only with a valid form and the terms box', async () => {
  await renderApp('/quote/account');
  await screen.findByTestId('book-now');
  expect(screen.getByTestId('book-now')).toBeDisabled();
  await fill();
  await waitFor(() => expect(screen.getByTestId('book-now')).toBeDisabled());
  await fireEvent.press(screen.getByTestId('account-terms'));
  await waitFor(() => expect(screen.getByTestId('book-now')).toBeEnabled());
});

test('booking lands on top of My Services, once, with a clean funnel after', async () => {
  await renderApp('/quote/account');
  await screen.findByTestId('book-now');
  await fill();
  await fireEvent.press(screen.getByTestId('account-terms'));
  await waitFor(() => expect(screen.getByTestId('book-now')).toBeEnabled());
  // a slow mock keeps the first booking pending while the second tap lands
  setMockDelay(300, 300);
  try {
    await fireEvent.press(screen.getByTestId('book-now'));
    await fireEvent.press(screen.getByTestId('book-now'));
    await act(async () => {
      await jest.advanceTimersByTimeAsync(400);
    });
    await screen.findByTestId('booked-go');
  } finally {
    setMockDelay(0, 0);
  }
  await fireEvent.press(await screen.findByTestId('booked-go'));
  await waitFor(() => expect(screen).toHavePathname('/services'));
  const cards = await screen.findAllByTestId(/^booking-card-/);
  expect(cards).toHaveLength(3);
  expect(cards[0]).toHaveTextContent(/Leaf Removal/);
  expect(useQuoteDraft.getState()).toMatchObject({ serviceId: null, frequency: null, promoApplied: false });
});

test('a failed booking shows an error and unlocks BOOK NOW again', async () => {
  await renderApp('/quote/account');
  await screen.findByTestId('book-now');
  await fill();
  await fireEvent.press(screen.getByTestId('account-terms'));
  await waitFor(() => expect(screen.getByTestId('book-now')).toBeEnabled());
  getDb().addresses.length = 0; // the booking now fails: its address is gone
  await fireEvent.press(screen.getByTestId('book-now'));
  expect(await screen.findByTestId('book-error')).toBeTruthy();
  await waitFor(() => expect(screen.getByTestId('book-now')).toBeEnabled());
  expect(screen).toHavePathname('/quote/account');
});
