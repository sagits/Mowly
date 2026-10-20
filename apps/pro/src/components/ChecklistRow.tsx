/** One row of the dashboard checklist: done (green check), next (green chevron) or locked (gray, inert). */
import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text } from 'react-native';
import { colors } from '@mowly/ui';
import type { ChecklistItem } from '../checklist';

export function ChecklistRow({ item, state, onPress }: { item: ChecklistItem; state: 'done' | 'next' | 'locked'; onPress: () => void }) {
  const locked = state === 'locked';
  return (
    <Pressable
      testID={`checklist-${item.id}`}
      accessibilityRole="button"
      accessibilityState={{ disabled: locked }}
      disabled={locked}
      className="flex-row items-center border-b border-primaryTint px-1 py-4"
      onPress={locked ? undefined : onPress}
    >
      <Text className={`flex-1 text-body ${locked ? 'text-disabled' : 'text-inkPro'}`}>{item.label}</Text>
      {state === 'done' ? (
        <Ionicons testID={`checklist-${item.id}-done`} name="checkmark" size={22} color={colors.primary} />
      ) : (
        <Ionicons name="chevron-forward" size={20} color={locked ? colors.disabled : colors.primary} />
      )}
    </Pressable>
  );
}
