/** Sign in (P02): any non-empty email and password signs in. */
import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Pressable, Text, View } from 'react-native';
import { useSession } from '@mowly/stores';
import { Button, FormField, colors } from '@mowly/ui';
import { ProSignInSchema } from '../src/schemas';

/** The sign in form. */
export default function SignInScreen() {
  const [show, setShow] = useState(false);
  const { control, handleSubmit } = useForm({
    resolver: zodResolver(ProSignInSchema) as never,
    defaultValues: { email: '', password: '' },
  });
  const submit = handleSubmit(() => {
    useSession.getState().signIn();
  });

  return (
    <View testID="screen-sign-in" className="flex-1 bg-surface px-5 pt-6">
      <View className="gap-5">
        <FormField control={control} name="email" label="Email" testID="signin-email" placeholder="e.g. john@gmail.com" keyboardType="email-address" />
        <FormField
          control={control}
          name="password"
          label="Password"
          testID="signin-password"
          placeholder="Must have at least 6 characters"
          secureTextEntry={!show}
          right={
            <Pressable testID="signin-eye" accessibilityLabel="Show password" onPress={() => setShow((v) => !v)}>
              <Ionicons name={show ? 'eye-off' : 'eye'} size={26} color={colors.ink} />
            </Pressable>
          }
        />
      </View>
      {/* Inert: there is no account recovery in the mock. */}
      <Text className="mt-10 text-center text-button uppercase text-primary">I need help accessing my account</Text>
      {/* Under the link, not pinned to the bottom, so the keyboard never covers it. */}
      <View className="mt-8">
        <Button testID="signin-submit" label="Sign in" onPress={submit} />
      </View>
    </View>
  );
}
