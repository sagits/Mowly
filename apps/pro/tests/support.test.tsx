// Tests Support (P14).
import { fireEvent, screen } from '@testing-library/react-native';
import { renderApp } from './renderApp';

test.each(['support-kb', 'support-message'])('%s shows the demo toast', async (id) => {
  await renderApp('/support');
  expect(await screen.findByTestId('screen-support')).toBeTruthy();
  await fireEvent.press(screen.getByTestId(id));
  expect(await screen.findByTestId('toast')).toHaveTextContent('Not in this demo');
});
