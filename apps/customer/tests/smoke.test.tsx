import { render, screen } from '@testing-library/react-native';
import Index from '../app/index';

test('the customer app renders', async () => {
  await render(<Index />);
  expect(screen.getByTestId('app-placeholder')).toBeTruthy();
});
