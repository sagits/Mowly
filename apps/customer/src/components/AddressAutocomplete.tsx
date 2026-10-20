/** Address field with a suggestion dropdown (C05). */
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useAddressSearch } from '@mowly/api';
import { TextField } from '@mowly/ui';
import type { Address } from '@mowly/types';

/** Typing filters the suggestions; picking one calls `onPick` and closes the list. */
export function AddressAutocomplete({
  value,
  onChangeText,
  onPick,
  error,
  testID,
}: {
  value: string;
  onChangeText: (text: string) => void;
  onPick: (address: Address) => void;
  error?: string;
  testID: string;
}) {
  const [open, setOpen] = useState(false);
  const { data: matches = [] } = useAddressSearch(value);

  return (
    <View>
      <TextField
        label="Address"
        testID={testID}
        value={value}
        error={error}
        onChangeText={(text) => {
          setOpen(true);
          onChangeText(text);
        }}
      />
      {open && matches.length > 0 ? (
        <View className="mt-1 overflow-hidden rounded-field border border-border bg-surface">
          {matches.map((a) => (
            <Pressable
              key={a.id}
              testID={`address-option-${a.id}`}
              accessibilityRole="button"
              className="border-b border-border px-3 py-3"
              onPress={() => {
                setOpen(false);
                onPick(a);
              }}
            >
              <Text className="text-body-lg text-ink">{a.line1}</Text>
              <Text className="text-sm text-muted">{`${a.city}, ${a.state} ${a.zip}, USA`}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
}
