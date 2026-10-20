/** "Add Promo Code" modal (C11). Any non-empty code applies. */
import { useState } from 'react';
import { Button, BottomSheet, TextField } from '@mowly/ui';
import { View } from 'react-native';

/** `onApplied` fires after APPLY; the caller closes it via `onClose`. */
export function PromoSheet({
  visible,
  onClose,
  onApplied,
}: {
  visible: boolean;
  onClose: () => void;
  onApplied: () => void;
}) {
  const [code, setCode] = useState('');
  return (
    <BottomSheet visible={visible} onClose={onClose} testID="promo-sheet" title="Add Promo Code">
      <View className="gap-4 pt-2">
        <TextField testID="promo-input" label="Promo code" value={code} onChangeText={setCode} />
        <Button
          testID="promo-apply"
          label="Apply"
          disabled={code.trim() === ''}
          onPress={() => {
            onApplied();
            setCode('');
            onClose();
          }}
        />
      </View>
    </BottomSheet>
  );
}
