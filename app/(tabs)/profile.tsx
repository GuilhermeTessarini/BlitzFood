import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import { images } from "@/constants";
import useAuthStore from "../store/auth.store";

interface ProfileFieldProps {
  label: string;
  value: string;
  icon: any;
  editable?: boolean;
}

const ProfileField = ({
  label,
  value,
  icon,
  editable = false,
}: ProfileFieldProps) => (
  <View className="profile-field">
    <View className="profile-field__icon">
      <Image
        source={icon}
        className="size-6"
        resizeMode="contain"
        tintColor="#FE8C00"
      />
    </View>
    <View className="flex-1">
      <Text className="text-sm text-gray-500 font-quicksand-medium">
        {label}
      </Text>
      <Text className="text-base text-dark-100 font-quicksand-semibold">
        {value}
      </Text>
    </View>
  </View>
);

const Profile = () => {
  const { user, logout, isLoading, updateProfile } = useAuthStore();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || "",
    phoneNumber: user?.phoneNumber || "",
    address: user?.address || "",
  });

  React.useEffect(() => {
    if (user && !isEditing) {
      setEditData({
        name: user.name || "",
        phoneNumber: user.phoneNumber || "",
        address: user.address || "",
      });
    }
  }, [user, isEditing]);

  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/sign-in");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleSaveProfile = async () => {
    if (isLoading) return;

    try {
      await updateProfile({
        name: editData.name,
        phoneNumber: editData.phoneNumber,
        address: editData.address,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save profile:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditData({
      name: user?.name || "",
      phoneNumber: user?.phoneNumber || "",
      address: user?.address || "",
    });
    setIsEditing(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        className="flex-1 px-5 pt-10"
        showsVerticalScrollIndicator={false}
      >
        <View className="custom-header">
          <TouchableOpacity onPress={() => router.back()}>
            <Image
              source={images.arrowBack}
              className="size-5"
              resizeMode="contain"
            />
          </TouchableOpacity>

          <Text className="text-xl font-quicksand-semibold text-dark-100">
            Profile
          </Text>

          <TouchableOpacity onPress={() => {}}>
            <Image
              source={images.search}
              className="size-5"
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        <View className="flex-center mb-8">
          <View className="relative">
            <Image
              source={user?.avatar ? { uri: user.avatar } : images.avatar}
              className="size-24 rounded-full"
              resizeMode="cover"
            />
            <View className="absolute -bottom-1 -right-1 size-8 bg-primary rounded-full flex-center">
              <Image
                source={images.check}
                className="size-4"
                resizeMode="contain"
                tintColor="white"
              />
            </View>
          </View>
        </View>

        <View className="mb-20">
          {isEditing ? (
            <View className="space-y-6">
              <CustomInput
                label="Full Name"
                value={editData.name}
                onChangeText={(text) =>
                  setEditData({ ...editData, name: text })
                }
                placeholder="Enter your full name"
              />
              <CustomInput
                label="Phone Number"
                value={editData.phoneNumber}
                onChangeText={(text) =>
                  setEditData({ ...editData, phoneNumber: text })
                }
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
              />
              <CustomInput
                label="Address"
                value={editData.address}
                onChangeText={(text) =>
                  setEditData({ ...editData, address: text })
                }
                placeholder="Enter your address"
              />
            </View>
          ) : (
            <>
              <ProfileField
                label="Full Name"
                value={user?.name || "Your Name"}
                icon={images.user}
              />
              <ProfileField
                label="Email"
                value={user?.email || "yourname@example.com"}
                icon={images.envelope}
              />
              <ProfileField
                label="Phone number"
                value={user?.phoneNumber || "Your number here"}
                icon={images.phone}
              />
              <ProfileField
                label="Address"
                value={user?.address || "Your address here"}
                icon={images.location}
              />
            </>
          )}
        </View>

        <View className="mb-32">
          {isEditing ? (
            <View className="flex-row space-x-3">
              <View className="flex-1">
                <CustomButton
                  title="Cancel"
                  onPress={handleCancelEdit}
                  style="bg-gray-200"
                  textStyle="text-dark-100"
                />
              </View>
              <View className="flex-1">
                <CustomButton
                  title="Save Changes"
                  onPress={handleSaveProfile}
                  isLoading={isLoading}
                />
              </View>
            </View>
          ) : (
            <>
              <View className="mb-6">
                <CustomButton
                  title="Edit Profile"
                  onPress={() => setIsEditing(true)}
                  leftIcon={
                    <Image
                      source={images.pencil}
                      className="size-5 mr-2"
                      resizeMode="contain"
                      tintColor="white"
                    />
                  }
                />
              </View>

              <CustomButton
                title="Logout"
                onPress={handleLogout}
                isLoading={isLoading}
                style="bg-red-500"
                leftIcon={
                  <Image
                    source={images.logout}
                    className="size-5 mr-2"
                    resizeMode="contain"
                    tintColor="white"
                  />
                }
              />
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
