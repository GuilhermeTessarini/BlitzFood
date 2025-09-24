import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import { createUser } from "@/lib/appwrite";
import { Link, router } from "expo-router";
import React from "react";
import { Alert, Text, View } from "react-native";

const SignUp = () => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [form, setForm] = React.useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    address: "",
  });

  const submit = async () => {
    const { email, password, name, phoneNumber, address } = form;

    if (!name || !email || !password || !phoneNumber || !address)
      return Alert.alert(
        "Error",
        "Please enter your name, email address, password, phone number & address."
      );

    setIsSubmitting(true);
    try {
      await createUser({ 
        email, 
        password, 
        name,
        phoneNumber,
        address 
      });
      router.replace("/");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="gap-10 bg-white rounded-lg p-5 mt-5">
      <CustomInput
        placeholder="Enter your full name"
        value={form.name}
        onChangeText={(text) => setForm((prev) => ({ ...prev, name: text }))}
        label="Full Name"
      />

      <CustomInput
        placeholder="Enter your email"
        value={form.email}
        onChangeText={(text) => setForm((prev) => ({ ...prev, email: text }))}
        label="Email"
        keyboardType="email-address"
      />

      <CustomInput
        placeholder="Enter your password"
        value={form.password}
        onChangeText={(text) =>
          setForm((prev) => ({ ...prev, password: text }))
        }
        label="Password"
        secureTextEntry
      />

      <CustomInput
        placeholder="Enter your phone number"
        value={form.phoneNumber}
        onChangeText={(text) =>
          setForm((prev) => ({ ...prev, phoneNumber: text }))
        }
        label="Phone Number"
        keyboardType="phone-pad"
      />

      <CustomInput
        placeholder="Enter your address"
        value={form.address}
        onChangeText={(text) =>
          setForm((prev) => ({ ...prev, address: text }))
        }
        label="Address"
      />

      <CustomButton title="Sign Up" isLoading={isSubmitting} onPress={submit} />

      <View className="flex justify-center nt-5 flex-row gap-2">
        <Text className="base-regular text-grey-100">
          Already have an account?
        </Text>
        <Link href="/sign-in" className="base-bold text-primary">
          Sign In
        </Link>
      </View>
    </View>
  );
};

export default SignUp;
