/** Account management (P24). Deletion asks, then does nothing in a demo. */
import { useState } from 'react';
import { Text, View } from 'react-native';
import { ConfirmDialog, ListRow, showToast } from '@mowly/ui';

/** The Account Management screen. */
export default function AccountScreen() {
  const [asking, setAsking] = useState(false);
  return (
    <View testID="screen-account" className="flex-1 bg-surface px-4">
      <Text className="mb-2 mt-8 px-1 text-xl font-bold text-inkPro">Account Management</Text>
      <ListRow testID="account-delete" title="Account Deletion" onPress={() => setAsking(true)} />
      <ConfirmDialog
        visible={asking}
        testID="account-delete-dialog"
        title="Delete your account?"
        message="This removes your profile and your jobs."
        keepTestID="account-delete-keep"
        onKeep={() => setAsking(false)}
        confirmTestID="account-delete-confirm"
        confirmLabel="Delete"
        onConfirm={() => {
          setAsking(false);
          showToast('Not in this demo');
        }}
      />
    </View>
  );
}
