// Tests the chat screen: sending a message and the canned pro reply.
import { fireEvent, screen } from '@testing-library/react-native';
import { renderApp } from './renderApp';

test('sending appends, and the canned reply arrives', async () => {
  await renderApp('/chat/t-greenleaf');
  const input = await screen.findByTestId('chat-input');
  expect(screen.getByTestId('chat-send')).toBeDisabled();
  await fireEvent.changeText(input, 'Can you come Friday?');
  await fireEvent.press(screen.getByTestId('chat-send'));
  expect(await screen.findByText('Can you come Friday?')).toBeTruthy();
  expect(screen.getByTestId('chat-input').props.value).toBe('');
  expect(await screen.findByText("Thanks! We'll take care of it.", {}, { timeout: 4000 })).toBeTruthy();
});
