/** A bottom sheet of the four bundled headshots (stands in for the camera roll). */
import { Image, Pressable, View } from 'react-native';
import { AVATARS, BottomSheet } from '@mowly/ui';

export function AvatarSheet({ visible, onClose, onPick }: { visible: boolean; onClose: () => void; onPick: (index: number) => void }) {
  return (
    <BottomSheet visible={visible} onClose={onClose} testID="avatar-sheet" title="Choose a photo">
      <View className="flex-row justify-between">
        {AVATARS.map((src, i) => (
          <Pressable key={i} testID={`avatar-${i}`} accessibilityRole="button" accessibilityLabel={`Photo ${i + 1}`} onPress={() => onPick(i)}>
            <Image source={src} className="h-16 w-16 rounded-full" />
          </Pressable>
        ))}
      </View>
    </BottomSheet>
  );
}
