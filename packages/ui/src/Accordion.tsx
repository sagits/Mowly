/** A titled section whose body expands and collapses. */
import { Ionicons } from '@expo/vector-icons';
import { useState, type ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import { colors } from '../tokens';

/** Pressing `${testID}-header` toggles `${testID}-body`. String children are wrapped in body text. */
export function Accordion({
  title,
  testID,
  children,
  defaultOpen = false,
}: {
  title: string;
  testID: string;
  children?: ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <View testID={testID} className="border-b border-border">
      <Pressable
        testID={`${testID}-header`}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        className="flex-row items-center justify-between py-4"
        onPress={() => setOpen((o) => !o)}
      >
        <Text className="flex-1 pr-3 text-base font-semibold text-ink">{title}</Text>
        <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={20} color={colors.primary} />
      </Pressable>
      {open ? (
        <View testID={`${testID}-body`} className="pb-4">
          {typeof children === 'string' ? <Text className="text-sm leading-5 text-muted">{children}</Text> : children}
        </View>
      ) : null}
    </View>
  );
}
