// Tests the chat screen: sending a message and the canned pro reply.
import { act, fireEvent, screen } from '@testing-library/react-native';
import * as mocks from '@mowly/mocks';
import { renderApp } from './renderApp';

// sendMessage wrapped in a jest.fn so one test can make a send fail (ES module exports cannot be spied on).
jest.mock('@mowly/mocks', () => {
  const actual = jest.requireActual('@mowly/mocks');
  return { ...actual, sendMessage: jest.fn(actual.sendMessage) };
});

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

test('a failed send gives the text back, unless a new one is already typed', async () => {
  let fail: (e: Error) => void = () => {};
  jest.mocked(mocks.sendMessage).mockImplementationOnce(() => new Promise((_, reject) => (fail = reject)));
  await renderApp('/chat/t-greenleaf');
  const input = await screen.findByTestId('chat-input');
  await fireEvent.changeText(input, 'First');
  await fireEvent.press(screen.getByTestId('chat-send'));
  await fireEvent.changeText(screen.getByTestId('chat-input'), 'Second');
  await act(async () => fail(new Error('offline')));
  expect(await screen.findByText("Couldn't send your message. Please try again.")).toBeTruthy();
  expect(screen.getByTestId('chat-input').props.value).toBe('Second');
});
