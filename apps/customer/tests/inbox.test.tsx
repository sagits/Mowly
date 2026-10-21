// Tests the Inbox tab (C21): thread row, empty state and opening a chat.
import { fireEvent, screen, waitFor } from '@testing-library/react-native';
import { configureMocks, resetDb } from '@mowly/mocks';
import { dateOf, formatShort } from '@mowly/types';
import { renderApp } from './renderApp';

test('one thread, last message from the pro, opens chat', async () => {
  await renderApp('/inbox');
  expect(screen.getByTestId('inbox-loading')).toBeTruthy();
  const row = await screen.findByTestId('thread-t-greenleaf');
  expect(row).toHaveTextContent(/GL/);
  expect(row).toHaveTextContent(/Greenleaf Lawn Co\./);
  expect(row).toHaveTextContent(/Lawn Mowing/);
  expect(row).toHaveTextContent(/Perfect, we will see you on the next service day\./);
  // The seed stamps messages relative to the real clock, so derive the label the same way.
  expect(row).toHaveTextContent(new RegExp(formatShort(dateOf(Date.now() - 24 * 3600 * 1000))));
  await fireEvent.press(row);
  await waitFor(() => expect(screen).toHavePathname('/chat/t-greenleaf'));
  expect(screen.getByTestId('chat-screen')).toBeTruthy();
});

test('empty inbox', async () => {
  configureMocks({ seed: false });
  resetDb();
  try {
    await renderApp('/inbox');
    expect(await screen.findByTestId('inbox-empty')).toBeTruthy();
  } finally {
    configureMocks({ seed: true });
  }
});
