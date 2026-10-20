/** Tests for the basic components: the behavior screens depend on, not their layout. */
import { fireEvent, render, screen } from '@testing-library/react-native';
import { Badge } from './Badge';
import { Button } from './Button';
import { Checkbox } from './Checkbox';
import { Radio } from './Radio';
import { TextField } from './TextField';
import { Toggle } from './Toggle';

test('Button disables and spins while loading', async () => {
  const onPress = jest.fn();
  await render(<Button testID="b" label="Continue" onPress={onPress} loading />);
  expect(screen.getByTestId('b-spinner')).toBeTruthy();
  fireEvent.press(screen.getByTestId('b'));
  expect(onPress).not.toHaveBeenCalled();
});

test('Button disabled does not press', async () => {
  const onPress = jest.fn();
  await render(<Button testID="b" label="Continue" onPress={onPress} disabled />);
  fireEvent.press(screen.getByTestId('b'));
  expect(onPress).not.toHaveBeenCalled();
});

test('Button presses when enabled', async () => {
  const onPress = jest.fn();
  await render(<Button testID="b" label="Continue" onPress={onPress} />);
  fireEvent.press(screen.getByTestId('b'));
  expect(onPress).toHaveBeenCalledTimes(1);
});

test('TextField shows its error', async () => {
  await render(
    <TextField testID="t" label="Name" value="" onChangeText={() => {}} error="Enter your name" />,
  );
  expect(screen.getByTestId('t-error')).toHaveTextContent('Enter your name');
});

test('Checkbox toggles', async () => {
  const onChange = jest.fn();
  await render(<Checkbox testID="c" checked={false} onChange={onChange} label="Terms" />);
  fireEvent.press(screen.getByTestId('c'));
  expect(onChange).toHaveBeenCalledWith(true);
});

test('Radio reports a press', async () => {
  const onPress = jest.fn();
  await render(<Radio testID="r" selected={false} onPress={onPress} label="Weekly" />);
  fireEvent.press(screen.getByTestId('r'));
  expect(onPress).toHaveBeenCalledTimes(1);
});

test('Toggle reports the new value', async () => {
  const onValueChange = jest.fn();
  await render(<Toggle testID="g" value={false} onValueChange={onValueChange} />);
  fireEvent(screen.getByTestId('g'), 'valueChange', true);
  expect(onValueChange).toHaveBeenCalledWith(true);
});

test('Badge shows its label', async () => {
  await render(<Badge testID="bd" label="Scheduled" />);
  expect(screen.getByTestId('bd')).toHaveTextContent('Scheduled');
});
