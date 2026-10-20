// Tests Recommend a service (P12).
import { act, fireEvent, screen, waitFor } from '@testing-library/react-native';
import { getDb } from '@mowly/mocks';
import { renderApp } from './renderApp';

async function openRecommend() {
  await renderApp('/jobs/job-11');
  await fireEvent.press(await screen.findByTestId('job-recommend'));
  expect(await screen.findByTestId('screen-recommend')).toBeTruthy();
}

test('picking a service reveals the form; sending saves, toasts and goes back', async () => {
  await openRecommend();
  expect(screen.queryByTestId('recommend-send')).toBeNull();
  await fireEvent.press(screen.getByTestId('recommend-mulching'));
  await fireEvent.changeText(screen.getByTestId('recommend-price'), '45');
  await fireEvent.changeText(screen.getByTestId('recommend-note'), 'Beds need fresh mulch');
  await fireEvent.press(screen.getByTestId('recommend-send'));
  expect(await screen.findByTestId('toast')).toHaveTextContent('Recommendation sent');
  await waitFor(() => expect(screen).toHavePathname('/jobs/job-11'));
  expect(getDb().recommendations).toEqual([
    { id: 'rec-1', jobId: 'job-11', service: 'mulching', price: 45, note: 'Beds need fresh mulch' },
  ]);
});

test('an empty price shows the schema error and sends nothing', async () => {
  await openRecommend();
  await fireEvent.press(screen.getByTestId('recommend-cleanup'));
  await fireEvent.changeText(screen.getByTestId('recommend-note'), 'Leaves everywhere');
  await fireEvent.press(screen.getByTestId('recommend-send'));
  expect(await screen.findByText('Enter a price')).toBeTruthy();
  expect(getDb().recommendations).toHaveLength(0);
  expect(screen).toHavePathname('/jobs/job-11/recommend');
});

test('a double tap on send sends once', async () => {
  await openRecommend();
  await fireEvent.press(screen.getByTestId('recommend-other'));
  await fireEvent.changeText(screen.getByTestId('recommend-price'), '20');
  await fireEvent.changeText(screen.getByTestId('recommend-note'), 'Gutters');
  const send = screen.getByTestId('recommend-send');
  await act(async () => {
    send.props.onClick({});
    send.props.onClick({});
  });
  await waitFor(() => expect(screen).toHavePathname('/jobs/job-11'));
  expect(getDb().recommendations).toHaveLength(1);
});
