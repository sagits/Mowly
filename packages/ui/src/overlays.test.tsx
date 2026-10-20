/** Tests for overlays, rows, toast and images: the behavior screens depend on, not their layout. */
import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { Accordion } from './Accordion';
import { ConfirmDialog } from './ConfirmDialog';
import { AERIAL_IMAGE, AVATARS, serviceImage } from './images';
import { ListRow } from './ListRow';
import { Select } from './Select';
import { showToast, ToastHost } from './Toast';

test('Select opens a sheet and picks', async () => {
  const onChange = jest.fn();
  await render(
    <Select
      testID="s"
      label="Category"
      value={undefined}
      onChange={onChange}
      options={[
        { value: 'lawn', label: 'Basic Lawn Care' },
        { value: 'pool', label: 'Basic Pool Care' },
      ]}
    />,
  );
  await fireEvent.press(screen.getByTestId('s'));
  await fireEvent.press(screen.getByTestId('s-option-pool'));
  expect(onChange).toHaveBeenCalledWith('pool');
});

test('Accordion toggles', async () => {
  await render(
    <Accordion testID="a" title="Q">
      Answer
    </Accordion>,
  );
  expect(screen.queryByTestId('a-body')).toBeNull();
  await fireEvent.press(screen.getByTestId('a-header'));
  expect(screen.getByTestId('a-body')).toBeTruthy();
});

test('ListRow disabled ignores presses', async () => {
  const onPress = jest.fn();
  await render(<ListRow testID="r" title="Row" onPress={onPress} disabled />);
  await fireEvent.press(screen.getByTestId('r'));
  expect(onPress).not.toHaveBeenCalled();
});

test('toast shows then hides', async () => {
  jest.useFakeTimers();
  await render(<ToastHost />);
  await act(async () => showToast('Recommendation sent'));
  expect(screen.getByTestId('toast')).toHaveTextContent('Recommendation sent');
  await act(async () => {
    jest.advanceTimersByTime(2500);
  });
  expect(screen.queryByTestId('toast')).toBeNull();
  jest.useRealTimers();
});

test('ConfirmDialog confirms', async () => {
  const onConfirm = jest.fn();
  await render(
    <ConfirmDialog
      visible
      title="Sure?"
      message="m"
      keepTestID="keep"
      onKeep={jest.fn()}
      confirmTestID="ok"
      confirmLabel="Sign out"
      onConfirm={onConfirm}
    />,
  );
  await fireEvent.press(screen.getByTestId('ok'));
  expect(onConfirm).toHaveBeenCalled();
});

test('images resolve', () => {
  expect(serviceImage('mowing')).toBeTruthy();
  expect(serviceImage('weeding')).toBeTruthy();
  expect(AERIAL_IMAGE).toBeTruthy();
  expect(AVATARS).toHaveLength(4);
});
