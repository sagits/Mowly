// The green header shared by the four signed-in tabs (C18): title, gift icon and the address row.
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, Text } from 'react-native';
import { useCustomer } from '@mowly/api';
import { HeaderBand, colors } from '@mowly/ui';
import { AddressSwitcher } from './AddressSwitcher';

/** `HeaderBand` with an inert gift icon (the web "Switch to Mowly Pro" link sits in the tab layout's strip) and the address row (testid `address-switcher`) that opens `AddressSwitcher`. */
export function CustomerHeader({ title }: { title: string }) {
  const { data: customer } = useCustomer();
  const [open, setOpen] = useState(false);
  const line1 = customer?.address.line1 ?? '';
  return (
    <>
      <HeaderBand
        title={title}
        action={<Ionicons name="gift-outline" size={28} color={colors.surface} />}
      >
        <Pressable testID="address-switcher" accessibilityRole="button" onPress={() => setOpen(true)} className="mt-3 flex-row items-center gap-2 self-start">
          <Ionicons name="home" size={24} color={colors.surface} />
          <Text className="text-lg text-surface">{line1}</Text>
          <Ionicons name="chevron-down" size={20} color={colors.surface} />
        </Pressable>
      </HeaderBand>
      <AddressSwitcher visible={open} onClose={() => setOpen(false)} line1={line1} />
    </>
  );
}
