/** Web-only link back to the app chooser at the site root. */
import { Platform, Pressable, Text } from 'react-native';

/** Renders nothing on native; on web a "Switch app" link that goes to `/`. */
export function SwitchAppLink() {
  if (Platform.OS !== 'web') return null;
  return (
    <Pressable
      testID="switch-app"
      accessibilityRole="link"
      onPress={() => {
        window.location.href = '/';
      }}
    >
      <Text className="text-sm text-link underline">Switch app</Text>
    </Pressable>
  );
}
