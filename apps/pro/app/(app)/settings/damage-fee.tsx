/** Damage Fee (P17). The opted-in state is P17; the accept state before it is invented. */
import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { usePro, useUpdatePro } from '@mowly/api';
import { Button } from '@mowly/ui';

export default function DamageFeeScreen() {
  const { data: pro } = usePro();
  const { mutateAsync: updatePro, isPending } = useUpdatePro();
  const accepted = pro?.damageFeeAccepted;
  return (
    <View testID="screen-damage-fee" className="flex-1 bg-surface">
      <View className="flex-1 p-5">
        {pro && accepted ? (
          <Text className="mb-4 text-2xl font-bold text-primary">You’re opted into Mowly’s damage fee policy.</Text>
        ) : null}
        {pro ? (
          <>
            <Text className="text-lg leading-7 text-inkProBody">
              {`Mowly charges a damage fee in order to mitigate specified risks for you and your customers. ${
                accepted ? 'You have added security' : 'Accepting adds security'
              } in case of unexpected incidents at a customer's property.`}
            </Text>
            <Text className="mt-6 text-lg leading-7 text-inkProBody">*Platinum and Gold Pros have all damage fees waived.</Text>
          </>
        ) : null}
      </View>
      {pro && !accepted ? (
        <View className="px-5 pb-8">
          <Button
            testID="damage-fee-accept"
            label="ACCEPT"
            loading={isPending}
            onPress={async () => {
              await updatePro({ damageFeeAccepted: true });
              router.back();
            }}
          />
        </View>
      ) : null}
    </View>
  );
}
