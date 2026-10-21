// Profile tab (invented; see prototype c-profile): identity, inert settings rows and Reset demo.
import { useState } from 'react';
import { Text, View } from 'react-native';
import { useCustomer, useResetDemo } from '@mowly/api';
import { ConfirmDialog, ListRow, Screen, showToast } from '@mowly/ui';
import { CustomerHeader } from '../../src/components/CustomerHeader';
import { useQuoteDraft } from '../../src/stores/useQuoteDraft';

const notInDemo = () => showToast('Not in this demo');

/** The Profile tab. */
export default function ProfileScreen() {
  const { data: customer } = useCustomer();
  const reset = useResetDemo();
  const [confirming, setConfirming] = useState(false);
  const close = () => setConfirming(false);
  return (
    <View testID="screen-profile" className="flex-1">
      <Screen>
        <CustomerHeader title="Profile" />
        <View className="border-b border-border px-4 py-4">
          <Text className="text-lg font-bold text-ink">{customer?.name}</Text>
          <Text className="text-sm text-muted">{customer?.email}</Text>
        </View>
        <ListRow testID="profile-addresses" title="Addresses" onPress={notInDemo} />
        <ListRow testID="profile-payment" title="Payment methods" subtitle="Demo card •••• 4242" onPress={notInDemo} />
        <ListRow testID="profile-notifications" title="Notifications" onPress={notInDemo} />
        <ListRow testID="profile-help" title="Help" onPress={notInDemo} />
        <ListRow testID="profile-reset" title="Reset demo" onPress={() => setConfirming(true)} />
      </Screen>
      <ConfirmDialog
        visible={confirming}
        title="Reset the demo?"
        message="Your bookings and messages go back to how they started."
        keepTestID="reset-keep"
        keepLabel="Keep as is"
        onKeep={close}
        confirmTestID="reset-confirm"
        confirmLabel="Reset demo"
        pending={reset.isPending}
        onConfirm={() =>
          reset.mutate(undefined, {
            onSuccess: () => {
              // a half-finished quote must not survive the reset either
              useQuoteDraft.getState().clear();
              close();
              showToast('Demo reset');
            },
            onError: () => {
              close();
              showToast("Couldn't reset the demo. Please try again.");
            },
          })
        }
      />
    </View>
  );
}
