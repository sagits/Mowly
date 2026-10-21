/** Connect your bank account (P19). Linking is a demo: it flips a flag and shows a fake account. */
import { router, useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';
import { usePro, useUpdatePro } from '@mowly/api';
import { Button } from '@mowly/ui';

export default function BankScreen() {
  const { from } = useLocalSearchParams<{ from?: string }>();
  const { data: pro } = usePro();
  const { mutateAsync: updatePro, isPending } = useUpdatePro();
  const linked = pro?.bankLinked;
  return (
    <View testID="screen-bank" className="flex-1 bg-surface">
      <View className="flex-1 gap-4 p-5">
        <Text className="text-2xl font-bold text-inkPro">Connect your bank account</Text>
        <View className="flex-row items-center justify-between">
          <Text className="text-xl font-semibold text-inkPro">Bank info</Text>
          <View className="rounded-field border border-inkPro px-2.5 py-1">
            <Text className="text-caption text-inkPro">
              Powered by <Text className="font-bold">stripe</Text>
            </Text>
          </View>
        </View>
        {pro ? (
          <>
            <Text className="text-lg leading-7 text-inkProBody">Connect your bank account so you get paid on time.</Text>
            <Text className="text-lg leading-7 text-inkProBody">
              Mowly uses Stripe to send you payments. All payments are processed on Mondays, and it typically takes 2 to 4 business days for funds to be released into your account.
            </Text>
            <Text className="text-lg leading-7 text-inkProBody">We may also use the information on this account to verify your identity.</Text>
            {linked ? (
              <Text testID="bank-linked" className="text-lg font-semibold text-primary">
                Demo Bank •••• 6789 linked
              </Text>
            ) : null}
          </>
        ) : null}
      </View>
      {pro ? (
        <View className="items-center px-5 pb-8">
          {linked ? (
            from === 'checklist' ? <View className="w-full"><Button testID="bank-done" label="CONTINUE" onPress={() => router.back()} /></View> : null
          ) : (
            <>
              <View className="w-full">
                <Button testID="bank-link" label="LINK BANK ACCOUNT" loading={isPending} onPress={() => updatePro({ bankLinked: true })} />
              </View>
              <Text testID="bank-no-account" accessibilityRole="link" className="mt-4 text-base font-semibold text-primary underline">
                {"I don't have a bank account"}
              </Text>
            </>
          )}
        </View>
      ) : null}
    </View>
  );
}
