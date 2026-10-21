// Tests the policy FAQ modal (C16, C17): seven expandable questions, OK closes.
import { act, fireEvent, screen, waitFor } from '@testing-library/react-native';
import { router } from 'expo-router';
import { useQuoteDraft } from '../src/stores/useQuoteDraft';
import { renderApp } from './renderApp';

test('seven questions that expand, and OK closes', async () => {
  useQuoteDraft.getState().clear();
  useQuoteDraft.getState().selectService('mowing'); // the plan step needs a service and a contact
  useQuoteDraft.getState().setContact({ name: 'Renato Probst', addressId: 'addr-maple-ridge', addressText: '1820 Maple Ridge Drive, Austin, TX 78704', apt: '', phone: '5125550147' });
  await renderApp('/quote/plan'); // gives OK a screen to go back to
  await act(async () => router.push('/quote/faq'));
  await screen.findByTestId('faq-item-0');
  expect(screen.getAllByTestId(/^faq-item-\d+$/)).toHaveLength(7);
  await fireEvent.press(screen.getByTestId('faq-item-2-header'));
  expect(screen.getByTestId('faq-item-2-body')).toBeTruthy();
  await fireEvent.press(screen.getByTestId('faq-ok'));
  await waitFor(() => expect(screen).toHavePathname('/quote/plan'));
});
